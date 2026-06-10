import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Activity, Database, Network, Terminal, 
  Server, BrainCircuit, PlayCircle, Plus, Info, RefreshCcw
} from 'lucide-react';
import { cn } from '../lib/utils';
import ForceGraph2D from 'react-force-graph-2d';
import api from '../lib/api';

// --- Error Boundary ---
class AgentErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-black/40 rounded-[3rem] border border-accent/20">
          <Cpu className="w-16 h-16 text-accent mb-6" />
          <h2 className="text-3xl font-black text-white mb-4 uppercase italic">Neural Sync Error</h2>
          <button onClick={() => window.location.reload()} className="px-8 py-4 bg-accent text-white rounded-2xl font-black uppercase text-xs">Reboot Studio</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Components ---

const GlassCard = ({ children, className, title, icon: Icon }: any) => (
  <div className={cn("bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group", className)}>
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
      {Icon && <Icon className="w-4 h-4 text-primary" />}
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{title}</h3>
    </div>
    {children}
  </div>
);

const AgentStudio: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [memory, setMemory] = useState<any>(null);
  const [graphData, setGraphData] = useState<any>({ nodes: [], links: [] });
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgentStatus = useCallback(async () => {
    try {
      const [statusRes, memoryRes, graphRes, feedRes] = await Promise.all([
        api.get('/intelligence/agents/status'),
        api.get('/intelligence/agents/memory/demo'),
        api.get('/command-center/graph-data'),
        api.get('/intelligence/agents/feed')
      ]);
      setAgents(statusRes.data);
      setMemory(memoryRes.data);
      setGraphData(graphRes.data);
      setLogs(feedRes.data);
    } catch (err) {
      console.error("Studio sync failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgentStatus();
    const interval = setInterval(fetchAgentStatus, 15000);
    return () => clearInterval(interval);
  }, [fetchAgentStatus]);

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center gap-8">
       <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Syncing Agent Studio...</p>
    </div>
  );

  return (
    <AgentErrorBoundary>
      <div className="h-full flex flex-col gap-6 text-white overflow-hidden pb-6 px-6 relative z-10">
        <header className="flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 azure-gradient rounded-2xl flex items-center justify-center shadow-glow">
                <Cpu className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">Agent Studio</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-2">Multi-Agent Orchestration Hub</p>
              </div>
           </div>
           <button onClick={fetchAgentStatus} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <RefreshCcw className="w-3.5 h-3.5" /> Re-Sync
           </button>
        </header>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
           {/* LEFT: Agent Mesh */}
           <div className="col-span-4 flex flex-col gap-6 overflow-hidden">
              <GlassCard title="Active Network Status" icon={Network} className="flex-1 overflow-y-auto no-scrollbar">
                 <div className="space-y-4">
                    {agents.map((agent) => (
                      <div key={agent.name} className="p-5 bg-white/5 border border-white/5 rounded-2xl group hover:border-primary/20 transition-all">
                         <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                               <div className={cn(
                                 "w-2 h-2 rounded-full",
                                 agent.status === 'running' ? "bg-primary animate-pulse" : "bg-highlight"
                               )} />
                               <span className="text-xs font-black uppercase tracking-widest text-white/80">{agent.name}</span>
                            </div>
                            <span className="text-[9px] font-mono text-white/20 uppercase tracking-tighter">{agent.latency}</span>
                         </div>
                         <div className="flex justify-between items-center">
                            <p className="text-[10px] font-bold text-white/40 italic">State: {agent.currentState}</p>
                            <span className="text-[10px] font-black text-primary">{agent.successRate}% Integrity</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </GlassCard>
              <div className="p-8 os-glass rounded-[2.5rem] border-white/5">
                 <div className="flex items-center gap-3 mb-6">
                    <Terminal className="w-5 h-5 text-secondary" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-white/60">Registry Metrics</h3>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl text-center">
                       <p className="text-[9px] font-black text-white/20 uppercase mb-1">Tasks</p>
                       <p className="text-2xl font-black">1.2k+</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl text-center">
                       <p className="text-[9px] font-black text-white/20 uppercase mb-1">Inference</p>
                       <p className="text-2xl font-black text-secondary">8ms</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* CENTER: Topology View */}
           <div className="col-span-8 flex flex-col gap-6 min-h-0">
              <div className="flex-1 os-window rounded-[3rem] relative overflow-hidden border-white/10 bg-black/40 backdrop-blur-xl">
                 <div className="absolute top-8 left-8 z-10 pointer-events-none">
                    <div className="flex items-center gap-3">
                       <Activity className="w-4 h-4 text-primary" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Neural Execution Graph</span>
                    </div>
                 </div>
                 <div className="w-full h-full">
                    <ForceGraph2D
                      graphData={graphData}
                      nodeRelSize={6}
                      linkColor={() => 'rgba(255,255,255,0.06)'}
                      nodeCanvasObject={(node: any, ctx, globalScale) => {
                         ctx.beginPath();
                         ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
                         ctx.fillStyle = node.type === 'employee' ? '#3b82f6' : '#00E5FF';
                         ctx.fill();
                      }}
                      backgroundColor="transparent"
                    />
                 </div>
              </div>

              {/* Memory Trace */}
              <div className="h-[300px] grid grid-cols-2 gap-6">
                 <GlassCard title="Shared Memory Trace" icon={Database} className="overflow-hidden flex flex-col">
                    {memory ? (
                      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar pr-2">
                        {Object.entries(memory).map(([key, val]) => (
                          <div key={key} className="flex flex-col bg-white/[0.02] p-3 rounded-xl border border-white/5">
                             <span className="text-[9px] font-black uppercase text-white/30 tracking-widest">{key}</span>
                             <span className="text-xs font-bold text-white/80 mt-1">{String(val)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center opacity-10"><Info className="w-12 h-12" /></div>
                    )}
                 </GlassCard>
                 <GlassCard title="Real-time Log Mesh" icon={Activity} className="overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto no-scrollbar pr-2 space-y-3">
                       {logs.map(log => (
                         <div key={log.id} className="p-3 bg-white/5 rounded-xl border-l-2 border-primary">
                            <div className="flex justify-between items-start">
                               <span className="text-[9px] font-black text-primary uppercase">{log.agent}</span>
                               <span className="text-[9px] font-mono text-white/20">{log.time}</span>
                            </div>
                            <p className="text-[10px] font-bold text-white/60 mt-1">{log.action}</p>
                         </div>
                       ))}
                    </div>
                 </GlassCard>
              </div>
           </div>
        </div>
      </div>
    </AgentErrorBoundary>
  );
};

export default AgentStudio;
