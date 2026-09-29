import React, { useState, useEffect, useRef } from 'react';
import { useKheti } from '../hooks/useKheti';
import {
  Gavel, ShoppingBag, Star, CheckCircle2, MapPin, X,
  Sparkles, ShieldCheck, SlidersHorizontal, ChevronDown, ArrowRight,
  ChevronLeft, ChevronRight, Truck, Award
} from 'lucide-react';
import { GiWheat, GiSeedling } from 'react-icons/gi';
import { FaShoppingCart, FaBolt, FaClock, FaMoneyBillWave, FaBoxOpen, FaShoppingBasket, FaCalendarAlt, FaLeaf, FaCheckCircle, FaHammer } from 'react-icons/fa';

const CATS = ['All', 'Grains', 'Vegetables', 'Fruits', 'Pulses', 'Cash Crops', 'Spices'];

export default function Marketplace() {
  const { products, searchTerm, setSearchTerm, userRole, setBiddingProduct, setBuyingProduct, setIsAddModalOpen } = useKheti();

  const [category, setCategory] = useState('All');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [listingType, setListingType] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [detail, setDetail] = useState(null);

  const filtered = products.filter(p => {
    const q = searchTerm.trim().toLowerCase();
    const matchSearch = !q || (
      p.title.toLowerCase().includes(q) ||
      p.farmerLocation.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.farmerName.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
    return (
      matchSearch &&
      (category === 'All' || p.category === category) &&
      (!organicOnly || p.isOrganic) &&
      (listingType === 'All' || p.listingType === listingType)
    );
  }).sort((a, b) =>
    sortBy === 'price-low' ? a.pricePerUnit - b.pricePerUnit :
      sortBy === 'price-high' ? b.pricePerUnit - a.pricePerUnit :
        sortBy === 'rating' ? b.farmerRating - a.farmerRating :
          b.id.localeCompare(a.id)
  );

  return (
    <div className="py-6">

      {/* ── AUTO-SWIPING HERO BANNER SLIDER ──────────────────────────────── */}
      <HeroBannerSlider userRole={userRole} setIsAddModalOpen={setIsAddModalOpen} />



      <div id="browse" className="filter-bar">

        {/* Row 1: Category + Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            {CATS.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all border ${category === cat
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-blue-500 hover:text-blue-700'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer shadow-sm"
            >
              <option value="newest"><FaClock /> Newest</option>
              <option value="price-low"><FaMoneyBillWave /> Lowest Price</option>
              <option value="price-high"><FaMoneyBillWave /> Highest Price</option>
              <option value="rating"><Star /> Top Rated</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Row 2: Toggles + Count */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-5">
            {/* Organic toggle */}
            <div className="toggle-wrap" onClick={() => setOrganicOnly(p => !p)}>
              <div className={`toggle-track ${organicOnly ? 'on' : 'off'}`}>
                <div className="toggle-thumb" />
              </div>
              <span className={`text-xs font-bold flex items-center gap-1.5 ${organicOnly ? 'text-blue-700' : 'text-slate-500'}`}>
                <FaLeaf className="text-blue-600" /> Organic Only
              </span>
            </div>

            <div className="h-5 w-px bg-slate-200" />

            {/* Type filter */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-0.5">
              {[['All', <span key="a" className="flex items-center gap-1">All</span>], ['auction', <span key="b" className="flex items-center gap-1"><FaHammer /> Auction</span>], ['fixed', <span key="c" className="flex items-center gap-1"><FaBolt /> Fixed</span>]].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setListingType(val)}
                  className={`px-3.5 py-1.5 rounded-lg text-[11px] font-extrabold transition-all ${listingType === val ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3.5 py-2 rounded-xl">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-900">{filtered.length}</span> listings found
            {searchTerm && (
              <span className="ml-2 pl-2 border-l border-slate-300 flex items-center gap-1 text-blue-600 font-extrabold">
                Searching "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:text-red-600 ml-1">x</button>
              </span>
            )}
          </div>
        </div>
      </div>


      {filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <GiWheat className="text-3xl text-blue-600" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-800 mb-2">No Listings Found</h3>
          <p className="text-sm text-slate-400 mb-6 max-w-xs mx-auto">
            {searchTerm ? `No crops match "${searchTerm}". Try another search term.` : 'Adjust filters to discover fresh produce.'}
          </p>
          <button onClick={() => { setCategory('All'); setOrganicOnly(false); setListingType('All'); setSearchTerm(''); }} className="btn btn-outline btn-sm font-bold">
            Clear Search &amp; Filters
          </button>
        </div>
      ) : (
        <div className="grid-responsive">
          {filtered.map(p => <CropCard key={p.id} product={p} onDetail={() => setDetail(p)} />)}
        </div>
      )}

      {/* ── DETAIL MODAL ──────────────────────────────────────────────────── */}
      {detail && (
        <DetailModal
          product={detail}
          onClose={() => setDetail(null)}
          onBid={() => { setBiddingProduct(detail); setDetail(null); }}
          onBuy={() => { setBuyingProduct(detail); setDetail(null); }}
        />
      )}
    </div>
  );
}

/* ─── Crop Card ──────────────────────────────────────────────────────────── */
function CropCard({ product, onDetail }) {
  const { setBiddingProduct, setBuyingProduct } = useKheti();
  const price = product.currentHighestBid || product.pricePerUnit;

  return (
    <article className="crop-card group">
      {/* Image area */}
      <div className="crop-card-img-wrapper cursor-pointer" onClick={onDetail}>
        <img src={product.image} alt={product.title} className="crop-card-img" loading="lazy" />
        <div className="card-img-scrim" />

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.isOrganic && <span className="badge badge-blue shadow backdrop-blur-sm flex items-center gap-1"><FaLeaf className="w-2.5 h-2.5" /> Organic</span>}
          {product.listingType === 'auction'
            ? <span className="badge badge-amber shadow backdrop-blur-sm flex items-center gap-1"><FaHammer className="w-2.5 h-2.5" /> Auction</span>
            : <span className="badge badge-blue shadow backdrop-blur-sm flex items-center gap-1"><FaBolt className="w-2.5 h-2.5" /> Fixed</span>}
        </div>

        {/* Qty pill */}
        <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-xl">
          {product.availableQuantity} {product.unit}s avail.
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider">{product.category}</span>
          <span className="text-[11px] text-slate-400 flex items-center gap-0.5">
            <MapPin className="w-3 h-3 text-slate-400" />{product.farmerLocation.split(',')[0]}
          </span>
        </div>

        {/* Title */}
        <h3
          onClick={onDetail}
          className="font-extrabold text-slate-900 text-[15px] leading-snug mb-3 cursor-pointer group-hover:text-blue-600 transition-colors line-clamp-2"
        >
          {product.title}
        </h3>

        {/* Farmer */}
        <div className="flex items-center gap-2.5 mb-4 pb-3.5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-extrabold shadow-md"
            style={{ background: 'linear-gradient(135deg, #0b1329, #1e3a8a)' }}>
            {product.farmerName.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 flex items-center gap-1 truncate">
              {product.farmerName}
              {product.isVerifiedFarmer && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
            </p>
            <p className="text-[11px] text-slate-400 flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 text-blue-600 fill-blue-600" />
              {product.farmerRating} · {product.farmerReviewsCount} reviews
            </p>
          </div>
        </div>

        <div className="flex-1" />

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {product.listingType === 'auction' ? 'Current Bid' : 'Fixed Price'}
            </p>
            <p className="text-[22px] font-black text-slate-900 leading-none">
              ₹{price.toLocaleString()}
              <span className="text-xs font-semibold text-slate-400 ml-1">/{product.unit}</span>
            </p>
          </div>
          {product.listingType === 'auction' && (product.totalBids || 0) > 0 && (
            <span className="badge badge-amber text-[11px]">{product.totalBids} bids</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={onDetail} className="btn btn-outline btn-sm flex-1">Details</button>
          {product.listingType === 'auction'
            ? <button onClick={() => setBiddingProduct(product)} className="btn btn-amber btn-sm flex-1"><Gavel className="w-3.5 h-3.5" /> Bid</button>
            : <button onClick={() => setBuyingProduct(product)} className="btn btn-primary btn-sm flex-1"><ShoppingBag className="w-3.5 h-3.5" /> Buy</button>}
        </div>
      </div>
    </article>
  );
}

/* ─── Detail Modal ───────────────────────────────────────────────────────── */
function DetailModal({ product, onClose, onBid, onBuy }) {
  const price = product.currentHighestBid || product.pricePerUnit;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card max-w-2xl" onClick={e => e.stopPropagation()}>
        {/* Hero image */}
        <div className="relative h-64 rounded-t-[28px] overflow-hidden">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          {/* Close */}
          <button onClick={onClose} className="absolute top-3.5 right-3.5 w-9 h-9 flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md transition-colors">
            <X className="w-4.5 h-4.5" />
          </button>

          {/* Overlay text */}
          <div className="absolute bottom-4 inset-x-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-sky-300 text-[11px] font-bold uppercase tracking-wider mb-0.5">{product.category}</p>
              <h2 className="text-white font-extrabold text-xl leading-tight">{product.title}</h2>
            </div>
            <div className="text-right shrink-0">
              <p className="text-white/60 text-[10px] uppercase font-bold">{product.listingType === 'auction' ? 'Top Bid' : 'Price'}</p>
              <p className="text-white text-2xl font-black">₹{price.toLocaleString()}</p>
              <p className="text-white/50 text-xs">/{product.unit}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Badges row */}
          <div className="flex flex-wrap gap-2 mb-5">
            {product.isOrganic && <span className="badge badge-blue flex items-center gap-1"><FaLeaf className="w-2.5 h-2.5" /> Organic Certified</span>}
            <span className="badge badge-verified flex items-center gap-1"><FaCheckCircle className="w-2.5 h-2.5" /> Verified Quality</span>
            {product.listingType === 'auction' && (
              <span className="badge badge-amber flex items-center gap-1"><FaHammer className="w-2.5 h-2.5" /> {product.totalBids || 0} Bids Active</span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-5">
            {product.description}
          </p>

          {/* Specs */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              [<FaBoxOpen key="avail" className="text-blue-600" />, 'Available', `${product.availableQuantity} ${product.unit}s`],
              [<FaShoppingBasket key="min" className="text-slate-800" />, 'Min. Order', `${product.minOrderQuantity} ${product.unit}s`],
              [<FaCalendarAlt key="harv" className="text-sky-500" />, 'Harvested', product.harvestDate],
            ].map(([icon, label, val]) => (
              <div key={label} className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1">{icon} {label}</p>
                <p className="font-extrabold text-slate-900 text-sm">{val}</p>
              </div>
            ))}
          </div>

          {/* Farmer card */}
          <div className="flex items-center gap-3.5 bg-gradient-to-r from-blue-50 to-slate-50 p-4 rounded-2xl border border-blue-100 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-extrabold shadow-lg shrink-0"
              style={{ background: 'linear-gradient(135deg, #0b1329, #1e3a8a)' }}>
              {product.farmerName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                {product.farmerName}
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              </h4>
              <p className="text-xs text-slate-500 flex items-center gap-3 mt-0.5">
                <span><MapPin className="w-3 h-3 inline text-blue-600 mr-0.5" />{product.farmerLocation}</span>
                <span><Star className="w-3 h-3 inline fill-blue-600 text-blue-600 mr-0.5" />{product.farmerRating} ({product.farmerReviewsCount})</span>
              </p>
            </div>
            <span className="badge badge-verified text-[10px] shrink-0">Direct Farmer</span>
          </div>

          {/* CTA */}
          <button
            onClick={product.listingType === 'auction' ? onBid : onBuy}
            className={`btn w-full py-4 font-extrabold text-base rounded-2xl ${product.listingType === 'auction' ? 'btn-amber' : 'btn-primary'}`}
          >
            {product.listingType === 'auction'
              ? <><Gavel className="w-5 h-5" /> Place Bid — ₹{price.toLocaleString()}</>
              : <><ShoppingBag className="w-5 h-5" /> Buy Directly — ₹{price.toLocaleString()}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Hero Auto-Swiping Banner Slider ─────────────────────────────────────── */
function HeroBannerSlider({ userRole, setIsAddModalOpen }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const SLIDES = [
    {
      id: 1,
      badge: "India's Direct Agri-Marketplace",
      titleLine1: "Buy Fresh Produce",
      titleLine2: "Straight from Farms",
      subtitle: "Transparent live bidding · Verified organic produce · Escrow-protected payments — zero middlemen.",
      bgImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1800&auto=format&fit=crop",
      gradient: "linear-gradient(135deg, #030712 0%, #0b1329 45%, #1e3a8a 85%, #2563eb 100%)",
      ctaText: userRole === 'farmer' ? 'List Produce Now' : 'Browse & Bid Crops',
      ctaIcon: userRole === 'farmer' ? <GiWheat className="w-5 h-5" /> : <FaShoppingCart className="w-4 h-4" />,
      ctaAction: () => userRole === 'farmer' ? setIsAddModalOpen(true) : document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      id: 2,
      badge: "Real-Time Farmer Auctions",
      titleLine1: "Live Bidding on",
      titleLine2: "Premium Quality Harvests",
      subtitle: "Farmers list produce directly · Buyers place competitive live bids for maximum yield value.",
      bgImage: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?q=80&w=1800&auto=format&fit=crop",
      gradient: "linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1d4ed8 100%)",
      ctaText: 'View Active Auctions',
      ctaIcon: <Gavel className="w-4 h-4" />,
      ctaAction: () => document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      id: 3,
      badge: "100% Escrow Protection",
      titleLine1: "Guaranteed Safe &",
      titleLine2: "Transparent Payments",
      subtitle: "Payment funds are safely locked in escrow until produce quality is verified upon delivery.",
      bgImage: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?q=80&w=1800&auto=format&fit=crop",
      gradient: "linear-gradient(135deg, #0b1329 0%, #1e3a8a 60%, #0284c7 100%)",
      ctaText: 'Learn About Escrow',
      ctaIcon: <ShieldCheck className="w-4 h-4" />,
      ctaAction: () => setIsAddModalOpen(false),
    },
    {
      id: 4,
      badge: "Farm-to-Door Logistics",
      titleLine1: "Cold Storage &",
      titleLine2: "Doorstep Transportation",
      subtitle: "Book verified refrigerated trucks and temperature-monitored fleet directly from farms.",
      bgImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1800&auto=format&fit=crop",
      gradient: "linear-gradient(135deg, #030712 0%, #0f172a 45%, #2563eb 100%)",
      ctaText: 'Explore Logistics',
      ctaIcon: <Truck className="w-4 h-4" />,
      ctaAction: () => document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' }),
    },
  ];

  const total = SLIDES.length;

  // Auto-play timer (4.5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % total);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, total]);

  const handleNext = () => setCurrent(prev => (prev + 1) % total);
  const handlePrev = () => setCurrent(prev => (prev - 1 + total) % total);

  const handleTouchStart = e => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = e => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) handleNext();
    if (touchEndX.current - touchStartX.current > 50) handlePrev();
  };

  const activeSlide = SLIDES[current];

  return (
    <div
      className="hero relative group overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background with dynamic transition */}
      <div
        className="hero-bg transition-all duration-700 ease-in-out"
        style={{ background: activeSlide.gradient }}
      />
      <div
        className="hero-img transition-opacity duration-700"
        style={{ backgroundImage: `url(${activeSlide.bgImage})`, opacity: 0.22 }}
      />

      {/* Decorative radial glows */}
      <div
        className="absolute top-[-80px] right-[-80px] w-[420px] h-[420px] rounded-full opacity-25 pointer-events-none transition-colors duration-700"
        style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-60px] left-[30%] w-[320px] h-[320px] rounded-full opacity-15 pointer-events-none transition-colors duration-700"
        style={{ background: 'radial-gradient(circle, #60a5fa 0%, transparent 70%)' }}
      />

      {/* Hero content */}
      <div className="hero-content flex flex-col justify-center min-h-[420px]">
        <div className="max-w-2xl animate-fadeIn key={current}">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sky-300 text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            {activeSlide.badge}
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight text-white mb-5">
            {activeSlide.titleLine1}<br />
            <span
              className="text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #60a5fa, #93c5fd)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text'
              }}
            >
              {activeSlide.titleLine2}
            </span>
          </h1>

          <p className="text-blue-100/80 text-base md:text-lg mb-8 leading-relaxed max-w-xl">
            {activeSlide.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-10">
            <button
              onClick={activeSlide.ctaAction}
              className="btn btn-primary btn-lg shadow-2xl shadow-blue-600/40 flex items-center gap-2"
            >
              {activeSlide.ctaIcon}
              <span>{activeSlide.ctaText}</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="btn btn-ghost-dark btn-lg flex items-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" /> How Escrow Works
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              [<FaCheckCircle key="a" className="text-blue-400" />, '100% Escrow Protected'],
              [<FaCheckCircle key="b" className="text-blue-400" />, 'Verified Farmers Only'],
              [<FaCheckCircle key="c" className="text-blue-400" />, 'Free to List'],
            ].map(([icon, txt]) => (
              <div key={txt} className="flex items-center gap-2 text-blue-200 text-xs font-semibold">
                <span className="text-blue-400 font-extrabold">{icon}</span> {txt}
              </div>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap">
          {[
            ['2,400+', 'Active Listings'],
            ['840+',   'Verified Farmers'],
            ['₹48 Cr', 'Trade Volume'],
            ['4.9 / 5.0', 'Buyer Rating'],
          ].map(([val, label]) => (
            <div key={label} className="stat-chip">
              <span className="text-2xl font-black text-white">{val}</span>
              <span className="text-xs text-sky-300 font-semibold mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Slide Controls (Left & Right Chevrons) ───────────────────── */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-80 hover:opacity-100 transition-all z-30 shadow-lg cursor-pointer"
        title="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center opacity-80 hover:opacity-100 transition-all z-30 shadow-lg cursor-pointer"
        title="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* ── Pagination Indicator Dots (Swiper style) ──────────────────── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(idx)}
            className={`transition-all rounded-full cursor-pointer ${
              current === idx
                ? 'w-7 h-2 bg-blue-500 shadow-md'
                : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
            title={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
