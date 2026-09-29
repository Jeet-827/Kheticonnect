// ─── Token Service: In-Memory Access Token & Cookie Refresh Token ───────────

let inMemoryAccessToken = null;

const REFRESH_TOKEN_COOKIE_KEY = 'kheti_refresh_token';

// ─── Cookie Utilities ────────────────────────────────────────────────────────
export const getCookie = (name) => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
};

export const setCookie = (name, value, days = 7) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
};

// ─── Token Service API ───────────────────────────────────────────────────────
export const tokenService = {
  // Get Access Token from In-Memory Closure
  getAccessToken() {
    return inMemoryAccessToken;
  },

  // Set Access Token in In-Memory Closure
  setAccessToken(token) {
    inMemoryAccessToken = token;
  },

  // Get Refresh Token from Cookie
  getRefreshToken() {
    return getCookie(REFRESH_TOKEN_COOKIE_KEY);
  },

  // Set Refresh Token in Cookie
  setRefreshToken(refreshToken, days = 7) {
    if (refreshToken) {
      setCookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, days);
    } else {
      deleteCookie(REFRESH_TOKEN_COOKIE_KEY);
    }
  },

  // Clear all tokens (In-Memory Access Token & Cookie Refresh Token)
  clearTokens() {
    inMemoryAccessToken = null;
    deleteCookie(REFRESH_TOKEN_COOKIE_KEY);
  },

  // Check if session has active refresh token cookie
  hasRefreshToken() {
    return !!getCookie(REFRESH_TOKEN_COOKIE_KEY);
  }
};

export default tokenService;
