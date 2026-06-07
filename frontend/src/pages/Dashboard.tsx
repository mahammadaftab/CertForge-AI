import React, { useState, useEffect } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Award, 
  TrendingUp, 
  Users, 
  ArrowUpRight,
  Zap,
  Activity,
  Shield,
  Cpu,
  Sparkles,
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { cn } from '../lib/utils';

const ModuleCard = ({ title, value, sub, icon: Icon, trend, color, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="mica p-8 rounded-[2.5rem] relative overflow-hidden group hover:bg-white/5 transition-all duration-500 hover:shadow-[0_20px_50px_-20px_rgba(0,120,212,0.2)]"
  >
    <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500`}>
       <Icon className="w-24 h-24" />
    </div>
    <div className="relative z-10">
       <div className="flex justify-between items-start mb-6">
          <div className={cn("p-3 rounded-2xl", `bg-${color}-500/10 text-${color}-500`)}>
             <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/10">
               <TrendingUp className="w-3 h-3" /> {trend}
            </div>
          )}
       </div>
       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-2">{title}</p>
       <h3 className="text-4xl font-black dark:text-white tracking-tighter">{value}</h3>
       <p className="text-xs font-bold text-foreground/50 mt-2">{sub}</p>
    </div>
  </motion.div>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [telemetry, setTelemetry] = useState<any[]>([]);
  const [progression, setProgression] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, telemetryRes, progressionRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/telemetry'),
          api.get('/dashboard/progression')
        ]);
        setStats(statsRes.data);
        setTelemetry(telemetryRes.data);
        setProgression(progressionRes.data);
      } catch (err) {
        console.error("Dashboard data sync failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center">
       <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 animate-pulse">Syncing Neural Core...</span>
       </div>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex items-center gap-3 mb-2"
           >
              <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Online</span>
           </motion.div>
           <h1 className="text-6xl font-black tracking-tight dark:text-white leading-[0.9]">Mission Control</h1>
           <p className="text-foreground/60 mt-3 text-lg font-medium max-w-xl italic">Orchestrating workforce intelligence through high-fidelity neural clusters.</p>
        </div>
        <div className="flex gap-4">
           <button className="mica p-4 rounded-2xl border-white/20 group hover:border-primary/40 transition-all shadow-xl">
              <Search className="w-5 h-5 text-foreground/40 group-hover:text-primary transition-colors" />
           </button>
           <button className="bg-primary text-white px-8 py-4 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
              Deploy Learning <ArrowUpRight className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <ModuleCard title="Active Units" value={stats?.total_units || 0} sub="Real-time synchronized" icon={Users} trend="+12.4%" color="blue" delay={0.1} />
        <ModuleCard title="Neural Readiness" value={`${stats?.neural_readiness || 0}%`} sub="Global organization avg" icon={Cpu} trend="+5.2%" color="indigo" delay={0.2} />
        <ModuleCard title="Verified Certs" value={stats?.verified_certs || 0} sub="In active library" icon={Award} color="emerald" delay={0.3} />
        <ModuleCard title="System Risk" value={stats?.system_risk || 'Low'} sub="Automated risk scanning" icon={Shield} color="amber" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-8 mica p-10 rounded-[3.5rem] shadow-2xl border-white/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-5"><Activity className="w-64 h-64 text-primary" /></div>
          <div className="relative z-10">
             <div className="flex justify-between items-center mb-12">
                <div>
                   <h3 className="text-2xl font-black dark:text-white tracking-tighter">Workload Telemetry</h3>
                   <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest mt-1">Real-time neural load mapping</p>
                </div>
                <div className="flex gap-2">
                   <div className="px-4 py-2 bg-background dark:bg-white/5 rounded-xl text-[10px] font-black uppercase dark:text-white border border-white/10">Cycle: 24H</div>
                   <div className="px-4 py-2 bg-background dark:bg-white/5 rounded-xl text-[10px] font-black uppercase dark:text-white border border-white/10">Active Flux</div>
                </div>
             </div>
             
             <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={telemetry}>
                      <defs>
                        <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0078d4" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0078d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fill: 'currentColor', fontWeight: 900, opacity: 0.4 }}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '24px', 
                          border: 'none', 
                          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                          backgroundColor: '#0f172a',
                          padding: '16px',
                          color: '#fff'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="load" 
                        stroke="#0078d4" 
                        strokeWidth={6}
                        fillOpacity={1} 
                        fill="url(#loadGradient)" 
                        animationDuration={2000}
                      />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-4 flex flex-col gap-8"
        >
           <div className="mica p-10 rounded-[3rem] bg-[#02040a] text-white border-none shadow-[0_30px_60px_-15px_rgba(0,120,212,0.3)] relative overflow-hidden">
              <div className="absolute inset-0 living-canvas opacity-20" />
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10">
                       <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">AI Intelligence</span>
                 </div>
                 <h2 className="text-3xl font-black tracking-tight leading-tight">Neural synchronization is at peak efficiency.</h2>
                 <p className="text-sm font-medium opacity-60 leading-relaxed">
                    System suggests optimizing the Cloud Engineering cohort for expert-level protocols based on recent high-velocity benchmarks.
                 </p>
                 <button className="w-full bg-white text-slate-950 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity">Optimize Units</button>
              </div>
           </div>

           <div className="mica p-10 rounded-[3rem] flex-1 border-white/20">
              <h4 className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-8">Unit Progression</h4>
              <div className="space-y-8">
                 {progression.map((unit, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                         <span className="text-xs font-black dark:text-white">{unit.label}</span>
                         <span className="text-xs font-black text-primary">{unit.val}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-background dark:bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${unit.val}%` }}
                           transition={{ delay: 0.8 + (i * 0.1), duration: 1.5 }}
                           className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-full" 
                         />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
