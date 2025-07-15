export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // Try to serve static assets
    const response = await env.ASSETS.fetch(request);
    
    // If asset is found, return it
    if (response.status !== 404) {
      return response;
    }
    
    // Handle root path
    if (url.pathname === '/') {
      return env.ASSETS.fetch(new Request(url.origin + '/index.html'));
    }
    
    // Handle i18n routes
    if (url.pathname.startsWith('/ja/') || url.pathname.startsWith('/en/')) {
      const locale = url.pathname.split('/')[1];
      return env.ASSETS.fetch(new Request(url.origin + `/${locale}/index.html`));
    }
    
    // Handle locale-specific root paths
    if (url.pathname === '/ja' || url.pathname === '/en') {
      return env.ASSETS.fetch(new Request(url.origin + url.pathname + '/index.html'));
    }
    
    // Fallback to 404
    return env.ASSETS.fetch(new Request(url.origin + '/404.html'));
  }
};

interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
}