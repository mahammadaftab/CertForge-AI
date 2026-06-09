import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Activity, Database, Network, Terminal, 
  Server, BrainCircuit, PlayCircle, Plus
} from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';
import { cn } from '../lib/utils';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { agentService } from '../lib/agentService';
import type { AgentStatusData, AgentMemory, AgentExecutionLog } from '../lib/agentService';
import { useAuth } from '../context/AuthContext';

const MOCK_AGENTS: AgentStatusData[] = [];

const MOCK_MEMORY: AgentMemory = {
  employee: 'Awaiting Context...',
  certification: 'Pending...',
  studyPlan: 'Pending...',
  readiness: 0
};

const MOCK_NETWORK = {
  nodes: [
    { id: 'master', name: 'Master Orchestrator', val: 20, color: '#3b82f6' },
    { id: 'learning', name: 'Learning Agent', val: 10, color: '#10b981' },
    { id: 'study', name: 'Study Plan Agent', val: 10, color: '#8b5cf6' },
    { id: 'assessment', name: 'Assessment Agent', val: 10, color: '#f59e0b' },
    { id: 'readiness', name: 'Readiness Agent', val: 10, color: '#ef4444' },
    { id: 'verification', name: 'Verification Agent', val: 10, color: '#06b6d4' }
  ],
  links: [
    { source: 'master', target: 'learning' },
    { source: 'master', target: 'study' },
    { source: 'study', target: 'assessment' },
    { source: 'assessment', target: 'readiness' },
    { source: 'readiness', target: 'verification' },
    { source: 'verification', target: 'master' }
  ]
};

