import React from 'react';
import { useKheti } from '../hooks/useKheti';
import { ShoppingBag, X, ArrowRight } from 'lucide-react';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, orders, userBids, setActiveTab } = useKheti();
  if (!isCartOpen) return null;

  return (
    <div className="modal-overlay justify-end items-stretch p-0" onClick={() => setIsCartOpen(false)} style={{ padding: 0 }}>
      <div className="bg-white w-full max-w-sm h-full flex flex-col shadow-2xl animate-none" style={{ animation: 'slideLeft .3s cubic-bezier(.16,1,.3,1)' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-sm">Activity</p>
              <p className="text-[11px] text-slate-400">{orders.length + userBids.length} items</p>
            </div>
          </div>
          <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Bids */}
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">Active Bids ({userBids.length})</p>
            {userBids.length === 0
              ? <p className="text-xs text-slate-400 italic bg-slate-50 p-3.5 rounded-2xl border border-slate-100">No bids placed yet.</p>
              : <div className="space-y-2">
                  {userBids.map(b => (
                    <div key={b.id} className="p-3.5 bg-amber-50 rounded-2xl border border-amber-100">
                      <p className="font-extrabold text-slate-900 text-xs line-clamp-1 mb-1">{b.productTitle}</p>
                      <p className="text-amber-800 font-black text-sm">₹{b.amount.toLocaleString()}/{b.unit}</p>
                    </div>
                  ))}
                </div>
            }
          </div>

          {/* Orders */}
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-3">Completed Orders ({orders.length})</p>
            {orders.length === 0
              ? <p className="text-xs text-slate-400 italic bg-slate-50 p-3.5 rounded-2xl border border-slate-100">No completed orders yet.</p>
              : <div className="space-y-2">
                  {orders.map(o => (
                    <div key={o.orderId} className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <p className="font-extrabold text-slate-900 text-xs line-clamp-1 mb-1">{o.productTitle}</p>
                      <p className="text-emerald-800 font-black text-sm">₹{o.totalAmount.toLocaleString()} · {o.quantity} {o.unit}s</p>
                    </div>
                  ))}
                </div>
            }
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100">
          <button onClick={() => { setIsCartOpen(false); setActiveTab('orders'); }} className="btn btn-primary w-full font-extrabold">
            Go to Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
