// Waits until the live site serves a given commit, then exits 0. Exits 1 if it
// does not within the timeout, and 2 on bad input. The production deployment
// job runs this, so a GitHub deployment is only marked successful once the
// site really serves that commit.
//
//   SITE_URL=https://www.juliocesardb.com EXPECTED_COMMIT=<sha> node scripts/wait-for-deploy.mjs
//
// Optional: TIMEOUT_SECONDS (default 900), INTERVAL_SECONDS (default 15).
// No dependencies; needs Node 18 or later for fetch.
//
// Two things must report the commit: /version.json, which is never cached, so
// it shows what the origin holds; and the page itself, through its
// <meta name="build-commit">, since the page is what visitors get and the CDN
// caches it. Both come from the same build.

const siteUrl = process.env.SITE_URL;
const expected = (process.env.EXPECTED_COMMIT ?? "").trim().toLowerCase();
const timeoutSeconds = Number(process.env.TIMEOUT_SECONDS ?? 900);
const intervalSeconds = Number(process.env.INTERVAL_SECONDS ?? 15);

const positive = (n) => Number.isFinite(n) && n > 0;
if (
  !siteUrl ||
  !/^[0-9a-f]{40}$/.test(expected) ||
  !positive(timeoutSeconds) ||
  !positive(intervalSeconds)
) {
  console.error(
    "SITE_URL and EXPECTED_COMMIT (a full 40-character SHA) are required; " +
      "TIMEOUT_SECONDS and INTERVAL_SECONDS, if set, must be positive numbers.",
  );
  process.exit(2);
}

const versionUrl = new URL("/version.json", siteUrl);
const timeoutMs = timeoutSeconds * 1000;
const intervalMs = intervalSeconds * 1000;
const deadline = Date.now() + timeoutMs;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetches a URL and reads a commit out of its body with `read`. Returns the
// commit (or null) and a short description of what was seen, for the log.
async function look(url, read) {
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
      signal: AbortSignal.timeout(10_000),
    });
    const age = res.headers.get("age");
    const cache = [res.headers.get("x-cache"), age && `age ${age}`]
      .filter(Boolean)
      .join(", ");
    const via = cache ? ` (${cache})` : "";
    if (!res.ok) return { commit: null, seen: `HTTP ${res.status}${via}` };
    const commit = read(await res.text())?.toLowerCase() ?? null;
    return { commit, seen: `${commit ?? "no commit in the response"}${via}` };
  } catch (error) {
    return { commit: null, seen: `request failed: ${error.message}` };
  }
}

function fromVersionFile(body) {
  try {
    const { commit } = JSON.parse(body);
    return typeof commit === "string" ? commit : null;
  } catch {
    return null;
  }
}

function fromPage(html) {
  const tag = html.match(/<meta\b[^>]*\bname=["']build-commit["'][^>]*>/i)?.[0];
  return tag?.match(/\bcontent=["']([^"']*)["']/i)?.[1] ?? null;
}

console.log(
  `Waiting up to ${timeoutSeconds}s for ${siteUrl} to serve ${expected}.`,
);

for (let attempt = 1; ; attempt++) {
  const stamp = new Date().toISOString();
  // The query is unique per request. Amplify's CDN leaves query strings out of
  // its cache key, so this alone does not bypass it (the no-store header in
  // customHttp.yml does); it only rules out any other cache on the way.
  const fresh = new URL(versionUrl);
  fresh.searchParams.set("t", String(Date.now()));
  const version = await look(fresh, fromVersionFile);
  console.log(`[${stamp}] #${attempt} /version.json: ${version.seen}`);

  if (version.commit === expected) {
    // Fetched as visitors fetch it, with no query, so a stale copy at the CDN
    // shows up here as the old commit.
    const page = await look(siteUrl, fromPage);
    console.log(`[${stamp}] #${attempt} page: ${page.seen}`);
    if (page.commit === expected) {
      console.log(`Live: ${siteUrl} serves ${expected}.`);
      process.exit(0);
    }
  }

  if (Date.now() + intervalMs > deadline) break;
  await sleep(intervalMs);
}

console.error(
  `Timed out: ${siteUrl} did not serve ${expected} within ${timeoutSeconds}s.`,
);
process.exit(1);
