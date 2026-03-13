
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, PhoneCall, Calendar, ChevronLeft, Stethoscope } from 'lucide-react';
import { Doctor } from '../types';

const DoctorListing: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/doctors');
        if (res.ok) {
          const data = await res.json();
          setDoctors(data);
        } else {
          console.error("Failed to fetch doctors");
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Find Your Specialist</h1>
          <p className="text-slate-500">Connecting you with the best healthcare professionals nearby.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search specialists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none w-full sm:w-80 text-slate-900 font-medium transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center space-x-2 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            <Filter className="w-5 h-5 text-blue-600" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-80 bg-white border border-slate-200 rounded-3xl animate-pulse" />
          ))
        ) : filteredDoctors.length > 0 ? (
          filteredDoctors.map(doc => (
            <DoctorCardLarge key={doc.id} doctor={doc} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">No doctors found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Typed DoctorCardLarge component using React.FC to fix missing key errors
const DoctorCardLarge: React.FC<{ doctor: Doctor }> = ({ doctor }) => (
  <div className="glass-card rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-200/50 hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full border-0">
    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
      <Stethoscope className="w-24 h-24 text-blue-300" />
      <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-2xl text-[10px] font-black text-blue-700 border border-white shadow-lg uppercase tracking-wider">
        Available
      </div>
    </div>

    <div className="p-8 flex-1 flex flex-col">
      <div className="mb-6">
        <h3 className="text-2xl font-black text-slate-800 mb-1 group-hover:text-blue-600 transition-colors tracking-tight uppercase">{doctor.name}</h3>
        <p className="text-sm font-bold text-blue-500/70 tracking-wide">{doctor.specialization}</p>
      </div>

      <div className="space-y-4 mb-8 flex-1">
        <div className="flex items-center text-sm font-bold text-slate-500">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <span>Available for booking</span>
        </div>
        <div className="flex items-center text-sm font-bold text-slate-500">
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center mr-3">
            <MapPin className="w-4 h-4 text-rose-400" />
          </div>
          <span>{doctor.address || 'Medical Center'}</span>
        </div>
        <div className="flex items-center p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mr-4">Fee</span>
          <span className="text-lg font-black text-emerald-700">${doctor.fee}</span>
          <span className="text-[10px] font-bold text-emerald-600/60 ml-2 uppercase">/ Session</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link
          to={`/booking/${doctor.id}`}
          className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black text-center shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 uppercase tracking-widest"
        >
          Book Now
        </Link>
        <a 
          href={`tel:${doctor.phone}`}
          className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-black hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center active:scale-95 uppercase tracking-widest"
        >
          <PhoneCall className="w-4 h-4 mr-2 text-blue-400" />
          Call
        </a>
      </div>
    </div>
  </div>
);

export default DoctorListing;
