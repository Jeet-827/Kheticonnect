import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';
import { tokenService } from '../services/tokenService';
import { showToast, clearToast } from '../store/slices/uiSlice';
import {
  Truck, MapPin, Package, Clock, Star, Phone, CheckCircle2,
  ChevronRight, Filter, Search, ArrowRight, Shield,
  Thermometer, Navigation, TrendingUp, Plus, X,
  IndianRupee, RefreshCw
} from 'lucide-react';

// ─── Static Initial Data ───────────────────────────────────────────────────────

const VEHICLE_TYPES = ['All', 'Mini Truck', 'Tata Ace', 'Tempo', 'Container', 'Refrigerated'];

const INITIAL_VEHICLES = [
  {
    id: 'v1',
    name: 'Ramesh Transport Co.',
    vehicleType: 'Refrigerated',
    capacity: '5 MT',
    from: 'Nashik',
    to: 'Mumbai',
    price: 3200,
    priceUnit: 'trip',
    rating: 4.8,
    reviews: 312,
    eta: '6–8 hrs',
    features: ['Cold Chain', 'GPS Tracked', 'Insured', '24/7 Support'],
    badge: 'Top Rated',
    avatar: 'truck',
    available: true,
    trips: 1820,
    phone: '+91-98765-43210',
  },
  {
    id: 'v2',
    name: 'Krishna Agri Logistics',
    vehicleType: 'Container',
    capacity: '10 MT',
    from: 'Pune',
    to: 'Delhi',
    price: 18500,
    priceUnit: 'trip',
    rating: 4.6,
    reviews: 198,
    eta: '28–32 hrs',
    features: ['GPS Tracked', 'Insured', 'Driver + Helper'],
    badge: 'Verified',
    avatar: 'container',
    available: true,
    trips: 940,
    phone: '+91-97654-32109',
  },
  {
    id: 'v3',
    name: 'Suresh Mini Truck',
    vehicleType: 'Mini Truck',
    capacity: '1.5 MT',
    from: 'Nagpur',
    to: 'Wardha',
    price: 850,
    priceUnit: 'trip',
    rating: 4.5,
    reviews: 87,
    eta: '1.5–2 hrs',
    features: ['GPS Tracked', 'Flexible Schedule'],
    badge: null,
    avatar: 'mini-truck',
    available: true,
    trips: 450,
    phone: '+91-96543-21098',
  },
];

const COLD_STORAGE = [
  {
    id: 'cs1',
    name: 'AgroFreeze Nashik',
    location: 'Nashik, Maharashtra',
    capacity: '2000 MT',
    available: '450 MT',
    tempRange: '0°C – 4°C',
    pricePerMT: 280,
    rating: 4.7,
    reviews: 203,
    crops: ['Grapes', 'Onion', 'Tomato', 'Pomegranate'],
    certified: true,
  },
  {
    id: 'cs2',
    name: 'FreshVault Pune',
    location: 'Pune, Maharashtra',
    capacity: '5000 MT',
    available: '1200 MT',
    tempRange: '-2°C – 8°C',
    pricePerMT: 310,
    rating: 4.8,
    reviews: 410,
    crops: ['Potato', 'Apple', 'Mango', 'Papaya'],
    certified: true,
  },
];

const LIVE_ROUTES = [
  { from: 'Nashik', to: 'Mumbai', distance: '168 km', trucks: 14, avgPrice: '₹2,800–₹3,500' },
  { from: 'Pune', to: 'Delhi', distance: '1,480 km', trucks: 8, avgPrice: '₹17,000–₹21,000' },
  { from: 'Bangalore', to: 'Chennai', distance: '346 km', trucks: 22, avgPrice: '₹8,000–₹11,000' },
  { from: 'Lucknow', to: 'Kanpur', distance: '84 km', trucks: 31, avgPrice: '₹500–₹700' },
  { from: 'Jaipur', to: 'Ajmer', distance: '132 km', trucks: 19, avgPrice: '₹650–₹900' },
];

