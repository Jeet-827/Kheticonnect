import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Package, Gavel, ShoppingBag, MapPin, Activity, Layers, TrendingUp } from 'lucide-react';
import { GiWheat } from 'react-icons/gi';
import { fetchMyProducts, fetchMyOrders, fetchFarmerOrders } from '../store/slices/marketplaceSlice';

const money = (n) => `₹${Number(n).toLocaleString()}`;

function StatCard({ title, value, subtitle, icon: Icon, colorClass }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900 leading-none">{value}</p>
        <p className="text-xs font-bold text-slate-600 mt-1">{title}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}

// One reusable card for every list section
function Section({ title, subtitle, icon: Icon, items, emptyText, render }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-base font-bold text-slate-900 mb-1">{title}</h2>
      <p className="text-xs text-slate-400 mb-4">{subtitle}</p>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <Icon className="w-12 h-12 text-slate-200 mx-auto mb-2" />
          <p className="text-slate-400 text-xs">{emptyText}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item._id || i} className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50">
              {render(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { orders, farmerOrders, userBids, myProducts, mandiRates } =
    useSelector((state) => state.marketplace);

  const isFarmer = user?.role === 'farmer';
  const [active, setActive] = useState('overview');

  useEffect(() => {
    dispatch(fetchMyOrders());
    dispatch(fetchMyProducts());
    if (isFarmer) dispatch(fetchFarmerOrders());
  }, [dispatch, isFarmer]);

  const sections = [
    { key: 'overview', label: 'Overview', icon: Activity },
    { key: 'orders', label: 'My Orders', icon: Package },
    ...(isFarmer
      ? [
          { key: 'myProducts', label: 'My Listings', icon: Layers },
          { key: 'farmerOrders', label: 'Buyer Orders', icon: ShoppingBag },
        ]
      : []),
    { key: 'bids', label: 'My Bids', icon: Gavel },
  ];

  return (
    <div className="py-6 space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-7 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 text-sky-300 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Activity className="w-3 h-3 text-sky-400" /> Dashboard Overview
          </div>
          <h1 className="text-2xl md:text-3xl font-black leading-tight">
            Welcome back, <span className="text-sky-300">{user?.name || 'Farmer'}</span>
          </h1>
          <p className="text-slate-300 text-xs md:text-sm mt-1">
            {isFarmer
              ? 'Track your crop listings, buyer orders, and live auction bids in real time.'
              : 'Monitor your orders, live auction bids, and commodity prices.'}
          </p>
        </div>

        <div className="flex rounded-2xl overflow-hidden border border-white/10 bg-white/5 divide-x divide-white/10 shrink-0">
          {[
            ['Orders', orders.length, 'text-sky-300'],
            ['Bids', userBids.length, 'text-blue-300'],
            ['Listings', myProducts.length, 'text-emerald-300'],
          ].map(([label, count, color]) => (
            <div key={label} className="px-5 py-3 text-center">
              <p className={`text-xl font-black ${color}`}>{count}</p>
              <p className="text-[10px] text-slate-300 font-bold uppercase mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              active === s.key
                ? 'bg-blue-600 text-white border-blue-600 shadow'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
            }`}
          >
            <s.icon className="w-3.5 h-3.5" />
            {s.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {active === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="My Orders" value={orders.length} subtitle="Placed orders" icon={Package} colorClass="bg-blue-600" />
            <StatCard title="Active Bids" value={userBids.length} subtitle="Live auction bids" icon={Gavel} colorClass="bg-amber-600" />
            <StatCard title="My Listings" value={myProducts.length} subtitle="Crops listed for sale" icon={Layers} colorClass="bg-emerald-600" />
            <StatCard title="Mandi Watch" value={mandiRates.length} subtitle="Live APMC mandis" icon={TrendingUp} colorClass="bg-slate-800" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Today's Mandi Rates</h2>
                <p className="text-xs text-slate-400">Live commodity prices across major agricultural markets</p>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                ₹/Quintal
              </span>
            </div>

            {mandiRates.length === 0 ? (
              <p className="text-center py-10 text-slate-400 text-xs">No mandi rates available yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {mandiRates.slice(0, 10).map((r, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl border border-slate-200 p-3">
                    <p className="text-xs font-bold text-slate-900">{r.crop}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5" /> {r.location}
                    </p>
                    <p className="text-base font-black text-slate-900 mt-2">{money(r.price)}</p>
                    <p className="text-[10px] text-slate-400">/{r.unit || 'Quintal'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Orders */}
      {active === 'orders' && (
        <Section
          title="My Orders"
          subtitle="Your purchase transactions"
          icon={Package}
          items={orders}
          emptyText="You have not placed any orders yet."
          render={(o) => (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <GiWheat className="text-blue-600 text-base" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{o.productTitle}</p>
                  <p className="text-xs text-slate-400">#{o.orderId} • {o.quantity} {o.unit}s • {o.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-black text-slate-900">{money(o.totalAmount)}</p>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {o.status || 'Confirmed'}
                </span>
              </div>
            </div>
          )}
        />
      )}

      {/* My Listings (farmer) */}
      {active === 'myProducts' && (
        <Section
          title="My Listed Produce"
          subtitle="Your active crop listings on the marketplace"
          icon={Layers}
          items={myProducts}
          emptyText="You haven't listed any crops for sale yet."
          render={(p) => (
            <div className="flex items-center gap-4">
              <img src={p.image} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{p.title}</p>
                <p className="text-xs text-slate-400">{p.category} • {p.availableQuantity} {p.unit}s available</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-base font-black text-slate-900">{money(p.pricePerUnit)}</p>
                <p className="text-[10px] text-slate-400">/{p.unit}</p>
              </div>
            </div>
          )}
        />
      )}

      {/* Buyer Orders (farmer) */}
      {active === 'farmerOrders' && (
        <Section
          title="Buyer Orders"
          subtitle="Orders received for your crops"
          icon={ShoppingBag}
          items={farmerOrders}
          emptyText="No buyers have ordered your crops yet."
          render={(o) => (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">{o.productTitle}</p>
                <p className="text-xs text-slate-500">Buyer: <span className="font-semibold">{o.buyerName}</span></p>
                <p className="text-[10px] text-slate-400">{o.quantity} {o.unit}s • {o.date}</p>
              </div>
              <div className="text-right">
                <p className="text-base font-black text-slate-900">{money(o.totalAmount)}</p>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  {o.status || 'Confirmed'}
                </span>
              </div>
            </div>
          )}
        />
      )}

      {/* My Bids */}
      {active === 'bids' && (
        <Section
          title="My Auction Bids"
          subtitle="Your bids from this session"
          icon={Gavel}
          items={userBids}
          emptyText="You have not placed bids on any auctions yet."
          render={(b) => (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                  <Gavel className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-sm font-bold text-slate-900">{b.title}</p>
              </div>
              <p className="text-base font-black text-slate-900">{money(b.amount)}</p>
            </div>
          )}
        />
      )}
    </div>
  );
}