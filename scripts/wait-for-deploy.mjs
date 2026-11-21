// Waits until the live site serves a given commit, then exits 0. Exits 1 if it
// does not within the timeout. The production deployment job runs this, so a
// GitHub deployment is only marked successful once the site really serves it.
//
//   SITE_URL=https://www.juliocesardb.com EXPECTED_COMMIT=<sha> node scripts/wait-for-deploy.mjs
//
// Optional: TIMEOUT_SECONDS (default 900), INTERVAL_SECONDS (default 15).
// No dependencies; needs Node 18 or later for fetch.

const siteUrl = process.env.SITE_URL;
const expected = (process.env.EXPECTED_COMMIT ?? "").trim().toLowerCase();
const timeoutMs = Number(process.env.TIMEOUT_SECONDS ?? 900) * 1000;
const intervalMs = Number(process.env.INTERVAL_SECONDS ?? 15) * 1000;

if (!siteUrl || !/^[0-9a-f]{40}$/.test(expected)) {
  console.error(
    "SITE_URL and EXPECTED_COMMIT (a full 40-character SHA) are required.",
  );
  process.exit(2);
}

const versionUrl = new URL("/version.json", siteUrl);
const deadline = Date.now() + timeoutMs;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// One look at /version.json: the commit it reports, or why there is none.
async function liveCommit() {
  // The query is unique per request. Amplify's CDN leaves query strings out of
  // its cache key, so this alone does not bypass it (the no-store header in
  // customHttp.yml does); it only rules out any other cache on the way.
  const url = new URL(versionUrl);
  url.searchParams.set("t", String(Date.now()));
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
      signal: AbortSignal.timeout(10_000),
    });
    const cache = [
      res.headers.get("x-cache"),
      res.headers.get("age") && `age ${res.headers.get("age")}`,
    ]
      .filter(Boolean)
      .join(", ");
    if (!res.ok) return { seen: `HTTP ${res.status}`, cache };
    const body = await res.json().catch(() => null);
    const commit =
      typeof body?.commit === "string" ? body.commit.toLowerCase() : null;
    return { commit, seen: commit ?? "no commit in the response", cache };
  } catch (error) {
    return { seen: `request failed: ${error.message}` };
  }
}

console.log(
  `Waiting up to ${timeoutMs / 1000}s for ${versionUrl} to report ${expected}.`,
);

for (let attempt = 1; ; attempt++) {
  const { commit, seen, cache } = await liveCommit();
  const stamp = new Date().toISOString();
  console.log(`[${stamp}] #${attempt}: ${seen}${cache ? ` (${cache})` : ""}`);

  if (commit === expected) {
    // The version file and the page ship in the same atomic deploy, but the
    // deployment's URL is the page, so make sure the page itself answers.
    const page = await fetch(siteUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    }).catch((error) => ({ ok: false, status: error.message }));
    if (page.ok) {
      console.log(`Live: ${siteUrl} serves ${expected}.`);
      process.exit(0);
    }
    console.log(`The version matches but ${siteUrl} answered ${page.status}.`);
  }

  if (Date.now() + intervalMs > deadline) break;
  await sleep(intervalMs);
}

console.error(
  `Timed out: ${siteUrl} did not serve ${expected} within ${timeoutMs / 1000}s.`,
);
process.exit(1);
