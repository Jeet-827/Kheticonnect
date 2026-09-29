import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import marketplaceReducer from './slices/marketplaceSlice';
import uiReducer from './slices/uiSlice';
import communityReducer from './slices/communitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    marketplace: marketplaceReducer,
    ui: uiReducer,
    community: communityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for non-serializable values (e.g., Date)
        ignoredActions: ['marketplace/confirmPayment'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
