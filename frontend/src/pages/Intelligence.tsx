import React from 'react';
import { 
  Activity, 
  Clock, 
  Brain, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  BarChart2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const Intelligence: React.FC = () => {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-black tracking-tight dark:text-white">Foundry IQ</h1>
          <p className="text-slate-500 mt-2 text-lg">Cross-enterprise intelligence and grounded workforce insights.</p>
        </div>
        <div className="flex gap-4">
           <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-50 dark:border-slate-950 bg-slate-200 dark:bg-slate-800" />
              ))}
           </div>
           <button className="mica px-4 py-2 rounded-xl text-xs font-bold border-primary/20 text-primary">
              Live Analysis
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Work IQ Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="mica p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-32 h-32 text-primary" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black dark:text-white">Work IQ Optimizer</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-6 rounded-3xl bg-slate-100/50 dark:bg-slate-800/50 border border-transparent hover:border-primary/20 transition-all cursor-pointer hover-lift">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Best Study Window</p>
                    <p className="text-xl font-black text-primary">09:00 AM - 10:30 AM</p>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Predicted based on low meeting density and peak focus history.</p>
                  </div>
                  <div className="p-6 rounded-3xl bg-slate-100/50 dark:bg-slate-800/50 border border-transparent hover:border-primary/20 transition-all cursor-pointer hover-lift">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Focus Score</p>
                    <div className="flex items-end gap-2">
                      <p className="text-3xl font-black dark:text-white">88</p>
                      <p className="text-xs font-bold text-emerald-500 mb-1">+12% vs last week</p>
                    </div>
                  </div>
                </div>

                <div className="mica p-6 rounded-3xl flex flex-col justify-between">
                   <div>
                      <h4 className="font-black text-sm mb-4">Capacity Analysis</h4>
                      <div className="space-y-4">
                        {[
                          { label: 'Meetings', val: 65, color: 'bg-blue-500' },
                          { label: 'Focus', val: 25, color: 'bg-emerald-500' },
                          { label: 'Study', val: 10, color: 'bg-primary' },
                        ].map((item, i) => (
                          <div key={i} className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                              <span className="text-slate-500">{item.label}</span>
                              <span className="dark:text-white">{item.val}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.val}%` }}
                                className={cn("h-full rounded-full", item.color)} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                   <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-amber-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Burnout Warning: Medium Risk</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Knowledge Base Section */}
          <div className="mica p-8 rounded-[2.5rem]">
             <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black dark:text-white">Grounded Knowledge</h3>
                </div>
                <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider">
                  Upload Docs
                </button>
             </div>

             <div className="space-y-4">
                {[
                  { title: 'AZ-900 Implementation Guide', source: 'Internal Wiki', date: '2 days ago' },
                  { title: 'Cloud Security Standard V2', source: 'Compliance Dept', date: '5 days ago' },
                  { title: 'Workload Balancing Policy', source: 'HR Central', date: '1 week ago' },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-emerald-500/20 group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm dark:text-white">{doc.title}</p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{doc.source} • {doc.date}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* AI Sidebar / Stats */}
        <div className="space-y-8">
           <div className="mica p-8 rounded-[2.5rem] bg-gradient-to-br from-primary to-blue-700 text-white border-none shadow-primary/30">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 fill-white" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Efficiency Score</span>
              </div>
              <p className="text-6xl font-black tracking-tighter mb-2">92%</p>
              <p className="text-sm font-bold opacity-80 leading-relaxed">Your team is performing 15% above the enterprise average for AZ-900 readiness.</p>
              <button className="w-full mt-8 bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all py-3 rounded-2xl text-xs font-black uppercase tracking-wider">
                Generate Full Report
              </button>
           </div>

           <div className="mica p-8 rounded-[2.5rem]">
              <h4 className="font-black text-sm mb-6 flex items-center gap-2 uppercase tracking-widest text-slate-400">
                <BarChart2 className="w-4 h-4" /> Team Capacity
              </h4>
              <div className="space-y-6">
                {[
                  { name: 'Cloud Ops', cap: 82 },
                  { name: 'Infrastructure', cap: 45 },
                  { name: 'AI/ML Team', cap: 91 },
                ].map((team, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold dark:text-white">
                      <span>{team.name}</span>
                      <span>{team.cap}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${team.cap}%` }}
                        className={cn("h-full rounded-full bg-primary", team.cap > 80 ? 'bg-red-500' : '')} 
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

// Re-using FileText from Lucide
const FileText = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
  </svg>
);

export default Intelligence;
