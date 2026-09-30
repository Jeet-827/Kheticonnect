import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  selectUser, 
  selectProfileLoading, 
  selectProfileUpdating,
  selectProfileError,
  selectProfileLastFetched,
  fetchUserProfile, 
  updateUserProfile,
  clearProfileError
} from '../store/slices/authSlice';
import { selectUserRole } from '../store/slices/uiSlice';
import { selectOrders, selectUserBids, selectProducts } from '../store/slices/marketplaceSlice';
import { showToast, clearToast } from '../store/slices/uiSlice';
import {
  User, Mail, Phone, MapPin, Star, CheckCircle2, Edit3, Save, X,
  Package, Gavel, Layers, ShieldCheck, Calendar, Award, Camera,
  RefreshCw, Loader2, Sparkles, Building, Briefcase, FileText, Check,
  AlertCircle, LogOut
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { GiWheat } from 'react-icons/gi';
import { FaShoppingCart } from 'react-icons/fa';

// ─── Preset Avatars for Fast Selection ─────────────────────────────────────────
const PRESET_AVATARS = [
  { label: 'Farmer 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
  { label: 'Farmer 2', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
  { label: 'Trader 1', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
  { label: 'Trader 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
];

// ─── Avatar Component ──────────────────────────────────────────────────────────
function Avatar({ name, src, size = 'lg' }) {
  const sz = size === 'lg' ? 'w-24 h-24 text-3xl' : 'w-12 h-12 text-base';
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sz} rounded-3xl object-cover border-4 border-white shadow-xl bg-slate-100`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name || 'User')}`;
        }}
      />
    );
  }
  return (
    <div className={`${sz} rounded-3xl bg-gradient-to-br from-blue-700 to-blue-950 flex items-center justify-center text-white font-black shadow-xl border-4 border-white`}>
      {name?.charAt(0) || 'U'}
    </div>
  );
}

