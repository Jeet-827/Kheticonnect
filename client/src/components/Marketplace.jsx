import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaGavel, 
  FaShoppingBag, 
  FaMapMarkerAlt, 
  FaLeaf, 
  FaCheckCircle, 
  FaStar,
  FaShieldAlt,
  FaChevronDown,
  FaSearch,
  FaSlidersH,
  FaTag,
  FaTimes
} from 'react-icons/fa';
import { Sprout, Sparkles } from 'lucide-react';
import { fetchProducts } from '../store/slices/marketplaceSlice';
import { setUI, setSearchTerm } from '../store/slices/uiSlice';
import Loader from './Loader';

const CATEGORIES = ['All', 'Grains', 'Vegetables', 'Fruits', 'Pulses', 'Cash Crops', 'Spices'];
const UNITS = ['All', 'Quintal', 'Kg', 'Ton', 'Box'];

const UNIT_PRICE_PRESETS = {
  All: [
    { label: 'All', val: '' },
    { label: '< ₹1,000', val: '1000' },
    { label: '< ₹3,000', val: '3000' },
    { label: '< ₹5,000', val: '5000' },
    { label: '< ₹25,000', val: '25000' },
    { label: '< ₹1,00,000', val: '100000' },
  ],
  Kg: [
    { label: 'All', val: '' },
    { label: '< ₹30/Kg', val: '30' },
    { label: '< ₹60/Kg', val: '60' },
    { label: '< ₹100/Kg', val: '100' },
    { label: '< ₹250/Kg', val: '250' },
    { label: '< ₹1,000/Kg', val: '1000' },
  ],
  Quintal: [
    { label: 'All', val: '' },
    { label: '< ₹2,000/Qtl', val: '2000' },
    { label: '< ₹3,500/Qtl', val: '3500' },
    { label: '< ₹5,000/Qtl', val: '5000' },
    { label: '< ₹10,000/Qtl', val: '10000' },
    { label: '< ₹25,000/Qtl', val: '25000' },
  ],
  Ton: [
    { label: 'All', val: '' },
    { label: '< ₹20,000/Ton', val: '20000' },
    { label: '< ₹35,000/Ton', val: '35000' },
    { label: '< ₹50,000/Ton', val: '50000' },
    { label: '< ₹1,00,000/Ton', val: '100000' },
    { label: '< ₹2,50,000/Ton', val: '250000' },
  ],
  Box: [
    { label: 'All', val: '' },
    { label: '< ₹500/Box', val: '500' },
    { label: '< ₹1,200/Box', val: '1200' },
    { label: '< ₹2,500/Box', val: '2500' },
    { label: '< ₹5,000/Box', val: '5000' },
  ]
};

