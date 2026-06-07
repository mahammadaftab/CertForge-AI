import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Brain, Database, Workflow, ShieldCheck, Zap } from 'lucide-react';

const WorkflowSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <section ref={containerRef} className="relative py-40 border-t border-[#00E5FF]/8 overflow-hidden bg-[#0A0F1E]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24 space-y-6">
          <p className="text-[#00E5FF] font-black uppercase tracking-[0.4em] text-sm">Autonomous Execution</p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Multi-Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]">Workflow.</span></h2>
          <p className="text-white/55 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            CertForge operates as a synchronized swarm of specialized AI agents. They orchestrate the entire lifecycle—from gap analysis to success verification.
          </p>
        </div>

        <div className="relative w-full max-w-4xl mx-auto h-[600px] flex items-center justify-center">
          {/* Central Hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 os-glass rounded-full flex items-center justify-center border-2 border-[#00E5FF]/30 z-20 shadow-[0_0_50px_rgba(0,229,255,0.2)]">
            <Brain className="w-12 h-12 text-[#00E5FF]" />
          </div>

          {/* Connectors & Nodes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <motion.path 
              d="M 50% 50% L 20% 20% M 50% 50% L 80% 20% M 50% 50% L 20% 80% M 50% 50% L 80% 80%" 
              stroke="#00E5FF" 
              strokeWidth="2" 
              fill="none" 
              strokeDasharray="10 10"
              style={{ pathLength, opacity: pathLength }}
            />
          </svg>

          {/* Nodes */}
          <motion.div style={{ opacity: pathLength }} className="absolute top-[20%] left-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-10">
            <div className="w-16 h-16 os-glass rounded-2xl flex items-center justify-center border border-[#8B5CF6]/30">
              <Database className="w-8 h-8 text-[#8B5CF6]" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-white/70">Ingest Knowledge</span>
          </motion.div>
          <motion.div style={{ opacity: pathLength }} className="absolute top-[20%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-10">
            <div className="w-16 h-16 os-glass rounded-2xl flex items-center justify-center border border-[#FF00AA]/30">
              <Workflow className="w-8 h-8 text-[#FF00AA]" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-white/70">Orchestrate Plans</span>
          </motion.div>
          <motion.div style={{ opacity: pathLength }} className="absolute top-[80%] left-[20%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-10">
            <div className="w-16 h-16 os-glass rounded-2xl flex items-center justify-center border border-[#7CFF6B]/30">
              <Zap className="w-8 h-8 text-[#7CFF6B]" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-white/70">Execute Study</span>
          </motion.div>
          <motion.div style={{ opacity: pathLength }} className="absolute top-[80%] left-[80%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-10">
            <div className="w-16 h-16 os-glass rounded-2xl flex items-center justify-center border border-[#FFD700]/30">
              <ShieldCheck className="w-8 h-8 text-[#FFD700]" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-white/70">Verify Success</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
