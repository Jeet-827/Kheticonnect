import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';

// Store selectors
import {
  selectProducts, selectOrders, selectUserBids, selectMandiRates,
  selectMarketLoading,
  addProduct, placeBid as placeBidAction, confirmPayment as confirmPaymentAction,
  addProductThunk, placeBidThunk,
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
  postForumThread, postReply, postReview, postGuide,
} from '../store/slices/communitySlice';
import { selectUser } from '../store/slices/authSlice';

export function useKheti() {
  const dispatch = useDispatch();

  const user         = useSelector(selectUser);
  const userRole     = useSelector(selectUserRole);
  const activeTab    = useSelector(selectActiveTab);
  const searchTerm   = useSelector(selectSearchTerm);
  const products     = useSelector(selectProducts);
  const orders       = useSelector(selectOrders);
  const userBids     = useSelector(selectUserBids);
  const mandiRates   = useSelector(selectMandiRates);
  const guides       = useSelector(selectGuides);
  const schemes      = useSelector(selectSchemes);
  const forumThreads = useSelector(selectForumThreads);
  const reviews      = useSelector(selectReviews);
  const marketLoading = useSelector(selectMarketLoading);
  const isAddModalOpen  = useSelector(selectIsAddModalOpen);
  const biddingProduct  = useSelector(selectBiddingProduct);
  const buyingProduct   = useSelector(selectBuyingProduct);
  const isCartOpen      = useSelector(selectIsCartOpen);
  const toast           = useSelector(selectToast);

  // userProfile is always derived from authenticated user (no mock fallback)
  const userProfile = user;

  // ─── Toast helper ─────────────────────────────────────────────────────────
  const _showToast = useCallback((message, type = 'success') => {
    dispatch(showToast({ message, type }));
    setTimeout(() => dispatch(clearToast()), 3500);
  }, [dispatch]);

  // ─── Marketplace Actions ──────────────────────────────────────────────────
  const _addProduct = useCallback(async (newCrop) => {
    // Optimistic local update
    dispatch(addProduct(newCrop));
    _showToast(`"${newCrop.title}" is being published...`, 'info');
    // Real API call
    const result = await dispatch(addProductThunk(newCrop));
    if (addProductThunk.fulfilled.match(result)) {
      _showToast(`"${newCrop.title}" published successfully!`);
    } else {
      _showToast(`Listing saved locally. Will sync when online.`, 'amber');
    }
  }, [dispatch, _showToast]);

  const _placeBid = useCallback(async (productId, bidAmount, bidderName) => {
    // Optimistic local update
    dispatch(placeBidAction({ productId, bidAmount, bidderName }));
    // Real API call
    const result = await dispatch(placeBidThunk({ productId, bidAmount }));
    if (placeBidThunk.fulfilled.match(result)) {
      _showToast(`Bid of ₹${bidAmount.toLocaleString()} placed! You're the highest bidder.`, 'amber');
    } else {
      _showToast(`Bid of ₹${bidAmount.toLocaleString()} submitted! You're the highest bidder.`, 'amber');
    }
  }, [dispatch, _showToast]);

  const _confirmPayment = useCallback((orderData) => {
    dispatch(confirmPaymentAction(orderData));
    _showToast(`Order confirmed! Paid ₹${orderData.totalAmount.toLocaleString()}.`);
  }, [dispatch, _showToast]);

  // ─── Community Actions ─────────────────────────────────────────────────────
  const _addForumThread = useCallback(async (thread) => {
    // Optimistic local update
    dispatch(addForumThreadAction(thread));
    // Real API call
    const result = await dispatch(postForumThread({ title: thread.title, content: thread.content }));
    if (postForumThread.fulfilled.match(result)) {
      _showToast('Question posted to Community Forum!');
    } else {
      _showToast('Question posted (local mode)!');
    }
  }, [dispatch, _showToast]);

  const _addReply = useCallback(async (threadId, replyObj) => {
    // Optimistic local update
    dispatch(addReplyAction({ threadId, replyObj }));
    // Real API call
    await dispatch(postReply({ threadId, text: replyObj.text }));
    _showToast('Your answer has been added!');
  }, [dispatch, _showToast]);

  const _addReview = useCallback(async (newReview) => {
    // Optimistic local update
    dispatch(addReviewAction(newReview));
    // Real API call
    const result = await dispatch(postReview({
      cropTitle: newReview.cropTitle,
      rating: newReview.rating,
      comment: newReview.comment,
    }));
    if (postReview.fulfilled.match(result)) {
      _showToast('Thank you! Your review has been published.');
    } else {
      _showToast('Review saved locally!');
    }
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
    marketLoading,

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
