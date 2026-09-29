import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_FARMER_PROFILE, DEMO_BUYER_PROFILE, DEMO_ADMIN_PROFILE } from '../data/mockData';
import { tokenService } from '../services/tokenService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_URL = 'http://localhost:5000/api/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => tokenService.getAccessToken());
  const [loading, setLoading] = useState(true);

  // Helper to store access token in memory & update state
  const updateTokens = (newAccessToken, newRefreshToken, userData) => {
    tokenService.setAccessToken(newAccessToken);
    setAccessToken(newAccessToken);

    if (newRefreshToken) {
      tokenService.setRefreshToken(newRefreshToken, 7);
    }
    if (userData) {
      setUser(userData);
    }
  };

  // ─── Verify & Refresh Token on Mount ──────────────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      const refreshToken = tokenService.getRefreshToken();

      if (!refreshToken) {
        setLoading(false);
        return;
      }

      // Check for Demo Mode Refresh Token in cookie
      if (refreshToken.startsWith('demo-refresh-')) {
        let demoUser = DEMO_BUYER_PROFILE;
        if (refreshToken.includes('farmer')) demoUser = DEMO_FARMER_PROFILE;
        if (refreshToken.includes('admin')) demoUser = DEMO_ADMIN_PROFILE;
        const demoAccessToken = `demo-access-${demoUser.role}-${Date.now()}`;
        updateTokens(demoAccessToken, refreshToken, demoUser);
        setLoading(false);
        return;
      }

      // Attempt to refresh access token using refresh cookie from backend
      try {
        const res = await fetch(`${API_URL}/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ refreshToken })
        });

        const data = await res.json();
        if (data.success && data.accessToken) {
          updateTokens(data.accessToken, data.refreshToken || refreshToken, data.user);
        } else {
          // Refresh token invalid or expired
          tokenService.clearTokens();
          setAccessToken(null);
          setUser(null);
        }
      } catch (err) {
        console.warn('Backend server offline during refresh, relying on active cookie session.');
        const isFarmer = refreshToken.includes('farmer');
        const demoUser = isFarmer ? DEMO_FARMER_PROFILE : DEMO_BUYER_PROFILE;
        const demoAccessToken = `demo-access-fallback-${Date.now()}`;
        updateTokens(demoAccessToken, refreshToken, demoUser);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ─── Login Handler ────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (data.success) {
        updateTokens(data.accessToken, data.refreshToken, data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (err) {
      // Offline fallback: store demo refresh token in cookie and access token in memory
      const isFarmer = email.toLowerCase().includes('farmer');
      const demoUser = isFarmer ? DEMO_FARMER_PROFILE : DEMO_BUYER_PROFILE;
      const demoRefreshToken = `demo-refresh-${isFarmer ? 'farmer' : 'buyer'}-${Date.now()}`;
      const demoAccessToken = `demo-access-${Date.now()}`;

      updateTokens(demoAccessToken, demoRefreshToken, demoUser);
      return { success: true, isDemo: true, message: 'Logged in using Offline Demo Mode.' };
    }
  };

  // ─── Quick Demo Login Helper ──────────────────────────────────────────────
  const demoLogin = (role = 'farmer') => {
    let demoUser = DEMO_BUYER_PROFILE;
    if (role === 'farmer') demoUser = DEMO_FARMER_PROFILE;
    if (role === 'admin') demoUser = DEMO_ADMIN_PROFILE;
    const demoRefreshToken = `demo-refresh-${role}-${Date.now()}`;
    const demoAccessToken = `demo-access-${role}-${Date.now()}`;

    updateTokens(demoAccessToken, demoRefreshToken, demoUser);
    return { success: true };
  };

  // ─── Register Handler ──────────────────────────────────────────────────────
  const register = async (userData) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData)
      });

      const data = await res.json();
      if (data.success) {
        updateTokens(data.accessToken, data.refreshToken, data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (err) {
      const newUser = {
        id: `user-${Date.now()}`,
        name: userData.name || 'Agri Member',
        email: userData.email,
        role: userData.role || 'buyer',
        location: userData.location || 'Punjab, India',
        rating: 5.0,
        verified: true,
        joinedDate: 'Just now',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'
      };
      const demoRefreshToken = `demo-refresh-${userData.role || 'buyer'}-${Date.now()}`;
      const demoAccessToken = `demo-access-${Date.now()}`;

      updateTokens(demoAccessToken, demoRefreshToken, newUser);
      return { success: true, isDemo: true };
    }
  };

  // ─── Logout Handler ────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' });
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      tokenService.clearTokens();
      setAccessToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token: accessToken,
    accessToken,
    loading,
    login,
    demoLogin,
    register,
    logout,
    isAuthenticated: !!user && !!accessToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
