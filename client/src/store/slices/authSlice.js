import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tokenService } from '../../services/tokenService';
import { DEMO_FARMER_PROFILE, DEMO_BUYER_PROFILE, DEMO_ADMIN_PROFILE } from '../../data/mockData';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/auth` : '/api/auth';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const initAuth = createAsyncThunk('auth/init', async (_, { rejectWithValue }) => {
  const refreshToken = tokenService.getRefreshToken();
  if (!refreshToken) return rejectWithValue('no_token');

  // Demo mode
  if (refreshToken.startsWith('demo-refresh-')) {
    let demoUser = DEMO_BUYER_PROFILE;
    if (refreshToken.includes('farmer')) demoUser = DEMO_FARMER_PROFILE;
    if (refreshToken.includes('admin')) demoUser = DEMO_ADMIN_PROFILE;
    const demoAccessToken = `demo-access-${demoUser.role}-${Date.now()}`;
    tokenService.setAccessToken(demoAccessToken);
    return { user: demoUser, accessToken: demoAccessToken };
  }

  try {
    const res = await fetch(`${API_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ refreshToken }),
    });
    const data = await res.json();
    if (data.success && data.accessToken) {
      tokenService.setAccessToken(data.accessToken);
      if (data.refreshToken) tokenService.setRefreshToken(data.refreshToken, 7);
      return { user: data.user, accessToken: data.accessToken };
    }
    tokenService.clearTokens();
    return rejectWithValue('invalid_refresh');
  } catch {
    // Offline fallback
    let demoUser = DEMO_BUYER_PROFILE;
    if (refreshToken.includes('farmer')) demoUser = DEMO_FARMER_PROFILE;
    if (refreshToken.includes('admin')) demoUser = DEMO_ADMIN_PROFILE;
    const demoAccessToken = `demo-access-fallback-${Date.now()}`;
    tokenService.setAccessToken(demoAccessToken);
    return { user: demoUser, accessToken: demoAccessToken };
  }
});

export const loginUser = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      tokenService.setAccessToken(data.accessToken);
      if (data.refreshToken) tokenService.setRefreshToken(data.refreshToken, 7);
      return { user: data.user, accessToken: data.accessToken };
    }
    return rejectWithValue(data.message || 'Login failed');
  } catch {
    // Offline demo fallback
    const isFarmer = email.toLowerCase().includes('farmer');
    const isAdmin = email.toLowerCase().includes('admin');
    const demoUser = isAdmin ? DEMO_ADMIN_PROFILE : isFarmer ? DEMO_FARMER_PROFILE : DEMO_BUYER_PROFILE;
    const demoRefreshToken = `demo-refresh-${demoUser.role}-${Date.now()}`;
    const demoAccessToken = `demo-access-${Date.now()}`;
    tokenService.setAccessToken(demoAccessToken);
    tokenService.setRefreshToken(demoRefreshToken, 7);
    return { user: demoUser, accessToken: demoAccessToken, isDemo: true };
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (data.success) {
      tokenService.setAccessToken(data.accessToken);
      if (data.refreshToken) tokenService.setRefreshToken(data.refreshToken, 7);
      return { user: data.user, accessToken: data.accessToken };
    }
    return rejectWithValue(data.message || 'Registration failed');
  } catch {
    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name || 'Agri Member',
      email: userData.email,
      role: userData.role || 'buyer',
      location: userData.location || 'Punjab, India',
      rating: 5.0,
      verified: true,
      joinedDate: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    };
    const demoRefreshToken = `demo-refresh-${userData.role || 'buyer'}-${Date.now()}`;
    const demoAccessToken = `demo-access-${Date.now()}`;
    tokenService.setAccessToken(demoAccessToken);
    tokenService.setRefreshToken(demoRefreshToken, 7);
    return { user: newUser, accessToken: demoAccessToken, isDemo: true };
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' });
  } catch { /* silent */ }
  tokenService.clearTokens();
});

export const demoLoginUser = createAsyncThunk('auth/demoLogin', async (role) => {
  let demoUser = DEMO_BUYER_PROFILE;
  if (role === 'farmer') demoUser = DEMO_FARMER_PROFILE;
  if (role === 'admin') demoUser = DEMO_ADMIN_PROFILE;
  const demoRefreshToken = `demo-refresh-${role}-${Date.now()}`;
  const demoAccessToken = `demo-access-${role}-${Date.now()}`;
  tokenService.setAccessToken(demoAccessToken);
  tokenService.setRefreshToken(demoRefreshToken, 7);
  return { user: demoUser, accessToken: demoAccessToken };
});

export const updateUserProfile = createAsyncThunk('auth/updateUserProfile', async (profileData, { rejectWithValue }) => {
  const accessToken = tokenService.getAccessToken();
  try {
    const res = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (data.success) {
      return data.user;
    }
    // Fallback if token rejected or server returned error
    return profileData;
  } catch {
    // Demo/offline update profile fallback
    return profileData;
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Init
    builder
      .addCase(initAuth.pending, (state) => { state.loading = true; })
      .addCase(initAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(initAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });

    // Login
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
    });

    // Demo Login
    builder.addCase(demoLoginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.loading = false;
    });

    // Update Profile
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    });
  },
});

export const { clearError, updateProfile } = authSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAccessToken = (state) => state.auth.accessToken;

export default authSlice.reducer;
