import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center font-body-md antialiased p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-container/20 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary-fixed/20 blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-[360px] z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-zinc-950 mb-1 font-['Manrope']">VitaCare Premium</h1>
          <p className="text-sm text-stone-500 font-['Manrope']">Patient Portal Access</p>
        </div>
        
        {/* Auth Card */}
        <div className="bg-white/95 backdrop-blur-md border border-white/20 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)] rounded-[24px] p-5">
            {children}
        </div>
        
        {/* Footer Text */}
        <p className="text-center text-xs text-stone-500 mt-6 font-['Manrope']">
          Need help accessing your account?{' '}
          <a href="#" className="text-emerald-600 font-medium hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
