import { createSlice } from '@reduxjs/toolkit';

const savedToken = typeof window !== 'undefined' ? localStorage.getItem('kheti_token') : null;
const savedUser = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('kheti_user') || 'null') : null;

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    user: savedUser,
    token: savedToken,
  },

  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      if (typeof window !== 'undefined') {
        if (action.payload.token) localStorage.setItem('kheti_token', action.payload.token);
        if (action.payload.user) localStorage.setItem('kheti_user', JSON.stringify(action.payload.user));
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('kheti_token');
        localStorage.removeItem('kheti_user');
      }
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;