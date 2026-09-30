// ─── Token Service: In-Memory Access Token & Storage/Cookie Refresh Token ───

let inMemoryAccessToken = null;

const ACCESS_TOKEN_KEY = 'kheti_access_token';
const REFRESH_TOKEN_COOKIE_KEY = 'kheti_refresh_token';
const REFRESH_TOKEN_STORAGE_KEY = 'kheti_refresh_token';

// ─── Cookie Utilities ────────────────────────────────────────────────────────
export const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
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
  if (typeof document === 'undefined') return;
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
};

export const deleteCookie = (name) => {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
};

// ─── Token Service API ───────────────────────────────────────────────────────
export const tokenService = {
  // Get Access Token from In-Memory Closure or localStorage
  getAccessToken() {
    if (inMemoryAccessToken) return inMemoryAccessToken;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(ACCESS_TOKEN_KEY);
      if (stored) {
        inMemoryAccessToken = stored;
        return stored;
      }
    }
    return null;
  },

  // Set Access Token in In-Memory Closure and localStorage
  setAccessToken(token) {
    inMemoryAccessToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      }
    }
  },

  // Get Refresh Token from Cookie or localStorage
  getRefreshToken() {
    const cookieToken = getCookie(REFRESH_TOKEN_COOKIE_KEY);
    if (cookieToken) return cookieToken;
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    }
    return null;
  },

  // Set Refresh Token in Cookie and localStorage
  setRefreshToken(refreshToken, days = 7) {
    if (refreshToken) {
      setCookie(REFRESH_TOKEN_COOKIE_KEY, refreshToken, days);
      if (typeof window !== 'undefined') {
        localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
      }
    } else {
      deleteCookie(REFRESH_TOKEN_COOKIE_KEY);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
      }
    }
  },

  // Clear all tokens (In-Memory, localStorage & Cookie)
  clearTokens() {
    inMemoryAccessToken = null;
    deleteCookie(REFRESH_TOKEN_COOKIE_KEY);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    }
  },

  // Check if session has active refresh token cookie or storage
  hasRefreshToken() {
    return !!(getCookie(REFRESH_TOKEN_COOKIE_KEY) || (typeof window !== 'undefined' && localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)));
  }
};

export default tokenService;

