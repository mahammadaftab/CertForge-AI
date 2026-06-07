
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Command } from 'lucide-react';

const MagneticButton = ({ children, onClick, className }: any) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-40 px-6 relative border-t border-[#00E5FF]/8 overflow-hidden bg-[#0A0F1E]">
      <div className="max-w-5xl mx-auto os-glass p-16 md:p-24 rounded-[4rem] text-center border-[#00E5FF]/20 relative overflow-hidden group shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00E5FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_90deg_at_50%_50%,#00E5FF11,#8B5CF611,#FF00AA11,#00E5FF11)] animate-[aurora-spin_10s_linear_infinite] opacity-50" />
        
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 relative z-10 text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">Initialize System</h2>
        <p className="text-white/60 text-xl mb-16 max-w-2xl mx-auto relative z-10 leading-relaxed font-medium">
          Deploy the world's first AI operating system for enterprise certification intelligence. Stop tracking. Start predicting.
        </p>
        
        <MagneticButton 
          onClick={() => navigate('/command-center')}
          className="bg-white text-[#0A0F1E] px-12 py-5 rounded-full font-black uppercase tracking-widest text-[11px] shadow-[0_20px_50px_-10px_rgba(255,255,255,0.6)] inline-flex items-center justify-center gap-4 hover:shadow-[0_20px_60px_-10px_rgba(0,229,255,0.6)] transition-shadow relative z-10"
        >
          <Command className="w-4 h-4" /> Launch Command Center
        </MagneticButton>
      </div>
    </section>
  );
};

export default CTASection;
