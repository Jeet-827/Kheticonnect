import React from 'react';
import { useKheti } from '../hooks/useKheti';
import { CheckCircle2, Sprout } from 'lucide-react';

const LINKS = [
  { id: 'marketplace', label: 'Crop Marketplace' },
  { id: 'community',   label: 'Advisory & Forum' },
  { id: 'trust',       label: 'Trust & Reviews' },
  { id: 'orders',      label: 'My Dashboard' },
];

const MANDIS = ['Khanna Mandi, Punjab', 'Karnal Market, Haryana', 'Nashik APMC, Maharashtra', 'Azadpur Mandi, Delhi', 'Ratnagiri Hub, Maharashtra'];

export default function Footer() {
  const { setActiveTab } = useKheti();

  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-md"
                style={{ background: 'linear-gradient(135deg, #0b1329, #1e3a8a)' }}>
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div className="font-extrabold text-slate-900 text-base">
                Kheti<span className="text-blue-600">-Connect</span>
              </div>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed mb-4">
              Empowering Indian agriculture through transparent digital auctions, direct farmer connections, and escrow-protected trade.
            </p>
            <p className="text-slate-400 text-xs">© 2026 Kheti-Connect Inc.</p>
          </div>

          {/* Nav */}
          <div>
            <p className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-4">Quick Links</p>
            <ul className="space-y-2.5">
              {LINKS.map(({ id, label }) => (
                <li key={id}>
                  <button onClick={() => setActiveTab(id)} className="text-slate-500 hover:text-blue-600 font-semibold transition-colors text-xs">
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Mandis */}
          <div>
            <p className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-4">Supported Mandis</p>
            <ul className="space-y-2.5">
              {MANDIS.map(m => <li key={m} className="text-xs text-slate-500 font-semibold">{m}</li>)}
            </ul>
          </div>

          {/* Trust */}
          <div>
            <p className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-4">Security</p>
            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-2xl border border-blue-100 shadow-sm">
              <span className="flex items-center gap-1.5 text-blue-900 font-extrabold text-xs mb-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" /> Escrow Payment Protection
              </span>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                All payments are held in secure escrow until crop quality is verified at delivery point. Zero fraud guarantee.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-100 py-4">
        <div className="container flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-medium">
          <span>Built for Indian Agriculture and Farmers</span>
          <div className="flex gap-5">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
