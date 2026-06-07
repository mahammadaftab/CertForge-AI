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
      setError(err.response?.data?.detail || 'System rejected credentials. Identity mismatch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0F1E]">
      {/* OS Background - Living Canvas */}
      <div className="absolute inset-0 living-canvas opacity-40" />
      
      {/* Cyber Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-[#00E5FF]/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-[#8B5CF6]/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className="relative z-10 w-full max-w-[480px] px-6"
      >
        <div className="mica p-10 sm:p-14 rounded-[4rem] shadow-2xl border-[#00E5FF]/15 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#00E5FF]/5 opacity-10 pointer-events-none" />
          
          <div className="flex flex-col items-center text-center mb-12 relative z-10">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="w-20 h-20 bg-[#00E5FF] rounded-3xl flex items-center justify-center text-[#0A0F1E] mb-8 shadow-[0_0_50px_rgba(0,229,255,0.5)] border-4 border-white/10"
            >
              <Shield className="w-10 h-10" />
            </motion.div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-3">
              Initialize <span className="text-[#00E5FF] text-glow">Session.</span>
            </h1>
            <p className="text-white/55 text-xs font-black uppercase tracking-[0.4em] flex items-center gap-3">
               Neural ID Required <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/55 ml-2">Secure Link / Email</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/30 group-focus-within:text-[#00E5FF] transition-colors duration-500" />
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border-2 border-white/8 focus:border-[#00E5FF]/40 rounded-[2rem] py-4.5 pl-14 pr-6 outline-none transition-all duration-500 font-bold text-white shadow-inner"
                  placeholder="admin@certforge.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center ml-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/55">Neural Key / Pass</label>
                <button type="button" className="text-[10px] font-black text-[#00E5FF] hover:text-white uppercase tracking-widest transition-colors">Recover</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/30 group-focus-within:text-[#00E5FF] transition-colors duration-500" />
                <input
                  type="password"
                  required
                  className="w-full bg-white/5 border-2 border-white/8 focus:border-[#00E5FF]/40 rounded-[2rem] py-4.5 pl-14 pr-6 outline-none transition-all duration-500 font-bold text-white shadow-inner"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-[11px] font-black text-[#FF00AA] bg-[#FF00AA]/10 p-4 rounded-2xl border border-[#FF00AA]/20 text-center uppercase tracking-widest leading-relaxed shadow-lg"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-[#0A0F1E] font-black py-5 rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(0,229,255,0.4)] transition-all duration-500 flex items-center justify-center gap-3 group disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Establish Uplink <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-white/8 text-center relative z-10">
            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">
              Unauthorized Access Prohibited.{' '}
              <button 
                onClick={() => navigate('/register')}
                className="text-[#00E5FF] hover:text-white transition-colors ml-1"
              >
                Request Enrollment
              </button>
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-8 text-white/25 font-black text-[9px] uppercase tracking-[0.4em]">
          <span className="cursor-pointer hover:text-[#00E5FF] transition-colors">Encryption</span>
          <span className="cursor-pointer hover:text-[#00E5FF] transition-colors">Foundry-EULA</span>
          <span className="cursor-pointer hover:text-[#00E5FF] transition-colors">V-Protocol</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
