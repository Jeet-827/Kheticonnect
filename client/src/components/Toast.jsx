import React from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle2 } from 'lucide-react';

export default function Toast() {
  const toast = useSelector(state => state.ui.toast);
  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${toast.type === 'amber' ? 'toast-amber' : 'toast-success'}`}>
        <CheckCircle2 className={`w-5 h-5 shrink-0 ${toast.type === 'amber' ? 'text-amber-400' : 'text-emerald-400'}`} />
        <span className="leading-snug">{toast.message}</span>
      </div>
    </div>
  );
}