export default function Marketplace() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.marketplace.products);
  const loading = useSelector((state) => state.marketplace.loading);
  const searchTerm = useSelector((state) => state.ui.searchTerm);

  const [category, setCategory] = useState('All');
  const [type, setType] = useState('All');
  const [unit, setUnit] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [organic, setOrganic] = useState(false);

  // Load products whenever any filter changes
  useEffect(() => {
    const params = { sort };
    if (searchTerm) params.search = searchTerm;
    if (category !== 'All') params.category = category;
    if (type !== 'All') params.type = type;
    if (unit !== 'All') params.unit = unit;
    if (maxPrice) params.maxPrice = maxPrice;
    if (organic) params.organic = 'true';
    dispatch(fetchProducts(params));
  }, [dispatch, searchTerm, category, type, unit, maxPrice, sort, organic]);

  const clearFilters = () => {
    setCategory('All');
    setType('All');
    setUnit('All');
    setMaxPrice('');
    setSort('newest');
    setOrganic(false);
    dispatch(setUI({ searchTerm: '' }));
  };

  return (
    <div className="py-6 space-y-6">
      {/* ── Hero Banner (Cold Storage & Logistics) ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
            <Sprout className="w-3.5 h-3.5 text-emerald-400" />
            DIRECT FARM-TO-BUYER NETWORK
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Fair Prices for Farmers, Fresh Produce for Buyers
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl font-medium">
            Trade top-quality grains, fruits, vegetables, and cash crops directly without middlemen commissions. Participate in transparent live crop auctions and secure escrow payments.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button
              onClick={() => dispatch(setUI({ isAddModalOpen: true }))}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" /> List Produce
            </button>
            <button
              onClick={() => dispatch(setUI({ activeTab: 'trust' }))}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs sm:text-sm font-bold flex items-center gap-2 backdrop-blur-sm transition-all"
            >
              <FaShieldAlt className="text-blue-400" /> How Escrow Works
            </button>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300 pb-6 border-b border-white/10">
            <span className="flex items-center gap-1.5 text-blue-300">
              <FaCheckCircle className="text-blue-400" /> 100% Escrow Protected
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <FaCheckCircle className="text-emerald-400" /> Verified Farmers Only
            </span>
            <span className="flex items-center gap-1.5 text-blue-300">
              <FaCheckCircle className="text-blue-400" /> Free to List
            </span>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">2,400+</p>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Listings</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">840+</p>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Verified Farmers</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">₹48 Cr</p>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Trade Volume</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-white">4.9 / 5.0</p>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Buyer Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category Pills ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
              category === c
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ── Secondary Controls: Sort, Type, Organic ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <FaChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none" />
          </div>

          {/* Organic Toggle */}
          <label className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-xs font-bold text-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={organic}
              onChange={(e) => setOrganic(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
            />
            <FaLeaf className={organic ? 'text-emerald-600' : 'text-slate-400'} />
            <span>Organic Only</span>
          </label>

          {/* Type Segmented Buttons */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-extrabold">
            <button
              onClick={() => setType('All')}
              className={`px-3 py-1 rounded-lg transition-all ${
                type === 'All' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setType('auction')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1 transition-all ${
                type === 'auction' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FaGavel className="text-[10px]" /> Auction
            </button>
            <button
              onClick={() => setType('fixed')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1 transition-all ${
                type === 'fixed' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FaShoppingBag className="text-[10px]" /> Fixed
            </button>
          </div>
        </div>

        <div className="text-xs font-extrabold text-slate-500 px-2">
          {products.length} {products.length === 1 ? 'listing' : 'listings'} found
        </div>
      </div>

      {/* ── Unit & Price Filtering Bar ── */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Unit selection: All, Quintal, Kg, Ton, Box */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FaSlidersH className="text-blue-500" /> Unit:
            </span>
            <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
              {UNITS.map((u) => (
                <button
                  key={u}
                  onClick={() => {
                    setUnit(u);
                    setMaxPrice(''); // reset maxPrice when changing unit
                  }}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    unit === u
                      ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {u === 'All' ? 'All Units' : u}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Max Price Input */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FaTag className="text-emerald-500" /> Max Price:
            </span>
            <div className="relative flex items-center">
              <span className="absolute left-2.5 text-xs text-slate-400 font-bold">₹</span>
              <input
                type="number"
                placeholder={unit === 'Kg' ? 'e.g. 100' : unit === 'Ton' ? 'e.g. 35000' : 'e.g. 2500'}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-28 pl-6 pr-6 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
              />
              {maxPrice && (
                <button
                  onClick={() => setMaxPrice('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-600"
                  title="Clear price filter"
                >
                  <FaTimes className="text-[10px]" />
                </button>
              )}
            </div>
            {unit !== 'All' && (
              <span className="text-[11px] font-bold text-slate-500">/{unit}</span>
            )}
          </div>
        </div>

        {/* Quick Price Preset Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Quick Price Filter:
          </span>
          {(UNIT_PRICE_PRESETS[unit] || UNIT_PRICE_PRESETS.All).map((p) => (
            <button
              key={p.label}
              onClick={() => setMaxPrice(p.val)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                maxPrice === p.val
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              {p.label}
            </button>
          ))}
          {(unit !== 'All' || maxPrice) && (
            <button
              onClick={() => {
                setUnit('All');
                setMaxPrice('');
              }}
              className="ml-auto text-[11px] font-extrabold text-red-500 hover:text-red-700 flex items-center gap-1 whitespace-nowrap px-2 py-0.5 rounded-md hover:bg-red-50"
            >
              <FaTimes className="text-[9px]" /> Reset Unit & Price
            </button>
          )}
        </div>
      </div>

      {/* ── Products Grid or Empty / Loading State ── */}
      {loading ? (
        <Loader fullScreen={false} message="Fetching fresh farm listings..." />
      ) : products.length === 0 ? (
        <div className="py-20 px-4 bg-white rounded-3xl border border-slate-200 text-center flex flex-col items-center justify-center shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-4 shadow-inner">
            <FaSearch />
          </div>
          <h3 className="text-lg font-black text-slate-900 mb-1">No Listings Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mb-6">
            Adjust your filters or search keywords to discover fresh verified farm produce.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold transition-all active:scale-95"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((p) => (
            <CropCard key={p._id || p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function CropCard({ product: p }) {
  const dispatch = useDispatch();
  const isAuction = p.listingType === 'auction';
  const price = p.currentHighestBid || p.pricePerUnit;

  return (
    <article className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group">
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={p.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'}
          alt={p.title}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80';
          }}
          onClick={() => {
            dispatch(setSearchTerm(p.title));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          loading="lazy"
          title={`Click to search "${p.title}"`}
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/95 text-blue-700 shadow-sm backdrop-blur-xs">
            {p.category}
          </span>
          {p.isOrganic && (
            <span className="px-2 py-1 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white flex items-center gap-1 shadow-sm">
              <FaLeaf className="text-[9px]" /> Organic
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
          <span className="flex items-center gap-1">
            <FaMapMarkerAlt className="text-slate-400" /> {p.farmerLocation?.split(',')[0]}
          </span>
          {p.farmerRating && (
            <span className="flex items-center gap-1 font-bold text-amber-500">
              <FaStar /> {p.farmerRating}
            </span>
          )}
        </div>

        <h3 
          onClick={() => {
            dispatch(setSearchTerm(p.title));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-extrabold text-slate-900 text-[15px] line-clamp-2 mb-1.5 cursor-pointer hover:text-blue-600 transition-colors"
          title={`Click to search "${p.title}"`}
        >
          {p.title}
        </h3>

        <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
          {p.farmerName}
          {p.isVerifiedFarmer && <FaCheckCircle className="text-blue-600 text-xs" title="Verified Farmer" />}
        </p>

        <p className="text-[11px] text-slate-400 mb-4">
          {p.availableQuantity} {p.unit}s available · Min {p.minOrderQuantity}
        </p>

        <div className="flex-1" />

        <div className="pt-3 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
            {isAuction ? 'Current Highest Bid' : 'Direct Price'}
          </p>
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-xl font-black text-slate-900">
              ₹{(price || 0).toLocaleString()}
              <span className="text-xs font-semibold text-slate-400"> /{p.unit}</span>
            </p>
          </div>

          {isAuction ? (
            <button
              onClick={() => dispatch(setUI({ biddingProduct: p }))}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
            >
              <FaGavel /> Place Bid
            </button>
          ) : (
            <button
              onClick={() => dispatch(setUI({ buyingProduct: p }))}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm shadow-blue-600/25 transition-all active:scale-95"
            >
              <FaShoppingBag /> Buy Now
            </button>
          )}
        </div>
      </div>
    </article>
  );
}