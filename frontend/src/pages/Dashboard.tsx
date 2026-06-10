import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Sparkles,
  Terminal,
  Network,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  Award,
  BookOpen,
  Target,
  TrendingUp,
  ShieldAlert,
  BarChart4,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import ForceGraph2D from 'react-force-graph-2d';
import { dashboardService } from '../lib/dashboardService';
import type { GraphData, RadarData, ActivityLog } from '../lib/dashboardService';
import { useAuth, UserRole } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../hooks/useWebSocket';

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
      </div>
    )}
    <div className="flex-1 p-6 relative z-10">
      {children}
    </div>
  </motion.div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { lastEvent } = useWebSocket();
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [radarData, setRadarData] = useState<RadarData[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [agents, setAgents] = useState<AgentStatus[]>(INITIAL_AGENTS);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [graphDimensions, setGraphDimensions] = useState({ width: 0, height: 0 });

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
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Real-time Event Handling
  useEffect(() => {
    if (!lastEvent) return;

    if (lastEvent.type === 'dashboard_updated') {
       fetchData();
    }
    
    if (lastEvent.type === 'agent_completed') {
       const agentName = lastEvent.data.agent;
       setAgents(prev => prev.map(a => 
          a.name === agentName ? { ...a, status: 'completed' } : a
       ));
    }

    if (lastEvent.type === 'learning_started') {
       setActivities(prev => [{
          id: Math.random().toString(),
          user: user?.full_name || 'System',
          action: 'STARTED_LEARNING',
          details: `Target: ${lastEvent.data.certification_name}`,
          time: new Date().toISOString()
       }, ...prev]);
    }
    
    if (lastEvent.type === 'readiness_updated') {
       fetchData(); // Refresh radar and stats
    }

    if (lastEvent.type === 'prediction_generated') {
       setActivities(prev => [{
          id: Math.random().toString(),
          user: 'Prediction Agent',
          action: 'FORECAST_GEN',
          details: `Probability: ${lastEvent.data.pass_probability}% | Risk: ${lastEvent.data.risk_level}`,
          time: new Date().toISOString()
       }, ...prev]);
    }
  }, [lastEvent, fetchData, user?.full_name]);

  if (loading && !isDemoMode) return (
    <div className="h-[80vh] flex items-center justify-center">
       <div className="flex flex-col items-center gap-8">
          <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin shadow-[0_0_50px_rgba(59,130,246,0.3)]" />
          <span className="text-[12px] font-black uppercase tracking-[0.5em] text-blue-400 animate-pulse">Syncing Mission Control...</span>
       </div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-24 relative z-10">
      {/* 1. Header (Role-Based CTA) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-r from-blue-900/20 via-black/40 to-purple-900/20 border border-white/10 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl"
      >
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
             <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-blue-400"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 shadow-[0_0_10px_rgba(59,130,246,0.5)] bg-blue-500"></span>
              </div>
             <span className="text-xs font-bold uppercase tracking-[0.4em] text-blue-400">Clearance: {user?.role.toUpperCase()}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
            Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Control.</span>
          </h1>
          <p className="text-sm md:text-base font-medium text-white/60 max-w-2xl leading-relaxed italic">
            "Your workspace is ready, {user?.full_name.split(' ')[0]}. Initializing neural link to {user?.role === UserRole.ROOT_ADMIN ? 'enterprise core' : user?.role === UserRole.CONTROLLER ? 'operations mesh' : 'personal learning path'}."
          </p>
        </div>
        
        <div className="relative z-10 flex gap-4 shrink-0">
           {user?.role === UserRole.ROOT_ADMIN ? (
             <button onClick={() => navigate('/agent-studio')} className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                <Sparkles className="w-4 h-4" /> Execute Orchestration
             </button>
           ) : user?.role === UserRole.CONTROLLER ? (
             <button onClick={() => navigate('/analytics')} className="h-14 px-8 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                <BarChart4 className="w-4 h-4" /> Team Analytics
             </button>
           ) : (
             <button onClick={() => navigate('/learning-path')} className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                <Zap className="w-4 h-4" /> Start Learning
             </button>
           )}
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Associate / Everyone View */}
        <GlassCard title="Personal Readiness" icon={Target} className="md:col-span-4 min-h-[400px]" delay={0.1}>
           <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 700 }} />
                <Radar name="Readiness" dataKey="A" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.3} />
              </RadarChart>
           </ResponsiveContainer>
        </GlassCard>

        {/* Manager / Admin View */}
        {(user?.role === UserRole.CONTROLLER || user?.role === UserRole.ROOT_ADMIN) && (
          <GlassCard title="Intelligence Graph" icon={Network} className="md:col-span-8 min-h-[400px] p-0 overflow-hidden" delay={0.2}>
             <div className="w-full h-full cursor-move" ref={(el) => { if (el && graphDimensions.width !== el.clientWidth) setGraphDimensions({ width: el.clientWidth, height: el.clientHeight }); }}>
                {graphDimensions.width > 0 && (
                  <ForceGraph2D
                    width={graphDimensions.width}
                    height={graphDimensions.height}
                    graphData={graphData}
                    nodeLabel="name"
                    nodeCanvasObject={(node: any, ctx, globalScale) => {
                       ctx.beginPath();
                       ctx.arc(node.x, node.y, node.val / 2, 0, 2 * Math.PI, false);
                       ctx.fillStyle = node.type === 'employee' ? '#3b82f6' : '#ec4899';
                       ctx.fill();
                    }}
                    linkColor={() => 'rgba(255,255,255,0.08)'}
                  />
                )}
             </div>
          </GlassCard>
        )}

        {/* Admin Specific View */}
        {user?.role === UserRole.ROOT_ADMIN && (
          <>
            <GlassCard title="Agent Execution" icon={Cpu} className="md:col-span-6 min-h-[300px]" delay={0.3}>
               <div className="grid grid-cols-1 gap-4">
                  {agents.map(a => (
                    <div key={a.name} className="p-4 bg-white/5 rounded-2xl flex justify-between items-center border border-white/5 group hover:border-primary/20 transition-all">
                       <div className="flex items-center gap-3">
                          <Cpu className={cn("w-4 h-4 transition-colors", a.status === 'completed' ? 'text-emerald-400' : 'text-white/40 group-hover:text-primary')} />
                          <span className="text-xs font-bold text-white/80">{a.name}</span>
                       </div>
                       <span className={cn("text-[9px] font-black uppercase", a.status === 'completed' ? 'text-emerald-400' : 'text-highlight')}>
                          {a.status.toUpperCase()}
                       </span>
                    </div>
                  ))}
               </div>
            </GlassCard>
            <GlassCard title="Strategic Flux" icon={Activity} className="md:col-span-6 min-h-[300px]" delay={0.4}>
                <div className="space-y-4">
                   {activities.slice(0, 3).map((act, i) => (
                     <div key={i} className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">{act.user}</span>
                           <span className="text-[9px] font-bold text-white/20">{act.time}</span>
                        </div>
                        <p className="text-xs text-white/70 font-medium">{act.action}: {act.details}</p>
                     </div>
                   ))}
                </div>
            </GlassCard>
          </>
        )}

        {/* Associate / Everyone View: Learning Path */}
        <GlassCard title="Active Protocol" icon={Award} className={cn(user?.role === UserRole.ROOT_ADMIN ? "md:col-span-12" : "md:col-span-8")} delay={0.5}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
              <div className="space-y-6">
                 <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">Current Target</h4>
                    <h3 className="text-3xl font-black text-white tracking-tighter leading-none uppercase">Azure Solutions Architect</h3>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Progress</span>
                       <span className="text-xl font-black text-white">74%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                       <motion.div initial={{ width: 0 }} animate={{ width: '74%' }} className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                    </div>
                 </div>
              </div>
              <div className="p-8 os-glass rounded-[2rem] border-blue-500/20 bg-blue-500/5">
                 <div className="flex items-center gap-3 mb-4">
                    <BrainCircuit className="w-5 h-5 text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">AI Coach Note</span>
                 </div>
                 <p className="text-sm font-bold text-white/80 leading-relaxed italic">
                    "Focus on Subscription Hierarchies. Your assessment performance suggests a 12% lag in this domain compared to peer benchmarks."
                 </p>
              </div>
           </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
