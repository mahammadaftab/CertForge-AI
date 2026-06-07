import React, { useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Globe, 
  Database,
  ShieldAlert,
  Sparkles,
  Activity,
  Cpu,
  BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { cn } from '../lib/utils';

const AICommandCenter: React.FC = () => {
  const [graphData, setGraphData] = useState<any>({ nodes: [], links: [] });
  const [radarData, setRadarData] = useState<any[]>([]);
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [riskData, setRiskData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [graph, radar, feed, risk] = await Promise.all([
          api.get('/command-center/graph-data'),
          api.get('/command-center/readiness-radar'),
          api.get('/command-center/live-feed'),
          api.get('/command-center/risk-heatmap')
        ]);
        setGraphData(graph.data);
        setRadarData(radar.data);
        setLiveFeed(feed.data);
        setRiskData(risk.data);
      } catch (err) {
        console.error("Command Center sync failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="h-full flex items-center justify-center">
       <motion.div 
         animate={{ rotate: 360 }}
         transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
         className="w-20 h-20 border-4 border-white/10 border-t-primary rounded-full shadow-[0_0_50px_rgba(0,242,255,0.4)]" 
       />
    </div>
  );

  return (
    <div className="h-full grid grid-cols-12 grid-rows-12 gap-6 pb-6 text-white overflow-hidden">
      
      {/* Knowledge Intelligence Graph */}
      <div className="col-span-8 row-span-8 os-glass rounded-[3rem] relative overflow-hidden group shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10">
         <div className="absolute top-8 left-8 z-10">
            <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
               <Database className="w-6 h-6 text-primary" /> Knowledge Intelligence Graph
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] description mt-1">Live Ontology Mapping</p>
         </div>
         <ForceGraph2D
            graphData={graphData}
            backgroundColor="rgba(0,0,0,0)"
            nodeLabel="name"
            nodeRelSize={6}
            nodeVal={d => (d as any).val}
            nodeColor={d => {
              const type = (d as any).type;
              if (type === 'team') return '#00f2ff';
              if (type === 'cert') return '#7000ff';
              return '#ff007a';
            }}
            linkColor={() => 'rgba(255,255,255,0.1)'}
            linkDirectionalParticles={2}
            linkDirectionalParticleSpeed={0.015}
            width={1200}
            height={800}
         />
      </div>

      {/* Workforce Readiness Radar */}
      <div className="col-span-4 row-span-6 os-window rounded-[3rem] p-8 flex flex-col relative overflow-hidden">
         <div className="absolute inset-0 bg-primary/5 blur-3xl" />
         <h3 className="text-xl font-black tracking-tighter flex items-center gap-3 relative z-10 mb-6">
            <Globe className="w-5 h-5 text-secondary" /> Readiness Radar
         </h3>
         <div className="flex-1 min-h-0 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 800 }} />
                <Radar
                  name="Metrics"
                  dataKey="A"
                  stroke="#00f2ff"
                  strokeWidth={3}
                  fill="#00f2ff"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
         </div>
      </div>

      {/* Workforce Risk Heatmap */}
      <div className="col-span-4 row-span-6 os-window rounded-[3rem] p-8 flex flex-col relative overflow-hidden border-t-4 border-t-red-500/50">
         <h3 className="text-xl font-black tracking-tighter flex items-center gap-3 mb-6">
            <ShieldAlert className="w-5 h-5 text-red-400" /> Risk Heatmap
         </h3>
         <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
            {riskData.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                 <div>
                    <p className="text-[11px] font-black uppercase text-white">{item.team}</p>
                    <p className="text-[9px] font-bold description uppercase tracking-widest">{item.domain}</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <span className="text-xl font-black tracking-tighter">{item.risk}%</span>
                    <div className={cn("w-2 h-2 rounded-full", item.risk > 70 ? "bg-red-500 shadow-[0_0_10px_red]" : "bg-emerald-500 shadow-[0_0_10px_#10b981]")} />
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Live Agent Activity Feed */}
      <div className="col-span-4 row-span-4 os-glass rounded-[3rem] p-8 flex flex-col relative overflow-hidden">
         <h3 className="text-xl font-black tracking-tighter flex items-center gap-3 mb-6 text-glow">
            <Activity className="w-5 h-5 text-emerald-400" /> Agent Activity Feed
         </h3>
         <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
            <AnimatePresence>
               {liveFeed.map((log) => (
                 <motion.div 
                   key={log.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="pl-4 border-l-2 border-emerald-500/50 relative py-1"
                 >
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                    <p className="text-[10px] font-black description uppercase tracking-widest mb-1">{new Date(log.time).toLocaleTimeString()} - {log.user}</p>
                    <p className="text-sm font-bold text-white leading-snug">{log.action}: {log.details}</p>
                 </motion.div>
               ))}
            </AnimatePresence>
         </div>
      </div>

      {/* AI Recommendation Stream */}
      <div className="col-span-4 row-span-4 os-window bg-primary/5 rounded-[3rem] p-8 flex flex-col relative overflow-hidden border-primary/20">
         <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
         <h3 className="text-xl font-black tracking-tighter flex items-center gap-3 mb-4 relative z-10">
            <BrainCircuit className="w-5 h-5 text-primary" /> Intelligence Stream
         </h3>
         <div className="flex-1 relative z-10 flex flex-col justify-center">
            <div className="p-6 os-glass opacity-80 backdrop-blur-md rounded-2xl border border-primary/30">
               <div className="flex items-center gap-2 mb-3 text-primary text-[10px] font-black uppercase tracking-widest">
                 <Sparkles className="w-4 h-4" /> Priority Recommendation
               </div>
               <p className="text-md font-medium text-white italic leading-relaxed">
                 "Network Security readiness is declining. Recommend immediate deployment of specialized Study Agents to Cloud Ops team."
               </p>
               <button className="mt-4 px-6 py-2 bg-primary/20 hover:bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors w-full border border-primary/50">
                 Execute Workflow
               </button>
            </div>
         </div>
      </div>

      {/* Certification Intelligence Engine */}
      <div className="col-span-4 row-span-4 os-glass rounded-[3rem] p-8 flex flex-col relative overflow-hidden">
         <h3 className="text-xl font-black tracking-tighter flex items-center gap-3 mb-6">
            <Cpu className="w-5 h-5 text-accent" /> Cert Intelligence Engine
         </h3>
         <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
               <span className="text-[11px] font-black uppercase description tracking-widest">Global Accuracy</span>
               <span className="text-2xl font-black text-white">94.2%</span>
            </div>
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
               <span className="text-[11px] font-black uppercase description tracking-widest">Inference Latency</span>
               <span className="text-2xl font-black text-accent">12ms</span>
            </div>
         </div>
      </div>

    </div>
  );
};

export default AICommandCenter;
