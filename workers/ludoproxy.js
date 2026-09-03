/**
 * Cloudflare Worker / Serverless Proxy for Ludopedia API
 * Injects Authorization header, provides CORS headers (*), and adds Edge Caching
 */

const LUDOPEDIA_TOKEN = '4c19506c8a280672ca249db5fde7c092';
const LUDOPEDIA_API_BASE = 'https://ludopedia.com.br/api/v1';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400'
        }
      });
    }

    // Only allow GET requests
    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Target Ludopedia API Path
    // e.g. /api/v1/jogos?search=catan or /jogos?search=catan
    let path = url.pathname.replace(/^\/api\/v1/, '').replace(/^\/api/, '');
    if (!path.startsWith('/')) path = '/' + path;

    const targetUrl = new URL(LUDOPEDIA_API_BASE + path + url.search);

    try {
      const apiResponse = await fetch(targetUrl.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${LUDOPEDIA_TOKEN}`,
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
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Cache-Control': apiResponse.ok ? 'public, max-age=86400, s-maxage=86400' : 'no-cache'
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Proxy error', message: err.message }), {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
