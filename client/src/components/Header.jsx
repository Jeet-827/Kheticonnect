import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sprout, Search, ShoppingCart, PlusCircle, TrendingUp, ArrowUpRight, ArrowDownRight, X, LogOut, ChevronRight, LayoutDashboard, Sparkles } from 'lucide-react';
import { GiWheat } from 'react-icons/gi';
import { FaBook, FaStar, FaBoxOpen } from 'react-icons/fa';
import { setUI, setSearchTerm } from '../store/slices/uiSlice';
import { logout } from '../store/slices/authSlice';

const NAV = [
  { id: 'dashboard',   label: 'Dashboard',       icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
  { id: 'marketplace', label: 'Marketplace',     icon: <GiWheat /> },
  { id: 'community',   label: 'Advisory Hub',    icon: <FaBook /> },
  { id: 'trust',       label: 'Trust & Reviews', icon: <FaStar /> },
  { id: 'orders',      label: 'My Orders',       icon: <FaBoxOpen /> },
];

export default function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { activeTab, searchTerm } = useSelector((state) => state.ui);
  const { products, orders, userBids, mandiRates } = useSelector((state) => state.marketplace);
  const { guides } = useSelector((state) => state.community);

  const [focused, setFocused] = useState(false);
  const searchRef = useRef(null);

  const q = searchTerm.trim().toLowerCase();
  const cartCount = orders.length + userBids.length;
  const isFarmer = user?.role === 'farmer';

  const go = (tab) => {
    dispatch(setUI({ activeTab: tab }));
    setFocused(false);
  };

  // Fit clicked crop into search using Redux Toolkit searchTerm variable
  const handleSelectCrop = (cropName) => {
    dispatch(setSearchTerm(cropName));
    dispatch(setUI({ activeTab: 'marketplace' }));
    setFocused(false);
  };

  // Close search popup on click outside
  useEffect(() => {
    const onClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setFocused(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Search results
  const find = (list, fields, limit) =>
    q ? list.filter((item) => fields.some((f) => (item[f] || '').toLowerCase().includes(q))).slice(0, limit) : [];

  const foundProducts = find(products, ['title', 'category', 'farmerLocation', 'farmerName'], 4);
  const foundGuides = find(guides, ['title', 'summary', 'category'], 3);
  const foundMandi = find(mandiRates, ['crop', 'location'], 3);
  const hasResults = foundProducts.length + foundGuides.length + foundMandi.length > 0;

  const changeTag = (change = '') =>
    change.startsWith('+') ? <span className="t-up"><ArrowUpRight className="w-3 h-3" />{change}</span>
    : change.startsWith('-') ? <span className="t-down"><ArrowDownRight className="w-3 h-3" />{change}</span>
    : <span className="t-flat">{change}</span>;

  return (
    <header className="sticky top-0 z-50">

      {/* Mandi ticker */}
      <div className="ticker-wrap">
        <div className="container flex items-center gap-3">
          <span className="shrink-0 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-sky-300 bg-blue-900/70 border border-blue-600/40 px-3 py-1 rounded-full">
            <TrendingUp className="w-3 h-3 text-sky-400" /> Live Mandi
          </span>
          <div className="overflow-hidden flex-1">
            <div className="ticker-inner">
              {[...mandiRates, ...mandiRates].map((r, i) => (
                <span 
                  key={i} 
                  onClick={() => handleSelectCrop(r.crop)} 
                  className="ticker-item cursor-pointer hover:opacity-80 transition-opacity"
                  title={`Click to search for ${r.crop}`}
                >
                  <span className="t-crop">{r.crop}</span>
                  <span className="t-loc">{r.location}</span>
                  <span className="t-price">₹{(r.price || 0).toLocaleString()}/{r.unit}</span>
                  {changeTag(r.change)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className="navbar bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="container py-3 flex items-center gap-3">

          {/* Logo */}
          <button onClick={() => go('marketplace')} className="flex items-center gap-2.5 shrink-0 group mr-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-slate-900 flex items-center justify-center shadow-lg shadow-blue-600/25 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block text-left leading-none">
              <span className="text-[18px] font-black text-slate-900 tracking-tight">
                Kheti<span className="text-blue-600">-Connect</span>
              </span>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Farm-to-Buyer Direct Network</p>
            </div>
          </button>

          {/* Search */}
          <div className="flex-1 min-w-0 max-w-md relative" ref={searchRef}>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                placeholder="Search crops, mandis, advisory guides..."
                value={searchTerm}
                onFocus={() => setFocused(true)}
                onChange={(e) => { dispatch(setUI({ searchTerm: e.target.value })); setFocused(true); }}
                onKeyDown={(e) => e.key === 'Enter' && go('marketplace')}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-100 border border-slate-200/80 rounded-full text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => dispatch(setUI({ searchTerm: '' }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search popover */}
            {focused && q && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fadeIn divide-y divide-slate-100">
                {!hasResults && (
                  <div className="p-5 text-center text-xs text-slate-400 font-semibold">
                    No results found for "<span className="text-slate-700">{searchTerm}</span>".
                  </div>
                )}

                {foundProducts.length > 0 && (
                  <div className="p-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-1">
                      <GiWheat /> Produce Listings
                    </p>
                    {foundProducts.map((p) => (
                      <div 
                        key={p._id || p.id} 
                        onClick={() => handleSelectCrop(p.title)} 
                        className="flex items-center justify-between p-2 hover:bg-blue-50/80 rounded-xl cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img 
                            src={p.image} 
                            alt={p.title} 
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800';
                            }}
                            className="w-9 h-9 rounded-lg object-cover shrink-0" 
                          />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">{p.title}</p>
                            <p className="text-[10px] text-slate-400 truncate">{p.farmerLocation} · {p.farmerName}</p>
                          </div>
                        </div>
                        <p className="text-xs font-black text-slate-900 shrink-0 ml-2">
                          ₹{(p.currentHighestBid || p.pricePerUnit).toLocaleString()}
                          <span className="text-[9px] text-blue-600 font-bold">/{p.unit}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {foundGuides.length > 0 && (
                  <div className="p-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-1">
                      <FaBook /> Agri Advisory Guides
                    </p>
                    {foundGuides.map((g) => (
                      <div key={g._id || g.id} onClick={() => go('community')} className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer group">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 flex items-center justify-between">
                          {g.title} <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </p>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{g.summary}</p>
                      </div>
                    ))}
                  </div>
                )}

                {foundMandi.length > 0 && (
                  <div className="p-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Live Mandi Prices
                    </p>
                    {foundMandi.map((m, i) => (
                      <div 
                        key={i} 
                        onClick={() => handleSelectCrop(m.crop)} 
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl text-xs cursor-pointer group"
                      >
                        <span className="font-bold text-slate-800 group-hover:text-blue-600">{m.crop} <span className="font-normal text-slate-400">({m.location})</span></span>
                        <span className="font-black text-blue-600">₹{m.price.toLocaleString()}/{m.unit}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1" />

          {/* KhetiBot */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-khetibot'))}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-600/25 transition-all active:scale-95"
            title="Ask KhetiBot AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span className="hidden sm:inline">KhetiBot AI</span>
          </button>

          {/* List crop (farmers only) */}
          {isFarmer && (
            <button onClick={() => dispatch(setUI({ isAddModalOpen: true }))} className="btn btn-primary btn-sm hidden sm:flex">
              <PlusCircle className="w-4 h-4" /> List Crop
            </button>
          )}

          {/* Cart */}
          <button
            onClick={() => dispatch(setUI({ isCartOpen: true }))}
            className="btn-icon w-10 h-10 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-blue-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow">
                {cartCount}
              </span>
            )}
          </button>

          {/* Profile & logout */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                onClick={() => go('profile')}
                className="w-9 h-9 rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shadow overflow-hidden hover:ring-2 hover:ring-blue-600 transition-all"
                title={`${user.name} — View Profile`}
              >
                {user.avatar
                  ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  : user.name?.charAt(0) || 'U'}
              </button>
              <button
                onClick={() => dispatch(logout())}
                className="btn-icon w-9 h-9 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Nav tabs */}
        <div className="border-t border-slate-100">
          <div className="container flex items-center no-scrollbar overflow-x-auto">
            {NAV.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`tab-button flex items-center gap-1.5 ${activeTab === id ? 'active' : ''}`}
              >
                <span className="text-base leading-none">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}