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
  Clock, 
  Command,
  Maximize2,
  Terminal,
  Database,
  Cpu,
  ShieldAlert,
  Sparkles
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
  const [activeNode, setActiveNode] = useState<any>(null);

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
    <div className="h-screen flex items-center justify-center bg-[#02040a]">
       <motion.div 
         animate={{ rotate: 360 }}
         transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
         className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full shadow-[0_0_40px_rgba(0,120,212,0.3)]" 
       />
    </div>
  );

  return (
    <div className="h-screen bg-[#02040a] text-white overflow-hidden flex flex-col p-6 gap-6 selection:bg-primary/30">
      
      <header className="h-20 mica rounded-[2.5rem] flex items-center justify-between px-10 border-white/10 shadow-2xl">
         <div className="flex items-center gap-8">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-2xl">CF</div>
            <div className="h-8 w-[1px] bg-white/5" />
            <div className="flex items-center gap-4">
               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
               <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">Foundry AI OS — Advanced Command Center</span>
            </div>
         </div>
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 px-6 py-2.5 bg-white/5 rounded-full border border-white/5 text-[10px] font-black uppercase tracking-widest text-foreground/40 shadow-inner">
               <Clock className="w-4 h-4" /> Real-time Synchronized
            </div>
            <button className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 shadow-xl"><Maximize2 className="w-5 h-5 text-foreground/30" /></button>
         </div>
      </header>

      <main className="flex-1 grid grid-cols-12 gap-6 min-h-0">
         
         <div className="col-span-3 flex flex-col gap-6 min-h-0">
            <div className="flex-[0.45] mica rounded-[3rem] p-10 relative overflow-hidden flex flex-col border-white/10 shadow-2xl">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-8 flex items-center gap-3">
                  <Globe className="w-5 h-5" /> Readiness Signature
               </h3>
               <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="currentColor" opacity={0.05} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 9, fontWeight: 900, opacity: 0.4 }} />
                      <Radar
                        name="Organization"
                        dataKey="A"
                        stroke="#0078d4"
                        strokeWidth={4}
                        fill="#0078d4"
                        fillOpacity={0.2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            <div className="flex-[0.55] mica rounded-[3rem] p-10 flex flex-col min-h-0 border-white/5 shadow-2xl">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30 mb-8 flex items-center gap-3">
                  <Terminal className="w-5 h-5" /> Activity Flux
               </h3>
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 pr-4">
                  <AnimatePresence initial={false}>
                    {liveFeed.map((log) => (
                      <motion.div 
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/40 transition-all cursor-pointer group shadow-xl"
                      >
                         <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">{log.action}</span>
                            <span className="text-[9px] font-bold text-foreground/20">{new Date(log.time).toLocaleTimeString()}</span>
                         </div>
                         <p className="text-sm font-bold text-foreground/60 leading-relaxed group-hover:text-white transition-colors italic">
                            {log.user} initialized cognitive sync.
                         </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
               </div>
            </div>
         </div>

         <div className="col-span-6 mica rounded-[3.5rem] relative overflow-hidden border-white/10 group bg-[#02040a]/40 shadow-2xl">
            <div className="absolute inset-0 living-canvas opacity-10 pointer-events-none" />
            <div className="absolute top-10 left-10 z-10 space-y-3">
               <h2 className="text-4xl font-black tracking-tighter">Neural Graph</h2>
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">Live Relational Ontology</p>
            </div>
            
            <div className="absolute top-10 right-10 z-10 flex gap-3">
               <div className="mica px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase border-white/10 flex items-center gap-3 shadow-2xl">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" /> Nodes
               </div>
               <div className="mica px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase border-white/10 flex items-center gap-3 shadow-2xl">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(0,120,212,0.5)]" /> Units
               </div>
               <div className="mica px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase border-white/10 flex items-center gap-3 shadow-2xl">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" /> Protocols
               </div>
            </div>

            <ForceGraph2D
              graphData={graphData}
              backgroundColor="rgba(0,0,0,0)"
              nodeLabel="name"
              nodeRelSize={7}
              nodeVal={d => (d as any).val}
              nodeColor={d => {
                const type = (d as any).type;
                if (type === 'team') return '#0078d4';
                if (type === 'cert') return '#10b981';
                return '#3b82f6';
              }}
              linkColor={() => 'rgba(255,255,255,0.06)'}
              linkDirectionalParticles={3}
              linkDirectionalParticleSpeed={0.008}
              onNodeClick={node => setActiveNode(node)}
              width={900}
              height={800}
            />

            <AnimatePresence>
               {activeNode && (
                 <motion.div 
                   initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                   animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                   exit={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
                   className="absolute bottom-10 left-10 right-10 mica p-10 rounded-[3rem] border-primary/30 z-20 flex justify-between items-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] bg-[#02040a]/80 backdrop-blur-3xl"
                 >
                    <div className="flex items-center gap-8">
                       <div className="p-5 bg-primary/20 rounded-[2rem] text-primary shadow-2xl border border-primary/10">
                          <Cpu className="w-10 h-10" />
                       </div>
                       <div>
                          <h4 className="text-3xl font-black tracking-tight leading-none mb-3">{activeNode.name}</h4>
                          <p className="text-xs font-black uppercase tracking-[0.3em] text-foreground/30">Node Entity Signature: {activeNode.id}</p>
                       </div>
                    </div>
                    <button onClick={() => setActiveNode(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 shadow-xl">
                       <Command className="w-6 h-6 text-foreground/20 rotate-45" />
                    </button>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>

         <div className="col-span-3 flex flex-col gap-6 min-h-0">
            <div className="flex-[0.5] mica rounded-[3rem] p-10 flex flex-col border-white/5 shadow-2xl">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 mb-10 flex items-center gap-3">
                  <ShieldAlert className="w-5 h-5" /> Neural Vulnerabilities
               </h3>
               <div className="flex-1 grid grid-cols-2 gap-6">
                  {riskData.map((item, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -5, scale: 1.05 }}
                      className="p-6 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col justify-between shadow-xl transition-all duration-500"
                    >
                       <span className="text-[9px] font-black uppercase text-foreground/30 tracking-widest leading-tight">{item.team}<br/>{item.domain}</span>
                       <div className="mt-4 flex items-end justify-between">
                          <span className="text-2xl font-black tracking-tighter">{item.risk}%</span>
                          <div className={cn(
                            "w-3.5 h-3.5 rounded-full shadow-[0_0_20px]",
                            item.risk > 70 ? "bg-red-500 shadow-red-500/50" : item.risk > 30 ? "bg-amber-500 shadow-amber-500/50" : "bg-emerald-500 shadow-emerald-500/50"
                          )} />
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>

            <div className="flex-[0.5] mica rounded-[3rem] p-12 bg-gradient-to-br from-primary via-blue-900 to-[#02040a] border-none shadow-[0_40px_80px_-20px_rgba(0,120,212,0.4)] relative overflow-hidden group">
               <div className="absolute inset-0 living-canvas opacity-30 pointer-events-none group-hover:scale-110 transition-transform duration-[3s]" />
               <div className="relative z-10 space-y-8">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-3xl border border-white/10 shadow-2xl">
                        <Sparkles className="w-7 h-7 text-white" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Strategy Engine</span>
                  </div>
                  <h2 className="text-3xl font-black leading-[1.2] tracking-tighter text-glow">Critical latency detected in Squad Delta.</h2>
                  <p className="text-sm font-medium text-white/60 leading-relaxed italic">
                    "Suggesting immediate skill-injection cycle for Network Security protocols to neutralize risk."
                  </p>
                  <button className="w-full bg-white text-slate-950 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:scale-[1.03] active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]">
                     Initiate Protocol
                  </button>
               </div>
            </div>
         </div>
      </main>

      <footer className="h-14 mica rounded-2xl flex items-center justify-between px-10 border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20 shadow-2xl">
         <div className="flex gap-10">
            <span className="flex items-center gap-3"><Database className="w-4 h-4 text-emerald-500" /> Atlas-Core: Synched</span>
            <span className="flex items-center gap-3"><Cpu className="w-4 h-4 text-primary" /> Neural Uplink: Active</span>
         </div>
         <div className="flex gap-10">
            <span className="hover:text-white cursor-pointer transition-colors">Neural Terminal</span>
            <span className="hover:text-white cursor-pointer transition-colors font-bold text-foreground/40">Audit 2026.06.07.1</span>
         </div>
      </footer>
    </div>
  );
};

export default AICommandCenter;
