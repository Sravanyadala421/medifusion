
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  LayoutDashboard,
  Stethoscope,
  Pill,
  ShieldCheck,
  Calendar,
  User,
  LogOut,
  PhoneCall,
  Search,
  Bell,
  Menu,
  X,
  CreditCard
} from 'lucide-react';

import { User as UserType, Appointment } from '../types';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DoctorListing from './pages/DoctorListing';
import MedicineAnalyzer from './pages/MedicineAnalyzer';
import CombinationChecker from './pages/CombinationChecker';
import AppointmentBooking from './pages/AppointmentBooking';
import PaymentPage from './pages/PaymentPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanel from './pages/AdminPanel';

// Defined ProtectedRoute outside and typed with React.FC to handle children and user props correctly
const ProtectedRoute: React.FC<{ user: UserType | null; children: React.ReactNode }> = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Admin-only route protection
const AdminRoute: React.FC<{ user: UserType | null; children: React.ReactNode }> = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize with mock data if needed
  useEffect(() => {
    const savedUser = localStorage.getItem('medi_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Load user-specific appointments
      const savedAppointments = localStorage.getItem(`appointments_${parsedUser.id}`);
      if (savedAppointments) {
        setAppointments(JSON.parse(savedAppointments));
      }
    }
  }, []);

  const handleLogin = async (u: UserType) => {
    setUser(u);
    localStorage.setItem('medi_user', JSON.stringify(u));

    // Load user-specific appointments
    const savedAppointments = localStorage.getItem(`appointments_${u.id}`);
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    } else {
      setAppointments([]);
    }

    // Sync user with backend
    try {
      await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(u)
      });
    } catch (err) {
      console.error("Failed to sync user with backend:", err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAppointments([]);
    localStorage.removeItem('medi_user');
  };

  const addAppointment = (app: Appointment) => {
    if (!user) return;
    
    const updatedAppointments = [app, ...appointments];
    setAppointments(updatedAppointments);
    
    // Save to localStorage with user ID
    localStorage.setItem(`appointments_${user.id}`, JSON.stringify(updatedAppointments));
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex">
        {user && (
          <>
            {/* Sidebar for Desktop */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 glass-card border-r-0 transform transition-transform duration-500 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <div className="h-full flex flex-col">
                <div className="p-6 flex items-center space-x-3 text-blue-600 animate-fade-in" style={{ animationDelay: '100ms' }}>
                  <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-2xl font-bold tracking-tight gradient-text">MediFusion</span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                  <SidebarLink to="/" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" onClick={() => setIsSidebarOpen(false)} />
                  <SidebarLink to="/doctors" icon={<Stethoscope className="w-5 h-5" />} label="Find Doctors" onClick={() => setIsSidebarOpen(false)} />
                  <SidebarLink to="/analyzer" icon={<Pill className="w-5 h-5" />} label="Medicine Analyzer" onClick={() => setIsSidebarOpen(false)} />
                  <SidebarLink to="/checker" icon={<ShieldCheck className="w-5 h-5" />} label="Safety Checker" onClick={() => setIsSidebarOpen(false)} />
                  <SidebarLink to="/appointments" icon={<Calendar className="w-5 h-5" />} label="My Appointments" onClick={() => setIsSidebarOpen(false)} />
                  {user.isAdmin && (
                    <SidebarLink to="/admin" icon={<ShieldCheck className="w-5 h-5" />} label="Admin Dashboard" onClick={() => setIsSidebarOpen(false)} />
                  )}
                </nav>

                <div className="p-4 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            </aside>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
              <div
                className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
          </>
        )}

        <main className={`flex-1 flex flex-col ${user ? 'md:ml-64' : ''}`}>
          {user && (
            <header className="sticky top-0 z-30 glass-nav px-4 md:px-8 py-4 flex items-center justify-between">
              <button
                className="md:hidden p-2 text-slate-600 hover:bg-white/50 rounded-lg transition-colors"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="hidden md:flex items-center bg-white/50 px-4 py-2 rounded-full w-96 border border-white/20 shadow-sm transition-all focus-within:w-[450px] focus-within:shadow-md">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search symptoms, doctors, medicines..."
                  className="bg-transparent border-none focus:ring-0 text-sm w-full text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-slate-600 hover:bg-white/50 rounded-full transition-colors group">
                  <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <Link to="/profile" className="flex items-center space-x-3 pl-4 border-l border-slate-200 hover:opacity-80 transition-opacity">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-slate-800">{user.name}</p>
                    <p className="text-xs font-medium text-slate-400">{user.email}</p>
                  </div>
                  <div className="relative group">
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-blue-100 group-hover:border-blue-500 transition-colors cursor-pointer" />
                    ) : (
                      <div className="w-10 h-10 rounded-full border-2 border-blue-100 group-hover:border-blue-500 transition-colors cursor-pointer bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-full bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </Link>
              </div>
            </header>
          )}

          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />} />
              <Route path="/" element={<ProtectedRoute user={user}><Dashboard user={user!} appointments={appointments} /></ProtectedRoute>} />
              <Route path="/doctors" element={<ProtectedRoute user={user}><DoctorListing /></ProtectedRoute>} />
              <Route path="/analyzer" element={<ProtectedRoute user={user}><MedicineAnalyzer /></ProtectedRoute>} />
              <Route path="/checker" element={<ProtectedRoute user={user}><CombinationChecker /></ProtectedRoute>} />
              <Route path="/appointments" element={<ProtectedRoute user={user}><ProfilePage appointments={appointments} user={user!} /></ProtectedRoute>} />
              <Route path="/booking/:id" element={<ProtectedRoute user={user}><AppointmentBooking onBook={addAppointment} /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute user={user}><PaymentPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute user={user}><ProfilePage appointments={appointments} user={user!} /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute user={user}><AdminPanel /></AdminRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center px-4 py-3 text-sm font-medium text-slate-600 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all group"
    >
      <span className="mr-3 group-hover:scale-110 transition-transform">{icon}</span>
      {label}
    </Link>
  );
};

export default App;
