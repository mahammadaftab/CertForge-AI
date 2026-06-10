import React from 'react';
import { cn } from '../lib/utils';
import { 
  Network, 
  GitFork, 
  Target, 
  AlertTriangle, 
  Share2, 
  Activity,
  Zap,
  Cpu,
  BrainCircuit,
  Database
} from 'lucide-react';
import { motion } from 'framer-motion';

const SemanticLayer: React.FC = () => {
  const knowledgeClusters = [
    { name: 'Compute Core', coverage: 94, nodes: 42, status: 'synced' },
    { name: 'Governance Mesh', coverage: 78, nodes: 28, status: 'syncing' },
    { name: 'Data Architecture', coverage: 62, nodes: 56, status: 'warning' },
    { name: 'Security Protocol', coverage: 91, nodes: 31, status: 'synced' },
    { name: 'Network Topology', coverage: 85, nodes: 19, status: 'synced' },
  ];

  return (
    <div className="h-full flex flex-col gap-10 p-10 text-white overflow-hidden relative z-10">
      <header className="flex justify-between items-center">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 azure-gradient rounded-[2rem] flex items-center justify-center shadow-glow">
              <GitFork className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Semantic Layer</h1>
              <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary mt-2">Workforce Knowledge Ontology</p>
            </div>
         </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-10 min-h-0">
         <div className="col-span-8 os-window rounded-[4rem] p-12 relative overflow-hidden bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl flex flex-col gap-8">
            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
               <BrainCircuit className="w-6 h-6 text-primary" />
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Knowledge Cluster Synthesis</h3>
            </div>
            
            <div className="flex-1 grid grid-cols-1 gap-6 overflow-y-auto no-scrollbar pr-4">
               {knowledgeClusters.map((cluster, i) => (
                 <motion.div 
                   key={cluster.name}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] flex items-center justify-between group hover:border-primary/20 transition-all duration-500"
                 >
                    <div className="flex items-center gap-8">
                       <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">
                          <Database className="w-7 h-7 text-white/20 group-hover:text-primary transition-colors" />
                       </div>
                       <div>
                          <h4 className="text-2xl font-black tracking-tight">{cluster.name}</h4>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">{cluster.nodes} Nodes Active</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-12 text-right">
                       <div>
                          <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mb-2">Cluster Integrity</p>
                          <div className="flex items-center gap-4">
                             <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div className="h-full bg-primary shadow-[0_0_10px_#00E5FF]" style={{ width: `${cluster.coverage}%` }} />
                             </div>
                             <span className="text-2xl font-black text-glow">{cluster.coverage}%</span>
                          </div>
                       </div>
                       <div className={cn(
                         "w-12 h-12 rounded-full flex items-center justify-center border transition-all",
                         cluster.status === 'synced' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                         cluster.status === 'warning' ? "bg-accent/10 border-accent/20 text-accent" :
                         "bg-primary/10 border-primary/20 text-primary animate-pulse"
                       )}>
                          <Zap className="w-5 h-5" />
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
         </div>

         <aside className="col-span-4 flex flex-col gap-8">
            <div className="os-glass rounded-[3rem] p-10 flex flex-col gap-8 border-white/10 shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Target className="w-32 h-32 text-primary" /></div>
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Ontology Insights</h3>
               <div className="space-y-6 relative z-10">
                  <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl">
                     <p className="text-sm font-bold text-white/90 leading-relaxed italic">
                        "The Compute Core cluster has reached 94% saturation. Strategic pivot recommended towards Governance optimization."
                     </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <span className="text-[9px] font-black uppercase text-white/20">Sync Rate</span>
                        <p className="text-xl font-black text-primary">0.12s</p>
                     </div>
                     <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                        <span className="text-[9px] font-black uppercase text-white/20">Drift</span>
                        <p className="text-xl font-black text-accent">0.04%</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex-1 os-window rounded-[3rem] p-10 flex flex-col gap-6 bg-gradient-to-br from-white/[0.02] to-transparent border-white/10 shadow-2xl">
               <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-secondary" />
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/60">Logic Mesh</h3>
               </div>
               <div className="flex-1 flex items-center justify-center opacity-10">
                  <Network className="w-24 h-24 text-white" />
               </div>
               <button className="w-full py-5 azure-gradient rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all active:scale-95">
                  Execute Registry Sync
               </button>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default SemanticLayer;
