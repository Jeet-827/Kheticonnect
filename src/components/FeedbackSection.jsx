import React, { useState } from 'react';
import { useKheti } from '../hooks/useKheti';
import { Star, ShieldCheck, PlusCircle, CheckCircle2, X } from 'lucide-react';

export default function FeedbackSection() {
  const { reviews, addReview, searchTerm, setSearchTerm } = useKheti();
  const [open, setOpen]   = useState(false);
  const [crop, setCrop]   = useState('Organic Sharbati Wheat');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const sq = searchTerm.trim().toLowerCase();
  const filteredReviews = reviews.filter(r =>
    !sq || r.buyerName.toLowerCase().includes(sq) || r.cropTitle.toLowerCase().includes(sq) || r.comment.toLowerCase().includes(sq)
  );

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1)).toFixed(1);

  const submit = e => {
    e.preventDefault();
    if (!comment.trim()) return;
    addReview({ id: `r-${Date.now()}`, buyerName: 'Ankit Gupta (Delhi Wholesaler)', rating: +rating, date: new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }), cropTitle: crop, comment, verifiedPurchase: true });
    setComment(''); setOpen(false);
  };

  const DIST = [['5 Star','82%','bg-emerald-600'],['4 Star','13%','bg-emerald-400'],['3 Star','4%','bg-amber-400'],['2 Star','1%','bg-slate-300']];

  return (
    <div className="py-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="section-eyebrow">Trust &amp; Transparency</div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Reviews &amp; Feedback</h2>
          <p className="text-sm text-slate-500 mt-1">Verified purchase reviews from real buyers and sellers.</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn btn-amber shadow-lg shadow-amber-700/20">
          <PlusCircle className="w-4 h-4" /> Write Review
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        {/* Score */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col items-center justify-center shadow-sm text-center">
          <p className="text-6xl font-black text-slate-900 mb-2">{avg}</p>
          <div className="flex gap-0.5 mb-2">
            {[1,2,3,4,5].map(s => <Star key={s} className="w-5 h-5 text-amber-500 fill-amber-500" />)}
          </div>
          <p className="text-xs text-slate-500 font-semibold">Based on {reviews.length} verified transactions</p>
        </div>

        {/* Distribution */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-center space-y-3">
          {DIST.map(([label, pct, cls]) => (
            <div key={label} className="flex items-center gap-3 text-xs">
              <span className="font-extrabold text-slate-600 w-12 shrink-0">{label}</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${cls}`} style={{ width: pct }} />
              </div>
              <span className="text-slate-400 font-semibold w-8 text-right">{pct}</span>
            </div>
          ))}
        </div>

        {/* Escrow trust card */}
        <div className="rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, #021a0a 0%, #063320 100%)' }}>
          <div>
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <h4 className="font-extrabold text-base mb-2">Escrow Payment Protection</h4>
            <p className="text-emerald-200/75 text-xs leading-relaxed">
              Funds are held in escrow and only released after quality inspection at delivery point. Zero fraud, guaranteed.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-5 text-sm font-bold text-emerald-300">
            <CheckCircle2 className="w-4 h-4" /> 0% Fraud Rate · ₹48 Cr Protected
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <h3 className="text-lg font-extrabold text-slate-900 mb-4 flex items-center justify-between">
        <span>Verified Buyer Reviews</span>
        {searchTerm && <span className="text-xs font-bold text-emerald-700">Filtering: "{searchTerm}" <button onClick={() => setSearchTerm('')} className="hover:text-red-600">x</button></span>}
      </h3>
      <div className="grid gap-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
            <p className="text-sm font-extrabold text-slate-700">No reviews match "{searchTerm}"</p>
            <button onClick={() => setSearchTerm('')} className="mt-2 text-xs font-bold text-emerald-700 hover:underline">Clear Search</button>
          </div>
        ) : filteredReviews.map(r => (
          <div key={r.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-extrabold shrink-0 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #0f5132, #052e16)' }}>
                  {r.buyerName.charAt(0)}
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                    {r.buyerName}
                    {r.verifiedPurchase && <span className="badge badge-green text-[9px]">Verified</span>}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    For: <strong className="text-slate-700">{r.cropTitle}</strong> · {r.date}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5 shrink-0">
                {[...Array(r.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />)}
                {[...Array(5 - r.rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-slate-200" />)}
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
              "{r.comment}"
            </p>
          </div>
        ))}
      </div>

      {/* Review modal */}
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-card max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header-amber p-5 flex items-center justify-between">
              <h3 className="font-extrabold text-white">Write a Review</h3>
              <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"><X className="w-4 h-4"/></button>
            </div>
            <form onSubmit={submit} className="p-6 space-y-4">
              <div className="form-group">
                <label className="form-label">Crop Purchased</label>
                <input type="text" required value={crop} onChange={e => setCrop(e.target.value)} className="form-input" />
              </div>
              <div className="form-group">
                <label className="form-label">Your Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setRating(n)}
                      className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-extrabold transition-all ${rating >= n ? 'bg-amber-50 border-amber-400 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                      {n} Star
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Your Review *</label>
                <textarea required rows="4" value={comment} onChange={e => setComment(e.target.value)}
                  placeholder="Quality, delivery speed, packaging, overall experience..."
                  className="form-textarea" />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setOpen(false)} className="btn btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn btn-amber flex-1 font-extrabold">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
