import React from 'react';
import { MagnifyingGlassIcon, BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const doctorName = localStorage.getItem('user_name') || 'Yılmaz';
  
  const todayDate = new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  }).format(new Date());

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10 sticky top-0">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Hastaları, randevuları veya tıbbi kayıtları arayın..." 
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6 ml-4">
        {/* Date/Time Indicator (Optional bonus based on design prompt) */}
        <div className="hidden lg:flex flex-col text-right mr-2">
          <span className="text-sm font-semibold text-slate-700">Bugün</span>
          <span className="text-xs text-slate-500">{todayDate}</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20">
          <span className="absolute top-1 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          <BellIcon className="w-6 h-6" />
        </button>

        <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>

        {/* Profile Dropdown */}
        <button className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none">
          <img
            src={`https://ui-avatars.com/api/?name=${doctorName}&background=f0f9ff&color=0369a1`}
            alt="Dr. Avatar"
            className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm border border-slate-100"
          />
          <div className="hidden sm:block text-left">
            <p className="text-sm font-bold text-slate-800 leading-tight">Dr. {doctorName}</p>
            <p className="text-xs text-slate-500">Oda 302</p>
          </div>
          <ChevronDownIcon className="w-4 h-4 text-slate-400 ml-1" />
        </button>
      </div>
    </header>
  );
};

export default Header;
