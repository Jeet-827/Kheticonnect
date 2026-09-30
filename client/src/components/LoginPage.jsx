import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Sprout, ShieldCheck, CheckCircle2, ArrowRight, Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { GiWheat } from 'react-icons/gi';
import { FaShoppingCart, FaExclamationTriangle } from 'react-icons/fa';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    location: '',
    phone: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = role => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await login(formData.email, formData.password);
        if (!res.success) {
          setError(res.message);
        }
      } else {
        // Validation
        if (!formData.name || !formData.email || !formData.password || !formData.location) {
          setError('Please fill in all required fields');
          setLoading(false);
          return;
        }
        const res = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          location: formData.location,
          phone: formData.phone
        });
        if (!res.success) {
          setError(res.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* ── Left Column: Premium Brand & Stats ────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden text-white"
        style={{ background: 'linear-gradient(135deg, #030712 0%, #0b1329 55%, #1e3a8a 100%)' }}>
        
        {/* Background image & overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
          style={{ background: 'url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200) center/cover' }}
        />
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
        />

        {/* Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            Kheti<span className="text-blue-400">-Connect</span>
          </span>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 my-auto max-w-lg">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-sky-300 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-sky-400" /> Direct Farmer Trading Platform
          </span>
          <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight text-white mb-6">
            Empowering Farmers,<br />
            Connecting Buyers.
          </h1>
          
          <div className="space-y-4">
            {[
              'Direct farm-to-buyer trade, bypassing middlemen commissions.',
              'Secure escrow payments protect transactions until quality check.',
              'Live auction bidding model gets farmers the best market price.',
            ].map((text, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-100/90 leading-relaxed font-medium">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-blue-200/60 font-semibold border-t border-white/10 pt-6">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-sky-400" /> Safe Escrow Payments</span>
          <span>© 2026 Kheti-Connect Inc.</span>
        </div>
      </div>

      {/* ── Right Column: Form Container ─────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md">
          
          {/* Logo on mobile */}
          <div className="flex lg:hidden items-center gap-2.5 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
              <Sprout className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-lg font-black text-slate-900">
              Kheti<span className="text-blue-600">-Connect</span>
            </span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {isLogin ? 'Welcome Back!' : 'Create an Account'}
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              {isLogin ? 'Access your dashboard and listings' : 'Join India’s direct farm-to-buyer trading network'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold leading-relaxed flex items-start gap-2">
                <FaExclamationTriangle className="shrink-0 mt-0.5 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {!isLogin && (
              <>
                {/* Role selection card */}
                <div>
                  <label className="form-label mb-2 block">Choose Your Account Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('farmer')}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all ${
                        formData.role === 'farmer'
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-100'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <GiWheat className="text-2xl mb-1 text-blue-600" />
                      <span className="text-xs font-extrabold">I am a Farmer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleSelect('buyer')}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 transition-all ${
                        formData.role === 'buyer'
                          ? 'border-slate-900 bg-slate-100 text-slate-900 ring-2 ring-slate-200'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <FaShoppingCart className="text-2xl mb-1 text-slate-800" />
                      <span className="text-xs font-extrabold">I am a Buyer</span>
                    </button>
                  </div>
                </div>

                <div className="form-group !mb-0">
                  <label className="form-label">Full Name *</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="form-input"
                  />
                </div>
              </>
            )}

            <div className="form-group !mb-0">
              <label className="form-label">Email Address *</label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="form-input"
              />
            </div>

            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group !mb-0">
                  <label className="form-label">Location *</label>
                  <input
                    required
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                    className="form-input"
                  />
                </div>
                <div className="form-group !mb-0">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className="form-input"
                  />
                </div>
              </div>
            )}

            <div className="form-group !mb-0">
              <label className="form-label">Password *</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className="form-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3.5 font-extrabold text-base rounded-2xl shadow-lg mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  {isLogin ? 'Login to Kheti-Connect' : 'Create Free Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Tab */}
          <div className="text-center mt-6 text-xs text-slate-500 font-semibold">
            {isLogin ? (
              <>
                New to Kheti-Connect?{' '}
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                  }}
                  className="text-blue-600 hover:underline font-bold"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                  }}
                  className="text-blue-600 hover:underline font-bold"
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
