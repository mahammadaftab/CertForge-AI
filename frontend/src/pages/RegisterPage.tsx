import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, ArrowLeft, Mail, Lock, User, Briefcase, Loader2, Sparkles } from 'lucide-react';
import api from '../lib/api';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('associate');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', {
        email,
        password,
        full_name: fullName,
        role,
      });
      navigate('/login');
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      let errorMsg = 'Registry rejection. Conflict detected in data packet.';
      if (typeof detail === 'string') {
        errorMsg = detail;
      } else if (Array.isArray(detail) && detail.length > 0 && detail[0].msg) {
        errorMsg = detail[0].msg;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#010204] py-20">
      {/* OS Background - Living Canvas */}
      <div className="absolute inset-0 living-canvas opacity-40" />
      
      {/* Cyber Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-secondary/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40, filter: 'blur(30px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ type: "spring", damping: 25, stiffness: 100 }}
        className="relative z-10 w-full max-w-[540px] px-6"
      >
        <div className="mica p-10 sm:p-16 rounded-[4.5rem] shadow-2xl border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-secondary/5 opacity-5 pointer-events-none" />
          
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] description hover:text-primary transition-all mb-12 group relative z-10"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-2 transition-transform duration-500" /> System Rollback
          </button>

          <div className="text-left mb-12 relative z-10">
            <h1 className="text-5xl font-black tracking-tighter text-white mb-4 leading-none">
              Enroll <span className="text-primary text-glow">Node.</span>
            </h1>
            <p className="description text-sm font-medium italic">
              Integrating human capital into the <span className="text-white">CertForge ecosystem.</span>
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6 relative z-10">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] description ml-2">Identity / Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 description group-focus-within:text-primary transition-colors duration-500" />
                  <input
                    type="text"
                    required
                    className="w-full bg-white/5 border-2 border-white/5 focus:border-primary/40 rounded-[2rem] py-4.5 pl-14 pr-6 outline-none transition-all duration-500 font-bold text-white shadow-inner"
                    placeholder="Subject Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] description ml-2">Digital Address / Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 description group-focus-within:text-primary transition-colors duration-500" />
                  <input
                    type="email"
                    required
                    className="w-full bg-white/5 border-2 border-white/5 focus:border-primary/40 rounded-[2rem] py-4.5 pl-14 pr-6 outline-none transition-all duration-500 font-bold text-white shadow-inner"
                    placeholder="node@certforge.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] description ml-2">Clearance Level</label>
                <div className="relative group">
                  <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 description group-focus-within:text-primary transition-colors duration-500 z-10" />
                  <select
                    className="w-full bg-white/5 border-2 border-white/5 focus:border-primary/40 rounded-[2rem] py-4.5 pl-14 pr-6 outline-none transition-all duration-500 font-bold text-white appearance-none cursor-pointer shadow-inner relative z-0"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="associate" className="bg-[#010204]">Lvl 1 — Associate</option>
                    <option value="controller" className="bg-[#010204]">Lvl 4 — Controller</option>
                    <option value="root_admin" className="bg-[#010204]">Lvl 9 — Root Admin</option>
                  </select>
                  <Sparkles className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none opacity-40" />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] description ml-2">Neural Key / Pass</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 description group-focus-within:text-primary transition-colors duration-500" />
                  <input
                    type="password"
                    required
                    className="w-full bg-white/5 border-2 border-white/5 focus:border-primary/40 rounded-[2rem] py-4.5 pl-14 pr-6 outline-none transition-all duration-500 font-bold text-white shadow-inner"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-[11px] font-black text-secondary bg-secondary/10 p-5 rounded-3xl border border-secondary/20 text-center uppercase tracking-widest shadow-xl"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold font-black py-6 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,242,255,0.5)] transition-all duration-500 flex items-center justify-center gap-4 group disabled:opacity-50 uppercase tracking-[0.25em] text-xs"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Commit Registry <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
                </>
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-[9px] description font-black uppercase tracking-[0.4em] leading-relaxed relative z-10">
            Node registration implies consent to <span className="text-white underline cursor-pointer">Protocol-7</span> and <span className="text-white underline cursor-pointer">Neural Privacy Acts.</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
