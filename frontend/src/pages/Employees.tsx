import React, { useState, useEffect } from 'react';
import { 
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
       <div className="flex flex-col items-center gap-8">
          <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_50px_rgba(0,242,255,0.3)]" />
          <span className="text-[12px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Accessing Registry...</span>
       </div>
    </div>
  );

  return (
    <div className="space-y-16 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-xl border border-primary/20"><Users className="w-6 h-6" /></div>
              <span className="text-[11px] font-black uppercase tracking-[0.5em] description">Registry / Workforce</span>
           </div>
           <h1 className="text-8xl font-black tracking-tighter dark:text-white leading-[0.8] mb-2">Human Capital <span className="text-primary text-glow">Sync.</span></h1>
           <p className="description text-xl font-medium max-w-2xl italic leading-relaxed">Real-time mapping of cognitive assets and workforce readiness clusters across the enterprise graph.</p>
        </div>
        <div className="flex items-center gap-6 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-96 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 description group-focus-within:text-primary transition-colors duration-500" />
              <input 
                type="text" 
                placeholder="Search registry..." 
                className="w-full bg-background dark:bg-white/5 border-2 border-white/10 rounded-3xl py-6 pl-16 pr-8 text-sm font-black dark:text-white outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/10 transition-all duration-500 shadow-2xl"
              />
           </div>
           <button className="bg-[#010204] dark:bg-white text-white dark:text-[#010204] px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all">
              Initialize Entry
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
         {[
           { label: 'Top Node', val: employees[0]?.name || 'N/A', icon: UserCheck, color: 'emerald' },
           { label: 'Highest Velocity', val: 'Cloud Ops Alpha', icon: Zap, color: 'blue' },
           { label: 'Risk Signature', val: 'Nominal', icon: ShieldAlert, color: 'pink' },
         ].map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: i * 0.1, duration: 0.8 }}
             className="mica p-8 rounded-[3.5rem] flex items-center gap-8 border-white/10 group cursor-pointer hover:bg-white/5 transition-all duration-700 shadow-2xl"
           >
              <div className={cn("p-5 rounded-2xl shadow-inner", `bg-${stat.color}-500/10 text-${stat.color}-500`)}>
                 <stat.icon className="w-8 h-8" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest description mb-2">{stat.label}</p>
                 <p className="text-2xl font-black dark:text-white leading-none tracking-tight">{stat.val}</p>
              </div>
              <ArrowUpRight className="w-5 h-5 text-white/50 ml-auto opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-500" />
           </motion.div>
         ))}
      </div>

      <div className="mica rounded-[4rem] border-white/10 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] relative">
        <div className="absolute inset-0 living-canvas opacity-5 pointer-events-none" />
        <div className="overflow-x-auto relative z-10 no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-foreground/5 dark:bg-white/5 border-b border-white/5">
                <th className="p-10 text-[11px] font-black description uppercase tracking-[0.3em] pl-16">Entity Signature</th>
                <th className="p-10 text-[11px] font-black description uppercase tracking-[0.3em]">Assignment</th>
                <th className="p-10 text-[11px] font-black description uppercase tracking-[0.3em]">Neural Status</th>
                <th className="p-10 text-[11px] font-black description uppercase tracking-[0.3em] text-center">Progression</th>
                <th className="p-10 text-[11px] font-black description uppercase tracking-[0.3em] text-right pr-16">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {employees.map((emp) => (
                <motion.tr 
                  key={emp.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="group hover:bg-primary/5 transition-all duration-500 cursor-pointer"
                >
                  <td className="p-10 pl-16">
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 rounded-[1.75rem] azure-gradient flex items-center justify-center font-black text-xl text-white shadow-2xl group-hover:rotate-6 group-hover:scale-110 transition-transform duration-700">
                        {emp.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-black dark:text-white tracking-tighter leading-none group-hover:text-primary transition-colors">{emp.name}</p>
                        <div className="flex gap-2">
                           {emp.tags.map((tag: string, i: number) => (
                             <span key={i} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/10">{tag}</span>
                           ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-10">
                    <div>
                      <p className="text-sm font-black dark:text-white uppercase tracking-widest leading-none">{emp.team}</p>
                      <p className="text-xs font-bold description mt-2 uppercase tracking-tighter italic">{emp.role}</p>
                    </div>
                  </td>
                  <td className="p-10">
                    <div className={cn(
                      "inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border shadow-2xl transition-all duration-500",
                      emp.status === 'Ready' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 group-hover:bg-emerald-500/20" : 
                      emp.status === 'Learning' ? "bg-primary/10 text-primary border-primary/20 group-hover:bg-primary/20" : "bg-secondary/10 text-secondary border-secondary/20 group-hover:bg-secondary/20"
                    )}>
                      <div className={cn("w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px]", emp.status === 'Ready' ? "bg-emerald-500 shadow-emerald-500" : emp.status === 'Learning' ? "bg-primary shadow-primary" : "bg-secondary shadow-secondary")} />
                      {emp.status}
                    </div>
                  </td>
                  <td className="p-10">
                    <div className="flex flex-col items-center gap-4">
                       <div className="w-full max-w-[160px] h-1.5 bg-foreground/5 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${emp.score}%` }}
                            transition={{ duration: 2, ease: "circOut" }}
                            className={cn(
                              "h-full rounded-full bg-gradient-to-r",
                              emp.score > 90 ? "from-emerald-400 to-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : emp.score > 70 ? "from-primary to-blue-600 shadow-[0_0_15px_rgba(0,120,212,0.4)]" : "from-secondary to-pink-600 shadow-[0_0_15px_rgba(112,0,255,0.4)]"
                            )}
                          />
                       </div>
                       <span className="text-[11px] font-black dark:text-white uppercase tracking-widest">{emp.score}% Accuracy</span>
                    </div>
                  </td>
                  <td className="p-10 text-right pr-16">
                    <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-x-10 group-hover:translate-x-0">
                       <button className="p-4 mica rounded-2xl border-white/10 description hover:text-primary hover:border-primary/40 transition-all shadow-xl">
                          <Cpu className="w-5 h-5" />
                       </button>
                       <button className="p-4 mica rounded-2xl border-white/10 description hover:text-white hover:border-white/30 transition-all shadow-xl">
                          <MoreHorizontal className="w-5 h-5" />
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
