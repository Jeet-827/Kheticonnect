import React from 'react';
import { useKheti } from '../hooks/useKheti';
import { CheckCircle2 } from 'lucide-react';

export default function Toast() {
  const { toast } = useKheti();
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
