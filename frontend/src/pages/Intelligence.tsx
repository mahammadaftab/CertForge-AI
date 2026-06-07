import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Search, Database, FileText, CheckCircle, Brain, Target, Command } from 'lucide-react';
import api from '../lib/api';

const StepNode = ({ icon: Icon, title, desc, delay, active }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className={`flex items-start gap-6 p-6 rounded-[2rem] border ${active ? 'bg-primary/10 border-primary/30 shadow-[0_0_30px_rgba(0,242,255,0.15)]' : 'bg-white/5 border-white/5 opacity-50'} transition-all duration-500`}
  >
     <div className={`p-4 rounded-xl ${active ? 'bg-primary/20 text-primary shadow-glow' : 'bg-white/10 text-white/50'}`}>
        <Icon className="w-6 h-6" />
     </div>
     <div>
        <h4 className={`text-lg font-black tracking-tighter ${active ? 'text-white' : 'text-white/50'}`}>{title}</h4>
        <p className="text-[11px] font-medium description mt-2 leading-relaxed">{desc}</p>
     </div>
  </motion.div>
);

const FoundryIQ: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeStep, setActiveStep] = useState(0);

  const simulateReasoningWorkflow = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setActiveStep(1);
    
    // Simulate multi-step reasoning
    setTimeout(() => setActiveStep(2), 1500); // Doc Retrieval
    setTimeout(() => setActiveStep(3), 3000); // Agent Reasoning
    
    try {
      // Real API Call
      const res = await api.post('/intelligence/orchestrate', {
        employee_id: "demo-user",
        certification_target: query,
        employee_skills: ["Python", "Cloud"]
      });
      setTimeout(() => {
         setActiveStep(4);
         setResult(res.data);
         setLoading(false);
      }, 4500);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setActiveStep(0);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 text-white overflow-hidden pb-6">
      <header className="flex justify-between items-end mb-4 px-4">
         <div>
            <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4 text-glow">
              <BrainCircuit className="w-12 h-12 text-secondary" /> Foundry IQ
            </h1>
            <p className="text-xs font-black uppercase tracking-[0.4em] description mt-2">Agentic Reasoning & Document Intelligence</p>
         </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
         {/* Query & Reasoning Flow */}
         <div className="os-glass rounded-[3rem] p-8 md:p-12 flex flex-col gap-8 shadow-2xl relative overflow-hidden border-white/10">
            <div className="absolute inset-0 bg-secondary/5 blur-3xl pointer-events-none" />
            <div className="relative group">
               <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary z-10" />
               <input 
                 type="text"
                 value={query}
                 onChange={e => setQuery(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && simulateReasoningWorkflow()}
                 placeholder="Input objective for agentic reasoning... (e.g. AZ-104 Readiness)"
                 className="w-full os-glass opacity-80 border border-white/10 focus:border-primary/50 rounded-full py-6 pl-16 pr-6 text-lg font-black outline-none transition-all relative z-10 shadow-inner"
                 disabled={loading}
               />
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
               <StepNode 
                 icon={Database} 
                 title="Knowledge Retrieval" 
                 desc="Semantic search across enterprise vectors, querying skill graphs and past certification telemetry." 
                 active={activeStep >= 1} 
                 delay={0.1} 
               />
               <StepNode 
                 icon={FileText} 
                 title="Document Intelligence" 
                 desc="Parsing relevant whitepapers, documentation, and assessment logs via Azure OpenAI." 
                 active={activeStep >= 2} 
                 delay={0.2} 
               />
               <StepNode 
                 icon={Brain} 
                 title="Multi-Agent Reasoning" 
                 desc="Synthesizing findings through the Readiness Agent to formulate a tailored study strategy." 
                 active={activeStep >= 3} 
                 delay={0.3} 
               />
               <StepNode 
                 icon={CheckCircle} 
                 title="Citation & Generation" 
                 desc="Generating final verified blueprint with semantic citations attached." 
                 active={activeStep >= 4} 
                 delay={0.4} 
               />
            </div>
         </div>

         {/* Results Pane */}
         <div className="os-window rounded-[3rem] p-8 md:p-12 flex flex-col shadow-2xl border-white/5 relative overflow-hidden">
            {loading ? (
               <div className="flex-1 flex flex-col items-center justify-center gap-8">
                  <div className="w-20 h-20 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin shadow-[0_0_30px_rgba(112,0,255,0.4)]" />
                  <p className="text-xs font-black uppercase tracking-widest text-secondary animate-pulse">Processing Neural Pipeline...</p>
               </div>
            ) : result ? (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex-1 flex flex-col overflow-y-auto no-scrollbar"
               >
                  <div className="flex items-center gap-3 mb-8">
                     <Target className="w-8 h-8 text-primary" />
                     <h2 className="text-3xl font-black tracking-tighter">{result.certification_target} Strategy</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-8">
                     <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 text-center">
                        <span className="text-5xl font-black text-primary text-glow">{result.readiness_score}%</span>
                        <p className="text-[10px] font-black uppercase tracking-widest description mt-3">Readiness</p>
                     </div>
                     <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 text-center flex flex-col items-center justify-center">
                        <span className="text-lg font-black text-secondary uppercase tracking-widest text-center leading-none">{result.verification_status}</span>
                        <p className="text-[10px] font-black uppercase tracking-widest description mt-3">Status</p>
                     </div>
                  </div>

                  <div className="p-8 os-glass rounded-[2rem] border-secondary/20 shadow-inner flex-1">
                     <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
                        <Command className="w-4 h-4" /> Strategic Reasoning Output
                     </p>
                     <p className="text-lg font-medium text-white/90 leading-relaxed italic">
                        "{result.manager_insights?.summary}"
                     </p>
                     <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-2">
                        {['Vector DB', 'Azure OpenAI', 'Semantic Search', 'LangChain'].map(tag => (
                           <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase description">{tag}</span>
                        ))}
                     </div>
                  </div>
               </motion.div>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/5">
                     <BrainCircuit className="w-10 h-10 text-white/50" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter description">Awaiting Input</h3>
                  <p className="text-sm font-medium description mt-2 max-w-sm">Enter an objective in the query panel to initiate the multi-agent reasoning flow.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default FoundryIQ;
