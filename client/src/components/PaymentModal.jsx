import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes } from 'react-icons/fa';
import { setUI, showToast } from '../store/slices/uiSlice';
import { placeOrder } from '../store/slices/marketplaceSlice';

export default function PaymentModal() {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.ui.buyingProduct);
  const [qty, setQty] = useState('');
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const quantity = Number(qty) || product.minOrderQuantity || 1;
  const price = product.pricePerUnit || product.currentHighestBid;
  const total = price * quantity;

  const close = () => {
    setQty('');
    dispatch(setUI({ buyingProduct: null }));
  };

  const handleBuy = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(placeOrder({ productId: product._id || product.id, quantity })).unwrap();
      dispatch(showToast({ message: 'Order placed successfully!', type: 'success' }));
      close();
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Failed to place order', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal-card max-w-md" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleBuy} className="p-6 space-y-4">

          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900">Buy Now</h3>
            <button type="button" onClick={close} className="text-slate-400 hover:text-slate-600">
              <FaTimes />
            </button>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <img src={product.image} alt="" className="w-14 h-14 rounded-xl object-cover" />
            <div>
              <p className="font-extrabold text-slate-900 text-sm line-clamp-1">{product.title}</p>
              <p className="text-xs text-slate-500">Seller: {product.farmerName}</p>
              <p className="text-xs font-bold text-emerald-800">
                ₹{price.toLocaleString()} / {product.unit}
              </p>
            </div>
          </div>

          <div>
            <label className="form-label">
              Quantity ({product.unit}s) · Max {product.availableQuantity}
            </label>
            <input
              type="number"
              min={product.minOrderQuantity || 1}
              max={product.availableQuantity}
              value={qty}
              placeholder={String(product.minOrderQuantity || 1)}
              onChange={(e) => setQty(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="flex justify-between font-extrabold text-lg text-slate-900 pt-3 border-t border-slate-200">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 font-extrabold">
            {loading ? 'Placing order...' : `Confirm Order — ₹${total.toLocaleString()}`}
          </button>
        </form>
      </div>
    </div>
  );
}