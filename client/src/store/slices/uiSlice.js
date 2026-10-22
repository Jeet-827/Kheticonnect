import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    activeTab: 'marketplace',
    searchTerm: '',
    userRole: 'buyer',
    isAddModalOpen: false,
    biddingProduct: null,
    buyingProduct: null,
    isCartOpen: false,
    toast: null, // { message, type }
  },
  reducers: {
    setUI: (state, { payload }) => Object.assign(state, payload),
    setSearchTerm: (state, { payload }) => {
      state.searchTerm = payload;
    },
    showToast: (state, { payload }) => { state.toast = payload; },
    clearToast: (state) => { state.toast = null; },
  },
});

export const { setUI, setSearchTerm, showToast, clearToast } = uiSlice.actions;

export default uiSlice.reducer;