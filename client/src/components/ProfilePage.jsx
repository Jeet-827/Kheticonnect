import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, updateProfile, updateUserProfile } from '../store/slices/authSlice';
import { selectUserRole } from '../store/slices/uiSlice';
import { selectOrders, selectUserBids, selectProducts } from '../store/slices/marketplaceSlice';
import { showToast, clearToast } from '../store/slices/uiSlice';
import {
  User, Mail, Phone, MapPin, Star, CheckCircle2, Edit3, Save, X,
  Package, Gavel, Layers, ShieldCheck, Calendar, Award, Camera
} from 'lucide-react';
import { GiWheat } from 'react-icons/gi';
import { FaShoppingCart } from 'react-icons/fa';

// ─── Avatar Generator (initials) ─────────────────────────────────────────────
function Avatar({ name, src, size = 'lg' }) {
  const sz = size === 'lg' ? 'w-24 h-24 text-3xl' : 'w-12 h-12 text-base';
  if (src && !src.includes('unsplash') === false) {
    return (
      <img src={src} alt={name} className={`${sz} rounded-3xl object-cover border-4 border-white shadow-xl`} />
    );
  }
  return (
    <div className={`${sz} rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-950 flex items-center justify-center text-white font-black shadow-xl border-4 border-white`}>
      {name?.charAt(0) || 'U'}
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, editing, name, onChange }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
        {editing ? (
          <input
            name={name}
            defaultValue={value}
            onChange={onChange}
            className="w-full text-sm font-semibold text-slate-900 bg-emerald-50 border border-emerald-300 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        ) : (
          <p className="text-sm font-semibold text-slate-900 truncate">{value || '—'}</p>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const dispatch   = useDispatch();
  const user       = useSelector(selectUser);
  const userRole   = useSelector(selectUserRole);
  const orders     = useSelector(selectOrders);
  const userBids   = useSelector(selectUserBids);
  const products   = useSelector(selectProducts);

  const [editing, setEditing]     = useState(false);
  const [formData, setFormData]   = useState({});

  const listings = products.filter(p =>
    p.farmerId === user?.id || p.farmerName?.includes(user?.name?.split(' ')[0] || '')
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (Object.keys(formData).length > 0) {
      dispatch(updateUserProfile(formData));
      dispatch(showToast({ message: 'Profile updated & synced with backend!', type: 'success' }));
      setTimeout(() => dispatch(clearToast()), 3500);
    }
    setEditing(false);
    setFormData({});
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({});
  };

  if (!user) {
    return (
      <div className="text-center py-24">
        <User className="w-12 h-12 text-slate-200 mx-auto mb-3" />
        <p className="text-slate-400 text-sm">Please log in to view your profile.</p>
      </div>
    );
  }

  const isFarmer = userRole === 'farmer';

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">

      {/* ── Profile Hero ──────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl">
        {/* Background */}
        <div className="h-32 w-full" style={{ background: 'linear-gradient(135deg, #021a0a 0%, #063320 55%, #0f5132 100%)' }} />
        <div className="absolute inset-0 h-32 opacity-10" style={{ background: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1800) center/cover' }} />

        {/* Profile card */}
        <div className="bg-white px-7 pb-7 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-12">
            {/* Avatar */}
            <div className="relative">
              <Avatar name={user.name} src={user.avatar} size="lg" />
              {editing && (
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              )}
            </div>

            {/* Name + badges */}
            <div className="flex-1 mb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">{user.name}</h1>
                {user.verified && (
                  <span className="badge badge-verified text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified {isFarmer ? 'Farmer' : 'Buyer'}
                  </span>
                )}
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 ${isFarmer ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                  {isFarmer ? <GiWheat /> : <FaShoppingCart />} {isFarmer ? 'Farmer' : 'Buyer'}
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> {user.location}
                <span className="text-slate-300">·</span>
                <Calendar className="w-3.5 h-3.5" /> Joined {user.joinedDate || 'Recently'}
              </p>
            </div>

            {/* Edit / Save buttons */}
            <div className="flex gap-2 shrink-0">
              {editing ? (
                <>
                  <button onClick={handleSave} className="btn btn-primary btn-sm">
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                  <button onClick={handleCancel} className="btn btn-outline btn-sm">
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="btn btn-outline btn-sm">
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Strip ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Package, label: 'Total Orders', value: orders.length, color: 'from-emerald-600 to-emerald-800' },
          { icon: Gavel,   label: 'Active Bids',  value: userBids.length, color: 'from-amber-500 to-amber-700' },
          { icon: Layers,  label: 'My Listings',  value: listings.length, color: 'from-blue-500 to-blue-700' },
          { icon: Star,    label: 'Rating',        value: user.rating ? `${user.rating} / 5.0` : '5.0 / 5.0', color: 'from-violet-500 to-violet-700' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
              <Icon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Grid ─────────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Personal Info */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-700" /> Personal Information
          </h2>
          <InfoRow icon={User}    label="Full Name"  value={formData.name ?? user.name}     editing={editing} name="name"     onChange={handleChange} />
          <InfoRow icon={Mail}    label="Email"      value={user.email}                      editing={false}   name="email"   onChange={handleChange} />
          <InfoRow icon={Phone}   label="Phone"      value={formData.phone ?? user.phone}    editing={editing} name="phone"   onChange={handleChange} />
          <InfoRow icon={MapPin}  label="Location"   value={formData.location ?? user.location} editing={editing} name="location" onChange={handleChange} />
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" /> Account & Security
          </h2>

          <div className="space-y-3">
            {[
              { label: 'Email Verified', status: true },
              { label: 'Identity Verified', status: user.verified },
              { label: 'Escrow Enabled', status: true },
              { label: '2FA Authentication', status: false },
            ].map(({ label, status }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                <p className="text-sm font-semibold text-slate-700">{label}</p>
                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                  status ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400'
                }`}>
                  {status ? <><CheckCircle2 className="w-2.5 h-2.5" /> Active</> : 'Inactive'}
                </span>
              </div>
            ))}
          </div>

          <button className="mt-4 btn btn-outline btn-sm w-full font-bold text-red-600 border-red-200 hover:bg-red-50">
            Change Password
          </button>
        </div>
      </div>

      {/* ── Recent Bids ───────────────────────────────────────────────────── */}
      {userBids.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <Gavel className="w-4 h-4 text-amber-600" /> Recent Bids
          </h2>
          <div className="space-y-2">
            {userBids.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/50 transition-colors">
                <div>
                  <p className="text-xs font-extrabold text-slate-900">{b.productTitle}</p>
                  <p className="text-[10px] text-slate-400">{b.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-amber-800">₹{b.amount?.toLocaleString()}</p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