// ─── Info Row Component ───────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, editing, name, type = 'text', onChange, placeholder }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
        {editing ? (
          <input
            type={type}
            name={name}
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder || `Enter ${label}`}
            className="w-full text-sm font-semibold text-slate-900 bg-blue-50/50 border border-blue-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        ) : (
          <p className="text-sm font-semibold text-slate-900 truncate">{value || '—'}</p>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const dispatch           = useDispatch();
  const { logout }         = useAuth();
  const user               = useSelector(selectUser);
  const userRole           = useSelector(selectUserRole);
  const orders             = useSelector(selectOrders);
  const userBids           = useSelector(selectUserBids);
  const products           = useSelector(selectProducts);
  const profileLoading     = useSelector(selectProfileLoading);
  const profileUpdating    = useSelector(selectProfileUpdating);
  const profileError       = useSelector(selectProfileError);
  const profileLastFetched = useSelector(selectProfileLastFetched);

  const [editing, setEditing]         = useState(false);
  const [formData, setFormData]       = useState({});
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Fetch full user profile from backend on mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Sync formData with user when editing starts or user changes
  useEffect(() => {
    if (user && !editing) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        acresCount: user.acresCount ?? '',
        businessType: user.businessType || '',
        department: user.department || '',
        avatar: user.avatar || ''
      });
    }
  }, [user, editing]);

  const listings = products.filter(p =>
    p.farmerId === user?.id || p.farmerName?.includes(user?.name?.split(' ')[0] || '')
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleManualRefresh = async () => {
    dispatch(clearProfileError());
    const res = await dispatch(fetchUserProfile());
    if (fetchUserProfile.fulfilled.match(res)) {
      dispatch(showToast({ message: 'Profile refreshed directly from backend server!', type: 'success' }));
      setTimeout(() => dispatch(clearToast()), 3000);
    } else {
      dispatch(showToast({ message: res.payload || 'Failed to fetch fresh profile', type: 'error' }));
      setTimeout(() => dispatch(clearToast()), 3500);
    }
  };

  const handleStartEdit = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
      acresCount: user?.acresCount ?? '',
      businessType: user?.businessType || '',
      department: user?.department || '',
      avatar: user?.avatar || ''
    });
    setEditing(true);
  };

  const handleSave = async () => {
    const res = await dispatch(updateUserProfile(formData));
    if (updateUserProfile.fulfilled.match(res)) {
      dispatch(showToast({ message: 'Profile saved & synced with backend successfully!', type: 'success' }));
      setTimeout(() => dispatch(clearToast()), 3500);
      setEditing(false);
    } else {
      dispatch(showToast({ message: res.payload || 'Failed to update profile on backend', type: 'error' }));
      setTimeout(() => dispatch(clearToast()), 3500);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        acresCount: user.acresCount ?? '',
        businessType: user.businessType || '',
        department: user.department || '',
        avatar: user.avatar || ''
      });
    }
  };

  const handleSelectPresetAvatar = (url) => {
    setFormData(prev => ({ ...prev, avatar: url }));
    setShowAvatarModal(false);
  };

  if (!user && profileLoading) {
    return (
      <div className="py-12 max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-48 rounded-3xl bg-slate-200" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-20 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="h-64 bg-slate-200 rounded-3xl" />
          <div className="h-64 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-lg mx-auto my-12 p-8 space-y-4 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-inner">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 mb-1">No Profile Data Available</h3>
          <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">No active user session or profile details were returned from the server.</p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => dispatch(fetchUserProfile())}
            className="btn btn-sm bg-slate-900 text-white hover:bg-slate-800 font-extrabold flex items-center gap-1.5 shadow"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" /> Refresh Data
          </button>
          <button
            onClick={() => logout()}
            className="btn btn-sm bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-extrabold flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </div>
    );
  }

  const isFarmer = (user.role || userRole) === 'farmer';

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">

      {/* ── Profile Error Banner (if any) ─────────────────────────────────── */}
      {profileError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-amber-900 text-xs font-bold shadow-sm">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{profileError}</span>
          </div>
          <button
            onClick={handleManualRefresh}
            className="px-2.5 py-1 bg-amber-200/60 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-extrabold flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Retry Sync
          </button>
        </div>
      )}

      {/* ── Profile Hero Header ───────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200">
        
        {/* Hero Background Banner */}
        <div
          className="h-36 w-full relative"
          style={{ background: 'linear-gradient(135deg, #030712 0%, #0c1938 55%, #1d4ed8 100%)' }}
        >
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{ background: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1800) center/cover' }}
          />

          {/* Backend Sync Indicator Badge */}
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-extrabold text-slate-200 flex items-center gap-1">
              Backend Connected
            </span>
            <span className="text-[10px] text-slate-400 border-l border-white/20 pl-2">
              /api/auth/me
            </span>
          </div>
        </div>

        {/* Profile Details Bar */}
        <div className="bg-white px-7 pb-7 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-12">
            
            {/* Avatar & Camera Toggle */}
            <div className="relative group">
              <Avatar
                name={editing ? (formData.name || user.name) : user.name}
                src={editing ? (formData.avatar || user.avatar) : user.avatar}
                size="lg"
              />
              {editing && (
                <button
                  type="button"
                  onClick={() => setShowAvatarModal(p => !p)}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 text-white transition-transform hover:scale-105"
                  title="Change avatar photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Name + Badges + Meta */}
            <div className="flex-1 mb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">
                  {editing ? (formData.name || user.name) : user.name}
                </h1>
                
                {user.verified && (
                  <span className="badge badge-verified text-[10px] flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-extrabold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified {isFarmer ? 'Farmer' : 'Buyer'}
                  </span>
                )}

                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                  isFarmer 
                    ? 'bg-blue-50 text-blue-800 border border-blue-200' 
                    : 'bg-slate-100 text-slate-800 border border-slate-300'
                }`}>
                  {isFarmer ? <GiWheat className="text-blue-600" /> : <FaShoppingCart className="text-slate-700" />}
                  {isFarmer ? 'Farmer' : 'Buyer / Trader'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {editing ? (formData.location || user.location) : user.location}
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Member since {user.joinedDate || 'Recently'}
                </span>
                {profileLastFetched && (
                  <>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-500" /> Synced with server
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons: Refresh, Edit, Save, Cancel, Logout */}
            <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={profileLoading}
                className="btn btn-outline btn-sm flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl"
                title="Fetch fresh profile data from backend server"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${profileLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              {editing ? (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={profileUpdating}
                    className="btn btn-primary btn-sm flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-xl shadow font-extrabold"
                  >
                    {profileUpdating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={profileUpdating}
                    className="btn btn-outline btn-sm flex items-center gap-1 px-3 py-1.5 text-xs rounded-xl"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="btn btn-primary btn-sm flex items-center gap-1.5 px-4 py-1.5 text-xs rounded-xl shadow font-extrabold"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              )}

              <button
                type="button"
                onClick={() => logout()}
                className="btn btn-sm bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-extrabold flex items-center gap-1 px-3 py-1.5 text-xs rounded-xl transition-colors"
                title="Log out of your account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── EDIT PROFILE MODAL (Inserts/Updates all fields to MongoDB) ───── */}
      {editing && (
        <div className="modal-overlay z-50" onClick={handleCancel}>
          <div className="modal-card max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-extrabold text-base leading-tight">Edit Profile & Account Details</h3>
                  <p className="text-[11px] text-slate-400">Updates will sync directly to MongoDB database.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar">
              
              {/* Account Role Selector */}
              <div>
                <label className="form-label mb-1.5 block">Account Role / Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, role: 'farmer' }))}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 font-extrabold text-xs transition-all ${
                      (formData.role || user.role) === 'farmer'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-100'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <GiWheat className="text-lg text-blue-600" /> Farmer Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, role: 'buyer' }))}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 font-extrabold text-xs transition-all ${
                      (formData.role || user.role) === 'buyer'
                        ? 'border-slate-900 bg-slate-100 text-slate-900 ring-2 ring-slate-200'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <FaShoppingCart className="text-lg text-slate-800" /> Buyer / Trader Account
                  </button>
                </div>
              </div>

              {/* Grid 2-col for Name & Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-group !mb-0">
                  <label className="form-label">Full Name *</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="form-input"
                  />
                </div>
                <div className="form-group !mb-0">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Location & Role-Specific Field */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="form-group !mb-0">
                  <label className="form-label">Trading Location / Mandi *</label>
                  <input
                    required
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    placeholder="e.g. Ludhiana Mandi, Punjab"
                    className="form-input"
                  />
                </div>

                {(formData.role || user.role) === 'farmer' ? (
                  <div className="form-group !mb-0">
                    <label className="form-label">Cultivation Area (Acres)</label>
                    <input
                      type="number"
                      name="acresCount"
                      value={formData.acresCount ?? ''}
                      onChange={handleChange}
                      placeholder="e.g. 25"
                      className="form-input"
                    />
                  </div>
                ) : (
                  <div className="form-group !mb-0">
                    <label className="form-label">Business / Enterprise Type</label>
                    <input
                      type="text"
                      name="businessType"
                      value={formData.businessType || ''}
                      onChange={handleChange}
                      placeholder="e.g. Grain Wholesale Merchant"
                      className="form-input"
                    />
                  </div>
                )}
              </div>

              {/* Avatar Selection */}
              <div className="form-group !mb-0 space-y-2">
                <label className="form-label">Profile Avatar Photo</label>
                <div className="flex items-center gap-3">
                  <Avatar name={formData.name || user.name} src={formData.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      name="avatar"
                      value={formData.avatar || ''}
                      onChange={handleChange}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="form-input text-xs"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Presets:</span>
                  {PRESET_AVATARS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatar: p.url }))}
                      className={`w-7 h-7 rounded-xl overflow-hidden border transition-all ${
                        formData.avatar === p.url ? 'border-blue-600 ring-2 ring-blue-200' : 'border-slate-200'
                      }`}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio / Description */}
              <div className="form-group !mb-0">
                <label className="form-label">Profile Bio / Description</label>
                <textarea
                  name="bio"
                  rows={3}
                  value={formData.bio || ''}
                  onChange={handleChange}
                  placeholder="Describe your farming produce, cultivation techniques, or trading operations..."
                  className="form-input resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={profileUpdating}
                  className="btn btn-outline btn-sm px-4 py-2 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileUpdating}
                  className="btn btn-primary btn-sm px-6 py-2.5 text-xs font-extrabold rounded-xl shadow-lg flex items-center gap-2"
                >
                  {profileUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving to MongoDB...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes to Database
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── Stats Strip ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Package, label: 'Total Orders',  value: orders.length,                                     color: 'from-blue-600 to-blue-800' },
          { icon: Gavel,   label: 'Active Bids',   value: userBids.length,                                   color: 'from-amber-500 to-amber-700' },
          { icon: Layers,  label: 'My Listings',   value: listings.length,                                   color: 'from-indigo-500 to-indigo-700' },
          { icon: Star,    label: 'Trust Rating',  value: user.rating ? `${user.rating} / 5.0` : '5.0 / 5.0', color: 'from-emerald-500 to-emerald-700' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-sm`}>
              <Icon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
              <p className="text-[10px] text-slate-400 font-bold mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Information Grid ─────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Column 1: Personal & Contact Information */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Personal & Contact Information
            </h2>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              Fetched from MongoDB
            </span>
          </div>

          <div>
            <InfoRow
              icon={User}
              label="Full Name"
              value={editing ? formData.name : user.name}
              editing={editing}
              name="name"
              onChange={handleChange}
              placeholder="e.g. Ramesh Kumar"
            />
            <InfoRow
              icon={Mail}
              label="Registered Email"
              value={user.email}
              editing={false}
              name="email"
              onChange={handleChange}
            />
            <InfoRow
              icon={Phone}
              label="Contact Phone"
              value={editing ? formData.phone : user.phone}
              editing={editing}
              name="phone"
              type="tel"
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
            />
            <InfoRow
              icon={MapPin}
              label="Trading Location / Mandi"
              value={editing ? formData.location : user.location}
              editing={editing}
              name="location"
              onChange={handleChange}
              placeholder="e.g. Ludhiana Mandi, Punjab"
            />
          </div>

          {/* Bio / Description */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <FileText className="w-3 h-3 text-slate-400" />
              Profile Bio / Description
            </p>
            {editing ? (
              <textarea
                name="bio"
                rows={3}
                value={formData.bio ?? ''}
                onChange={handleChange}
                placeholder="Share a brief overview of your farming produce or trade operations..."
                className="w-full text-xs font-semibold text-slate-800 bg-blue-50/50 border border-blue-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-2xl border border-slate-100">
                {user.bio || 'Dedicated agricultural participant on the Kheti-Connect direct farm trade platform.'}
              </p>
            )}
          </div>
        </div>

        {/* Column 2: Role Details & Account Security */}
        <div className="space-y-6">

          {/* Role-Specific Details Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                {isFarmer ? <GiWheat className="w-4 h-4 text-blue-600" /> : <Building className="w-4 h-4 text-slate-700" />}
                {isFarmer ? 'Farm & Cultivation Profile' : 'Enterprise & Trade Profile'}
              </h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Role Verified
              </span>
            </div>

            {isFarmer && (
              <div>
                <InfoRow
                  icon={GiWheat}
                  label="Cultivation Area (Acres)"
                  value={editing ? formData.acresCount : (user.acresCount ? `${user.acresCount} Acres` : '25 Acres')}
                  editing={editing}
                  name="acresCount"
                  type="number"
                  onChange={handleChange}
                  placeholder="e.g. 25"
                />
                <InfoRow
                  icon={Award}
                  label="Farming Method"
                  value="100% Residue-Free & Certified Organic"
                  editing={false}
                  name="organic"
                />
              </div>
            )}

            {!isFarmer && (
              <div>
                <InfoRow
                  icon={Briefcase}
                  label="Business / Trade Entity"
                  value={editing ? formData.businessType : (user.businessType || 'Grain & Produce Wholesaler')}
                  editing={editing}
                  name="businessType"
                  onChange={handleChange}
                  placeholder="e.g. Wholesale Grain Merchant"
                />
                <InfoRow
                  icon={ShieldCheck}
                  label="Buyer Verification"
                  value="APEDA & Mandi License Compliant"
                  editing={false}
                  name="compliance"
                />
              </div>
            )}
          </div>

          {/* Account & Trust Security */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
            <h2 className="text-sm font-black text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Account Security & Trust
            </h2>

            <div className="space-y-2.5">
              {[
                { label: 'Email Verified', status: true },
                { label: 'Identity & Aadhaar Verified', status: user.verified ?? true },
                { label: 'Escrow Payment Protection', status: true },
                { label: 'Direct Mandi Sync', status: true },
              ].map(({ label, status }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <p className="text-xs font-semibold text-slate-700">{label}</p>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    status ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {status ? <><CheckCircle2 className="w-2.5 h-2.5" /> Active</> : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Recent Bids & Marketplace Activity ────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Gavel className="w-4 h-4 text-amber-600" /> Recent Bidding Activity
          </h2>
          <span className="text-xs font-bold text-slate-400">
            {userBids.length} Active Bids Placed
          </span>
        </div>

        {userBids.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 font-semibold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No active bids placed yet. Explore crop listings in the Marketplace to start bidding.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {userBids.slice(0, 4).map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50/40 border border-slate-100 transition-colors">
                <div>
                  <p className="text-xs font-extrabold text-slate-900">{b.productTitle}</p>
                  <p className="text-[10px] text-slate-400">{b.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-amber-800">₹{b.amount?.toLocaleString()}</p>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
