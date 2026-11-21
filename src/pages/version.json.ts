import type { APIRoute } from "astro";

// The commit this build was made from. The production deployment check polls
// this file until it reports the pushed commit; customHttp.yml keeps it out of
// every cache so the answer is never stale.
export const GET: APIRoute = () =>
  new Response(`${JSON.stringify({ commit: __BUILD_COMMIT__ })}\n`, {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
