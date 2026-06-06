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
  BarChart4
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const AssessmentCenter: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'exam' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const mockQuestions = [
    {
      id: 1,
      text: "Which Azure service is best suited for building a serverless event-driven architecture?",
      options: ["Azure Functions", "Azure Virtual Machines", "Azure SQL Database", "Azure App Service"],
      correct: 0
    },
    {
      id: 2,
      text: "What is the primary benefit of using a Content Delivery Network (CDN)?",
      options: ["Increased security", "Reduced latency for users", "Lower storage costs", "Simplified database management"],
      correct: 1
    }
  ];

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setStep('results');
      setScore(85);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tight dark:text-white flex items-center gap-4">
            Assessment Center <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </h1>
          <p className="text-slate-500 mt-2 text-lg italic">AI-generated adaptive evaluations for workforce readiness.</p>
        </div>
        <div className="mica px-6 py-3 rounded-2xl flex items-center gap-3 border-primary/20">
           <Timer className="w-5 h-5 text-primary" />
           <span className="text-sm font-black dark:text-white">Time Remaining: 14:22</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mica p-12 rounded-[3rem] text-center space-y-8"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-3xl mx-auto flex items-center justify-center text-primary">
              <BrainCircuit className="w-12 h-12" />
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black dark:text-white">Ready for AZ-900?</h2>
              <p className="text-slate-500 max-w-xl mx-auto font-medium">
                Our AI will now generate a customized assessment based on your recent learning activity and project workload. 
                Expect 5 MCQs and 1 complex scenario.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
               {[
                 { label: 'Difficulty', val: 'Adaptive' },
                 { label: 'Passing Score', val: '75%' },
                 { label: 'Time Limit', val: '20 Mins' },
               ].map((item, i) => (
                 <div key={i} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{item.label}</p>
                    <p className="font-bold dark:text-white">{item.val}</p>
                 </div>
               ))}
            </div>
            <button 
              onClick={() => setStep('exam')}
              className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all hover-lift"
            >
              Start AI Assessment
            </button>
          </motion.div>
        )}

        {step === 'exam' && (
          <motion.div 
            key="exam"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 mica p-10 rounded-[2.5rem] relative overflow-hidden">
               <div className="flex justify-between items-center mb-10">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Question {currentQuestion + 1} of {mockQuestions.length}</span>
                  <div className="h-1.5 w-48 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500" 
                      style={{ width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%` }}
                    />
                  </div>
               </div>
               
               <h3 className="text-2xl font-bold dark:text-white mb-8 leading-tight">
                 {mockQuestions[currentQuestion].text}
               </h3>

               <div className="space-y-4">
                  {mockQuestions[currentQuestion].options.map((opt, i) => (
                    <button 
                      key={i}
                      className="w-full text-left p-6 rounded-3xl bg-slate-100/50 dark:bg-slate-800/50 border-2 border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-slate-800 transition-all group flex items-center gap-4"
                    >
                      <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center font-bold text-xs group-hover:border-primary group-hover:text-primary">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="font-semibold dark:text-slate-300">{opt}</span>
                    </button>
                  ))}
               </div>

               <div className="flex justify-between mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    disabled={currentQuestion === 0}
                    onClick={() => setCurrentQuestion(prev => prev - 1)}
                    className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <button 
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
                  >
                    {currentQuestion < mockQuestions.length - 1 ? 'Next Question' : 'Submit Exam'} <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>

            <div className="space-y-8">
               <div className="mica p-8 rounded-[2.5rem]">
                  <h4 className="text-sm font-black dark:text-white mb-6 uppercase tracking-widest">Exam Insights</h4>
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-600 shrink-0">
                           <Zap className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-xs font-bold dark:text-white">Adaptive Difficulty</p>
                           <p className="text-[10px] text-slate-500">Increasing based on your previous performance.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-600 shrink-0">
                           <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-xs font-bold dark:text-white">Validation Enabled</p>
                           <p className="text-[10px] text-slate-500">Grounded answers will be cross-referenced with Foundry IQ.</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="mica p-8 rounded-[3rem] bg-slate-900 text-white border-none relative overflow-hidden">
                  <div className="absolute top-[-20%] left-[-20%] w-[100%] h-[100%] bg-primary/20 rounded-full blur-[60px]"></div>
                  <h4 className="text-xs font-black mb-4 uppercase tracking-[0.2em] relative z-10">AI Proctor</h4>
                  <p className="text-sm font-medium leading-relaxed opacity-80 relative z-10 italic">
                    "I noticed you're taking your time on networking questions. Focus on VNet peering logic for the next section."
                  </p>
               </div>
            </div>
          </motion.div>
        )}

        {step === 'results' && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="mica p-12 rounded-[3.5rem] bg-gradient-to-br from-primary to-blue-700 text-white border-none shadow-2xl shadow-primary/30 relative overflow-hidden">
               <div className="absolute inset-0 canvas-grid opacity-10"></div>
               <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-inner">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-5xl font-black tracking-tight">Performance Decoded</h2>
                    <p className="text-white/70 mt-2 font-bold uppercase tracking-widest text-xs">Microsoft Azure Fundamentals (AZ-900)</p>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-8xl font-black leading-none">{score}</span>
                    <span className="text-2xl font-bold mb-2 text-white/50">/100</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="px-6 py-2 bg-emerald-500 rounded-full text-xs font-black uppercase tracking-wider">Status: Ready</span>
                    <span className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider border border-white/20">98th Percentile</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="mica p-10 rounded-[3rem]">
                  <h3 className="text-xl font-black dark:text-white mb-8 flex items-center gap-3">
                    <BarChart4 className="w-6 h-6 text-primary" /> Skill Breakdown
                  </h3>
                  <div className="space-y-8">
                     {[
                       { label: 'Compute Services', val: 95, color: 'bg-emerald-500' },
                       { label: 'Network Security', val: 78, color: 'bg-blue-500' },
                       { label: 'Governance & Compliance', val: 62, color: 'bg-amber-500' },
                       { label: 'Pricing & Lifecycle', val: 91, color: 'bg-primary' },
                     ].map((skill, i) => (
                       <div key={i} className="space-y-2">
                          <div className="flex justify-between items-end">
                            <span className="text-xs font-black dark:text-white uppercase tracking-tighter">{skill.label}</span>
                            <span className="text-sm font-black dark:text-slate-400">{skill.val}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${skill.val}%` }}
                               transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                               className={cn("h-full rounded-full", skill.color)} 
                             />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="mica p-10 rounded-[3rem] flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-black dark:text-white mb-6">AI Feedback</h3>
                    <div className="space-y-6">
                      <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                        <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-2">Primary Strength</p>
                        <p className="text-sm font-medium dark:text-slate-300">"Excellent understanding of serverless concepts. You correctly identified the orchestration patterns in the capstone scenario."</p>
                      </div>
                      <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10">
                        <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2">Growth Area</p>
                        <p className="text-sm font-medium dark:text-slate-300">"Work on Role-Based Access Control (RBAC) scopes. You hesitated on the subscription-level inheritance question."</p>
                      </div>
                    </div>
                  </div>
                  <button className="w-full mt-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity">
                    Add to Learning Path
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
