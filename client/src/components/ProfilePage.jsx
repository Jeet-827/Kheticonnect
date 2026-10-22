import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { FaSignOutAlt, FaEdit } from 'react-icons/fa';
import { login, logout } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const { orders, userBids, myProducts } = useSelector((state) => state.marketplace);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const isFarmer = user?.role === 'farmer';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const startEdit = () => {
    setForm({
      name: user.name || '',
      phone: user.phone || '',
      location: user.location || '',
      bio: user.bio || '',
      acresCount: user.acresCount || '',
      businessType: user.businessType || '',
    });
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put('/api/auth/me', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!data.success) throw new Error(data.message);
      dispatch(login({ user: data.user, token })); // update the saved user
      dispatch(showToast({ message: 'Profile updated!', type: 'success' }));
      setEditing(false);
    } catch (err) {
      dispatch(showToast({ message: err.response?.data?.message || err.message, type: 'error' }));
    }
  };

  if (!user) return null;

  return (
    <div className="py-6 max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white text-2xl font-black flex items-center justify-center">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">{user.name}</h1>
            <p className="text-xs text-slate-500">{isFarmer ? 'Farmer' : 'Buyer / Trader'} · {user.location}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!editing && (
            <button onClick={startEdit} className="btn btn-primary btn-sm">
              <FaEdit /> Edit
            </button>
          )}
          <button onClick={() => dispatch(logout())} className="btn btn-outline btn-sm">
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          ['Orders', orders.length],
          ['Bids', userBids.length],
          ['Listings', myProducts.length],
        ].map(([label, count]) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-4">
            <p className="text-xl font-black text-slate-900">{count}</p>
            <p className="text-[11px] text-slate-400 font-bold">{label}</p>
          </div>
        ))}
      </div>

      {/* Details / Edit form */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        {editing ? (
          <form onSubmit={handleSave} className="space-y-3">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required className="form-input" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="form-input" />
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required className="form-input" />
            {isFarmer ? (
              <input name="acresCount" type="number" value={form.acresCount} onChange={handleChange} placeholder="Farm size (acres)" className="form-input" />
            ) : (
              <input name="businessType" value={form.businessType} onChange={handleChange} placeholder="Business type" className="form-input" />
            )}
            <textarea name="bio" rows={3} value={form.bio} onChange={handleChange} placeholder="About you" className="form-input" />
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditing(false)} className="btn btn-outline flex-1">Cancel</button>
              <button type="submit" className="btn btn-primary flex-1 font-extrabold">Save</button>
            </div>
          </form>
        ) : (
          <dl className="space-y-3 text-sm">
            {[
              ['Email', user.email],
              ['Phone', user.phone],
              ['Location', user.location],
              isFarmer ? ['Farm size', user.acresCount && `${user.acresCount} acres`] : ['Business', user.businessType],
              ['About', user.bio],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-2 last:border-0">
                <dt className="text-slate-400 font-bold">{label}</dt>
                <dd className="text-slate-900 font-semibold text-right">{value || '—'}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </div>
  );
}