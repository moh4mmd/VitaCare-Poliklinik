import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Stethoscope, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function AppointmentPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    department: '',
    doctor: '',
    date: '',
    time: '',
    notes: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Map frontend fields to match backend Appointment model expectations
      const payload = {
        category: formData.department,
        doctor: 12, // Updated to match the ID of the doctor in the current database
        appointment_date: formData.date,
        appointment_time: formData.time,
      };

      const response = await axios.post('http://localhost:8000/api/appointments/', payload, {
        withCredentials: true
      });
      if (response.status === 201) {
        setSuccess('Randevunuz başarıyla oluşturuldu! Ana sayfaya yönlendiriliyorsunuz...');
        setTimeout(() => navigate('/'), 3000);
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Oturumunuz süresi dolmuş veya giriş yapmamışsınız. Lütfen tekrar giriş yapın.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') {
          setError(data);
        } else if (typeof data === 'object') {
          const errorMessages = Object.entries(data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(' ') : value}`)
            .join(' | ');
          setError(errorMessages);
        } else {
          setError(JSON.stringify(data));
        }
      } else {
        setError(err.message || 'Randevu oluşturulurken bir hata oluştu.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-stone-50 text-zinc-950 min-h-screen font-sans antialiased relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-100/50 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-stone-200/50 blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 w-full bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold text-zinc-950 tracking-tight font-['Manrope']">
            VitaCare Premium
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-sm font-medium text-stone-500 hover:text-emerald-600 transition-colors font-['Manrope']"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Ana Sayfaya Dön
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-zinc-950 mb-2 font-['Manrope']">Randevu Al</h1>
          <p className="text-base text-stone-500 font-['Manrope']">Sağlığınız için en uygun zamanı seçin.</p>
        </div>

        <div className="bg-white/95 backdrop-blur-md border border-white/20 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08)] rounded-[24px] p-8">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 font-medium font-['Manrope']">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-700 font-medium font-['Manrope']">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-widest font-['Manrope']">Bölüm / Klinik</label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg py-3 pl-10 pr-4 text-zinc-950 appearance-none focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-['Manrope']"
                >
                  <option value="" disabled>Bölüm Seçiniz</option>
                  <option value="kardiyoloji">Kardiyoloji</option>
                  <option value="noroloji">Nöroloji</option>
                  <option value="dermatoloji">Dermatoloji</option>
                  <option value="dahiliye">Dahiliye (İç Hastalıkları)</option>
                </select>
              </div>
            </div>

            {/* Doctor */}
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-widest font-['Manrope']">Doktor</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  required
                  disabled={!formData.department}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg py-3 pl-10 pr-4 text-zinc-950 appearance-none focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-['Manrope'] disabled:opacity-50"
                >
                  <option value="" disabled>Önce Bölüm Seçiniz</option>
                  <option value="dr-ahmet">Dr. Ahmet Yılmaz</option>
                  <option value="dr-ayse">Dr. Ayşe Demir</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-widest font-['Manrope']">Tarih</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg py-3 pl-10 pr-4 text-zinc-950 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-['Manrope']"
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-widest font-['Manrope']">Saat</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    disabled={!formData.date}
                    className="w-full bg-stone-50 border border-stone-200 rounded-lg py-3 pl-10 pr-4 text-zinc-950 appearance-none focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-['Manrope'] disabled:opacity-50"
                  >
                    <option value="" disabled>Saat Seçiniz</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:30">11:30</option>
                    <option value="14:00">14:00</option>
                    <option value="15:30">15:30</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-2 uppercase tracking-widest font-['Manrope']">Ek Notlar (İsteğe Bağlı)</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg py-3 px-4 text-zinc-950 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all font-['Manrope'] resize-none"
                placeholder="Şikayetinizi kısaca belirtebilirsiniz..."
              ></textarea>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full bg-emerald-700 text-white rounded-[1.5rem] py-4 mt-4 text-lg font-semibold hover:bg-emerald-800 active:scale-[0.98] transition-all shadow-[0_4px_14px_0_rgba(4,120,87,0.39)] disabled:opacity-70 disabled:active:scale-100 font-['Manrope']"
            >
              {isLoading ? 'Onaylanıyor...' : success ? 'Onaylandı' : 'Randevuyu Onayla'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
