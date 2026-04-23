import React, { useState } from 'react';
import { Heart, Mail, Lock, ShieldCheck, Activity, Users, User as UserIcon, Weight, Ruler } from 'lucide-react';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    weight: '',
    height: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isRegister) {
        // Validate password
        if (!validatePassword(formData.password)) {
          setError('Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character');
          setIsLoading(false);
          return;
        }

        // Register user
        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            age: parseInt(formData.age),
            weight: parseFloat(formData.weight),
            height: parseFloat(formData.height)
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error || 'Registration failed');
          setIsLoading(false);
          return;
        }

        onLogin({
          id: data.id,
          name: data.name,
          email: data.email,
          age: data.age,
          weight: data.weight,
          height: data.height,
          isAdmin: data.isAdmin,
          authProvider: data.authProvider,
          avatar: `https://picsum.photos/seed/${data.email}/100/100`
        });
      } else {
        // Login user
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          setError(data.error || 'Login failed');
          setIsLoading(false);
          return;
        }

        onLogin({
          id: data.id,
          name: data.name,
          email: data.email,
          age: data.age,
          weight: data.weight,
          height: data.height,
          isAdmin: data.isAdmin,
          authProvider: data.authProvider,
          avatar: data.avatar || `https://picsum.photos/seed/${data.email}/100/100`
        });
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // In production, this would use Google OAuth
      // For now, we'll use a simple implementation that works with the backend
      const email = prompt('Enter your Gmail address for Google Sign-In:');
      
      if (!email) {
        setIsLoading(false);
        return;
      }
      
      if (!email.endsWith('@gmail.com')) {
        setError('Only Gmail addresses are permitted.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: email.split('@')[0],
          email: email,
          avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=3b82f6&color=fff`
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Google login failed');
        setIsLoading(false);
        return;
      }

      onLogin({
        id: data.id,
        name: data.name,
        email: data.email,
        age: data.age,
        weight: data.weight,
        height: data.height,
        isAdmin: data.isAdmin,
        authProvider: data.authProvider,
        avatar: data.avatar
      });
    } catch (err) {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-md mx-auto">
          <div className="flex items-center space-x-3 mb-12">
            <Heart className="w-10 h-10" />
            <span className="text-3xl font-bold">MediFusion</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight">Your Smart Health Assistant Platform.</h1>
          <p className="text-blue-100 text-lg mb-10">
            A secure digital haven for all your medical needs. From medication analysis to instant doctor consultations.
          </p>

          <div className="space-y-6">
            <Feature icon={<ShieldCheck className="w-6 h-6" />} title="AI-Powered Diagnosis" desc="Smart analysis of symptoms and medications." />
            <Feature icon={<Activity className="w-6 h-6" />} title="Live Monitoring" desc="Track your appointments and health history." />
            <Feature icon={<Users className="w-6 h-6" />} title="Expert Doctors" desc="Connect with verified healthcare professionals." />
          </div>
        </div>
      </div>

      {/* Login/Register Form Side */}
      <div className="flex flex-col justify-center items-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8 text-blue-600">
            <Heart className="w-8 h-8" />
            <span className="text-2xl font-bold">MediFusion</span>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-slate-500">
              {isRegister ? 'Register to get started' : 'Sign in to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-900"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder={isRegister ? "Min 8 chars, 1 upper, 1 lower, 1 number, 1 special" : "Enter your password"}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-900"
                  required
                />
              </div>
            </div>

            {isRegister && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      placeholder="25"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Weight (kg)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      placeholder="70"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Height (cm)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                      placeholder="175"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-900"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center">
                <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-3 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 disabled:opacity-70"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <p className="text-center mt-6 text-slate-600 text-sm">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
                setFormData({ name: '', email: '', password: '', age: '', weight: '', height: '' });
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </p>

          <p className="text-center mt-4 text-slate-500 text-xs">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex items-start space-x-4">
    <div className="bg-white/10 p-2 rounded-lg">{icon}</div>
    <div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-blue-100 text-sm opacity-80">{desc}</p>
    </div>
  </div>
);

const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default LoginPage;
