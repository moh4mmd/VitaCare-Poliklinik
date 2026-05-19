import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UsersIcon, 
  CalendarDaysIcon, 
  ExclamationCircleIcon,
  CheckIcon,
  XMarkIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import ConfirmationModal from './ConfirmationModal';

const stats = [
  { 
    name: "Bugünkü Randevular", 
    value: '0', 
    icon: CalendarDaysIcon, 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100',
    trend: 'Veritabanından alındı',
    trendUp: true
  },
  { 
    name: 'Bu Hafta Yeni Hastalar', 
    value: '12', 
    icon: UsersIcon, 
    color: 'text-emerald-600', 
    bgColor: 'bg-emerald-100',
    trend: 'Bu hafta +%15',
    trendUp: true
  },
  { 
    name: 'Acil Mesajlar', 
    value: '3', 
    icon: ExclamationCircleIcon, 
    color: 'text-rose-600', 
    bgColor: 'bg-rose-100',
    trend: 'Acil dikkat gerektiriyor',
    trendUp: false
  },
];

const statusStyles = {
  Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200/50',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200/50',
  Cancelled: 'bg-rose-50 text-rose-700 border-rose-200/50',
  Completed: 'bg-blue-50 text-blue-700 border-blue-200/50',
};

const DashboardMain = () => {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  
  const doctorName = localStorage.getItem('user_name') || 'Yılmaz';
  
  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    appointmentId: null,
    newStatus: '',
    title: '',
    message: '',
    confirmText: '',
    confirmColor: ''
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const url = filterStatus === 'All' 
          ? 'http://localhost:8000/api/appointments/'
          : `http://localhost:8000/api/appointments/?status=${filterStatus}`;
          
        const response = await axios.get(url, {
          withCredentials: true
        });
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [filterStatus]);

  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:8000/api/appointments/${id}/`, 
        { status: newStatus },
        { withCredentials: true }
      );
      // Remove from list if filtered out, or just update status
      if (filterStatus !== 'All' && filterStatus !== newStatus) {
        setAppointments(prev => prev.filter(appt => appt.id !== id));
      } else {
        setAppointments(prev => prev.map(appt => 
          appt.id === id ? { ...appt, status: newStatus } : appt
        ));
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert("Failed to update appointment status.");
    }
  };

  const openModal = (id, newStatus, patientName) => {
    let config = {
      isOpen: true,
      appointmentId: id,
      newStatus: newStatus,
    };

    if (newStatus === 'Confirmed') {
      config = { ...config, title: 'Randevuyu Onayla', message: `${patientName} isimli hastanın randevusunu onaylamak istediğinize emin misiniz?`, confirmText: 'Onayla', confirmColor: 'bg-emerald-600 hover:bg-emerald-700' };
    } else if (newStatus === 'Cancelled') {
      config = { ...config, title: 'Randevuyu İptal Et', message: `${patientName} isimli hastanın randevusunu iptal etmek istediğinize emin misiniz? Bu işlem geri alınamaz.`, confirmText: 'İptal Et', confirmColor: 'bg-rose-600 hover:bg-rose-700' };
    } else if (newStatus === 'Completed') {
      config = { ...config, title: 'Randevuyu Tamamla', message: `${patientName} isimli hastanın randevusunun tamamlandığını işaretlemek istiyor musunuz?`, confirmText: 'Tamamlandı İşaretle', confirmColor: 'bg-blue-600 hover:bg-blue-700' };
    }
    
    setModalConfig(config);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      
      <ConfirmationModal 
        {...modalConfig} 
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} 
        onConfirm={() => updateAppointmentStatus(modalConfig.appointmentId, modalConfig.newStatus)} 
      />
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Tekrar hoş geldiniz, Dr. {doctorName} 👋</h1>
          <p className="text-sm text-slate-500 mt-1">İşte bugün kliniğinizde olanlar.</p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-sm">
          + Yeni Randevu
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-slate-50 to-white rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out pointer-events-none"></div>
            <div className="flex items-start justify-between relative">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{stat.name}</p>
                <p className="text-3xl font-extrabold text-slate-800 mt-3">
                  {stat.name === "Bugünkü Randevular" ? appointments.length : stat.value}
                </p>
                <p className={`text-xs font-medium mt-2 flex items-center gap-1.5 ${stat.trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.trend === 'Veritabanından alındı' && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                  {stat.trend}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor} shadow-sm`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Table Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <h2 className="text-lg font-bold text-slate-800">Yaklaşan Randevular</h2>
          
          {/* Filters */}
          <div className="flex gap-2">
            {['All', 'Pending', 'Confirmed', 'Completed'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filterStatus === status 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status === 'All' ? 'Tümü' : status === 'Pending' ? 'Bekliyor' : status === 'Confirmed' ? 'Onaylandı' : status === 'Cancelled' ? 'İptal Edildi' : 'Tamamlandı'}
              </button>
            ))}
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-8 flex justify-center items-center text-slate-500">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Randevular yükleniyor...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Hasta Adı</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tarih & Saat</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tür</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500 font-medium">Henüz planlanmış randevunuz yok.</td>
                  </tr>
                ) : (
                  appointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs border border-slate-200 uppercase">
                            {appt.patient_name ? appt.patient_name.split(' ').map(n => n[0]).join('').substring(0,2) : 'U'}
                          </div>
                          <span className="font-semibold text-slate-800">{appt.patient_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200/60 text-sm font-medium text-slate-600">
                          <CalendarDaysIcon className="w-4 h-4 text-slate-400" />
                          {appt.appointment_date} {appt.appointment_time && appt.appointment_time.substring(0, 5)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-600">{appt.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyles[appt.status] || statusStyles.Pending}`}>
                          {appt.status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>}
                          {appt.status === 'Pending' ? 'Bekliyor' : appt.status === 'Confirmed' ? 'Onaylandı' : appt.status === 'Cancelled' ? 'İptal Edildi' : appt.status === 'Completed' ? 'Tamamlandı' : appt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {appt.status === 'Pending' && (
                            <>
                              <button 
                                onClick={() => openModal(appt.id, 'Confirmed', appt.patient_name)}
                                title="Kabul Et"
                                className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 transition-colors focus:outline-none"
                              >
                                <CheckIcon className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => openModal(appt.id, 'Cancelled', appt.patient_name)}
                                title="İptal"
                                className="p-1.5 rounded-md text-rose-600 hover:bg-rose-50 transition-colors focus:outline-none"
                              >
                                <XMarkIcon className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          {appt.status === 'Confirmed' && (
                            <button 
                              onClick={() => openModal(appt.id, 'Completed', appt.patient_name)}
                              title="Tamamlandı Olarak İşaretle"
                              className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors focus:outline-none"
                            >
                              <CheckBadgeIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardMain;
