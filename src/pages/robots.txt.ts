import type { APIRoute } from "astro";

// Everything may be crawled. /resume opts out of the index with its own
// noindex tag, which a crawler can only read if it is allowed to fetch it.
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL("/sitemap.xml", site).href}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
