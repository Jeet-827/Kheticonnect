import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaBoxOpen, FaGavel } from 'react-icons/fa';
import { fetchMyOrders, fetchMyProducts } from '../store/slices/marketplaceSlice';

export default function MyOrdersBids() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { orders, userBids, myProducts } = useSelector((state) => state.marketplace);

  const isFarmer = user?.role === 'farmer';
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    dispatch(fetchMyOrders());
    if (isFarmer) dispatch(fetchMyProducts());
  }, [dispatch, isFarmer]);

  const tabs = [
    ['orders', 'My Orders', orders.length],
    ['bids', 'My Bids', userBids.length],
    ...(isFarmer ? [['listed', 'My Listings', myProducts.length]] : []),
  ];

  return (
    <div className="py-6">
      <h1 className="text-2xl font-black text-slate-900 mb-1">Hello, {user?.name}</h1>
      <p className="text-sm text-slate-500 mb-5">Your orders, bids and listings.</p>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-1">
        {tabs.map(([id, label, count]) => (
          <button key={id} onClick={() => setTab(id)} className={`tab-button ${tab === id ? 'active' : ''}`}>
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Orders */}
      {tab === 'orders' && (
        <List items={orders} icon={<FaBoxOpen />} empty="No orders yet.">
          {(o) => (
            <>
              <div>
                <p className="font-extrabold text-slate-900 text-sm">{o.productTitle}</p>
                <p className="text-xs text-slate-500">
                  #{o.orderId || o._id} · {o.quantity} {o.unit}s · {o.status || 'Confirmed'}
                </p>
              </div>
              <p className="text-lg font-black text-slate-900">₹{(o.totalAmount || 0).toLocaleString()}</p>
            </>
          )}
        </List>
      )}

      {/* Bids */}
      {tab === 'bids' && (
        <List items={userBids} icon={<FaGavel />} empty="No bids yet.">
          {(b) => (
            <>
              <p className="font-extrabold text-slate-900 text-sm">{b.title}</p>
              <p className="text-lg font-black text-slate-900">₹{(b.amount || 0).toLocaleString()}</p>
            </>
          )}
        </List>
      )}

      {/* Listings */}
      {tab === 'listed' && (
        <List items={myProducts} icon={<FaBoxOpen />} empty="You have no listings.">
          {(p) => (
            <>
              <div>
                <p className="font-extrabold text-slate-900 text-sm">{p.title}</p>
                <p className="text-xs text-slate-500">
                  {p.availableQuantity} {p.unit}s · {p.category} · {p.listingType === 'auction' ? 'Auction' : 'Fixed Price'}
                </p>
              </div>
              <p className="text-lg font-black text-slate-900">₹{(p.pricePerUnit || 0).toLocaleString()}</p>
            </>
          )}
        </List>
      )}
    </div>
  );
}

// One list used by all three tabs
function List({ items, icon, empty, children }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400">
        <div className="text-3xl mb-2 flex justify-center">{icon}</div>
        <p className="text-sm">{empty}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item._id || i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between gap-4">
          {children(item)}
        </div>
      ))}
    </div>
  );
}