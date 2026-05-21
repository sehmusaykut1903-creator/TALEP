export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Check if the request is likely for a static asset with a file extension
    const hasExtension = url.pathname.includes('.');
    
    try {
      // First, try to fetch the exact resource from ASSETS
      const response = await env.ASSETS.fetch(request);
      
      // If the resource was not found (status 404) and is a SPA path, fall back to index.html
      if (response.status === 404 && !hasExtension) {
        const indexRequest = new Request(new URL('/index.html', request.url), request);
        return env.ASSETS.fetch(indexRequest);
      }
      
      return response;
    } catch (err) {
      // If asset fetching fails, attempt to fallback to index.html for SPA routing safety
      if (!hasExtension) {
        try {
          const indexRequest = new Request(new URL('/index.html', request.url), request);
          return await env.ASSETS.fetch(indexRequest);
        } catch (_) {}
      }
      return new Response("Fallback/Asset error", { status: 500 });
    }
  }
}
