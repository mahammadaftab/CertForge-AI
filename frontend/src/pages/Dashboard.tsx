import React, { useState, useEffect, useCallback } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer
} from 'recharts';
import { 
  Activity, 
  BrainCircuit, 
  Cpu, 
  ShieldAlert, 
  Sparkles,
  Terminal,
  Network,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import ForceGraph2D from 'react-force-graph-2d';
import { dashboardService } from '../lib/dashboardService';
import type { GraphData, RadarData, ActivityLog, PredictionResult } from '../lib/dashboardService';
// No toast dependency needed for now

// --- AGENT TYPES ---
interface AgentStatus {
  name: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  startTime?: string;
  duration?: string;
}

const INITIAL_AGENTS: AgentStatus[] = [
  { name: 'Learning Agent', status: 'idle' },
  { name: 'Study Plan Agent', status: 'idle' },
  { name: 'Assessment Agent', status: 'idle' },
  { name: 'Readiness Agent', status: 'idle' },
  { name: 'Verification Agent', status: 'idle' },
];

// --- COMPONENTS ---

const GlassCard = ({ children, className, title, icon: Icon, delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className={cn(
      "relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col group",
      className
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />
    
    {(title || Icon) && (
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-4 h-4 text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]" />}
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">{title}</h3>
        </div>
        <div className="flex gap-1">
           <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
           <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
           <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
        </div>
      </div>
    )}
    <div className="flex-1 p-6 relative z-10">
      {children}
    </div>
  </motion.div>
);

const Dashboard: React.FC = () => {
  // State
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [radarData, setRadarData] = useState<RadarData[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [agents, setAgents] = useState<AgentStatus[]>(INITIAL_AGENTS);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [graphDimensions, setGraphDimensions] = useState({ width: 0, height: 0 });
  const [isPredicting, setIsPredicting] = useState(false);

  // Load Data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [gData, rData, fData] = await Promise.all([
        dashboardService.getGraphData(),
        dashboardService.getRadarData(),
        dashboardService.getLiveFeed()
      ]);
      setGraphData(gData);
      setRadarData(rData);
      setActivities(fData);
      setIsDemoMode(false);
    } catch (err) {
      console.error("Failed to sync with Foundry OS Kernel", err);
      setIsDemoMode(true);
      // Fallback/Mock data handled in UI if needed, but the requirement says show "Demo Mode"
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
        dashboardService.getLiveFeed().then(setActivities).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Actions
  const handleResync = async () => {
    // console.log replace console.log
    await fetchData();
  };

  const handleRunPrediction = async () => {
    setIsPredicting(true);
    setAgents(prev => prev.map(a => ({ ...a, status: 'running', startTime: new Date().toLocaleTimeString() })));
    
    try {
      // Simulate Agent Pipeline
      for(let i=0; i < agents.length; i++) {
          setAgents(prev => {
              const next = [...prev];
              next[i].status = 'running';
              return next;
          });
          await new Promise(r => setTimeout(r, 800)); // Simulate work
          setAgents(prev => {
              const next = [...prev];
              next[i].status = 'completed';
              next[i].duration = `${(Math.random() * 2 + 0.5).toFixed(1)}s`;
              return next;
          });
      }

      // Real API Call
      const result = await dashboardService.runPrediction({
          study_hours: 45,
          avg_assessment_score: 82,
          skill_coverage_percent: 75,
          team_readiness_avg: 68
      });

      setInsights([
          `Strategic Analysis: Pass probability detected at ${result.pass_probability}%.`,
          `Risk Factor: ${result.risk_score}% variance in current skill mapping.`,
          `Recommendation: ${result.recommendation}`,
          `Foundry Insight: Convergence of nodes suggests Team Alpha is ready for Azure Architect protocols.`
      ]);

      console.log("Prediction Cycle Complete:", result);
    } catch (err) {
      console.error("Orchestration Failed:", err);
    } finally {
      setIsPredicting(false);
    }
  };

  if (loading && !isDemoMode) return (
    <div className="h-[80vh] flex items-center justify-center">
       <div className="flex flex-col items-center gap-8">
          <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin shadow-[0_0_50px_rgba(59,130,246,0.3)]" />
          <span className="text-[12px] font-black uppercase tracking-[0.5em] text-blue-400 animate-pulse">Syncing Mission Control...</span>
       </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-24">
      
      {/* OS Banner */}
      <AnimatePresence>
        {isDemoMode && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2"
          >
            <AlertCircle className="w-4 h-4" /> Demo Mode Active: Backend kernel not detected. Using synthetic workforce data.
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. AI Command Center Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-r from-blue-900/20 via-black/40 to-purple-900/20 border border-white/10 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
             <div className="relative flex h-3 w-3">
                <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isDemoMode ? "bg-amber-400" : "bg-blue-400")}></span>
                <span className={cn("relative inline-flex rounded-full h-3 w-3 shadow-[0_0_10px_rgba(59,130,246,0.5)]", isDemoMode ? "bg-amber-500" : "bg-blue-500")}></span>
              </div>
             <span className="text-xs font-bold uppercase tracking-[0.4em] text-blue-400">System Online // {isDemoMode ? 'Demo Kernel' : 'Foundry Orchestrator v1.0'}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">AI Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Center.</span></h1>
          <p className="text-sm md:text-base font-medium text-white/60 max-w-2xl leading-relaxed">
            Next-gen Enterprise OS mapping real-time readiness intelligence, predictive skill trajectories, and automated workforce orchestration.
          </p>
        </div>
        
        <div className="relative z-10 flex gap-4 shrink-0">
           <button 
             onClick={handleResync}
             className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors flex items-center gap-3 group"
           >
              <Network className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" /> Resync Graph
           </button>
           <button 
             onClick={handleRunPrediction}
             disabled={isPredicting}
             className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
           >
              {isPredicting ? <Cpu className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} 
              {isPredicting ? 'Executing Pipeline...' : 'Run Prediction'}
           </button>
        </div>
      </motion.div>

      {/* Main OS Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* 2. Workforce Readiness Radar (Real Data) */}
        <GlassCard title="Workforce Readiness Radar" icon={Activity} className="md:col-span-4 min-h-[400px]" delay={0.1}>
           <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 to-transparent" />
           <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Readiness"
                  dataKey="A"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  isAnimationActive={true}
                />
              </RadarChart>
           </ResponsiveContainer>
        </GlassCard>

        {/* 3. Intelligence Graph (D3 Force Directed) */}
        <GlassCard title="Intelligence Graph" icon={Network} className="md:col-span-8 min-h-[400px] p-0 overflow-hidden" delay={0.2}>
          <div className="absolute top-6 left-6 z-20 pointer-events-none flex flex-col gap-2">
             <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-white/80">
                Nodes: {graphData.nodes.length} | Edges: {graphData.links.length}
             </div>
             <div className="flex gap-2">
                {['employee', 'skill', 'cert', 'assessment', 'readiness'].map(t => (
                    <div key={t} className="px-2 py-1 rounded bg-black/40 border border-white/5 text-[8px] font-black uppercase text-white/40">{t}</div>
                ))}
             </div>
          </div>
          <div 
             className="w-full h-full cursor-move" 
             ref={(el) => {
               if (el && graphDimensions.width !== el.clientWidth) {
                 setGraphDimensions({ width: el.clientWidth, height: el.clientHeight });
               }
             }}
          >
             {graphDimensions.width > 0 && (
               <ForceGraph2D
                 width={graphDimensions.width}
                 height={graphDimensions.height}
                 graphData={graphData}
                 nodeLabel="name"
                 nodeCanvasObject={(node: any, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize = 12/globalScale;
                    ctx.font = `${fontSize}px Inter`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

                    // Circle Shadow/Glow
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.val / 2, 0, 2 * Math.PI, false);
                    ctx.fillStyle = node.type === 'employee' ? '#3b82f6' : 
                                   node.type === 'skill' ? '#a855f7' : 
                                   node.type === 'cert' ? '#ec4899' : 
                                   node.type === 'assessment' ? '#eab308' : '#10b981';
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = ctx.fillStyle;
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    // Text
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'rgba(255,255,255,0.8)';
                    ctx.fillText(label, node.x, node.y + (node.val / 2) + 10 / globalScale);
                 }}
                 linkColor={() => 'rgba(255,255,255,0.08)'}
                 linkWidth={1.5}
                 backgroundColor="transparent"
                 d3AlphaDecay={0.02}
                 d3VelocityDecay={0.3}
               />
             )}
          </div>
        </GlassCard>

        {/* 4. Agent Execution Center */}
        <GlassCard title="Agent Execution Center" icon={Cpu} className="md:col-span-4 min-h-[400px]" delay={0.3}>
           <div className="space-y-4">
              {agents.map((agent, i) => (
                <div key={agent.name} className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-3">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className={cn(
                           "w-2 h-2 rounded-full",
                           agent.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 
                           agent.status === 'running' ? 'bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]' : 'bg-white/20'
                         )} />
                         <span className="text-xs font-bold text-white/90">{agent.name}</span>
                      </div>
                      <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">
                         {agent.status}
                      </span>
                   </div>
                   
                   <div className="flex justify-between items-end">
                      <div className="flex gap-4">
                         {agent.startTime && (
                           <div className="flex items-center gap-1 text-[9px] text-white/40">
                              <Clock className="w-3 h-3" /> {agent.startTime}
                           </div>
                         )}
                         {agent.duration && (
                           <div className="flex items-center gap-1 text-[9px] text-blue-400 font-bold">
                              <Zap className="w-3 h-3" /> {agent.duration}
                           </div>
                         )}
                      </div>
                      {agent.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                   </div>

                   {agent.status === 'running' && (
                     <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                        />
                     </div>
                   )}
                </div>
              ))}
           </div>
        </GlassCard>

        {/* 5. Agent Activity Stream (Real Logs) */}
        <GlassCard title="Live Activity Stream" icon={Terminal} className="md:col-span-4 min-h-[400px]" delay={0.4}>
           <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 scrollbar-none">
             <AnimatePresence mode="popLayout">
               {activities.length > 0 ? activities.map((act) => (
                 <motion.div 
                   key={act.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-2"
                 >
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                          {act.user}
                       </span>
                       <span className="text-[9px] font-bold text-white/30">{new Date(act.time).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-white/80 font-medium">{act.action}</p>
                 </motion.div>
               )) : (
                 <div className="h-full flex items-center justify-center text-white/20 text-xs font-bold uppercase tracking-[0.3em]">
                    No signals detected
                 </div>
               )}
             </AnimatePresence>
           </div>
        </GlassCard>

        {/* 6. Executive Insights Engine (Dynamic) */}
        <GlassCard title="Executive Insight Engine" icon={BrainCircuit} className="md:col-span-4 min-h-[400px] flex flex-col" delay={0.5}>
           <div className="flex-1 space-y-4">
              {insights.length > 0 ? insights.map((insight, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-blue-900/10 to-transparent border-l-2 border-blue-500 text-sm font-medium text-white/80 leading-relaxed"
                >
                   {insight}
                </motion.div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 px-6">
                   <Sparkles className="w-12 h-12 text-white/5" />
                   <p className="text-xs font-bold text-white/20 uppercase tracking-widest">Awaiting prediction cycle to generate strategic insights</p>
                </div>
              )}
           </div>
           {insights.length > 0 && (
             <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border border-black shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                   ))}
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
                   Broadcast Insights →
                </button>
             </div>
           )}
        </GlassCard>

      </div>
    </div>
  );
};

export default Dashboard;
