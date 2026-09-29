import React, { useState } from 'react';
import { useKheti } from '../hooks/useKheti';
import { X, Gavel, Clock, CheckCircle2, History, TrendingUp } from 'lucide-react';

export default function BiddingModal() {
  const { biddingProduct, setBiddingProduct, placeBid, userProfile } = useKheti();
  const [custom, setCustom] = useState('');
  const [error, setError]   = useState('');
  if (!biddingProduct) return null;

  const current  = biddingProduct.currentHighestBid || biddingProduct.pricePerUnit;
  const minInc   = biddingProduct.minBidIncrement || 50;
  const minNext  = current + minInc;
  const bidAmt   = Number(custom) || minNext;

  const quickBid = inc => { setCustom(String(current + inc)); setError(''); };

  const handleBid = e => {
    e.preventDefault();
    if (bidAmt < minNext) { setError(`Minimum bid is ₹${minNext.toLocaleString()}`); return; }
    placeBid(biddingProduct.id, bidAmt, userProfile.name);
    setCustom(''); setError(''); setBiddingProduct(null);
  };
  const close = () => { setCustom(''); setError(''); setBiddingProduct(null); };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-card max-w-lg" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header-amber p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
              <Gavel className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Live Auction</h3>
              <p className="text-amber-100 text-xs line-clamp-1">{biddingProduct.title}</p>
            </div>
          </div>
          <button onClick={close} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {/* Current bid card */}
          <div className="rounded-2xl p-5 mb-5 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #fffbeb, #fef3c7)', border: '1.5px solid #fde68a' }}>
            <div>
              <p className="text-amber-800 text-xs font-bold uppercase tracking-wider mb-1">Current Highest Bid</p>
              <p className="text-4xl font-black text-amber-900">₹{current.toLocaleString()}</p>
              <p className="text-amber-700 text-xs font-semibold mt-1">/{biddingProduct.unit} · Min increment: ₹{minInc}</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-200/60 px-3 py-1.5 rounded-xl border border-amber-300 mb-2">
                <Clock className="w-3.5 h-3.5" /> Ends in 3 Days
              </div>
              <p className="text-slate-500 text-xs">{biddingProduct.totalBids || 0} bids placed</p>
            </div>
          </div>

          {/* Quick bid pills */}
          <div className="mb-5">
            <p className="form-label mb-2.5">Quick Bid Increase</p>
            <div className="grid grid-cols-3 gap-2">
              {[50, 100, 250].map(inc => (
                <button key={inc} type="button" onClick={() => quickBid(inc)}
                  className="py-2.5 rounded-xl bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-600 text-xs font-extrabold border border-slate-200 hover:border-amber-300 transition-all">
                  +₹{inc}<br />
                  <span className="font-bold text-[10px] opacity-70">→ ₹{(current + inc).toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom bid input */}
          <form onSubmit={handleBid} className="mb-5">
            <div className="form-group">
              <label className="form-label">Enter Custom Bid (₹/{biddingProduct.unit})</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-extrabold text-lg">₹</span>
                <input type="number" min={minNext} placeholder={String(minNext)} value={custom}
                  onChange={e => { setCustom(e.target.value); setError(''); }}
                  className="form-input pl-10 text-xl font-black text-amber-900 border-amber-200 focus:border-amber-500" />
              </div>
              {error && <p className="text-red-500 text-xs font-bold mt-1">{error}</p>}
            </div>
            <button type="submit" className="btn btn-amber w-full py-3.5 font-extrabold text-base rounded-2xl shadow-lg shadow-amber-700/20">
              <Gavel className="w-5 h-5" /> Submit Bid — ₹{bidAmt.toLocaleString()}
            </button>
          </form>

          {/* Bid History */}
          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <History className="w-3.5 h-3.5" /> Bid History
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {!biddingProduct.bidsHistory?.length ? (
                <p className="text-center text-xs text-slate-400 italic py-3">No bids yet — be the first!</p>
              ) : biddingProduct.bidsHistory.map((b, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{b.bidderName}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-black text-amber-800">₹{b.amount.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">{b.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
