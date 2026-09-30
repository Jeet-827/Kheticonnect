import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { INITIAL_MANDI_RATES } from '../../data/mockData';

// ─── Helper: get stored access token ─────────────────────────────────────────
const getToken = () =>
  localStorage.getItem('kc_access_token') ||
  sessionStorage.getItem('kc_access_token') || '';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchProducts = createAsyncThunk('marketplace/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (data.success) return data.products;
    return rejectWithValue(data.message);
  } catch {
    return rejectWithValue('Failed to load products');
  }
});

export const addProductThunk = createAsyncThunk('marketplace/addProduct', async (productData, { rejectWithValue }) => {
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (data.success) return data.product;
    return rejectWithValue(data.message);
  } catch {
    return rejectWithValue('Failed to add product');
  }
});

export const placeBidThunk = createAsyncThunk('marketplace/placeBid', async ({ productId, bidAmount }, { rejectWithValue }) => {
  try {
    const res = await fetch(`/api/products/${productId}/bid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ amount: bidAmount })
    });
    const data = await res.json();
    if (data.success) return { productId, bidAmount, product: data.product };
    return rejectWithValue(data.message);
  } catch {
    return rejectWithValue('Failed to place bid');
  }
});

export const fetchMandiRates = createAsyncThunk('marketplace/fetchMandiRates', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch('/api/community/mandi');
    const data = await res.json();
    if (data.success) return data.mandiRates;
    return rejectWithValue(data.message);
  } catch {
    return rejectWithValue('Failed to load mandi rates');
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState: {
    products: [],
    orders: [],
    userBids: [],
    mandiRates: INITIAL_MANDI_RATES,
    loading: false,
    mandiLoading: false,
    error: null,
  },
  reducers: {
    // Optimistic local fallback for adding products
    addProduct(state, action) {
      state.products.unshift(action.payload);
    },

    // Local bid update (optimistic)
    placeBid(state, action) {
      const { productId, bidAmount, bidderName } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        product.currentHighestBid = bidAmount;
        product.totalBids = (product.totalBids || 0) + 1;
        product.bidsHistory = [
          { bidderName, amount: bidAmount, time: 'Just now' },
          ...(product.bidsHistory || []),
        ];
      }
      const bid = {
        id: `bid-${Date.now()}`,
        productId,
        productTitle: product?.title || 'Crop Produce',
        unit: product?.unit || 'Quintal',
        amount: bidAmount,
        time: 'Just now',
        status: 'Highest Bidder',
      };
      state.userBids.unshift(bid);
    },

    confirmPayment(state, action) {
      state.orders.unshift(action.payload);
    },

    updateMandiRates(state, action) {
      state.mandiRates = action.payload;
    },
  },
  extraReducers: (builder) => {
    // ── fetchProducts ──
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.products = action.payload; })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // ── addProductThunk ──
    builder
      .addCase(addProductThunk.fulfilled, (state, action) => {
        // Replace optimistic entry with real server response
        state.products = state.products.filter(p => p.id !== action.payload.id);
        state.products.unshift(action.payload);
      });

    // ── placeBidThunk ──
    builder
      .addCase(placeBidThunk.fulfilled, (state, action) => {
        const { productId, bidAmount, product } = action.payload;
        const idx = state.products.findIndex(p => p.id === productId);
        if (idx !== -1 && product) {
          state.products[idx] = { ...state.products[idx], ...product };
        }
        // Ensure bid is tracked in userBids
        const alreadyAdded = state.userBids.some(b => b.productId === productId && b.amount === bidAmount);
        if (!alreadyAdded) {
          state.userBids.unshift({
            id: `bid-${Date.now()}`,
            productId,
            productTitle: product?.title || 'Crop Produce',
            unit: product?.unit || 'Quintal',
            amount: bidAmount,
            time: 'Just now',
            status: 'Highest Bidder',
          });
        }
      });

    // ── fetchMandiRates ──
    builder
      .addCase(fetchMandiRates.pending, (state) => { state.mandiLoading = true; })
      .addCase(fetchMandiRates.fulfilled, (state, action) => { state.mandiLoading = false; state.mandiRates = action.payload; })
      .addCase(fetchMandiRates.rejected, (state) => { state.mandiLoading = false; }); // keep existing rates on failure
  },
});

export const { addProduct, placeBid, confirmPayment, updateMandiRates } = marketplaceSlice.actions;

// ─── Selectors ────────────────────────────────────────────────────────────────
export const selectProducts     = (state) => state.marketplace.products;
export const selectOrders       = (state) => state.marketplace.orders;
export const selectUserBids     = (state) => state.marketplace.userBids;
export const selectMandiRates   = (state) => state.marketplace.mandiRates;
export const selectMarketLoading = (state) => state.marketplace.loading;

// Dashboard-specific derived selectors
export const selectDashboardStats = (state) => {
  const { products, orders, userBids } = state.marketplace;
  const totalRevenue  = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const activeBids    = userBids.length;
  const activeListings = products.filter(p => p.listingType === 'auction').length;
  const fixedListings  = products.filter(p => p.listingType === 'fixed').length;
  return { totalRevenue, activeBids, activeListings, fixedListings, totalOrders: orders.length };
};

export default marketplaceSlice.reducer;
