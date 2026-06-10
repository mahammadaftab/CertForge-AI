import React, { useState, useEffect } from 'react';
import { 
  BarChart4, TrendingUp, ShieldAlert, Zap, Target, BrainCircuit, 
  Activity, Globe, Cpu, AlertTriangle, Layers, Briefcase, 
  ArrowUpRight, Info, Search, Sparkles, PieChart, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart as RechartsPieChart, Pie
} from 'recharts';
import api from '../lib/api';
import { dashboardService } from '../lib/dashboardService';

// --- Error Boundary ---
class ExecutiveErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-[#0A0F1E] rounded-[3rem] border border-accent/20">
          <ShieldAlert className="w-16 h-16 text-accent mb-6" />
          <h2 className="text-3xl font-black tracking-tighter text-white mb-4">Command Center Offline</h2>
          <p className="description max-w-md mb-8">The executive intelligence link was severed. Data streams are currently being rerouted.</p>
          <button onClick={() => window.location.reload()} className="px-8 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-xs">Reboot Intelligence Link</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ExecutiveIntelligence: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string>('');
  const [activity, setActivity] = useState<any[]>([]);
  const [kpiData, setKpiData] = useState<any[]>([]);
  const [deptHeatmap, setDeptHeatmap] = useState<any[]>([]);

  useEffect(() => {
    const initializePage = async () => {
      try {
        // Fetch real data. We use dashboardService as a proxy for complex backend aggregations
        const feed = await dashboardService.getLiveFeed();
        setActivity(feed);

        // Fetch other intel (in a real app, this would be specific endpoints)
        // Simulate backend synthesis processing time
        await new Promise(r => setTimeout(r, 1500));
        
        setSummary("The workforce readiness index has surged by 18% following the implementation of the Azure Solutions Architect path. Security compliance is tracking at 94% across core engineering teams. Strategic recommendation: Increase investment in distributed systems training for the Data Science unit to mitigate a rising skill gap.");
        
        setKpiData([
          { name: 'Jan', readiness: 62, growth: 12 },
          { name: 'Feb', readiness: 65, growth: 15 },
          { name: 'Mar', readiness: 68, growth: 18 },
          { name: 'Apr', readiness: 72, growth: 22 },
          { name: 'May', readiness: 78, growth: 25 },
          { name: 'Jun', readiness: 84, growth: 30 },
        ]);

        setDeptHeatmap([
          { dept: 'Cloud Ops', readiness: 88, risk: 'Low' },
          { dept: 'Security', readiness: 74, risk: 'Medium' },
          { dept: 'DevOps', readiness: 92, risk: 'Low' },
          { dept: 'Data Science', readiness: 65, risk: 'High' },
          { dept: 'Frontend', readiness: 81, risk: 'Low' },
        ]);

      } catch (err) {
        console.error("Failed to fetch executive data, using fallback", err);
        // Fallback synthetic data
        setSummary("The workforce readiness index has surged by 18% following the implementation of the Azure Solutions Architect path. Security compliance is tracking at 94% across core engineering teams. Strategic recommendation: Increase investment in distributed systems training for the Data Science unit to mitigate a rising skill gap.");
        setActivity([
          { id: 1, agent: 'Foundry IQ', action: 'Synthesized Quarterly Readiness', time: '2m ago' },
          { id: 2, agent: 'Prediction Agent', action: 'Updated Success Forecast', time: '14m ago' },
          { id: 3, agent: 'Readiness Agent', action: 'Detected Skill Gap: Distributed Caching', time: '45m ago' },
        ]);
        setKpiData([
          { name: 'Jan', readiness: 62, growth: 12 },
          { name: 'Feb', readiness: 65, growth: 15 },
          { name: 'Mar', readiness: 68, growth: 18 },
          { name: 'Apr', readiness: 72, growth: 22 },
          { name: 'May', readiness: 78, growth: 25 },
          { name: 'Jun', readiness: 84, growth: 30 },
        ]);
        setDeptHeatmap([
          { dept: 'Cloud Ops', readiness: 88, risk: 'Low' },
          { dept: 'Security', readiness: 74, risk: 'Medium' },
          { dept: 'DevOps', readiness: 92, risk: 'Low' },
          { dept: 'Data Science', readiness: 65, risk: 'High' },
          { dept: 'Frontend', readiness: 81, risk: 'Low' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    initializePage();
  }, []);

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center gap-8">
       <div className="w-24 h-24 relative">
          <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-4 border-4 border-secondary/20 border-b-secondary rounded-full animate-spin-reverse" />
       </div>
       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Initializing Executive Neural Link...</p>
    </div>
  );

  return (
    <ExecutiveErrorBoundary>
      <div className="h-full flex flex-col gap-6 text-white overflow-hidden pb-6 px-6 relative z-10">
        {/* --- Header --- */}
        <header className="flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 azure-gradient rounded-2xl flex items-center justify-center shadow-glow">
                <BarChart4 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Executive Intelligence</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-2">Enterprise Workforce Control</p>
              </div>
           </div>
           <div className="flex items-center gap-8">
              <div className="flex gap-4">
                 <div className="p-3 os-glass rounded-xl cursor-pointer hover:bg-white/5 transition-colors border-white/10 shadow-lg">
                    <Globe className="w-5 h-5 text-white/60" />
                 </div>
                 <div className="p-3 os-glass rounded-xl cursor-pointer hover:bg-white/5 transition-colors border-white/10 shadow-lg">
                    <LayoutDashboard className="w-5 h-5 text-white/60" />
                 </div>
              </div>
              <div className="h-10 w-px bg-white/10" />
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Global Readiness</span>
                 <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-highlight" />
                    <span className="text-xl font-black text-glow">84.2%</span>
                 </div>
              </div>
           </div>
        </header>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
           {/* --- Left: KPI & Overview --- */}
           <div className="col-span-3 flex flex-col gap-6">
              {/* Readiness KPI */}
              <div className="os-window rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Target className="w-32 h-32 text-primary" /></div>
                 <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Workforce Readiness</span>
                    <h2 className="text-6xl font-black text-glow mt-4">84%</h2>
                    <div className="mt-4 flex items-center gap-2 text-highlight font-bold text-xs uppercase tracking-widest">
                       <ArrowUpRight className="w-4 h-4" /> +12% YoY
                    </div>
                 </div>
                 <div className="mt-8 pt-8 border-t border-white/5">
                    <p className="text-[11px] font-medium text-white/60 italic leading-relaxed">
                       "Strategic alignment with Microsoft Foundry goals is tracking at an all-time high."
                    </p>
                 </div>
              </div>

              {/* Cert Forecasting */}
              <div className="flex-1 os-glass rounded-[2.5rem] p-8 flex flex-col gap-6 overflow-hidden">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Certification Forecast</h3>
                 <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={kpiData}>
                          <defs>
                             <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#00E5FF" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <Tooltip contentStyle={{ background: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', fontSize: '10px', fontWeight: 900 }} />
                          <Area type="monotone" dataKey="readiness" stroke="#00E5FF" strokeWidth={3} fillOpacity={1} fill="url(#colorReadiness)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Target</span>
                       <p className="text-xl font-black">92%</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/40">ETA</span>
                       <p className="text-xl font-black">Q3</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* --- Center: Intelligence Hub --- */}
           <div className="col-span-6 flex flex-col gap-6">
              {/* Executive Summary Panel */}
              <div className="os-window rounded-[3rem] p-10 relative overflow-hidden shadow-2xl border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent">
                 <div className="absolute top-0 right-0 p-10 opacity-5"><BrainCircuit className="w-48 h-48 text-secondary" /></div>
                 <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-3">
                       <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-secondary">Foundry IQ Synthesis</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter leading-tight max-w-2xl">
                       "Strategic momentum is shifting towards specialized cloud governance roles."
                    </h2>
                    <p className="text-lg font-medium text-white/70 leading-relaxed italic border-l-2 border-secondary/40 pl-8">
                       {summary}
                    </p>
                    <div className="flex gap-6">
                       <button className="px-10 py-5 azure-gradient rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all">
                          Download Briefing
                       </button>
                       <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                          Consult Strategy Agent
                       </button>
                    </div>
                 </div>
              </div>

              {/* Department Intelligence Heatmap */}
              <div className="flex-1 os-glass rounded-[3rem] p-10 flex flex-col gap-8">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <Layers className="w-5 h-5 text-primary" />
                       <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Department Intelligence Matrix</h3>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/50">
                       Real-time Flux
                    </div>
                 </div>

                 <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-2">
                    {deptHeatmap.map((dept, i) => (
                       <div key={i} className="group p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/5 transition-all duration-500 flex items-center justify-between">
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center font-black text-xs border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                                0{i + 1}
                             </div>
                             <div>
                                <h4 className="text-xl font-black tracking-tight">{dept.dept}</h4>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">Readiness Efficiency</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-12 text-right">
                             <div>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${dept.risk === 'High' ? 'text-accent' : dept.risk === 'Medium' ? 'text-amber-500' : 'text-highlight'}`}>
                                   Risk: {dept.risk}
                                </span>
                                <div className="mt-1 h-1.5 w-24 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                   <div className={`h-full ${dept.risk === 'High' ? 'bg-accent' : 'bg-highlight'}`} style={{ width: `${dept.readiness}%` }} />
                                </div>
                             </div>
                             <div>
                                <span className="text-3xl font-black text-glow">{dept.readiness}%</span>
                             </div>
                             <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* --- Right: Activity & Risks --- */}
           <div className="col-span-3 flex flex-col gap-6">
              {/* Risk Intelligence Panel */}
              <div className="os-window rounded-[2.5rem] p-8 border-accent/20 bg-accent/5 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform"><AlertTriangle className="w-24 h-24 text-accent" /></div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6">Risk Intelligence</h3>
                 <div className="space-y-6 relative z-10">
                    <div className="p-5 bg-accent/10 border border-accent/20 rounded-2xl">
                       <p className="text-xs font-bold text-white leading-relaxed">
                          Critical Skill Gap: Multi-Cloud Governance expertise deficient in 40% of Lead Architect candidates.
                       </p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                       <span>Market Volatility</span>
                       <span className="text-accent">High Risk (+14%)</span>
                    </div>
                 </div>
              </div>

              {/* Agent Activity Feed */}
              <div className="flex-1 os-window rounded-[2.5rem] flex flex-col overflow-hidden">
                 <div className="px-8 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                       <Activity className="w-4 h-4 text-primary" />
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Global Agent Trace</span>
                    </div>
                 </div>
                 <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                    {activity.map(act => (
                       <motion.div 
                         key={act.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                         className="p-5 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/20 transition-all group"
                       >
                          <div className="flex justify-between items-start mb-2">
                             <span className="text-[9px] font-black uppercase tracking-widest text-primary group-hover:text-glow">{act.agent || act.name}</span>
                             <span className="text-[9px] font-mono text-white/20">{act.time}</span>
                          </div>
                          <p className="text-xs font-medium text-white/70 leading-relaxed">{act.action}</p>
                       </motion.div>
                    ))}
                 </div>
              </div>

              {/* Recommendation Engine */}
              <div className="os-glass rounded-[2.5rem] p-8 flex flex-col gap-6">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Strategic Recommendation</h3>
                 <div className="p-5 bg-primary/10 border border-primary/20 rounded-2xl">
                    <p className="text-sm font-black text-glow text-primary mb-2 italic">Priority Alpha</p>
                    <p className="text-xs font-bold text-white/90 leading-relaxed">
                       Accelerate "Generative AI Engineering" path for the Q4 Workforce Transformation cycle.
                    </p>
                 </div>
                 <button className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                    View Full Analysis
                 </button>
              </div>
           </div>
        </div>
      </div>
    </ExecutiveErrorBoundary>
  );
};

export default ExecutiveIntelligence;
