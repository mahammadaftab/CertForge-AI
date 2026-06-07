import React from 'react';
import { motion } from 'framer-motion';
import { Database, Brain, BarChart, Bot } from 'lucide-react';

const WorkflowVisualizer: React.FC = () => {
  return (
    <div className="relative w-full max-w-5xl mx-auto h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* Nodes */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/2 left-[10%] -translate-y-1/2 flex flex-col items-center gap-4"
      >
        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#0A0F1E] border-2 border-[#00E5FF]/30 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.2)] z-10 relative">
          <Database className="w-8 h-8 md:w-10 md:h-10 text-[#00E5FF]" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-[#00E5FF]/20 rounded-2xl blur-xl"
          />
        </div>
        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/60">Data Lake</span>
      </motion.div>

      {/* Agent 1 */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-[20%] left-[45%] flex flex-col items-center gap-4"
      >
        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#0A0F1E] border-2 border-[#8B5CF6]/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.2)] z-10 relative">
          <Brain className="w-8 h-8 md:w-10 md:h-10 text-[#8B5CF6]" />
        </div>
        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/60">Fabric IQ</span>
      </motion.div>

      {/* Agent 2 */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute top-[70%] left-[45%] flex flex-col items-center gap-4"
      >
        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#0A0F1E] border-2 border-[#FF00AA]/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,0,170,0.2)] z-10 relative">
          <Bot className="w-8 h-8 md:w-10 md:h-10 text-[#FF00AA]" />
        </div>
        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/60">Predictor</span>
      </motion.div>

      {/* Output */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute top-1/2 right-[10%] -translate-y-1/2 flex flex-col items-center gap-4"
      >
        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#00E5FF] text-[#0A0F1E] border-2 border-white/20 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(0,229,255,0.5)] z-10 relative hover:scale-110 transition-transform cursor-pointer">
          <BarChart className="w-8 h-8 md:w-10 md:h-10" />
        </div>
        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white">Live Insights</span>
      </motion.div>

      {/* Connection Lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
        {/* Lake to IQ */}
        <motion.path 
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          d="M 15% 50% C 30% 50%, 35% 25%, 45% 25%" 
          fill="none" 
          stroke="url(#gradient-primary)" 
          strokeWidth="3" 
          strokeDasharray="5 5"
        />
        {/* Lake to Predictor */}
        <motion.path 
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
          d="M 15% 50% C 30% 50%, 35% 75%, 45% 75%" 
          fill="none" 
          stroke="url(#gradient-secondary)" 
          strokeWidth="3" 
          strokeDasharray="5 5"
        />
        {/* IQ to Output */}
        <motion.path 
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.4 }}
          d="M 55% 25% C 65% 25%, 70% 50%, 85% 50%" 
          fill="none" 
          stroke="url(#gradient-accent)" 
          strokeWidth="3" 
          strokeDasharray="5 5"
        />
        {/* Predictor to Output */}
        <motion.path 
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.6 }}
          d="M 55% 75% C 65% 75%, 70% 50%, 85% 50%" 
          fill="none" 
          stroke="url(#gradient-primary)" 
          strokeWidth="3" 
          strokeDasharray="5 5"
        />

        <defs>
          <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="gradient-secondary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="gradient-accent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7CFF6B" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#7CFF6B" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Moving Particles on Paths */}
      <motion.div 
        animate={{ left: ['15%', '45%'], top: ['50%', '25%'], opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute w-3 h-3 bg-[#00E5FF] rounded-full blur-[2px] z-20 -translate-x-1/2 -translate-y-1/2"
      />
      <motion.div 
        animate={{ left: ['15%', '45%'], top: ['50%', '75%'], opacity: [0, 1, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear", delay: 0.5 }}
        className="absolute w-3 h-3 bg-[#8B5CF6] rounded-full blur-[2px] z-20 -translate-x-1/2 -translate-y-1/2"
      />
      <motion.div 
        animate={{ left: ['55%', '85%'], top: ['25%', '50%'], opacity: [0, 1, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 1 }}
        className="absolute w-3 h-3 bg-[#FF00AA] rounded-full blur-[2px] z-20 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};

export default WorkflowVisualizer;
