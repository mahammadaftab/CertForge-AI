import React from 'react';
import { ShieldAlert, ArrowLeft, Home, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AccessDenied: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center p-6 bg-[#030712]">
      <div className="relative w-full max-w-2xl">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative z-10 os-window rounded-[3rem] border-red-500/20 bg-red-500/5 p-12 text-center flex flex-col items-center gap-8 shadow-2xl"
        >
          <div className="w-24 h-24 rounded-3xl bg-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_50px_rgba(239,68,68,0.3)] border border-red-500/30">
            <Lock className="w-12 h-12" />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
              Access <span className="text-red-500 text-glow">Denied.</span>
            </h1>
            <div className="flex items-center justify-center gap-3 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black uppercase tracking-[0.4em] text-red-400">
               <ShieldAlert className="w-3.5 h-3.5" /> Security Protocol 403
            </div>
          </div>

          <p className="description text-lg max-w-md italic font-medium leading-relaxed">
            Your current clearance level is insufficient to initialize this module. This attempt has been logged in the global audit trail.
          </p>

          <div className="flex gap-4 mt-4 w-full sm:w-auto">
            <button 
              onClick={() => navigate(-1)}
              className="flex-1 sm:flex-none px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              <ArrowLeft className="w-4 h-4" /> System Rollback
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex-1 sm:flex-none px-10 py-5 azure-gradient rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-3"
            >
              <Home className="w-4 h-4" /> Command Center
            </button>
          </div>

          <div className="pt-8 border-t border-white/5 w-full mt-4">
             <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">
                Neural fingerprint: {Math.random().toString(16).substring(2, 10).toUpperCase()} | Node: WEST-US-3
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccessDenied;
