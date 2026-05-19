import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, EyeOff, Eye, CheckCircle2 } from 'lucide-react';

export default function RegisterForm({ onSubmit, isLoading, error }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("One number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push("One special character");
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when typing
    if (validationErrors[name]) {
        setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    const pwdErrors = validatePassword(formData.password);
    if (pwdErrors.length > 0) {
        newErrors.password = pwdErrors;
    }

    if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = ["Passwords do not match."];
    }

    if (Object.keys(newErrors).length > 0) {
        setValidationErrors(newErrors);
        return;
    }

    onSubmit({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        
        {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                {error}
            </div>
        )}

        <div className="flex gap-4">
            {/* First Name Field */}
            <div className="flex-1">
                <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-widest font-['Manrope']">First Name</label>
                <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 pl-10 pr-4 text-zinc-950 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-['Manrope']"
                        placeholder="John"
                        required
                    />
                </div>
            </div>
            {/* Last Name Field */}
            <div className="flex-1">
                <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-widest font-['Manrope']">Last Name</label>
                <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 pl-10 pr-4 text-zinc-950 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-['Manrope']"
                        placeholder="Doe"
                        required
                    />
                </div>
            </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-widest font-['Manrope']">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg py-2.5 pl-10 pr-4 text-zinc-950 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-['Manrope']"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-widest font-['Manrope']">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              className={`w-full bg-stone-50 border ${validationErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-stone-200 focus:border-emerald-600 focus:ring-emerald-600'} rounded-lg py-2.5 pl-10 pr-10 text-zinc-950 focus:outline-none focus:ring-1 transition-all font-['Manrope']`}
              placeholder="Create strong password"
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
          {validationErrors.password && (
            <ul className="mt-2 space-y-1">
                {validationErrors.password.map((err, idx) => (
                    <li key={idx} className="text-xs text-red-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> {err}</li>
                ))}
            </ul>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-widest font-['Manrope']">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full bg-stone-50 border ${validationErrors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-stone-200 focus:border-emerald-600 focus:ring-emerald-600'} rounded-lg py-2.5 pl-10 pr-10 text-zinc-950 focus:outline-none focus:ring-1 transition-all font-['Manrope']`}
              placeholder="Confirm password"
              required
            />
          </div>
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-xs text-red-500">{validationErrors.confirmPassword[0]}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-700 text-white rounded-[1.5rem] py-3 mt-3 text-base font-semibold hover:bg-emerald-800 active:scale-[0.98] transition-all shadow-[0_4px_14px_0_rgba(4,120,87,0.39)] disabled:opacity-70 disabled:active:scale-100 font-['Manrope']"
        >
          {isLoading ? 'Registering...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
