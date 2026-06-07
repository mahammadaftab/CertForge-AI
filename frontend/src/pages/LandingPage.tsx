import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  ShieldCheck, 
  Network, 
  Zap,
  ChevronRight,
  Database,
  Terminal,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LivingOSBackground from '../components/LivingOSBackground';
import { cn } from '../lib/utils';

const AgentNode = ({ icon: Icon, label, desc, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 1, ease: [0.22, 1, 0.36, 1] }}
    className="mica p-10 rounded-[3.5rem] border-white/10 flex gap-8 items-center group cursor-pointer hover:bg-white/5 transition-all duration-700 shadow-2xl"
  >
     <div className="p-5 bg-primary/20 rounded-2xl text-primary shadow-xl shadow-primary/20 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
        <Icon className="w-7 h-7" />
     </div>
     <div>
        <h4 className="text-2xl font-black text-white tracking-tighter leading-none">{label}</h4>
        <p className="text-sm text-slate-400 mt-2 font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">"{desc}"</p>
     </div>
     <ArrowRight className="w-5 h-5 text-slate-700 ml-auto group-hover:text-primary group-hover:translate-x-2 transition-all duration-500" />
  </motion.div>
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div className="relative min-h-screen bg-[#02040a] text-white selection:bg-primary/30 overflow-x-hidden font-sans">
      <LivingOSBackground />

      {/* OS Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-28 flex items-center justify-between px-16 z-50">
         <div className="flex items-center gap-5 group cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-[0_0_40px_rgba(255,255,255,0.2)] rotate-3 group-hover:rotate-0 transition-transform duration-700">CF</div>
            <div className="flex flex-col">
               <span className="text-2xl font-black tracking-tighter uppercase leading-none">Foundry OS</span>
               <span className="text-[9px] font-black text-primary tracking-[0.4em] mt-1 uppercase">Intelligence v1.0</span>
            </div>
         </div>
         <div className="flex items-center gap-12">
            {['Architecture', 'Intelligence', 'Security'].map((item) => (
               <span key={item} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 cursor-pointer hover:text-white transition-colors relative group">
                  {item}
                  <div className="absolute -bottom-2 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-500" />
               </span>
            ))}
            <button 
              onClick={() => navigate('/login')}
              className="px-10 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)]"
            >
               Connect Interface
            </button>
         </div>
      </nav>

      {/* Hero OS Stage */}
      <section className="relative h-screen flex flex-col items-center justify-center px-6">
         <motion.div 
           style={{ opacity, scale }}
           className="text-center space-y-16 relative z-10"
         >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-4 px-8 py-3 rounded-full mica border-primary/20 text-primary text-[11px] font-black uppercase tracking-[0.5em] shadow-2xl"
            >
               <div className="w-2 h-2 rounded-full bg-primary animate-ping" /> Neural Flux Synchronized
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="space-y-4"
            >
               <h1 className="text-[9rem] md:text-[14rem] font-black tracking-tighter leading-[0.8] text-white drop-shadow-2xl">
                  CertForge <span className="text-primary text-glow">AI.</span>
               </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-2xl md:text-3xl text-slate-400 font-medium max-w-4xl mx-auto leading-relaxed italic opacity-80"
            >
               A recursive cognitive operating system. <br/>
               Orchestrating <span className="text-white">multi-agent neural workflows</span> for the future of workforce intelligence.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="flex justify-center gap-8"
            >
               <button 
                 onClick={() => navigate('/register')}
                 className="bg-primary text-white px-16 py-7 rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-[0_30px_60px_-10px_rgba(0,120,212,0.6)] hover:scale-[1.03] active:scale-95 transition-all group flex items-center gap-6"
               >
                  Initialize System <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
               </button>
               <button className="mica border-white/10 px-16 py-7 rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:bg-white/5 transition-all hover:border-white/20">
                  Read Neural Specs
               </button>
            </motion.div>
         </motion.div>
      </section>

      {/* Storytelling - The Neural Hierarchy */}
      <section className="relative py-60 px-16 max-w-[1400px] mx-auto">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
               <div className="space-y-6">
                  <h2 className="text-8xl font-black tracking-tighter leading-[0.9]">The Neural <span className="text-primary text-glow">Orchestra.</span></h2>
                  <p className="text-slate-400 text-xl font-medium max-w-xl leading-relaxed italic">Seven autonomous agents working in multi-step recursive loops to decode workforce readiness.</p>
               </div>
               <div className="space-y-6">
                  <AgentNode icon={Zap} label="Workload Agent" desc="Real-time load balancing and burnout resistance telemetry." delay={0.1} />
                  <AgentNode icon={Cpu} label="Success Predictor" desc="Scikit-Learn powered neural success projections." delay={0.2} />
                  <AgentNode icon={Database} label="Fabric IQ" desc="Advanced semantic workforce ontology mapping." delay={0.3} />
               </div>
            </div>
            
            <div className="relative flex items-center justify-center">
               <div className="absolute w-[600px] h-[600px] bg-primary/10 blur-[160px] rounded-full animate-pulse" />
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                 className="relative w-full max-w-[600px] aspect-square rounded-full border border-dashed border-primary/20 flex items-center justify-center"
               >
                  <motion.div 
                    animate={{ scale: [1, 1.08, 1], rotate: [0, 5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="w-48 h-48 bg-slate-900 dark:bg-white rounded-[3.5rem] flex items-center justify-center text-slate-950 shadow-[0_50px_100px_-20px_rgba(0,120,212,0.4)] relative z-10"
                  >
                     <Cpu className="w-24 h-24 text-primary" />
                  </motion.div>
                  
                  {/* Floating Satellites */}
                  {[Zap, ShieldCheck, Network, Database].map((Icon, i) => (
                    <motion.div 
                      key={i}
                      style={{ 
                        position: 'absolute',
                        top: `${50 + 45 * Math.cos(i * Math.PI / 2)}%`,
                        left: `${50 + 45 * Math.sin(i * Math.PI / 2)}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut" }}
                      className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/30"
                    >
                       <Icon className="w-8 h-8" />
                    </motion.div>
                  ))}
               </motion.div>
            </div>
         </div>
      </section>

      {/* Metrics of the Future */}
      <section className="py-60 mica border-none bg-transparent">
         <div className="max-w-7xl mx-auto px-16 grid grid-cols-1 md:grid-cols-3 gap-32">
            <div className="space-y-6 group cursor-pointer">
               <p className="text-[10rem] font-black tracking-tighter text-primary leading-none group-hover:scale-110 transition-transform duration-700">07</p>
               <h3 className="text-3xl font-black uppercase tracking-widest leading-none">Agents Active</h3>
               <p className="text-slate-500 text-lg font-medium italic opacity-70 leading-relaxed">Simultaneous neural logic chains processing enterprise telemetry.</p>
            </div>
            <div className="space-y-6 group cursor-pointer">
               <p className="text-[10rem] font-black tracking-tighter text-emerald-500 leading-none group-hover:scale-110 transition-transform duration-700">12<span className="text-4xl">ms</span></p>
               <h3 className="text-3xl font-black uppercase tracking-widest leading-none">Inference Flux</h3>
               <p className="text-slate-500 text-lg font-medium italic opacity-70 leading-relaxed">Optimized Gemini-Pro uplink with ultra-low latency response cycles.</p>
            </div>
            <div className="space-y-6 group cursor-pointer">
               <p className="text-[10rem] font-black tracking-tighter text-amber-500 leading-none group-hover:scale-110 transition-transform duration-700">92<span className="text-4xl">%</span></p>
               <h3 className="text-3xl font-black uppercase tracking-widest leading-none">Predictive IQ</h3>
               <p className="text-slate-500 text-lg font-medium italic opacity-70 leading-relaxed">Verified ML confidence index across workforce success vectors.</p>
            </div>
         </div>
      </section>

      {/* Footer OS Terminal */}
      <footer className="py-32 border-t border-white/5 bg-[#02040a]/80 backdrop-blur-3xl">
         <div className="max-w-[1400px] mx-auto px-16 flex flex-col md:flex-row justify-between items-center gap-16">
            <div className="flex items-center gap-6 group cursor-pointer">
               <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-slate-950 transition-all duration-500 font-black">CF</div>
               <div className="flex flex-col">
                  <span className="text-lg font-black uppercase tracking-widest">CertForge Intelligence OS</span>
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.5em] mt-1">Foundry Kernel v2.0.4 — Build Stable</span>
               </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-700 text-center md:text-left">
               © 2026 CertForge AI — Engineered for the Microsoft AI Hackathon
            </p>
            <div className="flex gap-12">
               {['Security', 'Terminal', 'Architecture'].map(item => (
                  <span key={item} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-colors cursor-pointer">{item}</span>
               ))}
            </div>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
