/**
 * Cloudflare Worker / Serverless Proxy for Ludopedia + BGG APIs.
 * Injects the Ludopedia Authorization header server-side (never trusts/forwards
 * an Authorization header sent by the browser), provides CORS headers (*), and
 * adds Edge Caching.
 *
 * IMPORTANT: this worker must actually be deployed (`wrangler deploy`) at the URL
 * referenced by tools/tierlist.html (LUDOPEDIA_PROXY_BASE), otherwise the client
 * silently falls back to its small bundled curated database for every search.
 *
 * Set the real token as a secret instead of hardcoding it:
 *   wrangler secret put LUDOPEDIA_TOKEN
 */

const LUDOPEDIA_API_BASE = 'https://ludopedia.com.br/api/v1';
const BGG_API_BASE = 'https://boardgamegeek.com/xmlapi2';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400'
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Only allow GET requests
    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }

    // Route: /bgg/... -> BoardGameGeek XML API
    // BGG's terms (as of 2025-07-02) require a registered application + Bearer
    // token: https://boardgamegeek.com/using_the_xml_api . Register at
    // https://boardgamegeek.com/applications, then: wrangler secret put BGG_TOKEN
    if (url.pathname.startsWith('/bgg/') || url.pathname.startsWith('/api/bgg/')) {
      let bggPath = url.pathname.replace(/^\/api\/bgg/, '').replace(/^\/bgg/, '');
      if (!bggPath.startsWith('/')) bggPath = '/' + bggPath;
      const bggTarget = new URL(BGG_API_BASE + bggPath + url.search);
      const bggHeaders = {
        'User-Agent': 'BoardBots-Proxy/1.0 (+https://boardbots.example)',
        'Accept': 'application/xml, text/xml'
      };
      if (env.BGG_TOKEN) {
        bggHeaders['Authorization'] = `Bearer ${env.BGG_TOKEN}`;
      }
      try {
        const bggResponse = await fetch(bggTarget.toString(), {
          method: 'GET',
          headers: bggHeaders
        });
        const body = await bggResponse.text();
        return new Response(body, {
          status: bggResponse.status,
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            ...CORS_HEADERS,
            'Cache-Control': bggResponse.ok ? 'public, max-age=86400, s-maxage=86400' : 'no-cache'
          }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'BGG proxy error', message: err.message }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
        });
      }
    }

    // Route: everything else -> Ludopedia API
    // e.g. /api/v1/jogos?search=catan or /jogos?search=catan
    let path = url.pathname.replace(/^\/api\/v1/, '').replace(/^\/api/, '');
    if (!path.startsWith('/')) path = '/' + path;

    const targetUrl = new URL(LUDOPEDIA_API_BASE + path + url.search);
    const ludopediaToken = env.LUDOPEDIA_TOKEN;
    if (!ludopediaToken) {
      return new Response(JSON.stringify({ error: 'Proxy misconfigured: missing LUDOPEDIA_TOKEN secret' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }

    try {
      const apiResponse = await fetch(targetUrl.toString(), {
        method: 'GET',
        headers: {
          // Server-side secret only — never read/forward the caller's own Authorization header.
          'Authorization': `Bearer ${ludopediaToken}`,
          'User-Agent': 'BoardBots-Proxy/1.0',
          'Accept': 'application/json'
        }
      });

      const responseBody = await apiResponse.text();

      // Return with full CORS and Cache-Control headers
      return new Response(responseBody, {
        status: apiResponse.status,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          ...CORS_HEADERS,
          'Cache-Control': apiResponse.ok ? 'public, max-age=86400, s-maxage=86400' : 'no-cache'
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Proxy error', message: err.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }
  }
};
