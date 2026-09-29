
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';

// Store selectors
import {
  selectProducts, selectOrders, selectUserBids, selectMandiRates,
  addProduct, placeBid as placeBidAction, confirmPayment as confirmPaymentAction,
} from '../store/slices/marketplaceSlice';
import {
  selectActiveTab, selectSearchTerm, selectUserRole,
  selectIsAddModalOpen, selectBiddingProduct, selectBuyingProduct, selectIsCartOpen, selectToast,
  setActiveTab, setSearchTerm, setUserRole,
  setIsAddModalOpen, setBiddingProduct, setBuyingProduct, setIsCartOpen,
  showToast, clearToast,
} from '../store/slices/uiSlice';
import {
  selectGuides, selectSchemes, selectForumThreads, selectReviews,
  addForumThread as addForumThreadAction, addReply as addReplyAction, addReview as addReviewAction,
} from '../store/slices/communitySlice';
import { selectUser } from '../store/slices/authSlice';

import { DEMO_FARMER_PROFILE, DEMO_BUYER_PROFILE } from '../data/mockData';

export function useKheti() {
  const dispatch = useDispatch();

  const user       = useSelector(selectUser);
  const userRole   = useSelector(selectUserRole);
  const activeTab  = useSelector(selectActiveTab);
  const searchTerm = useSelector(selectSearchTerm);
  const products   = useSelector(selectProducts);
  const orders     = useSelector(selectOrders);
  const userBids   = useSelector(selectUserBids);
  const mandiRates = useSelector(selectMandiRates);
  const guides     = useSelector(selectGuides);
  const schemes    = useSelector(selectSchemes);
  const forumThreads = useSelector(selectForumThreads);
  const reviews    = useSelector(selectReviews);
  const isAddModalOpen  = useSelector(selectIsAddModalOpen);
  const biddingProduct  = useSelector(selectBiddingProduct);
  const buyingProduct   = useSelector(selectBuyingProduct);
  const isCartOpen      = useSelector(selectIsCartOpen);
  const toast           = useSelector(selectToast);

  const userProfile = user || (userRole === 'farmer' ? DEMO_FARMER_PROFILE : DEMO_BUYER_PROFILE);

  // ─── Toast helper ─────────────────────────────────────────────────────────
  const _showToast = useCallback((message, type = 'success') => {
    dispatch(showToast({ message, type }));
    setTimeout(() => dispatch(clearToast()), 3500);
  }, [dispatch]);

  // ─── Actions ──────────────────────────────────────────────────────────────
  const _addProduct = useCallback((newCrop) => {
    dispatch(addProduct(newCrop));
    _showToast(`"${newCrop.title}" published successfully!`);
  }, [dispatch, _showToast]);

  const _placeBid = useCallback((productId, bidAmount, bidderName) => {
    dispatch(placeBidAction({ productId, bidAmount, bidderName }));
    _showToast(`Bid of ₹${bidAmount.toLocaleString()} submitted! You're the highest bidder.`, 'amber');
  }, [dispatch, _showToast]);

  const _confirmPayment = useCallback((orderData) => {
    dispatch(confirmPaymentAction(orderData));
    _showToast(`Order confirmed! Paid ₹${orderData.totalAmount.toLocaleString()}.`);
  }, [dispatch, _showToast]);

  const _addForumThread = useCallback((thread) => {
    dispatch(addForumThreadAction(thread));
    _showToast('Question posted to Community Forum!');
  }, [dispatch, _showToast]);

  const _addReply = useCallback((threadId, replyObj) => {
    dispatch(addReplyAction({ threadId, replyObj }));
    _showToast('Your answer has been added!');
  }, [dispatch, _showToast]);

  const _addReview = useCallback((newReview) => {
    dispatch(addReviewAction(newReview));
    _showToast('Thank you! Your review has been published.');
  }, [dispatch, _showToast]);

  return {
    // navigation
    activeTab,
    setActiveTab: (tab) => dispatch(setActiveTab(tab)),
    searchTerm,
    setSearchTerm: (term) => dispatch(setSearchTerm(term)),

    // user / role
    userRole,
    setUserRole: (role) => dispatch(setUserRole(role)),
    userProfile,

    // data
    products,
    orders,
    userBids,
    mandiRates,
    guides,
    schemes,
    forumThreads,
    reviews,

    // modals
    isAddModalOpen,
    setIsAddModalOpen: (v) => dispatch(setIsAddModalOpen(v)),
    biddingProduct,
    setBiddingProduct: (p) => dispatch(setBiddingProduct(p)),
    buyingProduct,
    setBuyingProduct: (p) => dispatch(setBuyingProduct(p)),
    isCartOpen,
    setIsCartOpen: (v) => dispatch(setIsCartOpen(v)),

    // toast
    toast,
    showToast: _showToast,

    // actions
    addProduct: _addProduct,
    placeBid: _placeBid,
    confirmPayment: _confirmPayment,
    addForumThread: _addForumThread,
    addReply: _addReply,
    addReview: _addReview,
  };
}
