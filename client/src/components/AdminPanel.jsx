import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useKheti } from '../hooks/useKheti';
import { selectUser, selectAccessToken } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';
import {
  ShieldCheck, Truck, PlusCircle, Trash2, Edit3, BookOpen,
  Landmark, TrendingUp, Layers, CheckCircle2, AlertCircle,
  Phone, MapPin, Search, ArrowRight, Star, RefreshCw, X
} from 'lucide-react';

export default function AdminPanel() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const accessToken = useSelector(selectAccessToken);
  const {
    products, addProduct,
    guides,
    schemes,
    mandiRates,
    userRole
  } = useKheti();

  const [activeAdminTab, setActiveAdminTab] = useState('transport');

  // ── Transport Vehicles State ──
  const [vehiclesList, setVehiclesList] = useState([]);

  // Fetch vehicles from API on mount
  useEffect(() => {
    fetch('/api/transport')
      .then(r => r.json())
      .then(d => { if (d.success) setVehiclesList(d.vehicles); })
      .catch(() => {}); // stays empty — will show when loaded
  }, []);

  // Form States
  const [vehicleForm, setVehicleForm] = useState({
    name: '',
    vehicleType: 'Refrigerated',
    capacity: '5 MT',
    from: '',
    to: '',
    price: '',
    eta: '4-6 hrs',
    phone: '',
    hasColdChain: true,
    hasGps: true,
    hasInsurance: true
  });

  const [cropForm, setCropForm] = useState({
    title: '',
    category: 'Grains',
    farmerName: 'Agri Verified Farmer',
    farmerLocation: 'Punjab, India',
    pricePerUnit: '',
    unit: 'Quintal',
    availableQuantity: '50',
    minOrderQuantity: '5',
    isOrganic: true,
    listingType: 'fixed',
    description: '',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800'
  });

  const [guideForm, setGuideForm] = useState({
    title: '',
    category: 'Organic Farming',
    readTime: '5 min read',
    author: 'Agri Advisory Council',
    summary: '',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=600'
  });

  const [schemeForm, setSchemeForm] = useState({
    title: '',
    benefit: '',
    eligibility: '',
    linkText: 'Check Eligibility & Apply'
  });

  const [mandiForm, setMandiForm] = useState({
    crop: '',
    location: '',
    price: '',
    unit: 'Quintal',
    change: '+1.5%'
  });

  // ── Handlers ──

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    if (!vehicleForm.name || !vehicleForm.from || !vehicleForm.to || !vehicleForm.price) return;

    const features = [];
    if (vehicleForm.hasColdChain) features.push('Cold Chain');
    if (vehicleForm.hasGps) features.push('GPS Tracked');
    if (vehicleForm.hasInsurance) features.push('Insured');

    const body = {
      name: vehicleForm.name, vehicleType: vehicleForm.vehicleType,
      capacity: vehicleForm.capacity, from: vehicleForm.from, to: vehicleForm.to,
      price: Number(vehicleForm.price), eta: vehicleForm.eta || '4–6 hrs',
      phone: vehicleForm.phone || '+91-90000-00000',
      features, badge: 'Admin Verified',
    };

    try {
      const res  = await fetch('/api/transport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success && data.vehicle) {
        setVehiclesList(prev => [data.vehicle, ...prev]);
      } else {
        setVehiclesList(prev => [{ id: `v_${Date.now()}`, ...body, rating: 5.0, reviews: 1, available: true }, ...prev]);
      }
    } catch {
      setVehiclesList(prev => [{ id: `v_${Date.now()}`, ...body, rating: 5.0, reviews: 1, available: true }, ...prev]);
    }

    setVehicleForm({ name: '', vehicleType: 'Refrigerated', capacity: '5 MT', from: '', to: '', price: '', eta: '4-6 hrs', phone: '', hasColdChain: true, hasGps: true, hasInsurance: true });
    dispatch(showToast({ message: `Transport vehicle "${vehicleForm.name}" added!`, type: 'success' }));
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await fetch(`/api/transport/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } });
    } catch { /* offline */ }
    setVehiclesList(prev => prev.filter(v => (v._id || v.id) !== id));
    dispatch(showToast({ message: 'Vehicle removed.', type: 'info' }));
  };

  const toggleVehicleAvailability = (id) => {
    setVehiclesList(prev => prev.map(v => (v._id || v.id) === id ? { ...v, available: !v.available } : v));
    dispatch(showToast({ message: 'Vehicle availability updated.', type: 'info' }));
  };

  const handleAddCrop = (e) => {
    e.preventDefault();
    if (!cropForm.title || !cropForm.pricePerUnit) return;

    const newProduct = {
      id: `crop-${Date.now()}`,
      title: cropForm.title,
      category: cropForm.category,
      farmerId: user?.id || 'admin-1',
      farmerName: cropForm.farmerName,
      farmerLocation: cropForm.farmerLocation,
      farmerRating: 5.0,
      farmerReviewsCount: 1,
      isVerifiedFarmer: true,
      pricePerUnit: Number(cropForm.pricePerUnit),
      unit: cropForm.unit,
      availableQuantity: Number(cropForm.availableQuantity),
      minOrderQuantity: Number(cropForm.minOrderQuantity),
      harvestDate: new Date().toISOString().split('T')[0],
      isOrganic: cropForm.isOrganic,
      listingType: cropForm.listingType,
      currentHighestBid: cropForm.listingType === 'auction' ? Number(cropForm.pricePerUnit) : null,
      minBidIncrement: 50,
      image: cropForm.image || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800',
      description: cropForm.description || 'Admin-approved premium verified produce.'
    };

    addProduct(newProduct);
    setCropForm({
      title: '',
      category: 'Grains',
      farmerName: 'Agri Verified Farmer',
      farmerLocation: 'Punjab, India',
      pricePerUnit: '',
      unit: 'Quintal',
      availableQuantity: '50',
      minOrderQuantity: '5',
      isOrganic: true,
      listingType: 'fixed',
      description: '',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800'
    });
    dispatch(showToast({ message: `Crop produce "${newProduct.title}" published to marketplace!`, type: 'success' }));
  };

  const handleAddGuide = (e) => {
    e.preventDefault();
    if (!guideForm.title || !guideForm.summary) return;

    const newGuide = {
      id: `g-${Date.now()}`,
      title: guideForm.title,
      category: guideForm.category,
      readTime: guideForm.readTime,
      author: guideForm.author,
      summary: guideForm.summary,
      image: guideForm.image
    };

    if (guides && Array.isArray(guides)) {
      guides.unshift(newGuide);
    }
    setGuideForm({
      title: '',
      category: 'Organic Farming',
      readTime: '5 min read',
      author: 'Agri Advisory Council',
      summary: '',
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=600'
    });
    dispatch(showToast({ message: `Agri guide "${newGuide.title}" added to Knowledge Hub!`, type: 'success' }));
  };

  const handleAddScheme = (e) => {
    e.preventDefault();
    if (!schemeForm.title || !schemeForm.benefit) return;

    const newScheme = {
      id: `s-${Date.now()}`,
      title: schemeForm.title,
      benefit: schemeForm.benefit,
      eligibility: schemeForm.eligibility,
      linkText: schemeForm.linkText
    };

    if (schemes && Array.isArray(schemes)) {
      schemes.unshift(newScheme);
    }
    setSchemeForm({
      title: '',
      benefit: '',
      eligibility: '',
      linkText: 'Check Eligibility & Apply'
    });
    dispatch(showToast({ message: `Government scheme "${newScheme.title}" published!`, type: 'success' }));
  };

  const handleAddMandiRate = (e) => {
    e.preventDefault();
    if (!mandiForm.crop || !mandiForm.price) return;

    const newRate = {
      crop: mandiForm.crop,
      location: mandiForm.location || 'Central Mandi',
      price: Number(mandiForm.price),
      unit: mandiForm.unit,
      change: mandiForm.change || '+0.0%'
    };

    if (mandiRates && Array.isArray(mandiRates)) {
      mandiRates.unshift(newRate);
    }
    setMandiForm({
      crop: '',
      location: '',
      price: '',
      unit: 'Quintal',
      change: '+1.5%'
    });
    dispatch(showToast({ message: `Live Mandi rate for ${newRate.crop} updated!`, type: 'success' }));
  };

  return (
    <div className="py-6 space-y-8">

      {/* ── Admin Header Banner ────────────────────────────────────────── */}
      <div className="rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%)' }}>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sky-300 text-[11px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              Administrative Control Center
            </div>
            <h1 className="text-3xl font-black text-white">System Administration Panel</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Manage freight and cold storage logistics, produce listings, advisory guides, government schemes, and mandi spot rates in real-time.
            </p>
          </div>

          <div className="flex gap-3 bg-white/10 p-3 rounded-2xl border border-white/15 backdrop-blur-md shrink-0">
            <div className="text-center px-3 border-r border-white/10">
              <p className="text-2xl font-black text-sky-300">{vehiclesList.length}</p>
              <p className="text-[10px] text-white/70 font-bold uppercase">Vehicles</p>
            </div>
            <div className="text-center px-3 border-r border-white/10">
              <p className="text-2xl font-black text-emerald-400">{products.length}</p>
              <p className="text-[10px] text-white/70 font-bold uppercase">Listings</p>
            </div>
            <div className="text-center px-3">
              <p className="text-2xl font-black text-amber-300">{guides?.length || 3}</p>
              <p className="text-[10px] text-white/70 font-bold uppercase">Guides</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Admin Tab Switcher ─────────────────────────────────────────── */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'transport', label: 'Logistics & Transport', icon: <Truck className="w-4 h-4" /> },
          { id: 'crops',     label: 'Marketplace Produce',   icon: <Layers className="w-4 h-4" /> },
          { id: 'guides',    label: 'Advisory Guides',       icon: <BookOpen className="w-4 h-4" /> },
          { id: 'schemes',   label: 'Government Schemes',    icon: <Landmark className="w-4 h-4" /> },
          { id: 'mandi',     label: 'Mandi Rates',           icon: <TrendingUp className="w-4 h-4" /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveAdminTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black transition-all ${
              activeAdminTab === t.id
                ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── TAB 1: TRANSPORTATION & LOGISTICS ──────────────────────────── */}
      {activeAdminTab === 'transport' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Vehicle Form */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
              <Truck className="w-5 h-5 text-sky-600" /> Add Transport Vehicle
            </h3>
            <p className="text-xs text-slate-500 mb-5">Register a new cargo vehicle or cold chain truck into logistics.</p>

            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Transporter / Service Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Mahadev Agri Freight Lines"
                  value={vehicleForm.name}
                  onChange={e => setVehicleForm(p => ({ ...p, name: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Vehicle Type</label>
                  <select
                    value={vehicleForm.vehicleType}
                    onChange={e => setVehicleForm(p => ({ ...p, vehicleType: e.target.value }))}
                    className="form-input"
                  >
                    <option value="Refrigerated">Refrigerated (Cold Chain)</option>
                    <option value="Container">Heavy Container</option>
                    <option value="Mini Truck">Mini Truck (1.5 MT)</option>
                    <option value="Tata Ace">Tata Ace (Chhota Hathi)</option>
                    <option value="Tempo">Tempo (3 MT)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 MT"
                    value={vehicleForm.capacity}
                    onChange={e => setVehicleForm(p => ({ ...p, capacity: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">From City / Mandi *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Nashik"
                    value={vehicleForm.from}
                    onChange={e => setVehicleForm(p => ({ ...p, from: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">To Destination *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Mumbai"
                    value={vehicleForm.to}
                    onChange={e => setVehicleForm(p => ({ ...p, to: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Price per Trip (Rs.) *</label>
                  <input
                    required
                    type="number"
                    placeholder="e.g. 3500"
                    value={vehicleForm.price}
                    onChange={e => setVehicleForm(p => ({ ...p, price: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Estimated Transit Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 5-7 hrs"
                    value={vehicleForm.eta}
                    onChange={e => setVehicleForm(p => ({ ...p, eta: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Driver / Contact Phone</label>
                <input
                  type="text"
                  placeholder="+91-98765-43210"
                  value={vehicleForm.phone}
                  onChange={e => setVehicleForm(p => ({ ...p, phone: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="flex gap-4 pt-1 text-xs font-bold text-slate-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vehicleForm.hasColdChain}
                    onChange={e => setVehicleForm(p => ({ ...p, hasColdChain: e.target.checked }))}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  Cold Chain
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vehicleForm.hasGps}
                    onChange={e => setVehicleForm(p => ({ ...p, hasGps: e.target.checked }))}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  GPS
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vehicleForm.hasInsurance}
                    onChange={e => setVehicleForm(p => ({ ...p, hasInsurance: e.target.checked }))}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  Insured
                </label>
              </div>

              <button type="submit" className="btn btn-primary w-full font-extrabold mt-4">
                <PlusCircle className="w-4 h-4" /> Add Vehicle to System
              </button>
            </form>
          </div>

          {/* Vehicle List Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-1">Registered Transport Vehicles</h3>
            <p className="text-xs text-slate-500 mb-5">Total {vehiclesList.length} transport assets registered.</p>

            <div className="space-y-3">
              {vehiclesList.map(v => (
                <div
                  key={v._id || v.id}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-sky-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{v.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
                        <span>{v.vehicleType}</span>
                        <span>·</span>
                        <span>{v.capacity}</span>
                        <span>·</span>
                        <span className="text-sky-700 font-bold">{v.from} to {v.to}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <p className="text-sm font-black text-slate-900">Rs.{v.price.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{v.eta}</p>
                    </div>

                    <button
                      onClick={() => toggleVehicleAvailability(v._id || v.id)}
                      className={`btn btn-sm text-xs font-extrabold ${
                        v.available
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      }`}
                    >
                      {v.available ? 'Available' : 'Busy'}
                    </button>

                    <button
                      onClick={() => handleDeleteVehicle(v._id || v.id)}
                      className="btn-icon w-8 h-8 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete vehicle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 2: MARKETPLACE PRODUCE ─────────────────────────────────── */}
      {activeAdminTab === 'crops' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" /> Direct Add Produce
            </h3>
            <p className="text-xs text-slate-500 mb-5">Publish admin-approved crop stock to marketplace.</p>

            <form onSubmit={handleAddCrop} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Produce Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Certified Sharbati Wheat"
                  value={cropForm.title}
                  onChange={e => setCropForm(p => ({ ...p, title: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={cropForm.category}
                    onChange={e => setCropForm(p => ({ ...p, category: e.target.value }))}
                    className="form-input"
                  >
                    <option value="Grains">Grains</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Spices">Spices</option>
                    <option value="Cash Crops">Cash Crops</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Listing Model</label>
                  <select
                    value={cropForm.listingType}
                    onChange={e => setCropForm(p => ({ ...p, listingType: e.target.value }))}
                    className="form-input"
                  >
                    <option value="fixed">Fixed Price</option>
                    <option value="auction">Live Auction</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Price per Unit (Rs.) *</label>
                  <input
                    required
                    type="number"
                    placeholder="e.g. 2400"
                    value={cropForm.pricePerUnit}
                    onChange={e => setCropForm(p => ({ ...p, pricePerUnit: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <input
                    type="text"
                    placeholder="Quintal / Box / Kg"
                    value={cropForm.unit}
                    onChange={e => setCropForm(p => ({ ...p, unit: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Available Qty</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={cropForm.availableQuantity}
                    onChange={e => setCropForm(p => ({ ...p, availableQuantity: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Min Order Qty</label>
                  <input
                    type="number"
                    placeholder="5"
                    value={cropForm.minOrderQuantity}
                    onChange={e => setCropForm(p => ({ ...p, minOrderQuantity: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Farmer / Origin</label>
                <input
                  type="text"
                  placeholder="e.g. Sardar Ramesh Singh (Ludhiana, Punjab)"
                  value={cropForm.farmerName}
                  onChange={e => setCropForm(p => ({ ...p, farmerName: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (Unsplash or direct link)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={cropForm.image}
                  onChange={e => setCropForm(p => ({ ...p, image: e.target.value }))}
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn btn-primary w-full font-extrabold mt-2">
                <PlusCircle className="w-4 h-4" /> Publish Listing
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-1">Active Marketplace Produce</h3>
            <p className="text-xs text-slate-500 mb-5">Showing {products.length} live crop listings.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(p => (
                <div key={p.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex gap-3 items-center">
                  <img src={p.image} alt={p.title} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-900 truncate">{p.title}</h4>
                    <p className="text-[11px] text-slate-500">{p.farmerLocation}</p>
                    <p className="text-sm font-black text-emerald-800 mt-1">Rs.{p.pricePerUnit || p.currentHighestBid} <span className="text-[10px] font-normal text-slate-400">/{p.unit}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 3: ADVISORY GUIDES ─────────────────────────────────────── */}
      {activeAdminTab === 'guides' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" /> Publish Advisory Guide
            </h3>
            <p className="text-xs text-slate-500 mb-5">Add expert scientific guides to farmer Knowledge Hub.</p>

            <form onSubmit={handleAddGuide} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Guide Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Modern Soil Aeration Techniques"
                  value={guideForm.title}
                  onChange={e => setGuideForm(p => ({ ...p, title: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    value={guideForm.category}
                    onChange={e => setGuideForm(p => ({ ...p, category: e.target.value }))}
                    className="form-input"
                  >
                    <option value="Organic Farming">Organic Farming</option>
                    <option value="Water Management">Water Management</option>
                    <option value="Market Advisory">Market Advisory</option>
                    <option value="Crop Protection">Crop Protection</option>
                    <option value="Soil Health">Soil Health</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Read Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 6 min read"
                    value={guideForm.readTime}
                    onChange={e => setGuideForm(p => ({ ...p, readTime: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Author / Organization</label>
                <input
                  type="text"
                  placeholder="e.g. ICAR Agri Advisory Council"
                  value={guideForm.author}
                  onChange={e => setGuideForm(p => ({ ...p, author: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Summary / Description *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Practical recommendations for farmers..."
                  value={guideForm.summary}
                  onChange={e => setGuideForm(p => ({ ...p, summary: e.target.value }))}
                  className="form-textarea"
                />
              </div>

              <button type="submit" className="btn btn-primary w-full font-extrabold mt-2">
                <PlusCircle className="w-4 h-4" /> Add Guide to Hub
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-1">Active Advisory Guides</h3>
            <p className="text-xs text-slate-500 mb-5">Available to all registered farmers and visitors.</p>

            <div className="space-y-3">
              {(guides || []).map((g, i) => (
                <div key={g.id || i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex gap-4 items-start">
                  <img src={g.image} alt={g.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="badge badge-green text-[10px] mb-1">{g.category}</span>
                    <h4 className="text-sm font-extrabold text-slate-900">{g.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{g.author} · {g.readTime}</p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{g.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 4: GOVT SCHEMES ────────────────────────────────────────── */}
      {activeAdminTab === 'schemes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-amber-600" /> Add Government Scheme
            </h3>
            <p className="text-xs text-slate-500 mb-5">Post agricultural subsidy & financial assistance schemes.</p>

            <form onSubmit={handleAddScheme} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Scheme Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. PM Kusum Solar Pump Subsidy"
                  value={schemeForm.title}
                  onChange={e => setSchemeForm(p => ({ ...p, title: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Benefit Details *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. 60% subsidy on standalone solar agriculture pumps"
                  value={schemeForm.benefit}
                  onChange={e => setSchemeForm(p => ({ ...p, benefit: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Eligibility Criteria</label>
                <input
                  type="text"
                  placeholder="e.g. Individual farmers, cooperatives, SHGs"
                  value={schemeForm.eligibility}
                  onChange={e => setSchemeForm(p => ({ ...p, eligibility: e.target.value }))}
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn btn-amber w-full font-extrabold mt-2">
                <PlusCircle className="w-4 h-4" /> Publish Scheme
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-1">Active Government Schemes</h3>
            <p className="text-xs text-slate-500 mb-5">Subsidies and financial schemes tracked in system.</p>

            <div className="space-y-3">
              {(schemes || []).map((s, i) => (
                <div key={s.id || i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex justify-between items-start gap-3">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{s.title}</h4>
                    <p className="text-xs text-emerald-800 font-bold mt-1">{s.benefit}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Eligibility: {s.eligibility}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── TAB 5: LIVE MANDI RATES ────────────────────────────────────── */}
      {activeAdminTab === 'mandi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-600" /> Post Mandi Spot Rate
            </h3>
            <p className="text-xs text-slate-500 mb-5">Update daily commodity prices for the live ticker & community table.</p>

            <form onSubmit={handleAddMandiRate} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Crop Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Yellow Mustard (Sarson)"
                  value={mandiForm.crop}
                  onChange={e => setMandiForm(p => ({ ...p, crop: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mandi & State *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Jaipur Mandi, RJ"
                  value={mandiForm.location}
                  onChange={e => setMandiForm(p => ({ ...p, location: e.target.value }))}
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label className="form-label">Spot Price (Rs.) *</label>
                  <input
                    required
                    type="number"
                    placeholder="e.g. 5400"
                    value={mandiForm.price}
                    onChange={e => setMandiForm(p => ({ ...p, price: e.target.value }))}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">24h Change</label>
                  <input
                    type="text"
                    placeholder="e.g. +2.1% or -0.8%"
                    value={mandiForm.change}
                    onChange={e => setMandiForm(p => ({ ...p, change: e.target.value }))}
                    className="form-input"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full font-extrabold mt-2">
                <PlusCircle className="w-4 h-4" /> Update Mandi Spot Rate
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-1">Live Mandi Price Records</h3>
            <p className="text-xs text-slate-500 mb-5">Synchronized across top bar ticker and advisory portal.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase">
                    <th className="p-3">Crop</th>
                    <th className="p-3">Mandi</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">24h Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold">
                  {(mandiRates || []).map((m, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-900 font-extrabold">{m.crop}</td>
                      <td className="p-3 text-slate-500">{m.location}</td>
                      <td className="p-3 text-emerald-700 font-black">Rs.{m.price.toLocaleString()} /{m.unit}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${m.change?.startsWith('+') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                          {m.change}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
