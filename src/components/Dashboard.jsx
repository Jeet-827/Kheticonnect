import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, Package, Gavel, ShoppingBag, Star,
  MapPin, CheckCircle2, Clock, ArrowUpRight, ArrowDownRight,
  Activity, DollarSign, Users, Layers, BarChart2, Leaf, Truck
} from 'lucide-react';
import { selectOrders, selectUserBids, selectProducts, selectMandiRates, selectDashboardStats } from '../store/slices/marketplaceSlice';
import { selectUser } from '../store/slices/authSlice';
import { selectUserRole } from '../store/slices/uiSlice';
import { GiWheat } from 'react-icons/gi';
import { FaLeaf, FaHammer, FaBolt } from 'react-icons/fa';

// ─── Mandi Price Trend Generator (simulated live) ─────────────────────────────
const generateMandiTrend = (mandiRates) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
  return days.map((day, i) => {
    const entry = { day };
    (mandiRates || []).slice(0, 5).forEach((r, j) => {
      const base = r.price;
      const variance = base * 0.04; // ±4%
      entry[r.crop] = Math.round(base + (Math.sin(i * 0.9 + j) * variance));
    });
    return entry;
  });
};

// ─── Revenue Trend (from orders) ─────────────────────────────────────────────
const generateRevenueTrend = (orders) => {
  const last7 = ['6d ago', '5d ago', '4d ago', '3d ago', '2d ago', 'Yesterday', 'Today'];
  return last7.map((label, i) => ({
    label,
    revenue: orders.filter((_, idx) => idx % 7 === i).reduce((s, o) => s + (o.totalAmount || 0), 0) || Math.floor(Math.random() * 8000 + 2000),
    bids: Math.floor(Math.random() * 12 + 1),
  }));
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ title, value, subtitle, icon: Icon, gradient, change, changeUp }) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity rounded-3xl" style={{ background: gradient }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-md" style={{ background: gradient }}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <span className={`flex items-center gap-0.5 text-xs font-extrabold px-2 py-1 rounded-full ${changeUp ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
            {changeUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-slate-900 leading-none mb-1">{value}</p>
      <p className="text-xs font-bold text-slate-500">{title}</p>
      {subtitle && <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const MandiTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-3 text-xs">
      <p className="font-extrabold text-slate-800 mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-slate-600 font-semibold">{entry.name}:</span>
          <span className="font-black text-slate-900">₹{entry.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

const MANDI_COLORS = ['#2563eb', '#3b82f6', '#0f172a', '#0ea5e9', '#6366f1'];

export default function Dashboard() {
  const user       = useSelector(selectUser);
  const userRole   = useSelector(selectUserRole);
  const orders     = useSelector(selectOrders);
  const userBids   = useSelector(selectUserBids);
  const products   = useSelector(selectProducts);
  const mandiRates = useSelector(selectMandiRates);
  const stats      = useSelector(selectDashboardStats);

  const [mandiTrend, setMandiTrend]   = useState([]);
  const [revenueTrend, setRevenueTrend] = useState([]);
  const [liveTime, setLiveTime]         = useState(new Date());

  useEffect(() => {
    setMandiTrend(generateMandiTrend(mandiRates));
    setRevenueTrend(generateRevenueTrend(orders));
  }, [mandiRates, orders]);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const topProducts = [...products]
    .sort((a, b) => (b.totalBids || 0) - (a.totalBids || 0))
    .slice(0, 5);

  const recentOrders = orders.slice(0, 5);
  const mandiKeys = (mandiRates || []).slice(0, 5).map(r => r.crop);

  const userProfile = user || {};

  return (
    <div className="py-6 space-y-7">

      {/* ── Welcome Hero ──────────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #030712 0%, #0b1329 55%, #1e3a8a 100%)' }} />
        <div className="absolute inset-0 opacity-10" style={{ background: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1800) center/cover' }} />
        <div className="absolute top-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />

        <div className="relative p-7 md:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-sky-300 text-[11px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
              <Activity className="w-3 h-3 text-sky-400" />
              Live Dashboard · {liveTime.toLocaleTimeString('en-IN')}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-2">
              Welcome back, <span className="text-sky-300">{userProfile.name?.split(' ')[0] || 'Farmer'}</span>
            </h1>
            <p className="text-blue-200/70 text-sm font-medium">
              {userRole === 'farmer'
                ? 'Track your listings, bids, and revenue — all in one place.'
                : 'Monitor your purchases, bids, and market trends in real-time.'}
            </p>
          </div>
          <div className="flex gap-0 rounded-2xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-sm shrink-0">
            {[
              { val: orders.length,   label: 'Orders',   color: 'text-sky-300' },
              { val: userBids.length, label: 'Bids',     color: 'text-blue-300'   },
              { val: stats.totalRevenue > 0 ? `₹${(stats.totalRevenue / 1000).toFixed(1)}K` : '—', label: 'Revenue', color: 'text-white' },
            ].map(({ val, label, color }, i) => (
              <div key={label} className={`px-6 py-4 text-center ${i < 2 ? 'border-r border-white/10' : ''}`}>
                <p className={`text-2xl font-black ${color}`}>{val}</p>
                <p className="text-[11px] text-white/50 font-bold uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={orders.length}
          subtitle="Completed purchases"
          icon={Package}
          gradient="linear-gradient(135deg, #2563eb, #1d4ed8)"
          change="+12%"
          changeUp
        />
        <StatCard
          title="Active Bids"
          value={userBids.length}
          subtitle="Live auction bids"
          icon={Gavel}
          gradient="linear-gradient(135deg, #0f172a, #1e293b)"
          change="+5%"
          changeUp
        />
        <StatCard
          title="Revenue"
          value={stats.totalRevenue > 0 ? `₹${stats.totalRevenue.toLocaleString()}` : '₹0'}
          subtitle="Total escrow cleared"
          icon={DollarSign}
          gradient="linear-gradient(135deg, #0284c7, #2563eb)"
          change="+8%"
          changeUp
        />
        <StatCard
          title="Listings"
          value={products.length}
          subtitle={`${stats.activeListings} auctions · ${stats.fixedListings} fixed`}
          icon={Layers}
          gradient="linear-gradient(135deg, #1e3a8a, #0b1329)"
          change="+3"
          changeUp
        />
      </div>

      {/* ── Live Mandi Price Trends ────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <h2 className="text-base font-extrabold text-slate-900">Live Mandi Price Trends</h2>
            </div>
            <p className="text-xs text-slate-400">7-day market price movement across top crops</p>
          </div>
          <span className="text-[11px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full">
            ₹/Quintal
          </span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={mandiTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {mandiKeys.map((crop, i) => (
                <linearGradient key={crop} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={MANDI_COLORS[i]} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={MANDI_COLORS[i]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={55}
              tickFormatter={v => `₹${(v / 1000).toFixed(1)}K`} />
            <Tooltip content={<MandiTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
            {mandiKeys.map((crop, i) => (
              <Area
                key={crop}
                type="monotone"
                dataKey={crop}
                stroke={MANDI_COLORS[i]}
                strokeWidth={2}
                fill={`url(#grad-${i})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── Bottom Grid: Top Listings + Recent Orders ──────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Top Listings by Bid Activity */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-extrabold text-slate-900 mb-1">Top Listings</h2>
          <p className="text-xs text-slate-400 mb-4">Sorted by bid activity</p>
          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8">No listings yet.</p>
            ) : topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <span className="text-xs font-black text-slate-400 w-5 shrink-0">#{i + 1}</span>
                <img src={p.image} alt={p.title} className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-100" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-extrabold text-slate-900 truncate">{p.title}</p>
                  <p className="text-[10px] text-slate-400">{p.category} · {p.farmerLocation?.split(',')[0]}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-black text-slate-900">₹{(p.currentHighestBid || p.pricePerUnit).toLocaleString()}</p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${p.listingType === 'auction' ? 'bg-slate-900 text-white' : 'bg-blue-50 text-blue-700'}`}>
                    {p.listingType === 'auction' ? `${p.totalBids || 0} bids` : 'Fixed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-extrabold text-slate-900 mb-1">Recent Orders</h2>
          <p className="text-xs text-slate-400 mb-4">Last completed transactions</p>
          {recentOrders.length === 0 ? (
            <div className="text-center py-10">
              <Package className="w-10 h-10 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No orders yet. Purchase a listing to see activity here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((o) => (
                <div key={o.orderId} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <GiWheat className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">{o.productTitle}</p>
                      <p className="text-[10px] text-slate-400">#{o.orderId} · {o.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">₹{o.totalAmount?.toLocaleString()}</p>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 justify-end">
                      <CheckCircle2 className="w-2.5 h-2.5" /> {o.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Mandi Rate Cards ──────────────────────────────────────────────── */}
      <div>
        <h2 className="text-base font-extrabold text-slate-900 mb-3">Today's Mandi Rates</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {(mandiRates || []).slice(0, 10).map((r, i) => {
            const isUp = r.change?.startsWith('+');
            const isDown = r.change?.startsWith('-');
            return (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-xs font-black text-slate-900 mb-0.5">{r.crop}</p>
                <p className="text-[10px] text-slate-400 mb-2 flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5 text-slate-400" />{r.location}
                </p>
                <p className="text-lg font-black text-slate-900">₹{r.price?.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">/{r.unit}</p>
                <span className={`mt-1.5 inline-flex items-center gap-0.5 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                  isUp ? 'bg-blue-50 text-blue-700' : isDown ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {isUp ? <ArrowUpRight className="w-2.5 h-2.5" /> : isDown ? <ArrowDownRight className="w-2.5 h-2.5" /> : null}
                  {r.change}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
