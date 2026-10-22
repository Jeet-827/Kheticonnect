import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const request = async (method, url, getState, body, params) => {
  const token = getState().auth.token;
  const { data } = await axios({
    method,
    url,
    data: body,
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!data.success) throw new Error(data.message);
  return data;
};

// Products
export const fetchProducts = createAsyncThunk('marketplace/fetchProducts', async (params = {}, { getState }) =>
  request('get', '/api/products', getState, null, params));

export const fetchMyProducts = createAsyncThunk('marketplace/fetchMyProducts', async (_, { getState }) =>
  (await request('get', '/api/products/user/mine', getState)).products);

export const addProduct = createAsyncThunk('marketplace/addProduct', async (body, { getState }) =>
  (await request('post', '/api/products', getState, body)).product);

// Bids
export const placeBid = createAsyncThunk('marketplace/placeBid', async ({ productId, bidAmount }, { getState }) => {
  const { product } = await request('post', `/api/products/${productId}/bid`, getState, { amount: bidAmount });
  return { productId, bidAmount, product };
});

// Orders
export const placeOrder = createAsyncThunk('marketplace/placeOrder', async ({ productId, quantity }, { getState }) =>
  (await request('post', `/api/products/${productId}/order`, getState, { quantity })).order);

export const fetchMyOrders = createAsyncThunk('marketplace/fetchMyOrders', async (_, { getState }) =>
  (await request('get', '/api/products/orders/mine', getState)).orders);

export const fetchFarmerOrders = createAsyncThunk('marketplace/fetchFarmerOrders', async (_, { getState }) =>
  (await request('get', '/api/products/orders/farmer', getState)).orders);

// Others
export const fetchMandiRates = createAsyncThunk('marketplace/fetchMandiRates', async (_, { getState }) =>
  (await request('get', '/api/community/mandi', getState)).mandiRates);

// Slice
const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState: {
    products: [],
    loading: false,
    myProducts: [],
    orders: [],
    farmerOrders: [],
    userBids: [],
    mandiRates: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.products = payload.products;
      })
      .addCase(fetchProducts.rejected, (state) => { state.loading = false; })
      .addCase(fetchMyProducts.fulfilled, (state, { payload }) => { state.myProducts = payload; })
      .addCase(addProduct.fulfilled, (state, { payload }) => { state.products.unshift(payload); })
      .addCase(placeBid.fulfilled, (state, { payload: { productId, bidAmount, product } }) => {
        const index = state.products.findIndex((p) => (p._id || p.id) === productId);
        if (index !== -1) state.products[index] = { ...state.products[index], ...product };
        state.userBids.unshift({ productId, amount: bidAmount, title: product?.title });
      })
      .addCase(placeOrder.fulfilled, (state, { payload }) => { state.orders.unshift(payload); })
      .addCase(fetchMyOrders.fulfilled, (state, { payload }) => { state.orders = payload; })
      .addCase(fetchFarmerOrders.fulfilled, (state, { payload }) => { state.farmerOrders = payload; })
      .addCase(fetchMandiRates.fulfilled, (state, { payload }) => { state.mandiRates = payload; });
  },
});

// Selectors
export const selectProducts = (state) => state.marketplace.products;
export const selectMyProducts = (state) => state.marketplace.myProducts;
export const selectOrders = (state) => state.marketplace.orders;
export const selectFarmerOrders = (state) => state.marketplace.farmerOrders;
export const selectUserBids = (state) => state.marketplace.userBids;
export const selectMandiRates = (state) => state.marketplace.mandiRates;

export default marketplaceSlice.reducer;