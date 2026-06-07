import React, { useState, useEffect } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Activity, 
  Users, 
  TrendingUp, 
  Zap,
  Radio,
  Sparkles,
  Signal,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const LiveAnalytics: React.FC = () => {
  // Simulated real-time data
  const [activeUsers, setActiveUsers] = useState(124);
  const [cpuLoad, setCpuLoad] = useState(42);
  const [eventData, setEventData] = useState(
    Array.from({ length: 30 }, (_, i) => ({ time: i, events: Math.floor(Math.random() * 60) + 20 }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 7) - 3);
      setCpuLoad(Math.floor(Math.random() * 30) + 40);
      setEventData(prev => {
        const newData = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, events: Math.floor(Math.random() * 60) + 20 }];
        return newData;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const pieData = [
    { name: 'AZURE CLUSTER', value: 400, color: '#0078d4' },
    { name: 'AWS CORE', value: 300, color: '#f59e0b' },
    { name: 'GCP SQUAD', value: 250, color: '#10b981' },
    { name: 'SECURITY NODES', value: 200, color: '#ef4444' },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* OS Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-xl text-red-500"><Radio className="w-5 h-5 animate-pulse" /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Telemetry / Real-time</span>
           </div>
           <h1 className="text-6xl font-black tracking-tighter dark:text-white leading-[0.9]">System <span className="text-primary">Vitals.</span></h1>
           <p className="text-slate-500 text-lg font-medium max-w-2xl italic">Streaming workforce intelligence and neural load telemetry from global nodes.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="mica px-6 py-3 rounded-2xl flex items-center gap-3 border-white/20">
              <Signal className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">Uplink Stable</span>
           </div>
           <button className="bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl transition-all hover-lift">
              Export Telemetry
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="mica p-10 rounded-[3rem] flex flex-col justify-center relative overflow-hidden group border-white/20"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Users className="w-24 h-24 text-blue-500" /></div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><Users className="w-6 h-6" /></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Concurrent Nodes</h3>
          </div>
          <p className="text-7xl font-black dark:text-white tracking-tighter relative z-10">{activeUsers}</p>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
             <TrendingUp className="w-3.5 h-3.5" /> High Sync Density
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="mica p-10 rounded-[3rem] flex flex-col justify-center relative overflow-hidden group border-white/20"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Cpu className="w-24 h-24 text-amber-500" /></div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500"><Activity className="w-6 h-6" /></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Processing Flux</h3>
          </div>
          <p className="text-7xl font-black text-amber-500 tracking-tighter relative z-10">{cpuLoad}%</p>
          <div className="mt-4 flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-widest">
             <Zap className="w-3.5 h-3.5" /> Nominal Operation
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="mica p-10 rounded-[3rem] flex flex-col justify-center relative overflow-hidden group border-white/20 bg-gradient-to-br from-emerald-500/5 to-transparent"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Award className="w-24 h-24 text-emerald-500" /></div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500"><Zap className="w-6 h-6" /></div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Neural Syncs (24h)</h3>
          </div>
          <div className="flex items-baseline gap-4 relative z-10">
            <p className="text-7xl font-black text-emerald-500 tracking-tighter">42</p>
            <span className="text-lg font-black text-emerald-600/50 uppercase tracking-widest">COMPLETED</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
             <Sparkles className="w-3.5 h-3.5" /> Efficiency Peak
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           whileInView={{ opacity: 1, scale: 1 }}
           className="lg:col-span-8 mica p-12 rounded-[3.5rem] min-h-[500px] border-white/20 relative overflow-hidden shadow-2xl"
         >
            <div className="absolute inset-0 living-canvas opacity-5 pointer-events-none" />
            <div className="flex justify-between items-center mb-12 relative z-10">
               <div>
                  <h3 className="text-2xl font-black dark:text-white tracking-tighter">Real-Time Event Stream</h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-2">Active Neural Packets</p>
               </div>
               <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Live Flux</span>
               </div>
            </div>
            <div className="h-[350px] w-full relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={eventData}>
                  <defs>
                    <linearGradient id="eventGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0078d4" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0078d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.05} />
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: 'rgba(15, 23, 42, 0.95)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} 
                  />
                  <Area 
                    type="stepAfter" 
                    dataKey="events" 
                    stroke="#0078d4" 
                    strokeWidth={5} 
                    fillOpacity={1} 
                    fill="url(#eventGradient)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </motion.div>

         <motion.div 
           initial={{ opacity: 0, x: 20 }}
           whileInView={{ opacity: 1, x: 0 }}
           className="lg:col-span-4 mica p-12 rounded-[3.5rem] border-white/20 flex flex-col items-center shadow-2xl relative overflow-hidden"
         >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <h3 className="text-[10px] font-black dark:text-white uppercase tracking-[0.4em] mb-12 self-start">Neural Domains</h3>
            <div className="flex-1 flex items-center justify-center w-full relative">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={90}
                    outerRadius={130}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center pointer-events-none">
                 <span className="text-4xl font-black dark:text-white tracking-tighter leading-none">1.2K</span>
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Global Nodes</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-x-10 gap-y-4 mt-12 w-full">
               {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <div className="flex flex-col">
                       <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">{d.name}</span>
                       <span className="text-xs font-black dark:text-white leading-none">{d.value}</span>
                    </div>
                  </div>
               ))}
            </div>
         </motion.div>
      </div>
    </div>
  );
};

export default LiveAnalytics;
