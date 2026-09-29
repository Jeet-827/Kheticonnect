import { createSlice } from '@reduxjs/toolkit';
import {
  INITIAL_PRODUCTS,
  INITIAL_MANDI_RATES,
  DEMO_FARMER_PROFILE,
  DEMO_BUYER_PROFILE,
} from '../../data/mockData';

const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
};

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState: {
    products: loadFromStorage('kheti_products', INITIAL_PRODUCTS),
    orders: loadFromStorage('kheti_orders', []),
    userBids: loadFromStorage('kheti_bids', []),
    mandiRates: INITIAL_MANDI_RATES,
  },
  reducers: {
    // ─── Products ────────────────────────────────────────────────────────────
    addProduct(state, action) {
      state.products.unshift(action.payload);
      saveToStorage('kheti_products', state.products);
    },

    placeBid(state, action) {
      const { productId, bidAmount, bidderName } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (!product) return;

      product.currentHighestBid = bidAmount;
      product.totalBids = (product.totalBids || 0) + 1;
      product.bidsHistory = [
        { bidderName, amount: bidAmount, time: 'Just now' },
        ...(product.bidsHistory || []),
      ];
      saveToStorage('kheti_products', state.products);

      const bid = {
        id: `bid-${Date.now()}`,
        productId,
        productTitle: product.title || 'Crop Produce',
        unit: product.unit || 'Quintal',
        amount: bidAmount,
        time: 'Just now',
        status: 'Highest Bidder',
      };
      state.userBids.unshift(bid);
      saveToStorage('kheti_bids', state.userBids);
    },

    confirmPayment(state, action) {
      state.orders.unshift(action.payload);
      saveToStorage('kheti_orders', state.orders);
    },

    updateMandiRates(state, action) {
      state.mandiRates = action.payload;
    },
  },
});

export const { addProduct, placeBid, confirmPayment, updateMandiRates } = marketplaceSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectProducts = (state) => state.marketplace.products;
export const selectOrders = (state) => state.marketplace.orders;
export const selectUserBids = (state) => state.marketplace.userBids;
export const selectMandiRates = (state) => state.marketplace.mandiRates;

// Dashboard-specific derived selectors
export const selectDashboardStats = (state) => {
  const { products, orders, userBids } = state.marketplace;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeBids = userBids.length;
  const activeListings = products.filter(p => p.listingType === 'auction').length;
  const fixedListings = products.filter(p => p.listingType === 'fixed').length;
  return { totalRevenue, activeBids, activeListings, fixedListings, totalOrders: orders.length };
};

export default marketplaceSlice.reducer;
