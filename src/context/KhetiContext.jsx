import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_MANDI_RATES,
  INITIAL_PRODUCTS,
  DEMO_FARMER_PROFILE,
  DEMO_BUYER_PROFILE,
  COMMUNITY_GUIDES,
  GOVT_SCHEMES,
  FORUM_THREADS,
  REVIEWS_LIST
} from '../data/mockData';

// ─── Create Context ─────────────────────────────────────────────────────────
const KhetiContext = createContext(null);

// ─── Custom Hook ─────────────────────────────────────────────────────────────
export const useKheti = () => {
  const ctx = useContext(KhetiContext);
  if (!ctx) throw new Error('useKheti must be used inside KhetiProvider');
  return ctx;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

import { useAuth } from './AuthContext';

// ─── Provider ─────────────────────────────────────────────────────────────────
export function KhetiProvider({ children }) {
  const { user } = useAuth();

  // ---------- navigation ----------
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchTerm, setSearchTerm] = useState('');

  // ---------- role / user ----------
  const [userRole, setUserRole] = useState('buyer'); // 'farmer' | 'buyer'

  // Sync role with authenticated user role
  useEffect(() => {
    if (user?.role) {
      setUserRole(user.role);
    }
  }, [user]);

  const userProfile = user || (userRole === 'farmer' ? DEMO_FARMER_PROFILE : DEMO_BUYER_PROFILE);

  // ---------- persistent data ----------
  const [products, setProducts]       = useState(() => loadFromStorage('kheti_products', INITIAL_PRODUCTS));
  const [orders, setOrders]           = useState(() => loadFromStorage('kheti_orders', []));
  const [userBids, setUserBids]       = useState(() => loadFromStorage('kheti_bids', []));
  const [forumThreads, setForumThreads] = useState(() => loadFromStorage('kheti_forum', FORUM_THREADS));
  const [reviews, setReviews]         = useState(() => loadFromStorage('kheti_reviews', REVIEWS_LIST));

  // ---------- modal state ----------
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [biddingProduct, setBiddingProduct] = useState(null);
  const [buyingProduct, setBuyingProduct]   = useState(null);
  const [isCartOpen, setIsCartOpen]         = useState(false);

  // ---------- toast ----------
  const [toast, setToast] = useState(null);

  // ---------- sync to localStorage ----------
  useEffect(() => { localStorage.setItem('kheti_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('kheti_orders',   JSON.stringify(orders));   }, [orders]);
  useEffect(() => { localStorage.setItem('kheti_bids',     JSON.stringify(userBids)); }, [userBids]);
  useEffect(() => { localStorage.setItem('kheti_forum',    JSON.stringify(forumThreads)); }, [forumThreads]);
  useEffect(() => { localStorage.setItem('kheti_reviews',  JSON.stringify(reviews));  }, [reviews]);

  // ---------- toast helper ----------
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ---------- actions ----------
  const addProduct = useCallback((newCrop) => {
    setProducts(prev => [newCrop, ...prev]);
    showToast(`"${newCrop.title}" published successfully!`);
  }, [showToast]);

  const placeBid = useCallback((productId, bidAmount, bidderName) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      return {
        ...p,
        currentHighestBid: bidAmount,
        totalBids: (p.totalBids || 0) + 1,
        bidsHistory: [
          { bidderName, amount: bidAmount, time: 'Just now' },
          ...(p.bidsHistory || [])
        ]
      };
    }));

    const target = products.find(p => p.id === productId);
    setUserBids(prev => [{
      id: `bid-${Date.now()}`,
      productId,
      productTitle: target?.title || 'Crop Produce',
      unit: target?.unit || 'Quintal',
      amount: bidAmount,
      time: 'Just now',
      status: 'Highest Bidder'
    }, ...prev]);

    showToast(`Bid of ₹${bidAmount.toLocaleString()} submitted! You're the highest bidder.`, 'amber');
  }, [products, showToast]);

  const confirmPayment = useCallback((orderData) => {
    setOrders(prev => [orderData, ...prev]);
    showToast(` Order confirmed! Paid ₹${orderData.totalAmount.toLocaleString()}.`);
  }, [showToast]);

  const addForumThread = useCallback((thread) => {
    setForumThreads(prev => [thread, ...prev]);
    showToast(' Question posted to Community Forum!');
  }, [showToast]);

  const addReply = useCallback((threadId, replyObj) => {
    setForumThreads(prev => prev.map(th =>
      th.id === threadId
        ? { ...th, repliesCount: (th.repliesCount || 0) + 1, replies: [...(th.replies || []), replyObj] }
        : th
    ));
    showToast(' Your answer has been added!');
  }, [showToast]);

  const addReview = useCallback((newReview) => {
    setReviews(prev => [newReview, ...prev]);
    showToast(' Thank you! Your review has been published.');
  }, [showToast]);

  // ─── context value ────────────────────────────────────────────────────────
  const value = {
    // navigation
    activeTab, setActiveTab,
    searchTerm, setSearchTerm,

    // user
    userRole, setUserRole,
    userProfile,

    // data
    products, orders, userBids, forumThreads, reviews,

    // static data
    mandiRates: INITIAL_MANDI_RATES,
    guides: COMMUNITY_GUIDES,
    schemes: GOVT_SCHEMES,

    // modals
    isAddModalOpen, setIsAddModalOpen,
    biddingProduct, setBiddingProduct,
    buyingProduct,  setBuyingProduct,
    isCartOpen,     setIsCartOpen,

    // toast
    toast,

    // actions
    addProduct,
    placeBid,
    confirmPayment,
    addForumThread,
    addReply,
    addReview,
  };

  return <KhetiContext.Provider value={value}>{children}</KhetiContext.Provider>;
}
