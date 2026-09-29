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
    toast: null,
  },
  reducers: {
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setUserRole(state, action) {
      state.userRole = action.payload;
    },
    setIsAddModalOpen(state, action) {
      state.isAddModalOpen = action.payload;
    },
    setBiddingProduct(state, action) {
      state.biddingProduct = action.payload;
    },
    setBuyingProduct(state, action) {
      state.buyingProduct = action.payload;
    },
    setIsCartOpen(state, action) {
      state.isCartOpen = action.payload;
    },
    showToast(state, action) {
      // payload: { message: string, type?: 'success' | 'error' | 'amber' }
      state.toast = action.payload;
    },
    clearToast(state) {
      state.toast = null;
    },
  },
});

export const {
  setActiveTab,
  setSearchTerm,
  setUserRole,
  setIsAddModalOpen,
  setBiddingProduct,
  setBuyingProduct,
  setIsCartOpen,
  showToast,
  clearToast,
} = uiSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectActiveTab = (state) => state.ui.activeTab;
export const selectSearchTerm = (state) => state.ui.searchTerm;
export const selectUserRole = (state) => state.ui.userRole;
export const selectIsAddModalOpen = (state) => state.ui.isAddModalOpen;
export const selectBiddingProduct = (state) => state.ui.biddingProduct;
export const selectBuyingProduct = (state) => state.ui.buyingProduct;
export const selectIsCartOpen = (state) => state.ui.isCartOpen;
export const selectToast = (state) => state.ui.toast;

export default uiSlice.reducer;
