import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, Search, Database, FileText, CheckCircle, Brain, Target, 
  Command, Sparkles, Activity, ShieldCheck, Zap, BarChart3, ListTree, 
  Quote, Globe, Cpu, AlertTriangle, TrendingUp, Compass, ArrowUpRight,
  BookOpen, Calendar, Milestone, Info, Users, Network, RefreshCcw, Briefcase
} from 'lucide-react';
import api from '../lib/api';

// --- Types ---
interface ReasoningStep {
  id: string;
  title: string;
  icon: any;
  status: 'idle' | 'processing' | 'complete' | 'error';
  description: string;
}

interface AgentLog {
  id: string;
  agent: string;
  message: string;
  timestamp: string;
  type: 'info' | 'action' | 'citation';
}

// --- Components ---

const PipelineStage = ({ step, index }: { step: ReasoningStep, index: number }) => (
  <div className={`relative flex items-center gap-4 transition-all duration-500 ${step.status === 'idle' ? 'opacity-30' : 'opacity-100'}`}>
    <div className="relative">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500 ${
        step.status === 'processing' ? 'bg-primary/20 border-primary animate-pulse shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 
        step.status === 'complete' ? 'bg-highlight/20 border-highlight text-highlight' : 
        'bg-white/5 border-white/10 text-white/50'
      }`}>
        {step.status === 'complete' ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
      </div>
      {index < 5 && (
        <div className={`absolute left-1/2 top-10 w-0.5 h-8 -translate-x-1/2 transition-colors duration-500 ${
          step.status === 'complete' ? 'bg-highlight/40' : 'bg-white/10'
        }`} />
      )}
    </div>
    <div className="flex flex-col text-white">
      <span className={`text-[10px] font-black uppercase tracking-widest ${
        step.status === 'processing' ? 'text-primary' : 
        step.status === 'complete' ? 'text-highlight' : 
        'text-white/40'
      }`}>
        Stage 0{index + 1}
      </span>
      <span className={`text-sm font-bold tracking-tight ${step.status === 'idle' ? 'text-white/30' : 'text-white'}`}>
        {step.title}
      </span>
    </div>
  </div>
);

const ConfidenceScore = ({ score }: { score: number }) => (
  <div className="flex flex-col gap-2">
    <div className="flex justify-between items-end">
      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Inference Confidence</span>
      <span className="text-2xl font-black text-primary text-glow">{score}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        className="h-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_10px_rgba(0,229,255,0.5)]"
      />
    </div>
  </div>
);

const FoundryIQ: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [result, setResult] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [steps, setSteps] = useState<ReasoningStep[]>([
    { id: 'retrieval', title: 'Signals Sync', icon: Database, status: 'idle', description: 'Querying readiness scores and employee data.' },
    { id: 'analysis', title: 'Workforce Analysis', icon: Users, status: 'idle', description: 'Identifying patterns and risk vectors.' },
    { id: 'graph', title: 'Graph Inference', icon: Network, status: 'idle', description: 'Connecting performance to team clusters.' },
    { id: 'evaluation', title: 'Benchmarking', icon: Target, status: 'idle', description: 'Comparing telemetry against battle-readiness.' },
    { id: 'prediction', title: 'Neural Forecast', icon: Sparkles, status: 'idle', description: 'Calculating success and risk probabilities.' },
    { id: 'recommendation', title: 'Strategy Synth', icon: BrainCircuit, status: 'idle', description: 'Generating executive recommendations.' },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (agent: string, message: string, type: 'info' | 'action' | 'citation' = 'info') => {
    const newLog: AgentLog = {
      id: Math.random().toString(36).substr(2, 9),
      agent,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type
    };
    setLogs(prev => [...prev, newLog]);
  };

  const updateStepStatus = (index: number, status: 'idle' | 'processing' | 'complete' | 'error') => {
    setSteps(prev => prev.map((s, i) => i === index ? { ...s, status } : s));
  };

  const runIntelligenceEngine = async () => {
    if (!query.trim() || isProcessing) return;

    setIsProcessing(true);
    setResult(null);
    setLogs([]);
    setSteps(prev => prev.map(s => ({ ...s, status: 'idle' })));
    
    try {
        // Stage 1: Signals Sync
        setActiveStepIndex(0);
        updateStepStatus(0, 'processing');
        addLog('Foundry IQ', `Syncing global workforce registry for intent: "${query}"`, 'action');
        await new Promise(r => setTimeout(r, 800));
        updateStepStatus(0, 'complete');

        // Stage 2: Workforce Analysis
        setActiveStepIndex(1);
        updateStepStatus(1, 'processing');
        addLog('Foundry IQ', 'Aggregating readiness scores and trajectory flux.', 'action');
        await new Promise(r => setTimeout(r, 1000));
        updateStepStatus(1, 'complete');

        // Call Production API
        const res = await api.post('/intelligence/query', { query });
        const intel = res.data;

        // Stage 3-5: Feed reasoning steps from backend if available, or simulate
        for (let i = 2; i < 5; i++) {
           setActiveStepIndex(i);
           updateStepStatus(i, 'processing');
           if (intel.reasoning && intel.reasoning[i-2]) {
              addLog('Foundry IQ', intel.reasoning[i-2], 'info');
           }
           await new Promise(r => setTimeout(r, 600));
           updateStepStatus(i, 'complete');
        }

        // Stage 6: Strategy Synth
        setActiveStepIndex(5);
        updateStepStatus(5, 'processing');
        addLog('Strategy Agent', 'Finalizing executive synthesis.', 'action');
        await new Promise(r => setTimeout(r, 800));
        updateStepStatus(5, 'complete');

        setResult(intel);
        setIsProcessing(false);
        addLog('System', 'Intelligence synthesis successful.', 'info');
        
    } catch (err) {
      console.error(err);
      updateStepStatus(activeStepIndex, 'error');
      setIsProcessing(false);
      addLog('System', 'Engine fault: Neural link timed out.', 'citation');
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 text-white overflow-hidden pb-6 px-6 relative z-10">
      <header className="flex justify-between items-center px-4">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 azure-gradient rounded-2xl flex items-center justify-center shadow-glow">
              <BrainCircuit className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase">Foundry IQ</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Intelligence Engine</p>
            </div>
         </div>
         <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Engine Pulse</span>
               <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-primary animate-pulse shadow-[0_0_8px_#00E5FF]' : 'bg-highlight shadow-[0_0_8px_#7CFF6B]'}`} />
                  <span className="text-xs font-bold uppercase tracking-widest">{isProcessing ? 'Thinking' : 'Connected'}</span>
               </div>
            </div>
         </div>
      </header>

      <div className="flex-1 flex gap-6 min-h-0">
         {/* --- Left Panel: Pipeline --- */}
         <aside className="w-[320px] os-window rounded-[2.5rem] p-8 flex flex-col gap-10 border-white/5 bg-black/40 backdrop-blur-xl">
            <div>
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-8">Reasoning Pipeline</h3>
               <div className="space-y-6">
                  {steps.map((step, i) => (
                    <PipelineStage key={step.id} step={step} index={i} />
                  ))}
               </div>
            </div>
            
            <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
               <ConfidenceScore score={isProcessing ? 45 : result ? result.confidence : 0} />
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                     <Cpu className="w-3 h-3 text-secondary" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Inference Model</span>
                  </div>
                  <p className="text-[11px] font-bold text-white/60">Foundry-Logic-v2 + Beanie Registry</p>
               </div>
            </div>
         </aside>

         <main className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Query Box */}
            <div className="os-glass rounded-[2.5rem] p-4 flex items-center gap-4 border-white/10 shadow-2xl group focus-within:border-primary/40 transition-all duration-500">
               <div className={`p-4 rounded-2xl transition-all duration-500 ${isProcessing ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/30'}`}>
                  <Search className="w-6 h-6" />
               </div>
               <input 
                 type="text"
                 value={query}
                 onChange={e => setQuery(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && runIntelligenceEngine()}
                 placeholder="Ask workforce intelligence... (e.g. Who is at risk?)"
                 className="flex-1 bg-transparent border-none outline-none text-xl font-bold placeholder:text-white/20 text-white"
                 disabled={isProcessing}
               />
               <button 
                 onClick={runIntelligenceEngine}
                 disabled={isProcessing || !query.trim()}
                 className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-500 ${
                   isProcessing ? 'bg-white/5 text-white/20 cursor-wait' : 
                   query.trim() ? 'bg-primary text-black hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]' : 'bg-white/5 text-white/20'
                 }`}
               >
                 {isProcessing ? 'Thinking...' : 'Analyze'}
               </button>
            </div>

            {/* Response Area */}
            <div className="flex-1 os-window rounded-[2.5rem] flex flex-col overflow-hidden border-white/5 bg-black/40 backdrop-blur-xl">
               <div className="px-8 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                     <Activity className="w-4 h-4 text-primary" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Intelligence Synthesis</span>
                  </div>
                  <div className="flex gap-4">
                     <span className="text-[10px] font-mono text-primary animate-pulse tracking-widest uppercase">Live_Flux</span>
                  </div>
               </div>
               
               <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
                  <AnimatePresence mode="wait">
                    {!result && !isProcessing ? (
                      <div className="h-full flex flex-col items-center justify-center opacity-20 select-none text-white">
                         <Zap className="w-16 h-16 mb-4" />
                         <p className="text-sm font-black uppercase tracking-widest">Awaiting Neural Probe</p>
                      </div>
                    ) : result ? (
                      <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="space-y-8"
                      >
                         <div className="space-y-4">
                            <h2 className="text-4xl font-black tracking-tighter text-white leading-tight">
                               "{result.answer}"
                            </h2>
                            {result.data && (
                               <div className="grid grid-cols-2 gap-4 mt-6">
                                  {result.data.map((item: string, i: number) => (
                                     <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4 group hover:border-primary/20 transition-all">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        <span className="text-xs font-bold text-white/80 uppercase tracking-tight">{item}</span>
                                     </div>
                                  ))}
                               </div>
                            )}
                         </div>

                         <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-8">
                            <div className="space-y-6">
                               <div className="flex items-center gap-3 text-white/40">
                                  <ListTree className="w-4 h-4 text-secondary" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">System Reasoning</span>
                               </div>
                               <div className="space-y-3">
                                  {result.reasoning.map((step: string, i: number) => (
                                     <div key={i} className="flex gap-3 text-xs font-medium text-white/60">
                                        <span className="text-primary font-black">0{i+1}</span>
                                        <p>{step}</p>
                                     </div>
                                  ))}
                               </div>
                            </div>
                            <div className="space-y-6">
                               <div className="flex items-center gap-3 text-white/40">
                                  <Info className="w-4 h-4 text-highlight" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">Data Sources</span>
                               </div>
                               <div className="flex flex-wrap gap-2">
                                  {result.sources.map((s: string, i: number) => (
                                     <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-widest">
                                        {s}
                                     </span>
                                  ))}
                               </div>
                            </div>
                         </div>
                      </motion.div>
                    ) : (
                       <div className="h-full flex flex-col items-center justify-center opacity-40">
                          <RefreshCcw className="w-12 h-12 mb-4 animate-spin text-primary" />
                          <p className="text-[10px] font-black uppercase tracking-widest text-white animate-pulse">Mapping Workforce Clusters...</p>
                       </div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
         </main>

         {/* --- Right Panel: Strategy --- */}
         <aside className="w-[380px] flex flex-col gap-6">
            <div className="os-window rounded-[2.5rem] p-8 border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform"><Briefcase className="w-32 h-32 text-highlight" /></div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6">Strategic Recommendations</h3>
               <div className="space-y-4">
                  {result ? result.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="p-5 bg-white/5 border border-white/5 rounded-2xl group hover:border-primary/20 transition-all cursor-pointer relative overflow-hidden">
                       <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <p className="text-xs font-bold text-white/80 leading-relaxed relative z-10">"{rec}"</p>
                    </div>
                  )) : (
                    <div className="h-40 flex flex-col items-center justify-center text-center opacity-10">
                       <ArrowUpRight className="w-12 h-12 mb-4" />
                       <p className="text-[10px] font-black uppercase tracking-widest">Synthesis Pending</p>
                    </div>
                  )}
               </div>
            </div>

            <div className="flex-1 os-glass rounded-[2.5rem] p-8 flex flex-col gap-6 border-white/10">
                <div className="flex items-center gap-3">
                   <Target className="w-5 h-5 text-secondary" />
                   <h3 className="text-xs font-black uppercase tracking-widest text-white/60">Execution Matrix</h3>
                </div>
                <div className="space-y-4 mt-4">
                   <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-emerald-500">Registry Integrity</span>
                      <span className="text-xs font-black text-white">99.9%</span>
                   </div>
                   <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-primary">Inference Latency</span>
                      <span className="text-xs font-black text-white">8ms</span>
                   </div>
                </div>
                <button className="w-full py-5 azure-gradient rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all mt-auto active:scale-95">
                   Generate Full Insight Report
                </button>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default FoundryIQ;
