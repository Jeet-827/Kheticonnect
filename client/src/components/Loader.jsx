import React from 'react';
import { Sprout } from 'lucide-react';

export default function Loader({ message = 'Loading Kheti-Connect...', fullScreen = true }) {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 animate-fadeIn">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center animate-bounce shadow-xl shadow-blue-500/20">
            <Sprout className="w-7 h-7 text-white" />
          </div>
          <span className="text-sm font-extrabold text-white tracking-wide">
            {message}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center animate-bounce shadow-md shadow-blue-500/20">
        <Sprout className="w-5 h-5 text-white" />
      </div>
      <span className="text-xs font-bold text-slate-500 tracking-wide">
        {message}
      </span>
    </div>
  );
}
