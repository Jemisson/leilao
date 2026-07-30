const DEFAULT_BACKEND_URL = import.meta.env.PROD
  ? "https://api.leiloescapuci.com.br"
  : "http://localhost:3000";

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, "");

export const BACKEND_BASE_URL = stripTrailingSlash(
  import.meta.env.VITE_BACKEND_BASE_URL ||
    import.meta.env.VITE_AUTH_API_BASE_URL ||
    DEFAULT_BACKEND_URL
);

export const API_BASE_URL = stripTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || `${BACKEND_BASE_URL}/api/v1`
);

export const AUTH_BASE_URL = stripTrailingSlash(
  import.meta.env.VITE_AUTH_API_BASE_URL || BACKEND_BASE_URL
);

export const FRONTEND_BASE_URL = stripTrailingSlash(
  import.meta.env.VITE_FRONTEND_BASE_URL || window.location.origin
);

export const buildShareProductUrl = (productId: number | string) =>
  `${FRONTEND_BASE_URL}/compartilhar/produto/${encodeURIComponent(productId)}`;
