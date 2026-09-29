import React, { useState } from 'react';
import { useKheti } from '../hooks/useKheti';
import { Package, Gavel, CheckCircle2, Clock, MapPin, FileText, Star, Printer } from 'lucide-react';

const TABS = [
  { id: 'orders', label: 'My Orders' },
  { id: 'bids',   label: 'Active Bids' },
  { id: 'listed', label: 'My Listings', farmerOnly: true },
];

export default function MyOrdersBids() {
  const { userRole, userProfile, products, orders, userBids } = useKheti();
  const [tab, setTab]       = useState('orders');
  const [receipt, setReceipt] = useState(null);

  const listings = products.filter(p => p.farmerId === userProfile.id || p.farmerName.includes('Ramesh'));
  const tabs = TABS.filter(t => !t.farmerOnly || userRole === 'farmer');

  return (
    <div className="py-6">

      {/* Profile hero */}
      <div className="relative rounded-3xl overflow-hidden mb-8 shadow-xl">
        {/* Background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #030712 0%, #0b1329 60%, #1e3a8a 100%)' }} />
        <div className="absolute inset-0 opacity-10" style={{ background: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1800) center/cover' }} />

        <div className="relative p-7 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Avatar + info */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <img src={userProfile.avatar} alt={userProfile.name}
                className="w-18 h-18 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-white/30 shadow-xl"
                style={{ width: 72, height: 72 }} />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-extrabold text-white">{userProfile.name}</h2>
                {userProfile.verified && (
                  <span className="badge badge-verified text-[10px] bg-blue-900/60 text-sky-300 border-blue-600">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified {userRole === 'farmer' ? 'Farmer' : 'Buyer'}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-blue-200 text-xs font-semibold">
                <span><MapPin className="w-3 h-3 inline mr-0.5" />{userProfile.location}</span>
                <span>Joined {userProfile.joinedDate}</span>
                <span><Star className="w-3 h-3 inline fill-blue-400 text-blue-400 mr-0.5" />{userProfile.rating} Rating</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-0 rounded-2xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-sm shrink-0">
            {[
              { val: orders.length,    label: 'Orders',   color: 'text-sky-300' },
              { val: userBids.length,  label: 'Bids',     color: 'text-blue-300' },
              { val: listings.length,  label: 'Listings', color: 'text-white' },
            ].map(({ val, label, color }, i) => (
              <div key={label} className={`px-6 py-4 text-center ${i < 2 ? 'border-r border-white/10' : ''}`}>
                <p className={`text-2xl font-black ${color}`}>{val}</p>
                <p className="text-[11px] text-white/50 font-bold uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-1 no-scrollbar overflow-x-auto">
        {tabs.map(t => {
          const count = t.id === 'orders' ? orders.length : t.id === 'bids' ? userBids.length : listings.length;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className={`tab-button flex items-center gap-2 ${tab === t.id ? 'active' : ''}`}>
              {t.label}
              <span className={`text-[11px] font-extrabold px-1.5 py-0.5 rounded-full ${tab === t.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Orders */}
      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? <Empty icon={<Package className="w-10 h-10" />} msg="No orders yet. Complete a purchase to see your receipts here." /> :
            orders.map(o => (
              <div key={o.orderId} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-blue-200 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700 shrink-0 border border-blue-100"><Package className="w-6 h-6" /></div>
                  <div>
                    <p className="font-extrabold text-slate-900 text-sm flex items-center gap-2 flex-wrap">
                      {o.productTitle}
                      <span className="badge badge-verified text-[10px]"><CheckCircle2 className="w-3 h-3" /> {o.status}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">#{o.orderId} · {o.date}</p>
                    <p className="text-xs text-slate-600 mt-0.5">{o.farmerName} · {o.quantity} {o.unit}s</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto">
                  <p className="text-xl font-black text-slate-900 mr-auto">₹{o.totalAmount.toLocaleString()}</p>
                  <button onClick={() => setReceipt(o)} className="btn btn-outline btn-sm">
                    <FileText className="w-3.5 h-3.5" /> Receipt
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Bids */}
      {tab === 'bids' && (
        <div className="space-y-4">
          {userBids.length === 0 ? <Empty icon={<Gavel className="w-10 h-10" />} msg="No active bids. Place bids on auction listings to track them here." /> :
            userBids.map(b => (
              <div key={b.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-blue-200 transition-colors">
                <div>
                  <p className="font-extrabold text-slate-900 text-sm flex items-center gap-2 flex-wrap">
                    {b.productTitle}
                    <span className="badge badge-black text-[10px]"><Clock className="w-3 h-3" /> Auction</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{b.time}</p>
                </div>
                <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto">
                  <p className="text-xl font-black text-slate-900 mr-auto">₹{b.amount.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/{b.unit}</span></p>
                  <span className="badge badge-blue"><CheckCircle2 className="w-3.5 h-3.5" /> Highest Bidder</span>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Listings */}
      {tab === 'listed' && (
        listings.length === 0 ? <Empty icon={<Package className="w-10 h-10 text-slate-300" />} msg="No listings yet. Click 'List Crop' to publish your first produce." /> :
        <div className="grid-responsive">
          {listings.map(p => (
            <div key={p.id} className="crop-card">
              <div className="crop-card-img-wrapper h-44">
                <img src={p.image} alt={p.title} className="crop-card-img" />
                <div className="card-img-scrim" />
                <span className="absolute top-3 left-3 badge badge-verified">Active</span>
              </div>
              <div className="p-4">
                <p className="font-extrabold text-slate-900 text-sm line-clamp-1 mb-1">{p.title}</p>
                <p className="text-base font-black text-blue-600">₹{(p.currentHighestBid || p.pricePerUnit).toLocaleString()} / {p.unit}</p>
                <p className="text-xs text-slate-400 mt-0.5">{p.availableQuantity} {p.unit}s available</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Receipt modal */}
      {receipt && (
        <div className="modal-overlay" onClick={() => setReceipt(null)}>
          <div className="modal-card max-w-md" onClick={e => e.stopPropagation()}>
            <div className="modal-header-blue p-6 text-center">
              <div className="w-14 h-14 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-extrabold text-white text-xl">Tax Invoice</h3>
              <p className="text-sky-200 text-xs mt-0.5">Kheti-Connect · #{receipt.orderId} · {receipt.date}</p>
            </div>
            <div className="p-6">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs space-y-2 mb-5">
                <div className="flex justify-between text-slate-600"><span className="max-w-[65%]">{receipt.productTitle} ({receipt.quantity} {receipt.unit}s)</span><span>₹{receipt.subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-slate-500"><span>Escrow Fee (1%)</span><span>₹{receipt.platformFee.toLocaleString()}</span></div>
                <div className="flex justify-between font-black text-sm text-slate-900 pt-2 border-t border-slate-200"><span>Total Paid</span><span>₹{receipt.totalAmount.toLocaleString()}</span></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="btn btn-outline flex-1 text-sm"><Printer className="w-4 h-4" /> Print</button>
                <button onClick={() => setReceipt(null)} className="btn btn-primary flex-1 text-sm font-extrabold">Done</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Empty({ icon, msg }) {
  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div className="text-slate-200 flex justify-center mb-4">{icon}</div>
      <p className="text-sm text-slate-500 max-w-xs mx-auto">{msg}</p>
    </div>
  );
}