const GlassCard = ({ children, className, title, icon: Icon, delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className={cn(
      "relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col group",
      className
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 pointer-events-none" />
    {(title || Icon) && (
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        {Icon && <Icon className="w-4 h-4 text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]" />}
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">{title}</h3>
      </div>
    )}
    <div className="flex-1 p-6 relative z-10">
      {children}
    </div>
  </motion.div>
);

const AgentStudio: React.FC = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState<AgentStatusData[]>([]);
  const [memory, setMemory] = useState<AgentMemory | null>(null);
  const [feed, setFeed] = useState<AgentExecutionLog[]>([]);
  const [graphDimensions, setGraphDimensions] = useState({ width: 0, height: 0 });
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Websocket ref mock (removed unused ref)

  const fetchInitialData = useCallback(async () => {
    try {
      // Parallel fetch from Real APIs
      const [agentStatus, agentMemory, agentFeed] = await Promise.all([
        agentService.getAgentStatus(),
        agentService.getAgentMemory(user?.id || 'demo'),
        agentService.getLiveFeed()
      ]);
      setAgents(agentStatus);
      setMemory(agentMemory);
      setFeed(agentFeed);
      setIsDemoMode(false);
    } catch (error) {
      console.warn("Backend unavailable, falling back to Demo Mode.");
      setIsDemoMode(true);
      setAgents(MOCK_AGENTS);
      setMemory(MOCK_MEMORY);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInitialData();
    
    // Poll for real data periodically
    const interval = setInterval(() => {
        fetchInitialData();
    }, 2000);

    return () => clearInterval(interval);
  }, [fetchInitialData]);

  const handleExecuteWorkflow = async () => {
    setIsExecuting(true);
    
    if (!isDemoMode) {
      try {
        await agentService.executeWorkflow({ 
            employee_id: user?.id || 'demo',
            certification_target: "AZ-104: Microsoft Azure Administrator",
            employee_skills: ["Azure", "Networking", "Compute"]
        });
        setIsExecuting(false);
        fetchInitialData();
      } catch (e) {
        console.error("Workflow execution failed", e);
        setIsExecuting(false);
      }
    } else {
      // Mock execution delay
      setTimeout(() => {
        setIsExecuting(false);
      }, 5000);
    }
  };

  if (loading && !isDemoMode) {
    return (
      <div className="h-full flex items-center justify-center">
         <div className="flex flex-col items-center gap-8">
            <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin shadow-[0_0_50px_rgba(168,85,247,0.3)]" />
            <span className="text-[12px] font-black uppercase tracking-[0.5em] text-purple-400 animate-pulse">Initializing Agent Studio...</span>
         </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto pb-24">
      
      {/* Demo Mode Banner */}
      <AnimatePresence>
        {isDemoMode && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2 mb-4"
          >
            <Server className="w-4 h-4" /> Demo Mode: Backend unreachable. Using synthetic LangGraph orchestration data.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/[0.02] border border-white/5 p-6 rounded-[2rem]"
      >
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="relative flex h-3 w-3">
                 <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isExecuting ? "bg-purple-400" : "bg-emerald-400")}></span>
                 <span className={cn("relative inline-flex rounded-full h-3 w-3 shadow-[0_0_10px_currentColor]", isExecuting ? "bg-purple-500 text-purple-500" : "bg-emerald-500 text-emerald-500")}></span>
               </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Multi-Agent System</span>
           </div>
           <h1 className="text-3xl md:text-4xl font-black text-white">Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Studio</span></h1>
        </div>
        
        <button 
           onClick={handleExecuteWorkflow}
           disabled={isExecuting}
           className="h-14 px-8 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
        >
           {isExecuting ? <Cpu className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />} 
           {isExecuting ? 'Orchestrating...' : 'Run Certification Workflow'}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Agent Network Graph */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <ErrorBoundary>
            <GlassCard title="Agent Topology Network" icon={Network} className="h-[400px] p-0" delay={0.1}>
              <div className="absolute top-6 left-6 z-20 pointer-events-none flex flex-col gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-white/80">
                   Nodes: {MOCK_NETWORK.nodes.length} | Latency: 42ms
                </div>
              </div>
              <div 
                className="w-full h-full cursor-move" 
                ref={(el) => { if (el && graphDimensions.width !== el.clientWidth) setGraphDimensions({ width: el.clientWidth, height: el.clientHeight }); }}
              >
                {graphDimensions.width > 0 && (
                  <ForceGraph2D
                    width={graphDimensions.width}
                    height={graphDimensions.height}
                    graphData={MOCK_NETWORK}
                    nodeRelSize={6}
                    linkColor={() => 'rgba(255,255,255,0.1)'}
                    linkWidth={2}
                    linkDirectionalParticles={isExecuting ? 2 : 0}
                    linkDirectionalParticleSpeed={0.01}
                    backgroundColor="transparent"
                    nodeCanvasObject={(node: any, ctx, globalScale) => {
                       const label = node.name;
                       const fontSize = 12/globalScale;
                       ctx.font = `${fontSize}px Inter`;
                       
                       ctx.beginPath();
                       ctx.arc(node.x, node.y, node.val / 2, 0, 2 * Math.PI, false);
                       ctx.fillStyle = node.color || '#fff';
                       ctx.shadowBlur = 15;
                       ctx.shadowColor = node.color;
                       ctx.fill();
                       
                       if(isExecuting && Math.random() > 0.8) {
                          ctx.beginPath();
                          ctx.arc(node.x, node.y, (node.val / 2) + 5, 0, 2 * Math.PI, false);
                          ctx.strokeStyle = `rgba(255,255,255,0.5)`;
                          ctx.stroke();
                       }

                       ctx.shadowBlur = 0;
                       ctx.textAlign = 'center';
                       ctx.textBaseline = 'middle';
                       ctx.fillStyle = 'rgba(255,255,255,0.8)';
                       ctx.fillText(label, node.x, node.y + (node.val / 2) + 12 / globalScale);
                    }}
                  />
                )}
              </div>
            </GlassCard>
          </ErrorBoundary>

          {/* Workflow Builder (Visual Placeholder) */}
          <ErrorBoundary>
             <GlassCard title="Workflow Orchestrator" icon={BrainCircuit} className="h-[250px]" delay={0.2}>
                <div className="flex items-center h-full gap-4 overflow-x-auto pb-4 scrollbar-none">
                   {['Data Ingestion', 'Cognitive Parsing', 'Skill Extraction', 'Knowledge Graph Update', 'Readiness Output'].map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div className="min-w-[180px] h-full rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col justify-between group hover:border-purple-500/50 transition-colors cursor-pointer">
                           <div className="flex justify-between items-start">
                              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
                                 {idx + 1}
                              </div>
                              <Plus className="w-4 h-4 text-white/20 group-hover:text-white/80 transition-colors" />
                           </div>
                           <div>
                              <h4 className="text-sm font-bold text-white mb-1">{step}</h4>
                              <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Auto-Managed</p>
                           </div>
                        </div>
                        {idx < 4 && (
                           <div className="flex-shrink-0 w-8 h-0.5 bg-gradient-to-r from-purple-500/50 to-blue-500/50 relative">
                              {isExecuting && <motion.div animate={{ x: [0, 32] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute top-1/2 -translate-y-1/2 left-0 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff]" />}
                           </div>
                        )}
                      </React.Fragment>
                   ))}
                </div>
             </GlassCard>
          </ErrorBoundary>
        </div>

        {/* Side Panel: Status & Memory & Logs */}
        <div className="xl:col-span-4 flex flex-col gap-6">
           <ErrorBoundary>
              <GlassCard title="Agent Status Matrix" icon={Activity} className="max-h-[300px] overflow-y-auto scrollbar-none" delay={0.3}>
                 <div className="space-y-3">
                    {agents.map(agent => (
                       <div key={agent.name} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                             <span className="text-xs font-bold text-white">{agent.name}</span>
                             <span className={cn(
                                "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded",
                                agent.status === 'running' ? "bg-purple-500/20 text-purple-400 animate-pulse" : 
                                agent.status === 'completed' ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/40"
                             )}>
                                {agent.status}
                             </span>
                          </div>
                          <div className="flex justify-between text-[10px] text-white/50">
                             <span>Latency: {agent.latency}</span>
                             <span>Success: {agent.successRate}%</span>
                          </div>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1">
                              <motion.div 
                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                initial={{ width: agent.status === 'running' ? '0%' : '100%' }}
                                animate={{ width: agent.status === 'running' ? '100%' : agent.status === 'completed' ? '100%' : '0%' }}
                                transition={{ duration: agent.status === 'running' ? 2 : 0.5, repeat: agent.status === 'running' ? Infinity : 0 }}
                              />
                          </div>
                       </div>
                    ))}
                 </div>
              </GlassCard>
           </ErrorBoundary>

           <ErrorBoundary>
              <GlassCard title="Shared Memory Cache" icon={Database} className="shrink-0" delay={0.4}>
                 {memory ? (
                   <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                         <span className="text-[10px] uppercase text-white/40 font-bold">Context</span>
                         <span className="text-xs font-bold text-blue-400">{memory.employee}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                         <span className="text-[10px] uppercase text-white/40 font-bold">Target</span>
                         <span className="text-xs font-bold text-purple-400">{memory.certification}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                         <span className="text-[10px] uppercase text-white/40 font-bold">Plan</span>
                         <span className="text-xs font-bold text-white">{memory.studyPlan}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] uppercase text-white/40 font-bold">Readiness</span>
                         <span className="text-xs font-bold text-emerald-400">{memory.readiness}%</span>
                      </div>
                   </div>
                 ) : (
                   <div className="text-center text-white/40 text-xs py-4">Memory state uninitialized.</div>
                 )}
              </GlassCard>
           </ErrorBoundary>

           <ErrorBoundary>
              <GlassCard title="Execution Stream" icon={Terminal} className="flex-1 min-h-[250px] overflow-hidden flex flex-col" delay={0.5}>
                 <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-none font-mono">
                    <AnimatePresence>
                       {feed.map((log) => (
                          <motion.div 
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[10px] border-l border-white/10 pl-2 py-1"
                          >
                             <div className="flex gap-2 text-white/40">
                                <span>[{log.time}]</span>
                                <span className={cn(
                                   "font-bold",
                                   log.status === 'error' ? 'text-red-400' :
                                   log.status === 'warning' ? 'text-amber-400' : 'text-blue-400'
                                )}>[{log.agent}]</span>
                             </div>
                             <div className="text-white/80 mt-0.5">{log.action}</div>
                          </motion.div>
                       ))}
                    </AnimatePresence>
                    {feed.length === 0 && (
                       <div className="text-center text-white/20 mt-4 text-[10px] uppercase tracking-widest">Listening for logs...</div>
                    )}
                 </div>
              </GlassCard>
           </ErrorBoundary>

        </div>
      </div>
    </div>
  );
};

export default AgentStudio;
