
import { motion, useScroll, useTransform } from 'framer-motion';
import { Command, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LivingOSBackground from '../LivingOSBackground';

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

const HeroSection = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  const brands = ['Google Antigravity', 'Apple', 'Google Gemini', 'Linear', 'OpenAI', 'Microsoft Copilot', 'Vercel'];

  return (
    <>
      <LivingOSBackground />
      
      {/* Hero Content */}
      <section className="relative min-h-[90vh] flex flex-col items-center px-6 pt-[90px] overflow-hidden">
         <motion.div 
           style={{ opacity, y, scale }}
           className="text-center relative z-20 w-full max-w-6xl flex flex-col items-center"
         >
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full os-glass border-[#00E5FF]/20 text-[#00E5FF] text-[10px] font-black uppercase tracking-[0.4em] shadow-xl mb-6"
            >
               <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" /> Global Intelligence Online
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="mb-5"
            >
               <h1 className="text-7xl md:text-[9rem] lg:text-[11rem] font-black tracking-tighter leading-[0.85] text-white drop-shadow-2xl">
                  CertForge <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#FF00AA] animate-gradient bg-300% drop-shadow-[0_0_40px_rgba(0,229,255,0.4)]">AI.</span>
               </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-xl md:text-3xl text-white/70 font-medium max-w-4xl mx-auto leading-relaxed mb-6"
            >
               Enterprise Certification Intelligence Platform <br className="hidden md:block"/>
               powered by <span className="text-white font-bold">Multi-Agent AI</span>.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="flex flex-col sm:flex-row justify-center gap-6"
            >
               <MagneticButton 
                 onClick={() => navigate('/command-center')}
                 className="bg-white text-[#0A0F1E] px-12 py-5 rounded-full font-black uppercase tracking-widest text-[11px] shadow-[0_20px_50px_-10px_rgba(255,255,255,0.6)] flex items-center justify-center gap-4 hover:shadow-[0_20px_60px_-10px_rgba(0,229,255,0.6)] transition-shadow"
               >
                  <Command className="w-4 h-4" /> Launch Command Center
               </MagneticButton>
               <MagneticButton className="os-glass px-12 py-5 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all flex items-center justify-center gap-4 group hover:border-white/30 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                  <Sparkles className="w-4 h-4 text-[#8B5CF6] group-hover:animate-pulse" /> Explore Intelligence Network
               </MagneticButton>
            </motion.div>
         </motion.div>
      </section>

      {/* Trusted Brands Marquee */}
      <section className="relative py-16 border-t border-[#00E5FF]/8 overflow-hidden bg-[#0A0F1E]/40 backdrop-blur-md">
         <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-[#0A0F1E] to-transparent z-20 pointer-events-none" />
         <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-[#0A0F1E] to-transparent z-20 pointer-events-none" />
         
         <div className="max-w-7xl mx-auto px-6 mb-10 text-center relative z-20">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]">
               Architected For & Inspired By
            </p>
         </div>

         <div className="flex overflow-hidden relative z-10 w-full">
            <motion.div
               animate={{ x: ["0%", "-50%"] }}
               transition={{ ease: "linear", duration: 30, repeat: Infinity }}
               className="flex gap-16 md:gap-32 items-center whitespace-nowrap px-8 w-max"
            >
               {[...brands, ...brands, ...brands].map((brand, i) => (
                 <div key={i} className="flex items-center gap-4 group cursor-default">
                   <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-[#00E5FF] transition-colors shadow-[0_0_10px_rgba(0,229,255,0)] group-hover:shadow-[0_0_15px_rgba(0,229,255,0.8)]" />
                   <span className="text-xl md:text-2xl font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-all duration-500 drop-shadow-[0_0_0px_rgba(255,255,255,0)] hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">
                     {brand}
                   </span>
                 </div>
               ))}
            </motion.div>
         </div>
      </section>
    </>
  );
};

export default HeroSection;
