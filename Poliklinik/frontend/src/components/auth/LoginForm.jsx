import React, { useState } from 'react';
import { Mail, Lock, EyeOff, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm({ onSubmit, isLoading, error: propError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  const displayError = propError;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        
        {displayError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                {displayError}
            </div>
        )}

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-widest font-['Manrope']"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 pl-10 pr-4 text-zinc-950 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-['Manrope']"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              htmlFor="password"
              className="block text-xs font-bold text-stone-500 uppercase tracking-widest font-['Manrope']"
            >
              Password
            </label>
            <a href="#" className="text-sm text-emerald-600 hover:underline font-['Manrope']">
              Forgot?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 pl-10 pr-10 text-zinc-950 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-['Manrope']"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-zinc-950 transition-colors"
            >
              {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-700 text-white rounded-[1.5rem] py-3 mt-3 text-base font-semibold hover:bg-emerald-800 active:scale-[0.98] transition-all shadow-[0_4px_14px_0_rgba(4,120,87,0.39)] disabled:opacity-70 disabled:active:scale-100 font-['Manrope']"
        >
          {isLoading ? 'Signing In...' : 'Sign In to Portal'}
        </button>
      </form>
    </div>
  );
}
