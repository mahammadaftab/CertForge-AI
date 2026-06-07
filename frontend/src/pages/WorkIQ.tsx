import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Activity, Clock, Battery, AlertTriangle } from 'lucide-react';
import api from '../lib/api';

const WorkIQ: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/work-iq/telemetry').then(res => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return <div className="p-8 text-white">Loading Work IQ...</div>;

  return (
    <div className="h-full flex flex-col gap-6 text-white overflow-hidden pb-6">
      <header className="flex justify-between items-end mb-4">
         <div>
            <h1 className="text-5xl font-black tracking-tighter text-glow">Work IQ</h1>
            <p className="text-xs font-black uppercase tracking-[0.4em] description mt-2">Workload Analysis & Capacity Planning</p>
         </div>
      </header>

      <div className="grid grid-cols-3 gap-6">
         <div className="os-glass p-8 rounded-[2rem] flex flex-col gap-4">
            <div className="flex items-center gap-3 text-emerald-400">
               <Clock className="w-5 h-5" />
               <span className="text-[10px] font-black uppercase tracking-widest">Focus Time Capacity</span>
            </div>
            <span className="text-5xl font-black">{data.current_capacity}%</span>
         </div>
         <div className="os-glass p-8 rounded-[2rem] flex flex-col gap-4">
            <div className="flex items-center gap-3 text-red-400">
               <AlertTriangle className="w-5 h-5" />
               <span className="text-[10px] font-black uppercase tracking-widest">High Risk Units</span>
            </div>
            <span className="text-5xl font-black">{data.high_risk_units}</span>
         </div>
         <div className="os-glass p-8 rounded-[2rem] flex flex-col gap-4">
            <div className="flex items-center gap-3 text-primary">
               <Battery className="w-5 h-5" />
               <span className="text-[10px] font-black uppercase tracking-widest">System Load</span>
            </div>
            <span className="text-5xl font-black">Nominal</span>
         </div>
      </div>

      <div className="flex-1 os-window p-8 rounded-[3rem] relative overflow-hidden flex flex-col">
         <div className="flex items-center gap-3 mb-8">
            <Activity className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-black tracking-tighter">7-Day Workload Telemetry</h2>
         </div>
         <div className="flex-1 min-h-0 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={data.timeline}>
                  <defs>
                     <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#00f2ff" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorBurnout" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff007a" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ff007a" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                  <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
                  <Tooltip 
                     contentStyle={{ backgroundColor: 'rgba(10,10,30,0.9)', border: '1px solid rgba(0,242,255,0.3)', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}
                     itemStyle={{ color: '#fff', fontWeight: 900, fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="focus_time" stroke="#00f2ff" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
                  <Area type="monotone" dataKey="burnout_risk" stroke="#ff007a" strokeWidth={3} fillOpacity={1} fill="url(#colorBurnout)" />
               </AreaChart>
            </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
};

export default WorkIQ;
