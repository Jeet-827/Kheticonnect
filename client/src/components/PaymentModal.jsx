import React, { useState } from 'react';
import { useKheti } from '../hooks/useKheti';
import { X, ShieldCheck, CreditCard, QrCode, Building2, Truck, CheckCircle2, Printer, Lock, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const METHODS = [
  { id: 'upi',  Icon: QrCode,    label: 'UPI / QR',   sub: 'Instant transfer' },
  { id: 'card', Icon: CreditCard, label: 'Card',        sub: 'Debit / Credit'  },
  { id: 'bank', Icon: Building2,  label: 'Net Banking',  sub: 'NEFT / RTGS'    },
  { id: 'cod',  Icon: Truck,      label: 'Pay on Delivery', sub: 'At Mandi'    },
];

export default function PaymentModal() {
  const { buyingProduct, setBuyingProduct, confirmPayment } = useKheti();
  const [qty, setQty]         = useState(null);
  const [method, setMethod]   = useState('upi');
  const [address, setAddress] = useState('Plot 45, Azadpur Mandi, Delhi - 110033');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  if (!buyingProduct) return null;

  const q     = qty ?? buyingProduct.minOrderQuantity ?? 10;
  const price = buyingProduct.pricePerUnit || buyingProduct.currentHighestBid;
  const sub   = price * q;
  const fee   = Math.round(sub * 0.01);
  const total = sub + fee;

  const handlePay = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      try { confetti({ particleCount: 100, spread: 80, origin: { y: 0.55 } }); } catch {}
      const order = {
        orderId: `KC-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        productTitle: buyingProduct.title, farmerName: buyingProduct.farmerName,
        farmerLocation: buyingProduct.farmerLocation,
        quantity: q, unit: buyingProduct.unit, unitPrice: price,
        subtotal: sub, platformFee: fee, totalAmount: total,
        paymentMethod: method.toUpperCase(), deliveryAddress: address,
        status: 'Confirmed — Preparing Dispatch',
      };
      confirmPayment(order);
      setReceipt(order);
    }, 1400);
  };

  const close = () => { setBuyingProduct(null); setReceipt(null); setQty(null); setLoading(false); };

  if (receipt) return <Receipt receipt={receipt} onClose={close} />;

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-card max-w-xl" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header-green p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Secure Checkout</h3>
              <p className="text-emerald-200 text-xs">100% Escrow-protected payment</p>
            </div>
          </div>
          <button onClick={close} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handlePay} className="p-6 space-y-5">
          {/* Mini product card */}
          <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <img src={buyingProduct.image} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
            <div className="min-w-0">
              <p className="font-extrabold text-slate-900 text-sm line-clamp-1">{buyingProduct.title}</p>
              <p className="text-xs text-slate-500 mt-0.5">Seller: {buyingProduct.farmerName}</p>
              <p className="text-xs font-extrabold text-emerald-800">₹{price.toLocaleString()} / {buyingProduct.unit}</p>
            </div>
          </div>

          {/* Qty */}
          <div className="form-group !mb-0">
            <label className="form-label flex justify-between">
              <span>Order Quantity ({buyingProduct.unit}s)</span>
              <span className="text-slate-400 normal-case tracking-normal">Max: {buyingProduct.availableQuantity}</span>
            </label>
            <input type="number" min={buyingProduct.minOrderQuantity || 1} max={buyingProduct.availableQuantity}
              value={q} onChange={e => setQty(Math.max(1, +e.target.value))} className="form-input font-extrabold text-lg" />
          </div>

          {/* Address */}
          <div className="form-group !mb-0">
            <label className="form-label">Delivery Address</label>
            <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="form-input text-sm" />
          </div>

          {/* Payment method */}
          <div>
            <p className="form-label mb-2.5">Payment Method</p>
            <div className="grid grid-cols-2 gap-2">
              {METHODS.map(({ id, Icon, label, sub }) => (
                <button key={id} type="button" onClick={() => setMethod(id)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${method === id ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-100' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${method === id ? 'bg-emerald-700' : 'bg-slate-100'}`}>
                    <Icon className={`w-4.5 h-4.5 ${method === id ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  <div>
                    <p className={`text-xs font-extrabold ${method === id ? 'text-emerald-900' : 'text-slate-800'}`}>{label}</p>
                    <p className="text-[10px] text-slate-400">{sub}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600"><span>{q} {buyingProduct.unit}s × ₹{price.toLocaleString()}</span><span>₹{sub.toLocaleString()}</span></div>
            <div className="flex justify-between text-slate-500 text-xs"><span>Escrow guarantee fee (1%)</span><span>₹{fee.toLocaleString()}</span></div>
            <div className="flex justify-between font-extrabold text-emerald-800 text-base pt-2 border-t border-slate-200">
              <span>Total Payable</span><span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full py-4 font-extrabold text-base rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2">
            {loading
              ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing Securely...</>
              : <><Lock className="w-5 h-5" /> Pay ₹{total.toLocaleString()} Securely</>
            }
          </button>
        </form>
      </div>
    </div>
  );
}

function Receipt({ receipt, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card max-w-lg p-0 overflow-hidden" onClick={e => e.stopPropagation()}>

        {/* Green header */}
        <div className="modal-header-green p-7 text-center">
          <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-9 h-9 text-emerald-300" />
          </div>
          <h2 className="text-2xl font-black text-white mb-1">Payment Successful!</h2>
          <p className="text-emerald-200 text-sm">Order #{receipt.orderId} · {receipt.date}</p>
        </div>

        <div className="p-6">
          {/* Breakdown */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs space-y-2 mb-5">
            <div className="flex justify-between text-slate-600">
              <span className="max-w-[70%]">{receipt.productTitle} ({receipt.quantity} {receipt.unit}s)</span>
              <span>₹{receipt.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500"><span>Escrow Fee (1%)</span><span>₹{receipt.platformFee.toLocaleString()}</span></div>
            <div className="flex justify-between font-black text-emerald-800 text-sm pt-2 border-t border-slate-200">
              <span>Total Paid</span><span>₹{receipt.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100">
              <p className="font-extrabold text-emerald-900 mb-1">Seller</p>
              <p className="font-semibold text-slate-800">{receipt.farmerName}</p>
              <p className="text-slate-500">{receipt.farmerLocation}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <p className="font-extrabold text-slate-800 mb-1">Delivery To</p>
              <p className="text-slate-600 leading-relaxed">{receipt.deliveryAddress}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => window.print()} className="btn btn-outline flex-1 text-sm">
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
            <button onClick={onClose} className="btn btn-primary flex-1 text-sm font-extrabold">Done</button>
          </div>
        </div>
      </div>
    </div>
  );
}
