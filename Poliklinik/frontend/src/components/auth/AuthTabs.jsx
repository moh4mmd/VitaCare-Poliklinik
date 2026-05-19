import React from 'react';

export default function AuthTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex border-b border-stone-200 mb-5 pb-1.5 gap-3">
      <button
        onClick={() => setActiveTab('login')}
        className={`flex-1 text-xl font-semibold pb-1.5 text-left font-['Manrope'] transition-all ${
          activeTab === 'login'
            ? 'text-emerald-700 border-b-2 border-emerald-700'
            : 'text-stone-500 hover:text-zinc-950'
        }`}
      >
        Login
      </button>
      <button
        onClick={() => setActiveTab('register')}
        className={`flex-1 text-xl font-semibold pb-1.5 text-left font-['Manrope'] transition-all ${
          activeTab === 'register'
            ? 'text-emerald-700 border-b-2 border-emerald-700'
            : 'text-stone-500 hover:text-zinc-950'
        }`}
      >
        Register
      </button>
    </div>
  );
}
