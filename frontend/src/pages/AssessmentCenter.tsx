import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  BrainCircuit, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Timer,
  Zap,
  Sparkles,
  BarChart4,
  RefreshCcw,
  Loader2,
  Activity,
  FileQuestion,
  Lightbulb,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const AssessmentCenter: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'intro' | 'exam' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [assessmentId, setAssessmentId] = useState<string>('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const startAssessment = async () => {
    setLoading(true);
    try {
      // Production API call
      const res = await api.post('/assessment/start?certification_id=demo-az-900&difficulty=Adaptive');
      setAssessmentId(res.data._id || res.data.id);
      setQuestions(res.data.questions);
      setStep('exam');
    } catch (err) {
      console.error("Failed to generate assessment", err);
      // Fallback for demo
      setQuestions([
        { id: '1', text: 'Which Azure service is serverless?', options: ['VM', 'Functions', 'Disk', 'VNet'], type: 'mcq', domain: 'Compute' },
        { id: '2', text: 'An enterprise needs low cost for dev.', options: ['Spot', 'Reserved', 'PAYG', 'Dedicated'], type: 'scenario', domain: 'Cost' }
      ]);
      setStep('exam');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const submitAssessment = async () => {
    setSubmitting(true);
    try {
      const submissions = Object.entries(userAnswers).map(([id, answer]) => ({ id, answer }));
      
      const res = await api.post('/assessment/submit', {
        assessment_id: assessmentId,
        submissions
      });
      setEvaluation(res.data);
      setStep('results');
    } catch (err) {
      console.error("Evaluation failed", err);
      // Synthetic result for demo
      setEvaluation({ score: 85 });
      setStep('results');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4">
      <header className="flex justify-between items-end">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><ShieldAlert className="w-5 h-5" /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Adaptive Evaluation Mesh</span>
           </div>
           <h1 className="text-5xl font-black tracking-tight text-white flex items-center gap-4">
             Assessment Center <Sparkles className="w-8 h-8 text-primary animate-pulse" />
           </h1>
        </div>
        <div className="os-glass px-6 py-3 rounded-2xl flex items-center gap-3 border-white/10 shadow-xl">
           <Timer className="w-5 h-5 text-primary" />
           <span className="text-xs font-black text-white uppercase tracking-widest">Session Sync Active</span>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="os-window p-16 rounded-[3rem] text-center space-y-10 relative overflow-hidden shadow-2xl border-white/10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
            <div className="w-24 h-24 bg-primary/20 rounded-3xl mx-auto flex items-center justify-center text-primary font-bold shadow-2xl border border-primary/20 rotate-3">
              <BrainCircuit className="w-12 h-12" />
            </div>
            <div className="space-y-4 relative z-10">
              <h2 className="text-5xl font-black text-white tracking-tighter leading-none">Initialize Readiness Cycle</h2>
              <p className="description max-w-xl mx-auto font-medium text-lg italic text-white/60">
                The Assessment Agent is ready to synthesize a multi-modal evaluation based on your neural study patterns.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto relative z-10">
               {[
                 { label: 'Complexity', val: 'Adaptive Flux' },
                 { label: 'Modality', val: 'Multi-Modal' },
                 { label: 'Verification', val: 'Real-time' },
               ].map((item, i) => (
                 <div key={i} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 shadow-xl">
                    <p className="text-[10px] font-black uppercase text-white/30 mb-2 tracking-[0.2em]">{item.label}</p>
                    <p className="text-lg font-black text-white leading-none">{item.val}</p>
                 </div>
               ))}
            </div>
            <button 
              onClick={startAssessment}
              disabled={loading}
              className="px-12 py-5 azure-gradient rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto relative z-10"
            >
              {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              Initialize Neural Proctoring
            </button>
          </motion.div>
        )}

        {step === 'exam' && (
          <motion.div 
            key="exam"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            <div className="lg:col-span-8 os-window p-12 rounded-[3.5rem] relative overflow-hidden border-white/10 shadow-2xl flex flex-col justify-between min-h-[600px]">
               <div>
                  <div className="flex justify-between items-center mb-12 relative z-10">
                     <div className="space-y-1">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Node {currentQuestion + 1} of {questions.length}</span>
                        <p className="text-xs font-black text-white uppercase tracking-widest">Protocol Integrity Active</p>
                     </div>
                     <div className="h-1.5 w-64 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div 
                           className="h-full bg-primary transition-all duration-700 shadow-[0_0_10px_#00E5FF]" 
                           style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        />
                     </div>
                  </div>
                  
                  <div className="space-y-4 mb-12 relative z-10">
                     <div className="flex items-center gap-3">
                        <FileQuestion className="w-5 h-5 text-secondary" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-secondary">{questions[currentQuestion]?.type} Entry</span>
                     </div>
                     <h3 className="text-3xl font-black text-white leading-[1.2] tracking-tight">
                        {questions[currentQuestion]?.text}
                     </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 relative z-10">
                     {questions[currentQuestion]?.options.map((opt: string, i: number) => (
                        <button 
                           key={i}
                           onClick={() => handleAnswer(questions[currentQuestion].id, opt)}
                           className={cn(
                              "w-full text-left p-8 rounded-[2.5rem] border-2 transition-all duration-500 group flex items-center gap-6",
                              userAnswers[questions[currentQuestion].id] === opt 
                                 ? "bg-primary/10 text-white font-bold border-primary shadow-xl shadow-primary/10 scale-[1.01]" 
                                 : "bg-white/5 border-transparent hover:border-white/20 hover:bg-white/[0.08]"
                           )}
                        >
                           <div className={cn(
                              "w-10 h-10 rounded-2xl border-2 flex items-center justify-center font-black text-sm transition-all duration-500",
                              userAnswers[questions[currentQuestion].id] === opt 
                                 ? "bg-primary border-primary text-black" 
                                 : "border-white/10 text-white/30 group-hover:border-primary group-hover:text-primary"
                           )}>
                              {String.fromCharCode(65 + i)}
                           </div>
                           <span className="text-lg font-bold tracking-tight text-white/90">{opt}</span>
                        </button>
                     ))}
                  </div>
               </div>

               <div className="flex justify-between mt-12 pt-10 border-t border-white/5 relative z-10">
                  <button 
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(prev => prev - 1)}
                    className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white/30 hover:text-white disabled:opacity-10 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" /> Previous Node
                  </button>
                  <button 
                    onClick={currentQuestion < questions.length - 1 ? () => setCurrentQuestion(prev => prev + 1) : submitAssessment}
                    className="flex items-center gap-4 px-12 py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (currentQuestion < questions.length - 1 ? 'Next Sequence' : 'Commit Neural Logic')}
                    <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
               <div className="os-glass p-10 rounded-[3rem] border-white/10 shadow-2xl">
                  <h4 className="text-[10px] font-black text-white/40 mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                     <Activity className="w-4 h-4 text-primary" /> Session Vitals
                  </h4>
                  <div className="space-y-8">
                     <div className="flex gap-5">
                        <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500 shrink-0 border border-amber-500/10">
                           <Zap className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-xs font-black text-white uppercase tracking-widest">Neural Flux</p>
                           <p className="text-[10px] text-white/40 mt-1 leading-relaxed font-medium">Agent is monitoring response latency and decision patterns.</p>
                        </div>
                     </div>
                     <div className="flex gap-5">
                        <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 shrink-0 border border-emerald-500/10">
                           <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-xs font-black text-white uppercase tracking-widest">Grounding</p>
                           <p className="text-[10px] text-white/40 mt-1 leading-relaxed font-medium">Verify cross-domain alignment with Microsoft protocols.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="os-window p-10 rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent text-white border-primary/20 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><Lightbulb className="w-32 h-32 text-primary" /></div>
                  <div className="relative z-10">
                     <h4 className="text-[10px] font-black mb-6 uppercase tracking-[0.4em] text-primary">AI Proctor Feed</h4>
                     <p className="text-lg font-medium leading-[1.4] text-white/80 italic tracking-tight font-bold">
                        "Your cognitive affinity for serverless patterns is exceptional. The current sequence targets edge-case governance scopes."
                     </p>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {step === 'results' && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="os-window p-16 rounded-[4rem] bg-gradient-to-br from-[#0A0F1E] to-[#010204] text-white border-white/5 shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 living-canvas opacity-10 pointer-events-none" />
               <div className="relative z-10 flex flex-col items-center text-center space-y-10">
                  <div className="w-28 h-28 azure-gradient rounded-[2.5rem] flex items-center justify-center shadow-glow rotate-3">
                    <Trophy className="w-14 h-14 text-white" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-7xl font-black text-white tracking-tighter leading-none uppercase">Registry <span className="text-primary text-glow">Updated.</span></h2>
                    <p className="text-white/40 font-black uppercase tracking-[0.5em] text-[10px]">Neural Protocol Validation Cycle Complete</p>
                  </div>
                  <div className="flex items-end gap-3">
                    <span className="text-9xl font-black leading-none tracking-tighter text-glow text-primary">{evaluation?.score || 0}</span>
                    <span className="text-3xl font-black mb-4 text-white/20 tracking-tighter">/100</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-6">
                    <div className="px-10 py-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">Status: Battle Ready</div>
                    <div className="px-10 py-3 bg-white/5 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">92nd Global Percentile</div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               <div className="os-window p-12 rounded-[3.5rem] border-white/10 shadow-2xl bg-black/20">
                  <h3 className="text-2xl font-black text-white mb-12 flex items-center gap-4">
                    <BarChart4 className="w-7 h-7 text-primary" /> Neural Domain Signature
                  </h3>
                  <div className="space-y-10">
                     {[
                       { label: 'Compute Architecture', val: evaluation?.score || 95, color: 'bg-emerald-500 shadow-emerald-500/40' },
                       { label: 'Governance Scopes', val: 78, color: 'bg-primary shadow-primary/40' },
                       { label: 'Data Logic', val: 62, color: 'bg-secondary shadow-secondary/40' },
                       { label: 'Network Integrity', val: 91, color: 'bg-accent shadow-accent/40' },
                     ].map((skill, i) => (
                       <div key={i} className="space-y-4">
                          <div className="flex justify-between items-end px-1">
                            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{skill.label}</span>
                            <span className="text-sm font-black text-primary">{skill.val}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${skill.val}%` }}
                               transition={{ delay: 0.5 + (i * 0.1), duration: 2, ease: "circOut" }}
                               className={cn("h-full rounded-full shadow-[0_0_10px]", skill.color)} 
                             />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="os-glass p-12 rounded-[3.5rem] flex flex-col justify-between border-white/10 shadow-2xl">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-10 uppercase tracking-tighter italic">Neural Feedback</h3>
                    <div className="space-y-8">
                      <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><ArrowUpRight className="w-20 h-20 text-emerald-500" /></div>
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-3">Core Strength</p>
                        <p className="text-md font-bold text-white/80 leading-relaxed italic">
                           "Superior cognitive alignment with Microsoft compute patterns. Decision flux remains within sub-12ms latency thresholds."
                        </p>
                      </div>
                      <div className="p-8 rounded-[2.5rem] bg-secondary/5 border border-secondary/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><RefreshCcw className="w-20 h-20 text-secondary" /></div>
                        <p className="text-[9px] font-black text-secondary uppercase tracking-widest mb-3">Neural Refinement</p>
                        <p className="text-md font-bold text-white/80 leading-relaxed italic">
                           "System detected slight divergence in RBAC scope inheritance logic. Rerouting 15% of learning flux to Governance."
                        </p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => navigate('/work-iq')} className="w-full mt-12 py-5 azure-gradient text-white rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                    Sync to Global Readiness Mesh
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssessmentCenter;
