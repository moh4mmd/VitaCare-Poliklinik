import React from 'react';
import { 
  HomeIcon, 
  CalendarIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Ana Sayfa', icon: HomeIcon, current: true },
  { name: 'Randevular', icon: CalendarIcon, current: false },
  { name: 'Hastalar', icon: UserGroupIcon, current: false },
  { name: 'Raporlar', icon: ChartBarIcon, current: false },
  { name: 'Ayarlar', icon: Cog6ToothIcon, current: false },
];

const Sidebar = () => {
  const doctorName = localStorage.getItem('user_name') || 'Yılmaz';
  
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full shadow-xl z-20">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-slate-900 shadow-lg shadow-emerald-500/20">
            <PlusCircleIcon className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white tracking-wide">
              VitaCare
            </span>
            <span className="text-xs text-emerald-400 font-medium tracking-widest uppercase">
              Poliklinik
            </span>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <a
            key={item.name}
            href="#"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              item.current 
                ? 'bg-blue-600/10 text-blue-400 font-semibold shadow-inner border border-blue-500/20' 
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.current ? 'text-blue-400' : 'text-slate-500'}`} />
            {item.name}
          </a>
        ))}
      </nav>

      {/* Bottom Profile Summary */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer group">
          <img
            src={`https://ui-avatars.com/api/?name=${doctorName}&background=0f172a&color=38bdf8`}
            alt="Dr. Avatar"
            className="w-11 h-11 rounded-full border border-slate-700 group-hover:border-blue-500/50 transition-colors"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">Dr. {doctorName}</p>
            <p className="text-xs text-slate-500 truncate">Dahiliye Uzmanı</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
