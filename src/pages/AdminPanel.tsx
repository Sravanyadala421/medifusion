import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Stethoscope, 
  Plus, 
  BarChart3, 
  Trash2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  DollarSign, 
  ChevronLeft 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DoctorData {
  _id?: string;
  name: string;
  qualification: string;
  specialization: string;
  address: string;
  phone: string;
  fee: number;
}

interface Analytics {
  totalUsers: number;
  totalDoctors: number;
  users: Array<{ name: string; email: string; createdAt: string }>;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'add-doctor'>('analytics');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [formData, setFormData] = useState<DoctorData>({
    name: '',
    qualification: '',
    specialization: '',
    address: '',
    phone: '',
    fee: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Get user email from localStorage
  const getUserEmail = () => {
    const savedUser = localStorage.getItem('medi_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      return user.email;
    }
    return '';
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: getUserEmail() })
      });
      
      if (!res.ok) {
        setMessage({ type: 'error', text: 'Access denied. Admin only.' });
        return;
      }
      
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setMessage({ type: 'error', text: 'Failed to fetch analytics.' });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'fee' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('http://localhost:5000/api/doctors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, email: getUserEmail() })
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Doctor added successfully!' });
        setFormData({ name: '', qualification: '', specialization: '', address: '', phone: '', fee: 0 });
        fetchAnalytics();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to add doctor.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error. Make sure backend is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to User View
          </Link>
          <h1 className="text-3xl font-bold font-black text-slate-900 uppercase">Admin Command Center</h1>
          <p className="text-slate-500 font-medium">Manage healthcare professionals and platform analytics.</p>
        </div>
        <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('add-doctor')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'add-doctor' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Add Doctor
          </button>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-200">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-10 h-10 opacity-50" />
                <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Total Users</span>
              </div>
              <p className="text-5xl font-black mb-2">{analytics?.totalUsers || 0}</p>
              <p className="text-blue-100 text-sm font-bold">Registered platform members</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 rounded-[2rem] text-white shadow-xl shadow-emerald-200">
              <div className="flex items-center justify-between mb-4">
                <Stethoscope className="w-10 h-10 opacity-50" />
                <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Active Doctors</span>
              </div>
              <p className="text-5xl font-black mb-2">{analytics?.totalDoctors || 0}</p>
              <p className="text-emerald-100 text-sm font-bold">Verified healthcare providers</p>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] overflow-hidden border-0">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-800 flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 text-blue-500" />
                User Logs
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Name</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {analytics?.users.map((u, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5 font-bold text-slate-700">{u.name}</td>
                      <td className="px-8 py-5 font-medium text-slate-500">{u.email}</td>
                      <td className="px-8 py-5 text-sm text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {(!analytics?.users || analytics.users.length === 0) && (
                    <tr>
                      <td colSpan={3} className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                        No user data synchronized yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95">
          <div className="glass-card rounded-[2.5rem] p-10 border-0 shadow-2xl">
            <h2 className="text-2xl font-black text-slate-800 mb-8 uppercase tracking-tight">Onboard New Specialist</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <InputField 
                  label="Full Name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Dr. John Doe"
                  required
                />
                <InputField 
                  label="Qualification" 
                  name="qualification" 
                  value={formData.qualification} 
                  onChange={handleInputChange} 
                  placeholder="MBBS, MD (Cardiology)"
                  required
                />
              </div>

              <InputField 
                label="Specialization" 
                name="specialization" 
                value={formData.specialization} 
                onChange={handleInputChange} 
                placeholder="e.g. Cardiologist, Dermatologist"
                required
              />

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Clinic/Hospital Address</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-4 w-5 h-5 text-slate-300" />
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300"
                    placeholder="Enter full medical center address..."
                    rows={3}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <InputField 
                  label="Phone Number" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  placeholder="+1 (555) 000-0000"
                  icon={<Phone className="w-5 h-5 text-slate-300" />}
                  required
                />
                <InputField 
                  label="Consultation Fee ($)" 
                  name="fee" 
                  type="number"
                  value={formData.fee === 0 ? '' : formData.fee.toString()} 
                  onChange={handleInputChange} 
                  placeholder="0.00"
                  icon={<DollarSign className="w-5 h-5 text-slate-300" />}
                  required
                />
              </div>

              {message && (
                <div className={`p-5 rounded-2xl font-bold text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {message.text}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Register Specialist'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, name, value, onChange, placeholder, type = 'text', icon, required }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">{label}</label>
    <div className="relative">
      {icon ? (
        <div className="absolute left-5 top-1/2 -translate-y-1/2">{icon}</div>
      ) : (
        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400/30" />
      )}
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300"
        placeholder={placeholder}
        required={required}
      />
    </div>
  </div>
);

export default AdminPanel;
