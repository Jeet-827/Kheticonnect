import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sprout } from 'lucide-react';

// Redux
import { initAuth } from './store/slices/authSlice';
import { selectIsAuthenticated, selectAuthLoading } from './store/slices/authSlice';
import { selectActiveTab, selectUserRole, setUserRole } from './store/slices/uiSlice';
import { selectUser } from './store/slices/authSlice';
import { fetchProducts, fetchMandiRates } from './store/slices/marketplaceSlice';
import { fetchGuides, fetchSchemes, fetchForumThreads, fetchReviews } from './store/slices/communitySlice';

// Components
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
import TransportationSection from './components/TransportationSection';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import ProfilePage from './components/ProfilePage';

// ─── App Content ─────────────────────────────────────────────────────────────
function AppContent() {
  const dispatch        = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading         = useSelector(selectAuthLoading);
  const activeTab       = useSelector(selectActiveTab);
  const user            = useSelector(selectUser);

  // Initialize auth state on mount
  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  // Sync userRole with authenticated user's role
  useEffect(() => {
    if (user?.role) {
      dispatch(setUserRole(user.role));
    }
  }, [user, dispatch]);

  // Fetch all backend data once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProducts());
      dispatch(fetchMandiRates());
      dispatch(fetchGuides());
      dispatch(fetchSchemes());
      dispatch(fetchForumThreads());
      dispatch(fetchReviews());
    }
  }, [isAuthenticated, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center animate-bounce shadow-xl shadow-blue-500/20">
            <Sprout className="w-7 h-7 text-white" />
          </div>
          <span className="text-sm font-extrabold text-white tracking-wide">
            Loading Kheti-Connect...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 container animate-fadeIn">
        {activeTab === 'dashboard'   && <Dashboard />}
        {activeTab === 'marketplace' && <Marketplace />}
        {activeTab === 'community'   && <CommunitySection />}
        {activeTab === 'trust'       && <FeedbackSection />}
        {activeTab === 'orders'      && <MyOrdersBids />}
        {activeTab === 'transport'   && <TransportationSection />}
        {activeTab === 'profile'     && <ProfilePage />}
      </main>

      <Footer />

      {/* Modals & overlays */}
      <CartDrawer />
      <AddProductModal />
      <BiddingModal />
      <PaymentModal />
      <Toast />
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return <AppContent />;
}
