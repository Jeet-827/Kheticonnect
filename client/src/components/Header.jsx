import React, { useState, useRef, useEffect } from 'react';
import { useKheti } from '../hooks/useKheti';
import { useAuth } from '../hooks/useAuth';
import { 
  Sprout, Search, ShoppingCart, PlusCircle, TrendingUp, 
  ArrowUpRight, ArrowDownRight, X, LogOut, BookOpen, Landmark, 
  ChevronRight, LayoutDashboard, User
} from 'lucide-react';
import { GiWheat } from 'react-icons/gi';
import { FaBook, FaStar, FaBoxOpen, FaTruck, FaShoppingCart } from 'react-icons/fa';

const NAV = [
  { id: 'dashboard',   label: 'Dashboard',      icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
  { id: 'marketplace', label: 'Marketplace',    icon: <GiWheat /> },
  { id: 'community',   label: 'Advisory Hub',   icon: <FaBook /> },
  { id: 'trust',       label: 'Trust & Reviews', icon: <FaStar /> },
  { id: 'orders',      label: 'My Orders',       icon: <FaBoxOpen /> },
  { id: 'transport',   label: 'Transportation',  icon: <FaTruck /> },
];

export default function Header() {
  const {
    activeTab, setActiveTab,
    userRole, setUserRole,
    searchTerm, setSearchTerm,
    products, guides, schemes, mandiRates, forumThreads,
    orders, userBids,
    setIsCartOpen, setIsAddModalOpen,
  } = useKheti();

  const { user, logout } = useAuth();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef(null);

  const cartCount = orders.length + userBids.length;
  const q = searchTerm.trim().toLowerCase();

  // Close search popup on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Matching results for real-time popover search
  const matchedProducts = q ? products.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.category.toLowerCase().includes(q) || 
    (p.farmerLocation || '').toLowerCase().includes(q) ||
    (p.farmerName || '').toLowerCase().includes(q)
  ).slice(0, 4) : [];

  const matchedGuides = q ? (guides || []).filter(g => 
    g.title.toLowerCase().includes(q) || 
    g.summary.toLowerCase().includes(q) ||
    g.category.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const matchedSchemes = q ? (schemes || []).filter(s => 
    s.title.toLowerCase().includes(q) || 
    s.benefit.toLowerCase().includes(q)
  ).slice(0, 2) : [];

  const matchedMandi = q ? (mandiRates || []).filter(m => 
    m.crop.toLowerCase().includes(q) || 
    m.location.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const hasResults = matchedProducts.length > 0 || matchedGuides.length > 0 || matchedSchemes.length > 0 || matchedMandi.length > 0;

  const handleSelectResult = (tabId) => {
    setActiveTab(tabId);
    setIsSearchFocused(false);
    setMobileSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">

      {/* ── Live Mandi Ticker ─────────────────────────────────────────────── */}
      <div className="ticker-wrap">
        <div className="container flex items-center gap-3">
          <span className="shrink-0 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-sky-300 bg-blue-900/70 border border-blue-600/40 px-3 py-1 rounded-full">
            <TrendingUp className="w-3 h-3 text-sky-400" />
            Live Mandi
          </span>
          <div className="overflow-hidden flex-1">
            <div className="ticker-inner">
              {[...mandiRates, ...mandiRates].map((r, i) => (
                <span key={i} className="ticker-item">
                  <span className="t-crop">{r.crop}</span>
                  <span className="t-loc">{r.location}</span>
                  <span className="t-price">₹{r.price.toLocaleString()}/{r.unit}</span>
                  {r.change.startsWith('+')
                    ? <span className="t-up"><ArrowUpRight className="w-3 h-3" />{r.change}</span>
                    : r.change.startsWith('-')
                    ? <span className="t-down"><ArrowDownRight className="w-3 h-3" />{r.change}</span>
                    : <span className="t-flat">{r.change}</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ───────────────────────────────────────────────────── */}
      <div className="navbar bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="container py-3 flex items-center gap-3">

          {/* Logo */}
          <button
            onClick={() => setActiveTab('marketplace')}
            className="flex items-center gap-2.5 shrink-0 group mr-2"
          >
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

          {/* Search bar with Live Popover */}
          <div className="flex-1 min-w-0 max-w-md hidden md:block relative" ref={searchRef}>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search crops, mandis, advisory guides..."
                value={searchTerm}
                onFocus={() => setIsSearchFocused(true)}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setIsSearchFocused(true);
                }}
                className="w-full pl-10 pr-9 py-2.5 bg-slate-100 border border-slate-200/80 rounded-full text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-inner"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* ── REAL-TIME SEARCH POPOVER DROPDOWN ────────────────────────── */}
            {isSearchFocused && q.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fadeIn divide-y divide-slate-100">
                
                {!hasResults && (
                  <div className="p-5 text-center text-xs text-slate-400 font-semibold">
                    No results found for "<span className="text-slate-700">{searchTerm}</span>". Try searching crops like "Wheat", "Rice", or "Mango".
                  </div>
                )}

                {/* Crops */}
                {matchedProducts.length > 0 && (
                  <div className="p-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-blue-700 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1"><GiWheat className="text-blue-600" /> Produce Listings</span>
                      <span className="text-slate-400 font-normal">Marketplace</span>
                    </p>
                    <div className="space-y-1">
                      {matchedProducts.map(p => (
                        <div
                          key={p.id}
                          onClick={() => handleSelectResult('marketplace')}
                          className="flex items-center justify-between p-2 hover:bg-blue-50/80 rounded-xl cursor-pointer transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={p.image} alt={p.title} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">{p.title}</p>
                              <p className="text-[10px] text-slate-400 truncate">{p.farmerLocation} · {p.farmerName}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-2">
                            <p className="text-xs font-black text-slate-900">₹{(p.currentHighestBid || p.pricePerUnit).toLocaleString()}</p>
                            <span className="text-[9px] text-blue-600 font-bold">/{p.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Guides */}
                {matchedGuides.length > 0 && (
                  <div className="p-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-blue-700 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1"><FaBook className="text-blue-600" /> Agri Advisory Guides</span>
                      <span className="text-slate-400 font-normal">Knowledge Hub</span>
                    </p>
                    <div className="space-y-1">
                      {matchedGuides.map(g => (
                        <div
                          key={g.id}
                          onClick={() => handleSelectResult('community')}
                          className="p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors group"
                        >
                          <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 flex items-center justify-between">
                            <span>{g.title}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                          </p>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{g.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mandi Rates */}
                {matchedMandi.length > 0 && (
                  <div className="p-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Live Mandi Prices
                    </p>
                    <div className="grid grid-cols-1 gap-1">
                      {matchedMandi.map((m, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleSelectResult('community')}
                          className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl text-xs cursor-pointer"
                        >
                          <span className="font-bold text-slate-800">{m.crop} <span className="font-normal text-slate-400">({m.location})</span></span>
                          <span className="font-black text-blue-600">₹{m.price.toLocaleString()}/{m.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-2.5 bg-slate-50 text-center">
                  <button 
                    onClick={() => {
                      setActiveTab('marketplace');
                      setIsSearchFocused(false);
                    }}
                    className="text-xs font-extrabold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 w-full py-1"
                  >
                    <span>View all search results</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}
          </div>

          <div className="flex-1 md:flex-none" />

          {/* Mobile Search Toggle */}
          <button 
            onClick={() => setMobileSearchOpen(p => !p)} 
            className="md:hidden btn-icon w-9 h-9 rounded-full bg-slate-100 text-slate-700"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Role toggle — Farmer / Buyer only */}
          <div className="hidden sm:flex items-center bg-slate-100 rounded-full p-1 border border-slate-200/80">
            {[
              { role: 'farmer', icon: <GiWheat />, label: 'Farmer', activeClass: 'bg-blue-600 text-white shadow' },
              { role: 'buyer',  icon: <FaShoppingCart />, label: 'Buyer',  activeClass: 'bg-slate-900 text-white shadow' },
            ].map(({ role, icon, label, activeClass }) => (
              <button
                key={role}
                onClick={() => setUserRole(role)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all duration-200 flex items-center gap-1.5 ${userRole === role ? activeClass : 'text-slate-500 hover:text-slate-700'}`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* List Crop CTA */}
          {userRole === 'farmer' && (
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary btn-sm hidden sm:flex">
              <PlusCircle className="w-4 h-4" /> List Crop
            </button>
          )}

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="btn-icon w-10 h-10 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-blue-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow">
                {cartCount}
              </span>
            )}
          </button>

          {/* User profile & Logout */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                onClick={() => setActiveTab('profile')}
                className="w-9 h-9 rounded-full bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shadow overflow-hidden hover:ring-2 hover:ring-blue-600 transition-all"
                title={`${user.name} — View Profile`}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  user.name?.charAt(0) || 'U'
                )}
              </button>
              <button
                onClick={logout}
                className="btn-icon w-9 h-9 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

        {/* ── Mobile Expandable Search Bar ───────────────────────────────── */}
        {mobileSearchOpen && (
          <div className="px-4 pb-3 md:hidden">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search crops, mandis, topics..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-9 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Nav Tabs ───────────────────────────────────────────────────── */}
        <div className="border-t border-slate-100">
          <div className="container flex items-center no-scrollbar overflow-x-auto">
            {NAV.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`tab-button flex items-center gap-1.5 ${activeTab === id ? 'active' : ''}`}
              >
                <span className="text-base leading-none">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
            {/* Mobile role toggle — Farmer / Buyer only */}
            <div className="sm:hidden ml-auto flex shrink-0 items-center bg-slate-100 rounded-full p-0.5 border border-slate-200 my-1">
              <button onClick={() => setUserRole('farmer')} className={`px-2 py-1 rounded-full text-[11px] font-bold transition-all ${userRole === 'farmer' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}><GiWheat /></button>
              <button onClick={() => setUserRole('buyer')}  className={`px-2 py-1 rounded-full text-[11px] font-bold transition-all ${userRole === 'buyer'  ? 'bg-slate-900 text-white' : 'text-slate-500'}`}><FaShoppingCart /></button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
