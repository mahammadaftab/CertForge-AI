import React, { useState } from 'react';
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
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { cn } from '../lib/utils';

const AssessmentCenter: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'exam' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [evaluation, setEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const startAssessment = async () => {
    setLoading(true);
    try {
      const res = await api.get('/assessment/generate?certification=AZ-900&difficulty=Adaptive&count=5');
      setQuestions(res.data.questions);
      setStep('exam');
    } catch (err) {
      console.error("Failed to generate assessment", err);
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
      const submissions = questions.map(q => ({
        id: q.id,
        answer: userAnswers[q.id] || "No answer"
      }));
      
      const res = await api.post('/assessment/evaluate?certification=AZ-900', submissions);
      setEvaluation(res.data);
      setStep('results');
    } catch (err) {
      console.error("Evaluation failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tight dark:text-white flex items-center gap-4">
            Assessment Center <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </h1>
          <p className="description mt-2 text-lg italic font-medium">AI-generated adaptive evaluations for workforce readiness.</p>
        </div>
        <div className="mica px-6 py-3 rounded-2xl flex items-center gap-3 border-white/20 shadow-xl">
           <Timer className="w-5 h-5 text-primary" />
           <span className="text-sm font-black dark:text-white uppercase tracking-widest">Clock Synchronized</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mica p-16 rounded-[3rem] text-center space-y-10 relative overflow-hidden shadow-2xl border-white/10"
          >
            <div className="absolute inset-0 living-canvas opacity-5 pointer-events-none" />
            <div className="w-24 h-24 bg-primary rounded-3xl mx-auto flex items-center justify-center text-white font-bold shadow-2xl shadow-primary/40 rotate-3">
              <BrainCircuit className="w-12 h-12" />
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-black dark:text-white tracking-tighter leading-none">Initialize AZ-900 Cycle</h2>
              <p className="description max-w-xl mx-auto font-medium text-lg italic">
                A custom assessment environment is ready to be synthesized from your neural fingerprints and workforce logs.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
               {[
                 { label: 'Engine Mode', val: 'Adaptive-7' },
                 { label: 'Baseline', val: '75%' },
                 { label: 'Neural Flux', val: 'Dynamic' },
               ].map((item, i) => (
                 <div key={i} className="mica p-6 rounded-[2rem] border-white/10 shadow-xl">
                    <p className="text-[10px] font-black uppercase description mb-2 tracking-[0.2em]">{item.label}</p>
                    <p className="text-lg font-black dark:text-white leading-none">{item.val}</p>
                 </div>
               ))}
            </div>
            <button 
              onClick={startAssessment}
              disabled={loading}
              className="bg-primary text-white font-bold px-12 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
            >
              {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Deploy AI Orchestrator
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
            <div className="lg:col-span-8 mica p-12 rounded-[3.5rem] relative overflow-hidden border-white/20 shadow-2xl">
               <div className="absolute inset-0 living-canvas opacity-5" />
               <div className="flex justify-between items-center mb-12 relative z-10">
                  <div className="space-y-1">
                     <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Packet {currentQuestion + 1} of {questions.length}</span>
                     <p className="text-xs font-black dark:text-white uppercase tracking-widest">Protocol Integrity Active</p>
                  </div>
                  <div className="h-1.5 w-64 bg-foreground/5 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-700" 
                      style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    />
                  </div>
               </div>
               
               <h3 className="text-3xl font-black dark:text-white mb-12 leading-[1.1] tracking-tight relative z-10">
                 {questions[currentQuestion]?.text}
               </h3>

               <div className="grid grid-cols-1 gap-4 relative z-10">
                  {questions[currentQuestion]?.options.map((opt: string, i: number) => (
                    <button 
                      key={i}
                      onClick={() => handleAnswer(questions[currentQuestion].id, opt)}
                      className={cn(
                        "w-full text-left p-8 rounded-[2.5rem] border-2 transition-all duration-500 group flex items-center gap-6",
                        userAnswers[questions[currentQuestion].id] === opt 
                          ? "bg-primary text-white font-bold border-primary shadow-xl shadow-primary/20 scale-[1.01]" 
                          : "bg-white/5 dark:bg-white/5 border-transparent hover:border-primary/40"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-2xl border-2 flex items-center justify-center font-black text-sm transition-all duration-500",
                        userAnswers[questions[currentQuestion].id] === opt 
                          ? "os-glass opacity-80 border-slate-950" 
                          : "border-foreground/10 description group-hover:border-primary group-hover:text-primary"
                      )}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="text-lg font-bold tracking-tight">{opt}</span>
                    </button>
                  ))}
               </div>

               <div className="flex justify-between mt-16 pt-10 border-t border-white/5 relative z-10">
                  <button 
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(prev => prev - 1)}
                    className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white/50 hover:text-foreground dark:hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" /> Previous Core
                  </button>
                  <button 
                    onClick={currentQuestion < questions.length - 1 ? () => setCurrentQuestion(prev => prev + 1) : submitAssessment}
                    className="flex items-center gap-4 px-12 py-5 bg-[#010204] dark:bg-white text-white dark:text-[#010204] rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:scale-105 active:scale-95 transition-all"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (currentQuestion < questions.length - 1 ? 'Next Sequence' : 'Commit Neural Logic')}
                    <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
               <div className="mica p-10 rounded-[3rem] border-white/10 shadow-2xl">
                  <h4 className="text-[10px] font-black dark:text-white mb-8 uppercase tracking-[0.3em] flex items-center gap-3">
                     <Activity className="w-4 h-4 text-primary" /> Session Vitals
                  </h4>
                  <div className="space-y-8">
                     <div className="flex gap-5">
                        <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500 shrink-0 border border-amber-500/10">
                           <Zap className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-xs font-black dark:text-white uppercase tracking-widest">Adaptive Flux</p>
                           <p className="text-[10px] description mt-1 leading-relaxed font-medium">Complexity is adjusting based on response velocity.</p>
                        </div>
                     </div>
                     <div className="flex gap-5">
                        <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 shrink-0 border border-emerald-500/10">
                           <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-xs font-black dark:text-white uppercase tracking-widest">Grounded Sync</p>
                           <p className="text-[10px] description mt-1 leading-relaxed font-medium">Foundry IQ is verifying domain logic in real-time.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="mica p-10 rounded-[3rem] bg-[#010204] text-white border-none relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,242,255,0.4)]">
                  <div className="absolute top-[-30%] left-[-20%] w-[120%] h-[120%] bg-primary/20 rounded-full blur-[80px] animate-pulse" />
                  <div className="relative z-10">
                     <h4 className="text-[10px] font-black mb-6 uppercase tracking-[0.4em] text-primary">Neural Proctor</h4>
                     <p className="text-lg font-medium leading-[1.4] opacity-80 italic tracking-tight font-bold">
                        "Your cognitive alignment with Microsoft compute patterns is high. Focus on subscription hierarchies in the next stage."
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
            <div className="mica p-16 rounded-[4rem] bg-[#010204] text-white border-none shadow-[0_50px_100px_-20px_rgba(0,242,255,0.5)] relative overflow-hidden">
               <div className="absolute inset-0 living-canvas opacity-20 pointer-events-none" />
               <div className="relative z-10 flex flex-col items-center text-center space-y-10">
                  <div className="w-28 h-28 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center border border-white/20 shadow-2xl rotate-3">
                    <Trophy className="w-14 h-14 text-primary" />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-7xl font-black tracking-tighter leading-none">Neural Code <span className="text-primary text-glow">Decoded.</span></h2>
                    <p className="text-white/60 font-black uppercase tracking-[0.5em] text-[10px]">Microsoft Azure Fundamentals Registry Sync Complete</p>
                  </div>
                  <div className="flex items-end gap-3">
                    <span className="text-9xl font-black leading-none tracking-tighter text-glow">{evaluation?.score || 0}</span>
                    <span className="text-3xl font-black mb-4 text-white/30 tracking-tighter">/100</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-6">
                    <span className="px-10 py-3 bg-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20">Status: Battle Ready</span>
                    <span className="px-10 py-3 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">98th Global Percentile</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               <div className="mica p-12 rounded-[3.5rem] border-white/20 shadow-2xl">
                  <h3 className="text-2xl font-black dark:text-white mb-12 flex items-center gap-4">
                    <BarChart4 className="w-7 h-7 text-primary" /> Neural Signatures
                  </h3>
                  <div className="space-y-10">
                     {[
                       { label: 'Compute Engine', val: 95, color: 'bg-emerald-500' },
                       { label: 'SecOps Logic', val: 78, color: 'bg-primary' },
                       { label: 'Hierarchy Scopes', val: 62, color: 'bg-secondary' },
                       { label: 'Cost Modulation', val: 91, color: 'bg-accent' },
                     ].map((skill, i) => (
                       <div key={i} className="space-y-4">
                          <div className="flex justify-between items-end px-1">
                            <span className="text-[10px] font-black dark:text-white uppercase tracking-widest">{skill.label}</span>
                            <span className="text-sm font-black text-primary">{skill.val}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-foreground/5 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${skill.val}%` }}
                               transition={{ delay: 0.5 + (i * 0.1), duration: 2, ease: "circOut" }}
                               className={cn("h-full rounded-full", skill.color)} 
                             />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="mica p-12 rounded-[3.5rem] flex flex-col justify-between border-white/20 shadow-2xl">
                  <div>
                    <h3 className="text-2xl font-black dark:text-white mb-10">Neural Feedback</h3>
                    <div className="space-y-8">
                      <div className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-all group">
                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-3">Core Strength</p>
                        <p className="text-md font-medium text-foreground/70 dark:description leading-relaxed italic font-bold">
                           "Superior cognitive alignment with serverless orchestration patterns. Real-time decision flux was within optimal range."
                        </p>
                      </div>
                      <div className="p-8 rounded-[2.5rem] bg-secondary/5 border border-secondary/10 hover:bg-secondary/10 transition-all group">
                        <p className="text-[9px] font-black text-secondary uppercase tracking-widest mb-3">Refinement Area</p>
                        <p className="text-md font-medium text-foreground/70 dark:description leading-relaxed italic font-bold">
                           "System detected slight latency in RBAC scope inheritance logic. Suggesting one 20-minute focus cycle in Governance."
                        </p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-12 py-5 bg-[#010204] dark:bg-white text-white dark:text-[#010204] rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl">
                    Push to Global Learning Path
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
