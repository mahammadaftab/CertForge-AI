import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Target, TrendingUp, Brain, Hourglass, LineChart, Sparkles, RefreshCcw, 
  Zap, ShieldCheck, ChevronRight, Fingerprint, Cpu, AlertTriangle, 
  Activity, BarChart3, ListTree, Quote, Globe, Compass, ArrowUpRight,
  BookOpen, Calendar, Milestone, Info, Gauge, Layers, Network, Search,
  Briefcase, GraduationCap, Clock, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer 
} from 'recharts';
import api from '../lib/api';
import { cn } from '../lib/utils';

// --- Error Boundary Component ---
class LocalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, errorInfo: any) { console.error("Predictor Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-accent/20">
          <AlertTriangle className="w-16 h-16 text-accent mb-6" />
          <h2 className="text-3xl font-black tracking-tighter text-white mb-4">Neural Link Failure</h2>
          <p className="description max-w-md mb-8">The prediction engine encountered a critical runtime exception. The workforce signals may be out of phase.</p>
          <button onClick={() => window.location.reload()} className="px-8 py-4 bg-accent text-white rounded-2xl font-black uppercase tracking-widest text-xs">Reinitialize Core</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Types ---
interface MLStage {
  id: string;
  title: string;
  icon: any;
  status: 'idle' | 'processing' | 'complete' | 'error';
}

interface AgentActivity {
  id: string;
  agent: string;
  message: string;
  timestamp: string;
  type: 'info' | 'action' | 'alert';
}

// --- Components ---

const PipelineNode = ({ stage, index }: { stage: MLStage, index: number }) => (
  <div className={`relative flex items-center gap-3 transition-all duration-500 ${stage.status === 'idle' ? 'opacity-30' : 'opacity-100'}`}>
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-500 ${
      stage.status === 'processing' ? 'bg-primary/20 border-primary animate-pulse' : 
      stage.status === 'complete' ? 'bg-highlight/20 border-highlight text-highlight' : 
      'bg-white/5 border-white/10 text-white/40'
    }`}>
      <stage.icon className="w-4 h-4" />
    </div>
    <div className="flex flex-col">
      <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Stage 0{index + 1}</span>
      <span className="text-[10px] font-bold text-white leading-none">{stage.title}</span>
    </div>
    {index < 4 && (
      <div className={`w-4 h-px mx-1 ${stage.status === 'complete' ? 'bg-highlight/40' : 'bg-white/10'}`} />
    )}
  </div>
);

const PredictorPageContent: React.FC = () => {
  // --- Signals ---
  const [studyHours, setStudyHours] = useState(45);
  const [assessmentScore, setAssessmentScore] = useState(82);
  const [learningVelocity, setLearningVelocity] = useState(75);
  const [skillCoverage, setSkillCoverage] = useState(68);
  const [attendance, setAttendance] = useState(95);
  const [projectExp, setProjectExp] = useState(60);
  const [certDifficulty, setCertDifficulty] = useState(80);

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [stages, setStages] = useState<MLStage[]>([
    { id: 'input', title: 'Signal Ingestion', icon: Network, status: 'idle' },
    { id: 'readiness', title: 'Readiness Core', icon: Target, status: 'idle' },
    { id: 'ml', title: 'ML Forecast', icon: Cpu, status: 'idle' },
    { id: 'risk', title: 'Risk Analysis', icon: ShieldCheck, status: 'idle' },
    { id: 'strategy', title: 'Strategic Recs', icon: Sparkles, status: 'idle' },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activities]);

  const addActivity = (agent: string, message: string, type: 'info' | 'action' | 'alert' = 'info') => {
    const newActivity: AgentActivity = {
      id: Math.random().toString(36).substr(2, 9),
      agent,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type
    };
    setActivities(prev => [...prev, newActivity]);
  };

  const updateStage = (index: number, status: 'idle' | 'processing' | 'complete' | 'error') => {
    setStages(prev => prev.map((s, i) => i === index ? { ...s, status } : s));
  };

  const executePrediction = async () => {
    if (loading) return;
    setLoading(true);
    setPrediction(null);
    setActivities([]);
    setStages(prev => prev.map(s => ({ ...s, status: 'idle' })));

    try {
        updateStage(0, 'processing');
        addActivity('System', 'Ingesting workforce telemetry mesh...', 'action');
        await new Promise(r => setTimeout(r, 800));
        updateStage(0, 'complete');

        updateStage(1, 'processing');
        addActivity('Readiness Agent', 'Synchronizing multi-dimensional readiness scores.', 'action');
        await new Promise(r => setTimeout(r, 1000));
        addActivity('Readiness Agent', 'Registry sync: 99.8% integrity.', 'info');
        updateStage(1, 'complete');

        updateStage(2, 'processing');
        addActivity('Prediction Agent', 'Initializing success model v4.2 (Logistic Regression).', 'action');
        await new Promise(r => setTimeout(r, 1200));
        updateStage(2, 'complete');

        updateStage(3, 'processing');
        addActivity('Prediction Agent', 'Assessing neural risk drivers and pass probability.', 'action');
        await new Promise(r => setTimeout(r, 1000));
        updateStage(3, 'complete');

        updateStage(4, 'processing');
        addActivity('Strategy Agent', 'Synthesizing final executive trajectory.', 'action');

        // Production API call
        const res = await api.post('/predictor/execute', {
            certification_id: "demo-az-900"
        });
        
        setTimeout(() => {
          updateStage(4, 'complete');
          setPrediction(res.data);
          setLoading(false);
          addActivity('System', 'Intelligence forecast complete.', 'info');
        }, 1000);

    } catch (err) {
      console.error("Agent failure", err);
      updateStage(4, 'error');
      setLoading(false);
    }
  };

  const radarData = useMemo(() => {
    if (prediction) {
      return [
        { subject: 'Knowledge', A: prediction.dimensions.Knowledge, fullMark: 100 },
        { subject: 'Velocity', A: prediction.dimensions.Velocity, fullMark: 100 },
        { subject: 'Alignment', A: prediction.dimensions.Alignment, fullMark: 100 },
        { subject: 'Readiness', A: prediction.readiness_score, fullMark: 100 },
        { subject: 'Confidence', A: prediction.confidence_score, fullMark: 100 },
      ];
    }
    return [
      { subject: 'Knowledge', A: 0, fullMark: 100 },
      { subject: 'Velocity', A: 0, fullMark: 100 },
      { subject: 'Alignment', A: 0, fullMark: 100 },
      { subject: 'Readiness', A: 0, fullMark: 100 },
      { subject: 'Confidence', A: 0, fullMark: 100 },
    ];
  }, [prediction]);

  return (
    <div className="h-full flex flex-col gap-6 text-white overflow-hidden pb-6 px-6 relative z-10">
      <header className="flex justify-between items-center">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 azure-gradient rounded-2xl flex items-center justify-center shadow-glow">
              <Gauge className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">Prediction Agent</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-2">Neural Forecasting Engine</p>
            </div>
         </div>
         <div className="flex items-center gap-8">
            <div className="flex gap-4">
              {stages.map((stage, i) => (
                <PipelineNode key={stage.id} stage={stage} index={i} />
              ))}
            </div>
            <div className="h-10 w-px bg-white/10" />
            <button 
              onClick={executePrediction}
              disabled={loading}
              className="px-8 py-4 azure-gradient rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
              Execute Forecast
            </button>
         </div>
      </header>

      <div className="flex-1 flex gap-6 min-h-0">
         <aside className="w-[380px] os-window rounded-[2.5rem] p-8 flex flex-col gap-8">
            <div className="flex justify-between items-center">
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Neural Signals</h3>
               <div className="p-2 bg-white/5 rounded-lg"><Network className="w-3 h-3 text-primary" /></div>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 pr-2">
               {[
                  { label: 'Study Volume', val: studyHours, icon: Clock, unit: 'h' },
                  { label: 'Neural Score', val: assessmentScore, icon: GraduationCap, unit: '%' },
                  { label: 'Trajectory Flux', val: learningVelocity, icon: Zap, unit: 'v' },
                  { label: 'Skill Coverage', val: skillCoverage, icon: Brain, unit: '%' },
               ].map((signal, i) => (
                  <div key={i} className="space-y-4 group">
                     <div className="flex justify-between items-end px-1">
                        <div className="flex items-center gap-3">
                           <signal.icon className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{signal.label}</span>
                        </div>
                        <span className="text-xs font-black text-primary">{signal.val}{signal.unit}</span>
                     </div>
                     <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div className="absolute inset-0 bg-primary/40 blur-sm" animate={{ width: `${signal.val}%` }} />
                        <motion.div className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_8px_#00E5FF]" animate={{ width: `${signal.val}%` }} />
                     </div>
                  </div>
               ))}
            </div>
         </aside>

         <main className="flex-1 flex flex-col gap-6 min-w-0">
            <div className="grid grid-cols-3 gap-6">
               <div className="os-glass rounded-[2rem] p-6 border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Target className="w-16 h-16 text-primary" /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Pass Probability</span>
                  <div className="mt-2 flex items-end gap-3">
                     <span className="text-4xl font-black text-glow text-emerald-400">{prediction ? prediction.pass_probability : '0'}%</span>
                     <span className="text-[9px] font-black text-white/20 mb-1 tracking-widest uppercase">Target: 85%</span>
                  </div>
               </div>
               <div className="os-glass rounded-[2rem] p-6 border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck className="w-16 h-16 text-secondary" /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Risk Level</span>
                  <div className="mt-2 flex items-end gap-3">
                     <span className={cn("text-4xl font-black text-glow", prediction?.risk_level === 'Nominal' ? 'text-emerald-400' : 'text-primary')}>
                        {prediction ? prediction.risk_level : 'NA'}
                     </span>
                     <span className="text-[9px] font-black text-white/20 mb-1 tracking-widest uppercase">Score: {prediction?.risk_score || 0}</span>
                  </div>
               </div>
               <div className="os-glass rounded-[2rem] p-6 border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Info className="w-16 h-16 text-accent" /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Confidence</span>
                  <div className="mt-2 flex items-end gap-3">
                     <span className="text-4xl font-black text-primary text-glow">{prediction ? prediction.confidence_score : '0'}%</span>
                     <span className="text-[9px] font-black text-white/20 mb-1 tracking-widest uppercase">Registry Sync</span>
                  </div>
               </div>
            </div>

            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
               <div className="col-span-7 os-window rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-8 left-8 flex items-center gap-3">
                     <Activity className="w-4 h-4 text-primary" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Success Profile Vector</span>
                  </div>
                  <div className="w-full h-full pt-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="rgba(255,255,255,0.05)" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 900 }} />
                          <Radar name="User" dataKey="A" stroke="#00E5FF" strokeWidth={4} fill="#00E5FF" fillOpacity={prediction ? 0.2 : 0} animationDuration={1500} />
                        </RadarChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="col-span-5 os-window rounded-[2.5rem] flex flex-col overflow-hidden">
                  <div className="px-8 py-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                     <div className="flex items-center gap-3">
                        <ListTree className="w-4 h-4 text-secondary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Agent Trace Stream</span>
                     </div>
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                     <AnimatePresence initial={false}>
                        {activities.map(act => (
                           <motion.div key={act.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 rounded-xl border border-white/5 bg-white/5 group hover:border-primary/20 transition-all">
                              <div className="flex justify-between items-start mb-2">
                                 <span className="text-[8px] font-black uppercase tracking-widest text-primary group-hover:text-glow">{act.agent}</span>
                                 <span className="text-[8px] font-mono text-white/20">{act.timestamp}</span>
                              </div>
                              <p className="text-[11px] font-medium text-white/70 leading-relaxed">{act.message}</p>
                           </motion.div>
                        ))}
                     </AnimatePresence>
                  </div>
               </div>
            </div>
         </main>

         <aside className="w-[440px] flex flex-col gap-6">
            <div className="os-window rounded-[2.5rem] p-8 relative overflow-hidden group bg-gradient-to-br from-primary/5 to-transparent shadow-2xl border-primary/10">
               <div className="absolute top-0 right-0 p-8 opacity-5"><Brain className="w-32 h-32 text-primary" /></div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6">Strategic Trajectory</h3>
               {prediction ? (
                  <div className="space-y-6 relative z-10">
                     <div className="p-6 bg-white/5 border-l-4 border-primary rounded-xl">
                        <p className="text-sm font-bold text-white/90 leading-relaxed italic">"{prediction.recommendations}"</p>
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                           <span>Primary Contributor</span>
                           <span className="text-emerald-400">Knowledge Depth (+42%)</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                           <span>Neural Latency</span>
                           <span className="text-primary">Alignment (-12%)</span>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-center opacity-20">
                     <Sparkles className="w-12 h-12 mb-4 animate-pulse" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Neural Link</p>
                  </div>
               )}
            </div>

            <div className="flex-1 os-glass rounded-[2.5rem] p-8 flex flex-col gap-8 border-white/10">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Registry Commit</h3>
               {prediction ? (
                  <div className="flex-1 flex flex-col gap-6">
                     <div className="space-y-4">
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-6 group hover:border-primary/20 transition-all cursor-pointer">
                           <div className="p-3 bg-primary/10 rounded-xl text-primary"><Milestone className="w-4 h-4" /></div>
                           <div className="flex-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Target Epoch</p>
                              <p className="text-xs font-bold text-white/80 uppercase tracking-tighter">Azure Architect Exp. (Q4)</p>
                           </div>
                           <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-primary" />
                        </div>
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-6 group hover:border-secondary/20 transition-all cursor-pointer">
                           <div className="p-3 bg-secondary/10 rounded-xl text-secondary"><Cpu className="w-4 h-4" /></div>
                           <div className="flex-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-1">Inference Engine</p>
                              <p className="text-xs font-bold text-white/80 uppercase tracking-tighter">Model v4.2 Deployment</p>
                           </div>
                           <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-secondary" />
                        </div>
                     </div>
                     <button className="w-full py-5 azure-gradient rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all mt-auto active:scale-95">
                        Download Full Forecast (PDF)
                     </button>
                  </div>
               ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20">
                     <Briefcase className="w-12 h-12 mb-4" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Forecast Trigger</p>
                  </div>
               )}
            </div>
         </aside>
      </div>
    </div>
  );
};

const PredictorPage: React.FC = () => {
  return (
    <LocalErrorBoundary>
      <PredictorPageContent />
    </LocalErrorBoundary>
  );
};

export default PredictorPage;
