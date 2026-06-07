import React from 'react';
import { 
  Activity, 
  Clock, 
  Brain, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  BarChart2,
  Sparkles,
  LayoutDashboard,
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const FoundryIQ: React.FC = () => {
  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary"><Brain className="w-5 h-5" /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">Intelligence / Core</span>
           </div>
           <h1 className="text-6xl font-black tracking-tighter dark:text-white leading-[0.9]">Foundry <span className="text-primary">Intelligence.</span></h1>
           <p className="text-foreground/60 text-lg font-medium max-w-2xl italic">Grounded workforce insights powered by the Fabric IQ semantic engine.</p>
        </div>
        <div className="flex gap-4">
           <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-12 h-12 rounded-2xl border-4 border-background dark:border-[#02040a] bg-foreground/5 dark:bg-white/10 flex items-center justify-center text-[10px] font-black" />
              ))}
           </div>
           <button className="mica px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary hover-lift">
              Sync Real-time
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="mica p-10 rounded-[3.5rem] relative overflow-hidden group shadow-2xl border-white/20"
          >
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-1000">
              <Activity className="w-64 h-64 text-primary" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-primary rounded-2xl text-white shadow-xl shadow-primary/30">
                  <Cpu className="w-7 h-7" />
                </div>
                <div>
                   <h3 className="text-2xl font-black dark:text-white tracking-tighter leading-none">Work IQ Optimizer</h3>
                   <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-2">Active Workforce Modulation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-8 rounded-[2.5rem] bg-foreground/5 dark:bg-white/5 border border-white/5 hover:border-primary/40 transition-all cursor-pointer group shadow-xl">
                    <p className="text-[9px] font-black text-foreground/40 uppercase tracking-widest mb-2">Optimal Study Window</p>
                    <p className="text-2xl font-black text-primary group-hover:scale-105 transition-transform duration-500">09:00 AM — 10:45 AM</p>
                    <div className="mt-4 flex items-center gap-2 text-emerald-500">
                       <Sparkles className="w-3 h-3" />
                       <span className="text-[8px] font-black uppercase tracking-tighter">High Focus Confidence</span>
                    </div>
                  </div>
                  <div className="p-8 rounded-[2.5rem] bg-foreground/5 dark:bg-white/5 border border-white/5 hover:border-primary/40 transition-all cursor-pointer group shadow-xl">
                    <p className="text-[9px] font-black text-foreground/40 uppercase tracking-widest mb-2">Aggregate Focus Score</p>
                    <div className="flex items-end gap-3">
                      <p className="text-5xl font-black dark:text-white">88.4</p>
                      <p className="text-xs font-black text-emerald-500 mb-1.5 uppercase tracking-widest">+12% WoW</p>
                    </div>
                  </div>
                </div>

                <div className="mica p-8 rounded-[2.5rem] flex flex-col justify-between border-white/10 shadow-xl">
                   <div>
                      <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-8 text-foreground/40">Load Distribution</h4>
                      <div className="space-y-6">
                        {[
                          { label: 'Meetings / Synchs', val: 65, color: 'bg-blue-500' },
                          { label: 'Deep Focus', val: 25, color: 'bg-emerald-500' },
                          { label: 'Neural Training', val: 10, color: 'bg-primary' },
                        ].map((item, i) => (
                          <div key={i} className="space-y-3">
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                              <span className="text-foreground/40">{item.label}</span>
                              <span className="dark:text-white">{item.val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-foreground/5 dark:bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${item.val}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className={cn("h-full rounded-full", item.color)} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                   <div className="mt-10 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-3 text-amber-500 bg-amber-500/5 p-3 rounded-2xl border border-amber-500/10">
                        <Clock className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Burnout Index: Moderate Risk</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mica p-10 rounded-[3.5rem] border-white/20 relative overflow-hidden shadow-2xl">
             <div className="absolute inset-0 living-canvas opacity-5 pointer-events-none" />
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black dark:text-white tracking-tighter leading-none">Grounded Knowledge</h3>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-2">Verified Skill Blueprints</p>
                  </div>
                </div>
                <button className="bg-[#02040a] dark:bg-white text-white dark:text-[#02040a] px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover-lift shadow-2xl transition-all">
                  Ingest Protocol
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {[
                  { title: 'AZ-900 Implementation', source: 'Core Wiki', date: '2H AGO', color: 'blue' },
                  { title: 'Cloud Security v2.4', source: 'SecOps', date: '5H AGO', color: 'red' },
                  { title: 'Workload Balance 1.0', source: 'Systems', date: '1D AGO', color: 'indigo' },
                ].map((doc, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-[2.5rem] bg-white/5 dark:bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer group flex flex-col justify-between h-[200px] shadow-xl"
                  >
                    <div>
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors", `bg-${doc.color}-500/10 text-${doc.color}-500`)}>
                        <LayoutDashboard className="w-5 h-5" />
                      </div>
                      <p className="font-black text-sm dark:text-white leading-tight group-hover:text-emerald-500 transition-colors">{doc.title}</p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <p className="text-[8px] font-black text-foreground/30 uppercase tracking-tighter">{doc.source} • {doc.date}</p>
                      <ChevronRight className="w-3 h-3 text-foreground/20 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="mica p-10 rounded-[3.5rem] bg-[#02040a] text-white border-none shadow-[0_40px_80px_-20px_rgba(0,120,212,0.4)] relative overflow-hidden"
           >
              <div className="absolute inset-0 living-canvas opacity-20 pointer-events-none" />
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-primary fill-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">OS Efficiency Score</span>
                 </div>
                 <div>
                    <p className="text-8xl font-black tracking-tighter leading-none">92%</p>
                    <div className="mt-4 flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                       <TrendingUp className="w-4 h-4" /> 15% Above Sector Base
                    </div>
                 </div>
                 <p className="text-sm font-medium opacity-60 leading-relaxed italic">
                    "Your workforce clusters are performing with high cognitive alignment. Suggesting immediate AZ-104 deployment for Squad Alpha."
                 </p>
                 <button className="w-full bg-white/10 backdrop-blur-xl border border-white/10 hover:bg-white/20 transition-all py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest">
                    Generate Neural Audit
                 </button>
              </div>
           </motion.div>

           <div className="mica p-10 rounded-[3.5rem] border-white/20 shadow-2xl">
              <h4 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
                <BarChart2 className="w-4 h-4 text-primary" /> Team Saturation
              </h4>
              <div className="space-y-8">
                {[
                  { name: 'Cloud Ops', cap: 82, color: 'bg-primary' },
                  { name: 'Infrastructure', cap: 45, color: 'bg-emerald-500' },
                  { name: 'AI/ML Core', cap: 91, color: 'bg-red-500' },
                ].map((team, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end px-1">
                      <span className="text-xs font-black dark:text-white uppercase tracking-tighter">{team.name}</span>
                      <span className={cn("text-xs font-black", team.cap > 80 ? 'text-red-500' : 'dark:text-slate-400')}>{team.cap}%</span>
                    </div>
                    <div className="h-1 w-full bg-foreground/5 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${team.cap}%` }}
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                        className={cn("h-full rounded-full", team.color)} 
                      />
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FoundryIQ;
