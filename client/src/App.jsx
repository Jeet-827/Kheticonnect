import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchProducts, fetchMandiRates } from './store/slices/marketplaceSlice';
import { fetchGuides, fetchSchemes, fetchForumThreads, fetchReviews } from './store/slices/communitySlice';

import Header from './components/Header';
import Marketplace from './components/Marketplace';
import AddProductModal from './components/AddProductModal';
import BiddingModal from './components/BiddingModal';
import PaymentModal from './components/PaymentModal';
import CommunitySection from './components/CommunitySection';
import FeedbackSection from './components/FeedbackSection';
import MyOrdersBids from './components/MyOrdersBids';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';
import KhetiBot from './components/KhetiBot';
import Loader from './components/Loader';

const tabs = {
  dashboard: Dashboard,
  marketplace: Marketplace,
  community: CommunitySection,
  trust: FeedbackSection,
  orders: MyOrdersBids,
  profile: ProfilePage,
};

export default function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const activeTab = useSelector((state) => state.ui.activeTab);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initial splash loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  // Load data after login
  useEffect(() => {
    if (token) {
      dispatch(fetchProducts());
      dispatch(fetchMandiRates());
      dispatch(fetchGuides());
      dispatch(fetchSchemes());
      dispatch(fetchForumThreads());
      dispatch(fetchReviews());
    }
  }, [token, dispatch]);

  if (isInitializing) {
    return <Loader message="Loading Kheti-Connect..." />;
  }

  if (!token) {
    return (
      <>
        <LoginPage />
        <KhetiBot />
      </>
    );
  }

  const Tab = tabs[activeTab];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 container animate-fadeIn">
        {Tab && <Tab />}
      </main>

      <Footer />

      <CartDrawer />
      <AddProductModal />
      <BiddingModal />
      <PaymentModal />
      <Toast />
      <KhetiBot />
    </div>
  );
}