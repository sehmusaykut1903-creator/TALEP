export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. Avoid cache/Edge loops or unauthorized method forwards
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return env.ASSETS.fetch(request);
    }

    // 2. Identify static assets (usually contain extensions and are under assets/ or static folders)
    const isStaticAsset = pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|otf|json|webmanifest|map)$/i) || 
                          pathname.startsWith('/assets/') || pathname.startsWith('/static/');

    if (isStaticAsset) {
      try {
        const response = await env.ASSETS.fetch(request);
        
        // Return 404s directly or fallback for asset maps
        if (!response.ok) {
          return response;
        }

        const newHeaders = new Headers(response.headers);
        
        // Add immutable caching for high-performance hashed bundles
        if (pathname.includes('/assets/') && (pathname.endsWith('.js') || pathname.endsWith('.css') || pathname.endsWith('.woff2'))) {
          newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          newHeaders.set('Cache-Control', 'public, max-age=86400, must-revalidate');
        }
        
        // Exclude custom frames
        newHeaders.delete('X-Frame-Options');

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      } catch (err) {
        console.error('[Worker Error] Asset fetch failed:', err);
        return new Response('Asset Not Found', { status: 404 });
      }
    }

    // 3. For all navigation routes (e.g., /patients, /chemicals, or /index.html), serve index.html with no-store
    try {
      // Direct asset fetch request specifically rewritten to index.html
      const indexRequest = new Request(new URL('/index.html', url.origin), request);
      const response = await env.ASSETS.fetch(indexRequest);

      if (!response.ok) {
        // Ultimate emergency recovery fallback if index.html is missing inside dist
        return new Response(
          `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>TALEP v4.0</title></head><body style="background:#0f172a;color:#f8fafc;font-family:sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0"><div><h1>TALEP v4.0 Enterprise Node</h1><p>Platform is initializing. Please reload or check your build pipeline.</p></div></body></html>`,
          {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
          }
        );
      }

      const newHeaders = new Headers(response.headers);
      
      // Strict Cache-Control policy for index.html as requested
      newHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      newHeaders.delete('X-Frame-Options');

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } catch (err) {
      console.error('[Worker Error] SPA fallback failed:', err);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};
