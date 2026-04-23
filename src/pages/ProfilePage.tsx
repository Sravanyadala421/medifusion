
import React from 'react';
import { User as UserIcon, Calendar, Clock, MapPin, ChevronRight, Activity, Heart, Shield, Sparkles } from 'lucide-react';
import { Appointment, User } from '../types';

interface ProfilePageProps {
  appointments: Appointment[];
  user: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ appointments, user }) => {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* User Card */}
        <aside className="w-full md:w-80 space-y-6 animate-slide-in">
          <div className="glass-card p-8 rounded-[2rem] border-0 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="relative inline-block mb-6 group">
              {user.avatar ? (
                <img src={user.avatar} className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl transition-transform group-hover:scale-105" alt="Profile" />
              ) : (
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-white shadow-xl flex items-center justify-center">
                  <UserIcon className="w-16 h-16 text-blue-400" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl border-4 border-white shadow-lg">
                <Shield className="w-5 h-5" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{user.name}</h2>
            <p className="text-sm font-bold text-blue-600/60 mb-8">{user.email}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">Age</p>
                <p className="font-black text-blue-700 text-lg">{user.age || 'N/A'}</p>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Weight</p>
                <p className="font-black text-slate-700 text-lg">{user.weight ? `${user.weight}kg` : 'N/A'}</p>
              </div>
            </div>

            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 mb-8">
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Height</p>
              <p className="font-black text-indigo-700 text-lg">{user.height ? `${user.height}cm` : 'N/A'}</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8 animate-fade-in">

          <section className="glass-card rounded-[2rem] border-0 shadow-xl overflow-hidden">
            <div className="p-8 pb-4 flex justify-between items-center bg-white/30">
              <h2 className="text-2xl font-black text-slate-800 flex items-center">
                <Calendar className="w-7 h-7 mr-3 text-indigo-600" />
                My Appointments
              </h2>
              <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full uppercase tracking-[0.15em] border border-indigo-100">
                {appointments.length} Total
              </span>
            </div>

            <div className="divide-y divide-slate-100/50">
              {appointments.length > 0 ? (
                appointments.map(app => (
                  <div key={app.id} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between group hover:bg-blue-50/30 transition-all">
                    <div className="flex items-center space-x-6 mb-4 sm:mb-0">
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-[1.5rem] text-indigo-600 shadow-inner group-hover:scale-110 transition-transform">
                        <Calendar className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{app.doctorName}</h4>
                        <div className="flex flex-wrap items-center gap-4 mt-2">
                          <span className="flex items-center text-xs font-bold text-slate-400"><Clock className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> {app.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-8">
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-800">{app.date}</p>
                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 ${app.status === 'upcoming' ? 'text-blue-500' : app.status === 'completed' ? 'text-emerald-500' : 'text-slate-300'}`}>
                          {app.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Calendar className="w-10 h-10 text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No Active Appointments</p>
                  <p className="text-xs text-slate-400 mt-2">Book your first consultation to get started.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
