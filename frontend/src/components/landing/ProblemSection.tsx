import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ProblemSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen py-32 flex items-center justify-center overflow-hidden border-t border-[#00E5FF]/8">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1E] via-[#0A0F1E]/50 to-[#0A0F1E] z-0" />
      
      <motion.div 
        style={{ y: textY, opacity }} 
        className="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-16"
      >
        <p className="text-[#FF00AA] font-black uppercase tracking-[0.4em] text-sm">The Enterprise Bottleneck</p>
        
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
          Enterprises spend millions on upskilling, yet <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF00AA] to-[#8B5CF6]">certifications stall</span>, skills decay, and tracking remains manual.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          <div className="os-glass p-8 rounded-3xl text-left border-white/5 shadow-2xl">
            <h3 className="text-5xl font-black text-[#00E5FF] mb-4">40%</h3>
            <p className="text-white/60 font-medium leading-relaxed">of enterprise training budgets are wasted due to unaligned study tracks and lack of personalization.</p>
          </div>
          <div className="os-glass p-8 rounded-3xl text-left border-white/5 shadow-2xl">
            <h3 className="text-5xl font-black text-[#8B5CF6] mb-4">3x</h3>
            <p className="text-white/60 font-medium leading-relaxed">longer times to certification without proactive manager intervention and autonomous study workflows.</p>
          </div>
          <div className="os-glass p-8 rounded-3xl text-left border-white/5 shadow-2xl">
            <h3 className="text-5xl font-black text-[#FF00AA] mb-4">0%</h3>
            <p className="text-white/60 font-medium leading-relaxed">visibility into real-time readiness before costly exam vouchers are deployed to the workforce.</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ProblemSection;
