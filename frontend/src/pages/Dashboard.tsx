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
  Activity,
  Shield,
  Cpu,
  Sparkles,
  Search,
  Terminal
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { cn } from '../lib/utils';

const ModuleCard = ({ title, value, sub, icon: Icon, trend, color, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    className="mica p-10 rounded-[4rem] relative overflow-hidden group hover:bg-white/5 transition-all duration-700 shadow-2xl border-white/10"
  >
    <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-15 transition-opacity duration-1000`}>
       <Icon className="w-32 h-32" />
    </div>
    <div className="relative z-10 space-y-6">
       <div className="flex justify-between items-start">
          <div className={cn("p-4 rounded-2xl shadow-inner", `bg-${color}-500/10 text-${color}-500`)}>
             <Icon className="w-8 h-8" />
          </div>
          {trend && (
            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/10 shadow-lg">
               <TrendingUp className="w-3.5 h-3.5" /> {trend}
            </div>
          )}
       </div>
       <div>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] description mb-3">{title}</p>
          <h3 className="text-6xl font-black dark:text-white tracking-tighter leading-none">{value}</h3>
          <p className="text-sm font-bold description mt-4 italic opacity-80">{sub}</p>
       </div>
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
       <div className="flex flex-col items-center gap-8">
          <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_50px_rgba(0,242,255,0.3)]" />
          <span className="text-[12px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Syncing Mission Control...</span>
       </div>
    </div>
  );

  return (
    <div className="space-y-16 pb-20">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
        <div className="space-y-4">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="flex items-center gap-4 mb-2"
           >
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Foundry OS Terminal Active</span>
           </motion.div>
           <h1 className="text-8xl font-black tracking-tighter dark:text-white leading-[0.8] mb-2">Mission <span className="text-primary text-glow">Control.</span></h1>
           <p className="description text-xl font-medium max-w-2xl italic leading-relaxed">High-fidelity workforce orchestration through recursive neural clusters and real-time flux telemetry.</p>
        </div>
        <div className="flex gap-6">
           <button className="mica p-6 rounded-3xl border-white/20 group hover:border-primary/50 transition-all shadow-2xl">
              <Search className="w-6 h-6 description group-hover:text-primary transition-colors" />
           </button>
           <button className="bg-primary text-white font-bold px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-[0_25px_50px_-10px_rgba(0,120,212,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group">
              Initialize Strategy <ArrowUpRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <ModuleCard title="Active Units" value={stats?.total_units || 0} sub="Nodes synchronized" icon={Users} trend="+12.4%" color="blue" delay={0.1} />
        <ModuleCard title="Neural Mastery" value={`${stats?.neural_readiness || 0}%`} sub="Aggregate organizational IQ" icon={Cpu} trend="+5.2%" color="purple" delay={0.2} />
        <ModuleCard title="Verified protocols" value={stats?.verified_certs || 0} sub="Blueprint library count" icon={Award} color="emerald" delay={0.3} />
        <ModuleCard title="Risk Threshold" value={stats?.system_risk || 'Low'} sub="Real-time vulnerability scan" icon={Shield} color="pink" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="lg:col-span-8 mica p-12 rounded-[4rem] shadow-2xl border-white/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-all duration-[2s]"><Activity className="w-80 h-80 text-primary" /></div>
          <div className="relative z-10">
             <div className="flex justify-between items-center mb-16">
                <div className="space-y-2">
                   <h3 className="text-4xl font-black dark:text-white tracking-tighter">Neural Flux Stream</h3>
                   <p className="text-[10px] font-black description uppercase tracking-[0.5em] mt-1">Real-time cognitive load mapping</p>
                </div>
                <div className="flex gap-4">
                   <div className="px-6 py-3 bg-foreground/5 dark:bg-white/5 rounded-[1.5rem] text-[10px] font-black uppercase dark:text-white border border-white/10 shadow-xl">Cycle: 24H</div>
                   <div className="px-6 py-3 bg-foreground/5 dark:bg-white/5 rounded-[1.5rem] text-[10px] font-black uppercase dark:text-white border border-white/10 shadow-xl flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> Live Uplink
                   </div>
                </div>
             </div>
             
             <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={telemetry}>
                      <defs>
                        <linearGradient id="loadGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#7000ff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.03} />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 11, fill: 'currentColor', fontWeight: 900, opacity: 0.3 }}
                        dy={20}
                      />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '32px', 
                          border: 'none', 
                          boxShadow: '0 30px 60px -15px rgba(0,0,0,0.5)',
                          backgroundColor: '#010204',
                          padding: '24px',
                          color: '#fff'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="load" 
                        stroke="#00f2ff" 
                        strokeWidth={8}
                        fillOpacity={1} 
                        fill="url(#loadGradient)" 
                        animationDuration={3000}
                      />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="lg:col-span-4 flex flex-col gap-10"
        >
           <div className="mica p-12 rounded-[4rem] bg-[#010204] text-white border-none shadow-[0_50px_100px_-20px_rgba(0,242,255,0.4)] relative overflow-hidden group">
              <div className="absolute inset-0 living-canvas opacity-30 group-hover:scale-110 transition-transform duration-[4s]" />
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-3xl border border-white/10 shadow-2xl">
                       <Sparkles className="w-8 h-8 text-primary shadow-glow" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] opacity-70">AI Strategic Core</span>
                 </div>
                 <h2 className="text-4xl font-black tracking-tighter leading-[1.1] text-glow">Neural pathways are reaching peak convergence.</h2>
                 <p className="text-md font-medium opacity-60 leading-relaxed italic">
                    Suggesting a skill-injection cycle for Squad Omega to neutralize detected domain latency in Azure Architect protocols.
                 </p>
                 <button className="w-full bg-white text-white font-bold py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[10px] hover:scale-[1.03] active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]">Execute Protocol</button>
              </div>
           </div>

           <div className="mica p-12 rounded-[4rem] flex-1 border-white/10 shadow-2xl">
              <h4 className="text-[11px] font-black description uppercase tracking-[0.4em] mb-12 flex items-center gap-3">
                 <Terminal className="w-5 h-5" /> Unit Trajectories
              </h4>
              <div className="space-y-12">
                 {progression.map((unit, i) => (
                   <div key={i} className="space-y-4 group cursor-pointer">
                      <div className="flex justify-between items-end px-1">
                         <span className="text-sm font-black dark:text-white uppercase tracking-widest leading-none group-hover:text-primary transition-colors">{unit.label}</span>
                         <span className="text-sm font-black text-primary text-glow">{unit.val}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-foreground/5 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${unit.val}%` }}
                           transition={{ delay: 0.8 + (i * 0.15), duration: 2, ease: [0.16, 1, 0.3, 1] }}
                           className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full" 
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
