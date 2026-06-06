import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowRight, Mail, Lock, Loader2, Sparkles } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await api.post('/auth/login/access-token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      login(response.data.access_token, response.data.refresh_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 canvas-grid opacity-30"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="relative z-10 w-full max-w-[440px] px-6"
      >
        <div className="mica p-8 sm:p-12 rounded-[2.5rem] shadow-2xl border-white/20">
          <div className="flex flex-col items-center text-center mb-10">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.6 }}
              className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl shadow-primary/40"
            >
              <Shield className="w-8 h-8" />
            </motion.div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
              Secure access to CertForge AI <Sparkles className="w-3 h-3 text-primary" />
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  required
                  className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 dark:text-white"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
                <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  required
                  className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-900 dark:text-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs font-bold text-red-500 bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500 font-medium">
              New to CertForge?{' '}
              <button 
                onClick={() => navigate('/register')}
                className="text-primary font-bold hover:underline"
              >
                Join the workforce
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6 text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">
          <span className="cursor-pointer hover:text-white transition-colors">Security</span>
          <span className="cursor-pointer hover:text-white transition-colors">Terms</span>
          <span className="cursor-pointer hover:text-white transition-colors">Infrastructure</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
