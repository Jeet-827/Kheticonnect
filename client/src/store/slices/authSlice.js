import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tokenService } from '../../services/tokenService';
import { DEMO_FARMER_PROFILE, DEMO_BUYER_PROFILE } from '../../data/mockData';

const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/auth` : '/api/auth';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const initAuth = createAsyncThunk('auth/init', async (_, { rejectWithValue }) => {
  const refreshToken = tokenService.getRefreshToken();
  if (!refreshToken) return rejectWithValue('no_token');

  // Demo mode
  if (refreshToken.startsWith('demo-refresh-')) {
    const demoUser = refreshToken.includes('farmer') ? DEMO_FARMER_PROFILE : DEMO_BUYER_PROFILE;
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
    const demoUser = refreshToken.includes('farmer') ? DEMO_FARMER_PROFILE : DEMO_BUYER_PROFILE;
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
    const demoUser = isFarmer ? DEMO_FARMER_PROFILE : DEMO_BUYER_PROFILE;
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
  const demoUser = role === 'farmer' ? DEMO_FARMER_PROFILE : DEMO_BUYER_PROFILE;
  const demoRefreshToken = `demo-refresh-${demoUser.role}-${Date.now()}`;
  const demoAccessToken = `demo-access-${demoUser.role}-${Date.now()}`;
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
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: 'include',
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (data.success && data.user) {
      return data.user;
    }
    return rejectWithValue(data.message || 'Failed to update profile');
  } catch (err) {
    // Demo/offline update profile fallback
    return profileData;
  }
});

export const fetchUserProfile = createAsyncThunk('auth/fetchUserProfile', async (_, { rejectWithValue }) => {
  const accessToken = tokenService.getAccessToken();
  try {
    const res = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: 'include',
    });

    if (res.status === 401) {
      // Access token might be expired, attempt refresh
      const refreshToken = tokenService.getRefreshToken();
      if (refreshToken) {
        const refreshRes = await fetch(`${API_URL}/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ refreshToken }),
        });
        const refreshData = await refreshRes.json();
        if (refreshData.success && refreshData.accessToken) {
          tokenService.setAccessToken(refreshData.accessToken);
          if (refreshData.refreshToken) tokenService.setRefreshToken(refreshData.refreshToken, 7);

          const retryRes = await fetch(`${API_URL}/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${refreshData.accessToken}`,
            },
            credentials: 'include',
          });
          const retryData = await retryRes.json();
          if (retryData.success && retryData.user) {
            return retryData.user;
          }
        }
      }
      return rejectWithValue('Session expired. Please log in again.');
    }

    const data = await res.json();
    if (data.success && data.user) {
      return data.user;
    }
    return rejectWithValue(data.message || 'Failed to fetch user profile');
  } catch (err) {
    return rejectWithValue(err.message || 'Backend connection error');
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: null,
    loading: true,
    profileLoading: false,
    profileUpdating: false,
    profileError: null,
    profileLastFetched: null,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    clearProfileError: (state) => { state.profileError = null; },
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
      state.profileLoading = false;
      state.profileUpdating = false;
      state.profileError = null;
      state.profileLastFetched = null;
    });

    // Demo Login
    builder.addCase(demoLoginUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.profileLastFetched = new Date().toISOString();
    });

    // Fetch Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profileError = null;
        state.profileLastFetched = new Date().toISOString();
        if (action.payload) {
          state.user = { ...(state.user || {}), ...action.payload };
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      });

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.profileUpdating = true;
        state.profileError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profileUpdating = false;
        state.profileError = null;
        state.profileLastFetched = new Date().toISOString();
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        } else {
          state.user = action.payload;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.profileUpdating = false;
        state.profileError = action.payload;
      });
  },
});

export const { clearError, clearProfileError, updateProfile } = authSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectProfileLoading = (state) => state.auth.profileLoading;
export const selectProfileUpdating = (state) => state.auth.profileUpdating;
export const selectProfileError = (state) => state.auth.profileError;
export const selectProfileLastFetched = (state) => state.auth.profileLastFetched;
export const selectAuthError = (state) => state.auth.error;
export const selectAccessToken = (state) => state.auth.accessToken;

export default authSlice.reducer;
