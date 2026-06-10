import React, { useState, useEffect } from 'react';
import { 
  Milestone, 
  Target, 
  Zap, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Map as MapIcon, 
  Cpu, 
  Award,
  BookOpen,
  TrendingUp,
  BrainCircuit,
  Layout,
  RefreshCcw,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import api from '../lib/api';
import { useWebSocket } from '../hooks/useWebSocket';

// --- Error Boundary ---
class PathErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-[#0A0F1E] rounded-[3rem] border border-accent/20">
          <MapIcon className="w-16 h-16 text-accent mb-6" />
          <h2 className="text-3xl font-black tracking-tighter text-white mb-4">Trajectory Offline</h2>
          <p className="description max-w-md mb-8">The learning trajectory engine encountered a spatial error. Rerouting neural paths.</p>
          <button onClick={() => window.location.reload()} className="px-8 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-xs">Recalculate Path</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Components ---

const MilestoneNode = ({ milestone, index, active, completed }: any) => (
  <div className={cn("relative flex items-center gap-6", !active && !completed && "opacity-30")}>
    <div className="relative flex flex-col items-center">
       <div className={cn(
         "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
         completed ? "bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" :
         active ? "bg-primary/20 border-primary text-primary animate-pulse shadow-[0_0_15px_rgba(0,229,255,0.4)]" :
         "bg-white/5 border-white/10 text-white/40"
       )}>
          {completed ? <ShieldCheck className="w-6 h-6" /> : <milestone.icon className="w-6 h-6" />}
       </div>
       {index < 4 && (
         <div className={cn("w-0.5 h-16 transition-colors duration-500", completed ? "bg-emerald-500/40" : "bg-white/10")} />
       )}
    </div>
    <div className="flex flex-col gap-1 pb-16">
       <span className={cn("text-[9px] font-black uppercase tracking-widest", completed ? "text-emerald-500" : active ? "text-primary" : "text-white/20")}>
          Phase 0{index + 1}
       </span>
       <h4 className="text-lg font-black text-white tracking-tight leading-none">{milestone.title}</h4>
       <p className="text-xs font-medium text-white/40 italic">{milestone.description}</p>
    </div>
  </div>
);

const LearningPath: React.FC = () => {
  const { lastEvent } = useWebSocket();
  const [loading, setLoading] = useState(true);
  
  const milestones = [
    { title: 'Foundational Discovery', description: 'Core principles and enterprise alignment.', icon: Sparkles },
    { title: 'Neural Blueprinting', description: 'Synthesizing specialized domain knowledge.', icon: Cpu },
    { title: 'Cognitive Stress Test', description: 'High-fidelity adaptive assessments.', icon: Zap },
    { title: 'Strategic Execution', description: 'Real-world project simulations.', icon: Layout },
    { title: 'Registry Validation', description: 'Final certification and registry sync.', icon: Award },
  ];

  const init = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  // Real-time listener
  useEffect(() => {
    if (lastEvent?.type === 'learning_started') {
       init(); // Re-sync trajectory
    }
  }, [lastEvent]);

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center gap-8">
       <div className="w-24 h-24 relative">
          <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-4 border-4 border-secondary/20 border-b-secondary rounded-full animate-spin-reverse" />
       </div>
       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Mapping Neural Trajectory...</p>
    </div>
  );

  return (
    <PathErrorBoundary>
      <div className="h-full flex flex-col gap-8 text-white overflow-hidden pb-6 px-6 relative z-10">
        <header className="flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 azure-gradient rounded-2xl flex items-center justify-center shadow-glow">
                <Compass className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Learning Path</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-2">Azure Solutions Architect Trajectory</p>
              </div>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Overall Progress</span>
                 <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-highlight" />
                    <span className="text-2xl font-black text-glow">42%</span>
                 </div>
              </div>
              <div className="h-10 w-px bg-white/10 mx-2" />
              <button onClick={init} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                 <RefreshCcw className="w-3.5 h-3.5" /> Recalculate
              </button>
           </div>
        </header>

        <div className="flex-1 grid grid-cols-12 gap-8 min-h-0">
           {/* Trajectory Map */}
           <div className="col-span-4 os-window rounded-[3rem] p-10 flex flex-col gap-10 overflow-y-auto no-scrollbar">
              <div className="flex items-center gap-3 border-b border-white/5 pb-6">
                 <MapIcon className="w-5 h-5 text-primary" />
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Neural Roadmap</h3>
              </div>
              <div className="flex flex-col">
                 {milestones.map((m, i) => (
                   <MilestoneNode 
                     key={i} 
                     milestone={m} 
                     index={i} 
                     active={i === 2} 
                     completed={i < 2} 
                   />
                 ))}
              </div>
           </div>

           {/* Active Module & AI Coach */}
           <div className="col-span-8 flex flex-col gap-8">
              {/* Active Unit Card */}
              <div className="os-window rounded-[3rem] p-12 relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent shadow-2xl border-white/10 flex-1 flex flex-col justify-between">
                 <div className="absolute top-0 right-0 p-12 opacity-5"><BrainCircuit className="w-48 h-48 text-primary" /></div>
                 <div className="relative z-10 space-y-10">
                    <div className="space-y-4">
                       <div className="flex items-center gap-3 text-primary">
                          <Zap className="w-5 h-5 animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Active Module</span>
                       </div>
                       <h2 className="text-5xl font-black tracking-tighter leading-tight max-w-2xl uppercase italic">
                          Adaptive <span className="text-primary text-glow">Load Balancing</span> Protocols
                       </h2>
                       <p className="text-lg font-medium text-white/60 leading-relaxed italic border-l-2 border-primary/40 pl-8">
                          "Currently optimizing neural pathways for serverless orchestration and region-failover logic."
                       </p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-8">
                       <div className="p-6 bg-white/5 rounded-2xl border border-white/5 group hover:border-primary/20 transition-all">
                          <Clock className="w-5 h-5 text-white/30 mb-3 group-hover:text-primary transition-colors" />
                          <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Est. Duration</p>
                          <p className="text-xl font-black">45 min</p>
                       </div>
                       <div className="p-6 bg-white/5 rounded-2xl border border-white/5 group hover:border-secondary/20 transition-all">
                          <Target className="w-5 h-5 text-white/30 mb-3 group-hover:text-secondary transition-colors" />
                          <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Mastery Lvl</p>
                          <p className="text-xl font-black">Lvl 4/10</p>
                       </div>
                       <div className="p-6 bg-white/5 rounded-2xl border border-white/5 group hover:border-highlight/20 transition-all">
                          <Milestone className="w-5 h-5 text-white/30 mb-3 group-hover:text-highlight transition-colors" />
                          <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Prerequisites</p>
                          <p className="text-xl font-black">Verified</p>
                       </div>
                    </div>
                 </div>

                 <div className="relative z-10 flex gap-6 pt-10 mt-10 border-t border-white/5">
                    <button onClick={() => window.location.href='/assessments'} className="px-12 py-5 azure-gradient rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all">
                       Initialize Focus Cycle
                    </button>
                    <button className="px-12 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                       Review Logic Blueprint
                    </button>
                 </div>
              </div>

              {/* AI Coach Sidebar */}
              <div className="h-64 os-glass rounded-[3rem] p-10 flex items-center gap-10 border-white/10 relative overflow-hidden group">
                 <div className="w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                 </div>
                 <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Neural Feedback Agent</span>
                       <div className="w-2 h-2 rounded-full bg-highlight shadow-[0_0_8px_#7CFF6B]" />
                    </div>
                    <h3 className="text-xl font-bold text-white/90 leading-tight">
                       "Your performance in 'SecOps logic' is trending 12% above the enterprise baseline. However, your cost-modulation skills show high latency. Suggesting a refinement cycle."
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Last Analysis: Just Now | Integrity: 99.8%</p>
                 </div>
                 <ChevronRight className="w-8 h-8 text-white/10 group-hover:text-primary transition-all cursor-pointer" />
              </div>
           </div>
        </div>
      </div>
    </PathErrorBoundary>
  );
};

export default LearningPath;
