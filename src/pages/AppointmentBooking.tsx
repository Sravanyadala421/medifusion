
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, ChevronLeft, User, Video, Users, CheckCircle } from 'lucide-react';
import { Appointment } from '../types';

interface AppointmentBookingProps {
  onBook: (app: Appointment) => void;
}

const AppointmentBooking: React.FC<AppointmentBookingProps> = ({ onBook }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Initialize with today's date
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [type, setType] = useState<'visit' | 'consultation'>('visit');
  const [isBooked, setIsBooked] = useState(false);
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch doctor details
  React.useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/doctors');
        if (res.ok) {
          const doctors = await res.json();
          const foundDoctor = doctors.find((d: any) => d.id === id);
          setDoctor(foundDoctor);
        }
      } catch (err) {
        console.error('Error fetching doctor:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  // Generate next 7 days
  const getNextDays = () => {
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      days.push({
        day: dayNames[date.getDay()],
        date: date.getDate().toString(),
        full: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    return days;
  };

  const dates = getNextDays();
  
  // Get minimum date (today) for calendar input
  const minDate = today.toISOString().split('T')[0];

  const slots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  const handleBooking = () => {
    if (!doctor) return;
    
    const newApp: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      doctorId: id || '1',
      doctorName: doctor.name,
      date: selectedDate,
      time: selectedTime,
      type,
      status: 'upcoming'
    };
    onBook(newApp);
    setIsBooked(true);
    setTimeout(() => {
      navigate('/payment', { state: { amount: doctor.fee } });
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Doctor Not Found</h2>
        <p className="text-slate-500 mb-8">The doctor you're looking for doesn't exist.</p>
        <Link to="/doctors" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700">
          Back to Doctors
        </Link>
      </div>
    );
  }

  if (isBooked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center animate-in zoom-in-95">
        <div className="bg-emerald-100 p-6 rounded-full mb-6">
          <CheckCircle className="w-16 h-16 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Slot Reserved!</h2>
        <p className="text-slate-500 mb-8 max-w-sm">Your appointment is provisionally booked. Redirecting to payment page to confirm...</p>
        <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 animate-progress"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link to="/doctors" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Doctors
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Book Appointment</h1>
        <p className="text-slate-500">Choose your preferred date and time for consultation.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-wider flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              Select Date
            </h2>
            
            {/* Quick date selection */}
            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide mb-4">
              {dates.map((d) => (
                <button
                  key={d.full}
                  onClick={() => setSelectedDate(d.full)}
                  className={`flex flex-col items-center justify-center min-w-[70px] h-24 rounded-2xl transition-all border ${selectedDate === d.full ? 'bg-blue-600 text-white border-blue-600 scale-105' : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-blue-200'}`}
                >
                  <span className="text-xs uppercase font-medium mb-1 opacity-80">{d.day}</span>
                  <span className="text-2xl font-bold">{d.date}</span>
                </button>
              ))}
            </div>
            
            {/* Calendar input for custom date */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-500 mb-2">Or pick a custom date:</label>
              <input
                type="date"
                value={selectedDate}
                min={minDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900"
              />
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-wider flex items-center">
              <Clock className="w-4 h-4 mr-2 text-emerald-500" />
              Select Time Slot
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {slots.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedTime(s)}
                  className={`py-3 rounded-xl text-sm font-bold transition-all border ${selectedTime === s ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-emerald-200'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-wider">Consultation Type</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setType('visit')}
                className={`p-4 rounded-2xl flex items-center space-x-4 border transition-all ${type === 'visit' ? 'bg-blue-50 border-blue-400' : 'bg-white border-slate-200'}`}
              >
                <div className={`p-3 rounded-xl ${type === 'visit' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800">In-Person Visit</p>
                  <p className="text-xs text-slate-500">Visit clinic for checkup</p>
                </div>
              </button>
              <button 
                onClick={() => setType('consultation')}
                className={`p-4 rounded-2xl flex items-center space-x-4 border transition-all ${type === 'consultation' ? 'bg-indigo-50 border-indigo-400' : 'bg-white border-slate-200'}`}
              >
                <div className={`p-3 rounded-xl ${type === 'consultation' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Video className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-800">Video Consult</p>
                  <p className="text-xs text-slate-500">Secure remote session</p>
                </div>
              </button>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-slate-700 mb-6 uppercase tracking-wider">Booking Summary</h2>
            <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <User className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <p className="font-bold text-slate-800">{doctor.name}</p>
                <p className="text-xs text-slate-500">{doctor.specialization}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <SummaryRow label="Date" value={new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} />
              <SummaryRow label="Time" value={selectedTime} />
              <SummaryRow label="Type" value={type === 'visit' ? 'Clinic Visit' : 'Tele-consult'} />
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <p className="text-sm font-bold text-slate-800">Total Fee</p>
                <p className="text-lg font-bold text-blue-600">${doctor.fee}.00</p>
              </div>
            </div>

            <button 
              onClick={handleBooking}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
            >
              Confirm and Pay
            </button>
          </section>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Need to cancel?</strong> Free cancellation up to 24 hours before your appointment time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center text-sm">
    <p className="text-slate-400">{label}</p>
    <p className="font-semibold text-slate-700 capitalize">{value}</p>
  </div>
);

export default AppointmentBooking;
