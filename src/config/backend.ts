const DEFAULT_BACKEND_URL = "http://localhost:3000";

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

export const WEBSOCKET_URL =
  import.meta.env.VITE_WEBSOCKET_URL ||
  `${BACKEND_BASE_URL.replace(/^http/, "ws")}/cable`;

export const buildShareProductUrl = (productId: number | string) =>
  `${BACKEND_BASE_URL}/share/products/${productId}`;