const STATS = [
  { icon: Truck,       value: '4,200+', label: 'Verified Vehicles' },
  { icon: MapPin,      value: '380+',   label: 'Routes Covered' },
  { icon: Package,     value: '92,000+', label: 'Deliveries Done' },
  { icon: Thermometer, value: '180+',   label: 'Cold Storage Units' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TransportationSection() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [vehicles, setVehicles]           = useState(INITIAL_VEHICLES);
  const [vehicleFilter, setVehicleFilter] = useState('All');
  const [searchFrom, setSearchFrom]       = useState('');
  const [searchTo, setSearchTo]           = useState('');
  const [activeTab, setActiveTab]         = useState('vehicles');
  const [booked, setBooked]               = useState(null);
  const [bookingVehicle, setBookingVehicle] = useState(null);
  const [form, setForm]                   = useState({ date: '', weight: '', cargo: '', note: '' });

  // Admin Add Vehicle Modal State
  const [addModalOpen, setAddModalOpen]   = useState(false);
  const [newVehicle, setNewVehicle]       = useState({
    name: '', vehicleType: 'Refrigerated', capacity: '5 MT', from: '', to: '', price: '', phone: '', avatar: 'truck'
  });

  // Fetch vehicles from API backend
  useEffect(() => {
    fetch('/api/transport')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.vehicles) setVehicles(data.vehicles);
      })
      .catch(() => { /* fallback to INITIAL_VEHICLES */ });
  }, []);

  const filtered = vehicles.filter(v => {
    const matchType = vehicleFilter === 'All' || v.vehicleType === vehicleFilter;
    const matchFrom = !searchFrom || v.from.toLowerCase().includes(searchFrom.toLowerCase());
    const matchTo   = !searchTo   || v.to.toLowerCase().includes(searchTo.toLowerCase());
    return matchType && matchFrom && matchTo;
  });

  function handleBook(v) {
    setBookingVehicle(v);
    setBooked(null);
  }

  async function handleConfirm(e) {
    e.preventDefault();
    try {
      const accessToken = tokenService.getAccessToken();
      await fetch('/api/transport/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          vehicleId: bookingVehicle._id || bookingVehicle.id,
          cargo: form.cargo,
          scheduledDate: form.date,
        }),
      });
    } catch { /* offline — still show confirmation */ }
    setBooked(bookingVehicle);
    setBookingVehicle(null);
    setForm({ date: '', weight: '', cargo: '', note: '' });
  }

  const handleAddVehicleSubmit = async (e) => {
    e.preventDefault();
    if (!newVehicle.name || !newVehicle.from || !newVehicle.to || !newVehicle.price) return;

    try {
      const accessToken = tokenService.getAccessToken();
      const res = await fetch('/api/transport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(newVehicle)
      });
      const data = await res.json();
      if (data.success && data.vehicle) {
        setVehicles(prev => [data.vehicle, ...prev]);
        dispatch(showToast({ message: 'New transport vehicle added successfully!', type: 'success' }));
      } else {
        // Fallback local insert
        const fallback = { id: `v_${Date.now()}`, ...newVehicle, price: Number(newVehicle.price), rating: 5.0, reviews: 1, available: true, trips: 1 };
        setVehicles(prev => [fallback, ...prev]);
        dispatch(showToast({ message: 'Vehicle added (Demo Admin Mode)!', type: 'success' }));
      }
    } catch {
      const fallback = { id: `v_${Date.now()}`, ...newVehicle, price: Number(newVehicle.price), rating: 5.0, reviews: 1, available: true, trips: 1 };
      setVehicles(prev => [fallback, ...prev]);
      dispatch(showToast({ message: 'Vehicle added (Local Mode)!', type: 'success' }));
    }
    setTimeout(() => dispatch(clearToast()), 3500);
    setAddModalOpen(false);
    setNewVehicle({ name: '', vehicleType: 'Refrigerated', capacity: '5 MT', from: '', to: '', price: '', phone: '', avatar: 'truck' });
  };

  return (
    <div className="py-6">

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <div className="transport-hero">
        <div className="transport-hero-orb-1" />
        <div className="transport-hero-orb-2" />

        <div className="hero-content flex flex-col justify-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sky-300 text-[11px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              <Truck className="w-3.5 h-3.5" /> Farm Logistics and Transportation
            </div>
            <h1 className="text-4xl font-black text-white leading-tight mb-4">
              Move Your Harvest <span className="text-sky-300">Safely and Fast</span>
            </h1>
            <p className="text-blue-100/80 text-base leading-relaxed mb-8 max-w-xl">
              Book verified trucks, tempo, and refrigerated vehicles directly from your farm to mandi, warehouse, or buyer with real-time GPS tracking.
            </p>

            {/* Quick Search Bar */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2 bg-white/15 border border-white/25 rounded-2xl px-4 py-2.5 flex-1 min-w-[160px]">
                <MapPin className="w-4 h-4 text-sky-300 shrink-0" />
                <input
                  className="bg-transparent text-white placeholder-blue-200/60 text-sm font-semibold outline-none w-full"
                  placeholder="From (City)"
                  value={searchFrom}
                  onChange={e => setSearchFrom(e.target.value)}
                />
              </div>
              <ArrowRight className="w-4 h-4 text-sky-300 shrink-0" />
              <div className="flex items-center gap-2 bg-white/15 border border-white/25 rounded-2xl px-4 py-2.5 flex-1 min-w-[160px]">
                <Navigation className="w-4 h-4 text-sky-300 shrink-0" />
                <input
                  className="bg-transparent text-white placeholder-blue-200/60 text-sm font-semibold outline-none w-full"
                  placeholder="To (City)"
                  value={searchTo}
                  onChange={e => setSearchTo(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary btn-sm px-6"
                style={{ background: 'linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%)', boxShadow: '0 4px 16px rgba(14,165,233,.35)' }}
                onClick={() => setActiveTab('vehicles')}
              >
                <Search className="w-4 h-4" /> Find Vehicles
              </button>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="absolute bottom-0 left-0 right-0 flex divide-x divide-white/10 bg-black/30 backdrop-blur-sm border-t border-white/10">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="stat-chip flex-1 py-3">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Icon className="w-3.5 h-3.5 text-sky-300" />
                <span className="text-white font-black text-base leading-none">{value}</span>
              </div>
              <span className="text-blue-200/70 text-[10px] font-semibold">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── TAB SWITCHER ──────────────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 max-w-lg">
        {[
          { id: 'vehicles',     label: 'Book Vehicles' },
          { id: 'cold-storage', label: 'Cold Storage' },
          { id: 'live-routes',  label: 'Live Routes' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === t.id
                ? 'bg-sky-600 text-white shadow'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── VEHICLES TAB ──────────────────────────────────────────────────────── */}
      {activeTab === 'vehicles' && (
        <>
          {/* Filter bar */}
          <div className="filter-bar mb-6 flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2 text-slate-500 text-sm font-bold shrink-0">
                <Filter className="w-4 h-4" /> Vehicle Type:
              </div>
              {VEHICLE_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setVehicleFilter(type)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold border transition-all ${
                    vehicleFilter === type
                      ? 'bg-sky-600 text-white border-sky-600 shadow'
                      : 'border-slate-200 text-slate-600 hover:border-sky-400 hover:text-sky-700 bg-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button
                onClick={() => setAddModalOpen(true)}
                className="btn btn-sm bg-slate-900 text-white hover:bg-slate-800 font-extrabold flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4 text-sky-400" /> List Your Transport Vehicle
              </button>
              {(vehicleFilter !== 'All' || searchFrom || searchTo) && (
                <button
                  onClick={() => { setVehicleFilter('All'); setSearchFrom(''); setSearchTo(''); }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 font-bold transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>
          </div>

          {/* Vehicle cards grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Truck className="w-14 h-14 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 font-bold text-sm">No vehicles found for this route.</p>
              <p className="text-slate-300 text-xs mt-1">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid-responsive">
              {filtered.map(v => (
                <VehicleCard key={v.id} vehicle={v} onBook={handleBook} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── COLD STORAGE TAB ────────────────────────────────────────────────── */}
      {activeTab === 'cold-storage' && (
        <div className="grid gap-5">
          <div className="section-eyebrow">Cold Chain and Storage Facilities</div>
          {COLD_STORAGE.map(cs => (
            <ColdStorageCard key={cs.id} cs={cs} />
          ))}
        </div>
      )}

      {/* ── LIVE ROUTES TAB ─────────────────────────────────────────────────── */}
      {activeTab === 'live-routes' && (
        <div className="space-y-4">
          <div className="section-eyebrow">High-Demand Live Routes</div>
          {LIVE_ROUTES.map((r, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-wrap items-center gap-4 shadow-sm hover:shadow-md hover:border-sky-200 transition-all cursor-pointer"
              onClick={() => { setSearchFrom(r.from); setSearchTo(r.to); setActiveTab('vehicles'); }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-[200px]">
                <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                  <Navigation className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-black text-slate-800">
                    <span>{r.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-500" />
                    <span>{r.to}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">{r.distance}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-sky-500" />
                  <span>{r.trucks} trucks available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{r.avgPrice}</span>
                </div>
              </div>
              <button className="ml-auto flex items-center gap-1 text-xs text-sky-600 font-extrabold hover:text-sky-800 transition-colors">
                Search <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── BOOKING MODAL ─────────────────────────────────────────────────────── */}
      {bookingVehicle && (
        <div className="modal-overlay" onClick={() => setBookingVehicle(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header-transport p-6">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-4xl">{bookingVehicle.avatar}</span>
                <div>
                  <h2 className="text-lg font-black text-white">{bookingVehicle.name}</h2>
                  <p className="text-sky-200 text-xs font-bold">{bookingVehicle.vehicleType} · {bookingVehicle.capacity}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sky-200 text-xs font-semibold mt-2">
                <MapPin className="w-3.5 h-3.5" />
                {bookingVehicle.from} to {bookingVehicle.to}
                <span className="ml-4 flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{bookingVehicle.eta}</span>
              </div>
            </div>
            <form onSubmit={handleConfirm} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Pickup Date</label>
                  <input
                    required
                    type="date"
                    className="form-input"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Cargo Weight (MT)</label>
                  <input
                    required
                    type="number"
                    step="0.1"
                    min="0.1"
                    className="form-input"
                    placeholder="e.g. 2.5"
                    value={form.weight}
                    onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Crop / Cargo Type</label>
                <input
                  required
                  type="text"
                  className="form-input"
                  placeholder="e.g. Wheat, Tomato, Onion..."
                  value={form.cargo}
                  onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Special Instructions (optional)</label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  placeholder="e.g. Handle with care, early morning pickup..."
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                />
              </div>

              {/* Price Summary */}
              <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-bold">Estimated Cost</p>
                  <p className="text-2xl font-black text-slate-900">Rs.{bookingVehicle.price.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">per {bookingVehicle.priceUnit}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-bold">Contact</p>
                  <p className="text-sm font-extrabold text-sky-700">{bookingVehicle.phone}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBookingVehicle(null)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn flex-1 text-white font-extrabold"
                  style={{ background: 'linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%)' }}
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── BOOKING SUCCESS TOAST ─────────────────────────────────────────────── */}
      {booked && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-white/10 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0" />
          <div>
            <p className="font-extrabold text-sm">Booking Confirmed!</p>
            <p className="text-xs text-slate-400">{booked.name} booked for your cargo. Contact: {booked.phone}</p>
          </div>
          <button onClick={() => setBooked(null)} className="ml-4 text-slate-400 hover:text-white text-lg font-bold leading-none">x</button>
        </div>
      )}

      {/* ── ADD VEHICLE MODAL ─────────────────────────── */}
      {addModalOpen && (
        <div className="modal-overlay" onClick={() => setAddModalOpen(false)}>
          <div className="modal-card max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="bg-slate-900 p-5 rounded-t-[28px] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-sky-400" />
                <h3 className="font-extrabold text-base">List New Transport Vehicle</h3>
              </div>
              <button onClick={() => setAddModalOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddVehicleSubmit} className="p-6 space-y-4">
              <div className="form-group">
                <label className="form-label">Transporter / Service Name *</label>
                <input required type="text" placeholder="e.g. Maharastra Express Logistics" value={newVehicle.name} onChange={e => setNewVehicle(p => ({ ...p, name: e.target.value }))} className="form-input" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Vehicle Type *</label>
                  <select value={newVehicle.vehicleType} onChange={e => setNewVehicle(p => ({ ...p, vehicleType: e.target.value }))} className="form-input">
                    <option value="Refrigerated">Refrigerated</option>
                    <option value="Container">Container</option>
                    <option value="Mini Truck">Mini Truck</option>
                    <option value="Tata Ace">Tata Ace</option>
                    <option value="Tempo">Tempo</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity *</label>
                  <input required type="text" placeholder="e.g. 5 MT" value={newVehicle.capacity} onChange={e => setNewVehicle(p => ({ ...p, capacity: e.target.value }))} className="form-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">From City *</label>
                  <input required type="text" placeholder="e.g. Nashik" value={newVehicle.from} onChange={e => setNewVehicle(p => ({ ...p, from: e.target.value }))} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">To City *</label>
                  <input required type="text" placeholder="e.g. Mumbai" value={newVehicle.to} onChange={e => setNewVehicle(p => ({ ...p, to: e.target.value }))} className="form-input" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Trip Price (₹) *</label>
                  <input required type="number" placeholder="e.g. 3500" value={newVehicle.price} onChange={e => setNewVehicle(p => ({ ...p, price: e.target.value }))} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input type="text" placeholder="+91-98765-43210" value={newVehicle.phone} onChange={e => setNewVehicle(p => ({ ...p, phone: e.target.value }))} className="form-input" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setAddModalOpen(false)} className="btn btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn bg-sky-600 hover:bg-sky-700 text-white flex-1 font-extrabold">Add Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// ─── VehicleCard ──────────────────────────────────────────────────────────────

function VehicleCard({ vehicle: v, onBook }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`transport-card ${!v.available ? 'opacity-60' : ''} flex flex-col justify-between`}>
      {/* Card Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
            <Truck className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-sm font-black text-slate-900 truncate">{v.name}</h3>
              {v.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${
                  v.badge === 'Top Rated' ? 'bg-blue-600 text-white' : v.badge === 'Premium' ? 'bg-slate-900 text-white' : 'bg-blue-100 text-blue-800'
                }`}>
                  {v.badge}
                </span>
              )}
              {!v.available && <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-100 text-red-700">Busy</span>}
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">{v.vehicleType} · {v.capacity}</p>
          </div>
        </div>

        {/* Route */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 mb-3">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-xs font-extrabold text-slate-900">{v.from}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-extrabold text-slate-900">{v.to}</span>
          <div className="ml-auto flex items-center gap-1 text-[11px] text-slate-500 font-extrabold">
            <Clock className="w-3 h-3 text-slate-400" /> {v.eta}
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {v.features.map(f => (
            <span key={f} className="flex items-center gap-1 text-[10px] font-extrabold text-slate-700 bg-blue-50/70 px-2.5 py-0.5 rounded-full border border-blue-100">
              <CheckCircle2 className="w-3 h-3 text-blue-600" /> {f}
            </span>
          ))}
        </div>

        {/* Rating and trips */}
        <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
            <strong className="text-slate-900">{v.rating}</strong> ({v.reviews} reviews)
          </span>
          {v.trips != null && (
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              {(v.trips || 0).toLocaleString()} trips
            </span>
          )}
        </div>
      </div>

      {/* Expandable contact details */}
      {expanded && (
        <div className="px-5 pb-3 text-xs text-slate-600 font-semibold border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Contact: <strong className="text-slate-900">{v.phone}</strong></span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100/80 mt-auto">
        <div>
          <span className="text-xl font-black text-slate-900">₹{v.price.toLocaleString()}</span>
          <span className="text-xs text-slate-400 font-bold">/{v.priceUnit}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setExpanded(p => !p)}
            className="btn btn-outline btn-sm text-xs px-2.5 py-1.5"
          >
            {expanded ? 'Less' : 'Details'}
          </button>
          <button
            disabled={!v.available}
            onClick={() => onBook(v)}
            className="btn btn-primary btn-sm text-xs font-extrabold px-3.5 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            {v.available ? 'Book Now' : 'Busy'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ColdStorageCard ──────────────────────────────────────────────────────────

function ColdStorageCard({ cs }) {
  const availablePct = parseInt(cs.available) / parseInt(cs.capacity) * 100;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-sky-200 transition-all">
      <div className="flex flex-wrap gap-4 items-start">
        <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
          <Thermometer className="w-6 h-6 text-sky-600" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-sm font-black text-slate-800">{cs.name}</h3>
            {cs.certified && (
              <span className="badge badge-green text-[9px]">
                <Shield className="w-2.5 h-2.5" /> Certified
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {cs.location}
          </p>
          <div className="flex flex-wrap gap-3 mt-3 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-sky-500" />{cs.tempRange}</span>
            <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5 text-emerald-500" />Capacity: {cs.capacity}</span>
            <span className="flex items-center gap-1 text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5" />Available: {cs.available}</span>
          </div>
          {/* Capacity bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
              <span>Available Space</span>
              <span>{Math.round(availablePct)}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: availablePct + '%',
                  background: availablePct > 30 ? 'linear-gradient(90deg,#22c55e,#16a34a)' : 'linear-gradient(90deg,#f59e0b,#d97706)',
                }}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {cs.crops.map(c => (
              <span key={c} className="bg-sky-50 text-sky-700 border border-sky-100 text-[10px] font-bold px-2 py-0.5 rounded-full">{c}</span>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold mb-1 justify-end">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <strong className="text-slate-800">{cs.rating}</strong> ({cs.reviews})
          </div>
          <p className="text-xl font-black text-slate-900">Rs.{cs.pricePerMT}</p>
          <p className="text-[10px] text-slate-400 font-semibold">per MT/month</p>
          <button
            className="btn btn-sm mt-3 text-white text-xs font-extrabold"
            style={{ background: 'linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%)' }}
          >
            Reserve Space
          </button>
        </div>
      </div>
    </div>
  );
}
