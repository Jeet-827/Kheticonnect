import React, { useState } from 'react';
import { useKheti } from '../hooks/useKheti';
import { X, Sprout, Check, ChevronRight } from 'lucide-react';

const PRESETS = [
  { label: 'Wheat',    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop' },
  { label: 'Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop' },
  { label: 'Rice',     url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop' },
  { label: 'Mango',    url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop' },
  { label: 'Potato',   url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=800&auto=format&fit=crop' },
  { label: 'Cotton',   url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?q=80&w=800&auto=format&fit=crop' },
];

const BLANK = {
  title: '', category: 'Grains', unit: 'Quintal',
  availableQuantity: 50, minOrderQuantity: 5,
  pricePerUnit: 2200, listingType: 'fixed',
  isOrganic: true, harvestDate: '2026-08-15', description: '',
  image: PRESETS[0].url,
};

export default function AddProductModal() {
  const { isAddModalOpen, setIsAddModalOpen, userProfile, addProduct } = useKheti();
  const [form, setForm] = useState(BLANK);
  if (!isAddModalOpen) return null;

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const tog = k => () => setForm(p => ({ ...p, [k]: !p[k] }));

  const handleClose = () => { setForm(BLANK); setIsAddModalOpen(false); };
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addProduct({
      id: `crop-${Date.now()}`,
      ...form,
      farmerId: userProfile.id,
      farmerName: userProfile.name,
      farmerLocation: userProfile.location,
      farmerRating: userProfile.rating,
      farmerReviewsCount: 1,
      isVerifiedFarmer: userProfile.verified,
      pricePerUnit: +form.pricePerUnit,
      availableQuantity: +form.availableQuantity,
      minOrderQuantity: +form.minOrderQuantity,
      currentHighestBid: form.listingType === 'auction' ? +form.pricePerUnit : null,
      minBidIncrement: form.listingType === 'auction' ? 50 : null,
      auctionEndsAt: form.listingType === 'auction' ? new Date(Date.now() + 5 * 86400000).toISOString() : null,
      totalBids: 0, bidsHistory: [],
      description: form.description || 'Premium quality agricultural produce from verified Indian farm.',
    });
    handleClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card max-w-xl" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header-green p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <Sprout className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">List New Produce</h3>
              <p className="text-emerald-200 text-xs">Reach thousands of verified buyers instantly</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">

          <div className="form-group">
            <label className="form-label">Crop / Produce Name *</label>
            <input required type="text" value={form.title} onChange={set('title')}
              placeholder="e.g. Organic Punjab Sharbati Wheat Grade A"
              className="form-input" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select value={form.category} onChange={set('category')} className="form-select">
                {['Grains','Vegetables','Fruits','Pulses','Cash Crops','Spices'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Unit</label>
              <select value={form.unit} onChange={set('unit')} className="form-select">
                {['Quintal','Kg','Ton','Box (12 Pcs)'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[['Total Qty', 'availableQuantity'],['Min. Order', 'minOrderQuantity'],['Price (₹)', 'pricePerUnit']].map(([l, k]) => (
              <div key={k} className="form-group">
                <label className="form-label">{l}</label>
                <input type="number" min="1" required value={form[k]} onChange={set(k)} className="form-input" />
              </div>
            ))}
          </div>

          {/* Selling model + organic */}
          <div className="flex gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-5">
            <div className="flex-1">
              <p className="form-label mb-2">Selling Model</p>
              <div className="flex gap-2">
                {[['fixed','Fixed Price'],['auction','Live Auction']].map(([v,l]) => (
                  <button key={v} type="button" onClick={() => setForm(p => ({...p,listingType:v}))}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-extrabold border transition-all ${form.listingType===v ? (v==='auction'?'bg-amber-600 border-amber-600 text-white':'bg-emerald-700 border-emerald-700 text-white') : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-end pb-1">
              <div className="toggle-wrap" onClick={tog('isOrganic')}>
                <div className={`toggle-track ${form.isOrganic ? 'on' : 'off'}`}><div className="toggle-thumb"/></div>
                <span className={`text-xs font-bold ${form.isOrganic ? 'text-emerald-700' : 'text-slate-500'}`}>Organic</span>
              </div>
            </div>
          </div>

          {/* Image picker */}
          <div className="form-group">
            <label className="form-label">Crop Photo</label>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map(({ label, url }) => (
                <button key={label} type="button" onClick={() => setForm(p => ({...p,image:url}))}
                  className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all ${form.image===url?'border-emerald-600 ring-2 ring-emerald-200':'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={url} alt={label} className="w-full h-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] text-center py-0.5">{label}</span>
                  {form.image===url && <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white"/></div>}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Quality Description</label>
            <textarea rows="3" value={form.description} onChange={set('description')}
              placeholder="Moisture content, grading, storage conditions..."
              className="form-textarea" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={handleClose} className="btn btn-outline flex-1">Cancel</button>
            <button type="submit" className="btn btn-primary flex-1 font-extrabold">
              <Sprout className="w-4 h-4" /> Publish Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
