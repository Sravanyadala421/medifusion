
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Pill,
  ShieldCheck,
  PhoneCall,
  Calendar,
  ArrowRight,
  MapPin,
  Clock,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { User, Appointment, Doctor } from '../types';
import { findNearbyDoctors } from '../services/geminiService';

interface DashboardProps {
  user: User;
  appointments: Appointment[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, appointments }) => {
  const upcomingApps = appointments.filter(a => a.status === 'upcoming');

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-8 text-white shadow-2xl shadow-blue-200 animate-fade-in">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Hello, {user.name}!</h1>
          <p className="text-blue-50 text-lg md:text-xl mb-8 leading-relaxed opacity-90">How are you feeling today? Check your upcoming appointments or explore our smart health tools below.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/analyzer" className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center">
              Analyze Medicine <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/doctors" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all">
              Find a Specialist
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <Activity className="w-full h-full transform translate-x-1/4 translate-y-1/4 rotate-12" />
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Col: Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-3 text-blue-500" />
              Quick Actions
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <ActionCard
                to="/analyzer"
                icon={<Pill className="w-8 h-8 text-emerald-600" />}
                title="Medicine Analyzer"
                desc="Upload prescriptions or medicines to get detailed information."
                bgColor="bg-emerald-50"
              />
              <ActionCard
                to="/checker"
                icon={<ShieldCheck className="w-8 h-8 text-blue-600" />}
                title="Safety Checker"
                desc="Check if combined medicines are safe to consume."
                bgColor="bg-blue-50"
              />
              <ActionCard
                to="/doctors"
                icon={<Stethoscope className="w-8 h-8 text-indigo-600" />}
                title="Find Doctors"
                desc="Search for specialists near your current location."
                bgColor="bg-indigo-50"
              />
              <ActionCard
                to="/doctors"
                icon={<PhoneCall className="w-8 h-8 text-purple-600" />}
                title="Tele-Consultation"
                desc="Request a phone or video call with a verified expert."
                bgColor="bg-purple-50"
              />
            </div>
          </section>
        </div>

        {/* Right Col: Health Stats & Upcoming */}
        <div className="space-y-8">
          <section className="glass-card rounded-[2rem] p-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-blue-500" />
              Upcoming Visits
            </h2>
            {upcomingApps.length > 0 ? (
              <div className="space-y-4">
                {upcomingApps.map(app => (
                  <div key={app.id} className="p-4 bg-white/50 rounded-2xl border border-white/50 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-slate-800">{app.doctorName}</p>
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        {app.type}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                      {app.date} • {app.time}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <CheckCircle2 className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm text-slate-500 font-medium">No upcoming appointments</p>
                <Link to="/doctors" className="text-sm font-bold text-blue-600 mt-3 inline-block hover:underline">Book a session</Link>
              </div>
            )}
          </section>

          <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 text-white shadow-xl animate-fade-in" style={{ animationDelay: '500ms' }}>
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-3 text-emerald-400" />
              Health Summary
            </h2>
            <div className="space-y-6">
              <HealthStat label="Blood Pressure" value="120/80" unit="mmHg" status="Normal" />
              <HealthStat label="Heart Rate" value="72" unit="BPM" status="Optimal" />
              <HealthStat label="Sleep" value="7.5" unit="Hours" status="Good" />
            </div>
            <button className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-sm font-bold transition-all border border-white/10 active:scale-95">
              View Detailed Analytics
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

const ActionCard = ({ to, icon, title, desc, bgColor }: { to: string, icon: React.ReactNode, title: string, desc: string, bgColor: string }) => (
  <Link to={to} className="group p-6 glass-card rounded-[2rem] border-0 hover:shadow-2xl hover:shadow-blue-200/50 hover:-translate-y-2 transition-all duration-300">
    <div className={`${bgColor} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-sm`}>
      {icon}
    </div>
    <h3 className="text-lg font-extrabold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
    <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
  </Link>
);

const HealthStat = ({ label, value, unit, status }: { label: string, value: string, unit: string, status: string }) => (
  <div className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0 last:pb-0">
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-bold text-lg">{value} <span className="text-xs font-medium text-slate-400 uppercase">{unit}</span></p>
    </div>
    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full">{status}</span>
  </div>
);

export default Dashboard;
