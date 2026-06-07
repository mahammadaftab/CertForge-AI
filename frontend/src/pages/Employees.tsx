import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Plus, 
  Mail, 
  MoreHorizontal, 
  Search,
  UserCheck,
  Zap,
  ShieldAlert,
  ArrowUpRight,
  Users,
  Cpu
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import api from '../lib/api';

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get('/employees/');
        setEmployees(response.data);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center">
       <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 animate-pulse">Accessing Registry...</span>
       </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary"><Users className="w-5 h-5" /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">Registry / Workforce</span>
           </div>
           <h1 className="text-6xl font-black tracking-tighter dark:text-white leading-[0.9]">Human Capital <span className="text-primary">Sync.</span></h1>
           <p className="text-foreground/60 text-lg font-medium max-w-2xl italic">Real-time mapping of cognitive assets and workforce readiness clusters.</p>
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search registry..." 
                className="w-full bg-background dark:bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-black dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all"
              />
           </div>
           <button className="bg-[#02040a] dark:bg-white text-white dark:text-[#02040a] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-105 active:scale-95 transition-all">
              Initialize Entry
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Top Performer', val: employees[0]?.name || 'N/A', icon: UserCheck, color: 'emerald' },
           { label: 'Highest Velocity', val: 'Cloud Ops', icon: Zap, color: 'blue' },
           { label: 'Risk Identified', val: 'Nominal', icon: ShieldAlert, color: 'amber' },
         ].map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: i * 0.1 }}
             className="mica p-6 rounded-[2rem] flex items-center gap-6 border-white/10 group cursor-pointer hover:bg-white/5 transition-all"
           >
              <div className={cn("p-4 rounded-2xl", `bg-${stat.color}-500/10 text-${stat.color}-500`)}>
                 <stat.icon className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[9px] font-black uppercase tracking-widest text-foreground/30 mb-1">{stat.label}</p>
                 <p className="text-lg font-black dark:text-white leading-none">{stat.val}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-foreground/20 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
           </motion.div>
         ))}
      </div>

      <div className="mica rounded-[3rem] border-white/10 overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 living-canvas opacity-5 pointer-events-none" />
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground/5 dark:bg-white/5">
                <th className="p-8 text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] pl-12">Entity</th>
                <th className="p-8 text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">Assignment</th>
                <th className="p-8 text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em]">Neural Status</th>
                <th className="p-8 text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] text-center">Progression</th>
                <th className="p-8 text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] text-right pr-12">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {employees.map((emp, idx) => (
                <motion.tr 
                  key={emp.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="group hover:bg-white/5 transition-all duration-300 cursor-pointer"
                >
                  <td className="p-8 pl-12">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-foreground/5 to-foreground/10 dark:from-white/10 dark:to-white/5 flex items-center justify-center font-black text-lg text-foreground/30 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500">
                        {emp.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-lg font-black dark:text-white tracking-tight leading-none">{emp.name}</p>
                        <div className="flex gap-2">
                           {emp.tags.map((tag: string, i: number) => (
                             <span key={i} className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/10">{tag}</span>
                           ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div>
                      <p className="text-xs font-black dark:text-white uppercase tracking-widest">{emp.team}</p>
                      <p className="text-[10px] font-bold text-foreground/40 mt-1 uppercase tracking-tighter">{emp.role}</p>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm",
                      emp.status === 'Ready' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                      emp.status === 'Learning' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", emp.status === 'Ready' ? "bg-emerald-500" : emp.status === 'Learning' ? "bg-blue-500" : "bg-amber-500")} />
                      {emp.status}
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-full max-w-[140px] h-1 bg-foreground/5 dark:bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${emp.score}%` }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className={cn(
                              "h-full rounded-full bg-gradient-to-r",
                              emp.score > 90 ? "from-emerald-400 to-emerald-600" : emp.score > 70 ? "from-blue-400 to-blue-600" : "from-amber-400 to-amber-600"
                            )}
                          />
                       </div>
                       <span className="text-[10px] font-black dark:text-white uppercase tracking-widest">{emp.score}% Accuracy</span>
                    </div>
                  </td>
                  <td className="p-8 text-right pr-12">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                       <button className="p-3 mica rounded-xl border-white/20 text-foreground/40 hover:text-primary transition-all">
                          <Cpu className="w-4 h-4" />
                       </button>
                       <button className="p-3 mica rounded-xl border-white/20 text-foreground/40 hover:text-white transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;
