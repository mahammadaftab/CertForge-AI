import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Brain, 
  Hourglass, 
  LineChart,
  Sparkles,
  RefreshCcw,
  Zap,
  ShieldCheck,
  ChevronRight,
  Fingerprint,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import api from '../lib/api';
import { cn } from '../lib/utils';

const SuccessPredictor: React.FC = () => {
  const [studyHours, setStudyHours] = useState(30);
  const [assessmentScore, setAssessmentScore] = useState(75);
  const [skillCoverage, setSkillCoverage] = useState(60);
  const [teamReadiness, setTeamReadiness] = useState(70);
  
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await api.post('/predictor/predict', {
        study_hours: studyHours,
        avg_assessment_score: assessmentScore,
        skill_coverage_percent: skillCoverage,
        team_readiness_avg: teamReadiness
      });
      setPrediction(response.data);
    } catch (error) {
      console.error("Prediction failed", error);
    } finally {
      setLoading(false);
    }
  };

  const radarData = prediction ? [
    { subject: 'Knowledge', A: prediction.dimensions.Knowledge, fullMark: 100 },
    { subject: 'Skills', A: prediction.dimensions.Skills, fullMark: 100 },
    { subject: 'Dedication', A: prediction.dimensions.Dedication, fullMark: 100 },
    { subject: 'Support', A: prediction.dimensions.Support, fullMark: 100 },
  ] : [];

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500"><Zap className="w-5 h-5" /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">ML / Success Engine</span>
           </div>
           <h1 className="text-6xl font-black tracking-tighter dark:text-white leading-[0.9]">Predictive <span className="text-primary">Modeling.</span></h1>
           <p className="text-foreground/60 text-lg font-medium max-w-2xl italic">Projecting workforce success trajectories using Scikit-Learn neural signatures.</p>
        </div>
        <button 
          onClick={handlePredict}
          disabled={loading}
          className="bg-primary text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-[0_20px_50px_-10px_rgba(0,120,212,0.4)] flex items-center gap-3 hover-lift disabled:opacity-50"
        >
          {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
          Execute Prediction
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 mica p-10 rounded-[3.5rem] space-y-12 border-white/20 shadow-2xl">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-foreground/5 rounded-2xl border border-white/10">
                 <LineChart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-black dark:text-white tracking-tighter">Signal Matrix</h3>
           </div>
           
           <div className="space-y-10">
              {[
                { label: 'Cumulative Study', val: studyHours, set: setStudyHours, min: 0, max: 100, icon: Hourglass, unit: 'HRS' },
                { label: 'Avg Assessment', val: assessmentScore, set: setAssessmentScore, min: 0, max: 100, icon: Target, unit: '%' },
                { label: 'Skill Coverage', val: skillCoverage, set: setSkillCoverage, min: 0, max: 100, icon: Brain, unit: '%' },
                { label: 'Team Influence', val: teamReadiness, set: setTeamReadiness, min: 0, max: 100, icon: TrendingUp, unit: '%' },
              ].map((item, i) => (
                <div key={i} className="space-y-5">
                  <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-2.5 text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30">
                      <item.icon className="w-3.5 h-3.5" /> {item.label}
                    </div>
                    <span className="text-[11px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-lg">{item.val}{item.unit}</span>
                  </div>
                  <input 
                    type="range" 
                    min={item.min} 
                    max={item.max} 
                    value={item.val} 
                    onChange={(e) => item.set(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-foreground/5 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>
              ))}
           </div>

           <div className="pt-10 border-t border-white/5">
              <div className="p-6 rounded-[2rem] bg-foreground/5 dark:bg-white/5 border border-white/10 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10"><Cpu className="w-12 h-12" /></div>
                 <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2">Model Confidence</p>
                 <p className="text-[10px] font-bold text-foreground/40 leading-relaxed italic relative z-10">
                    Proprietary Logistic Regression protocol with cross-domain signal standardization.
                 </p>
              </div>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-10">
          <AnimatePresence mode="wait">
            {!prediction ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full min-h-[600px] mica rounded-[3.5rem] flex flex-col items-center justify-center text-center p-20 border-white/10 bg-white/30 dark:bg-white/5 border-dashed"
              >
                <div className="p-10 bg-foreground/5 dark:bg-white/5 rounded-[2.5rem] mb-8 relative">
                  <Sparkles className="w-16 h-16 text-foreground/20" />
                  <div className="absolute inset-0 bg-primary/10 blur-3xl animate-pulse rounded-full" />
                </div>
                <h2 className="text-4xl font-black text-foreground/20 tracking-tighter">Engine Standby</h2>
                <p className="text-foreground/40 max-w-sm mt-4 text-sm font-medium leading-relaxed italic">Synchronize workforce signals on the left and trigger the neural processor.</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 30, filter: 'blur(20px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ type: 'spring', damping: 25 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="mica p-12 rounded-[3.5rem] flex flex-col items-center justify-center relative overflow-hidden h-[440px] border-white/20 shadow-2xl">
                      <div className="absolute inset-0 living-canvas opacity-10 pointer-events-none" />
                      <h4 className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] mb-8 z-10">Readiness Signature</h4>
                      <div className="w-full h-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                            <PolarGrid stroke="currentColor" opacity={0.05} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 9, fontWeight: 900, opacity: 0.4 }} />
                            <Radar
                              name="User"
                              dataKey="A"
                              stroke="#0078d4"
                              strokeWidth={4}
                              fill="#0078d4"
                              fillOpacity={0.4}
                              animationDuration={1500}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                   </div>

                   <div className="flex flex-col gap-8">
                      <div className="mica p-10 rounded-[3rem] flex-1 flex flex-col justify-center text-center group border-emerald-500/20 bg-emerald-500/5 shadow-2xl shadow-emerald-500/5">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 mb-2">Pass Probability</p>
                        <p className="text-8xl font-black text-emerald-500 group-hover:scale-110 transition-transform duration-700 tracking-tighter">{prediction.pass_probability}%</p>
                        <div className="mt-6 flex items-center justify-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                          <TrendingUp className="w-4 h-4" /> Cognitive Surge Detected
                        </div>
                      </div>
                      <div className="mica p-10 rounded-[3rem] flex-1 flex flex-col justify-center text-center group border-red-500/10 bg-red-500/5 shadow-2xl shadow-red-500/5">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30 mb-2">Burnout Resistance</p>
                        <p className="text-8xl font-black text-red-500 group-hover:scale-110 transition-transform duration-700 tracking-tighter">{prediction.risk_score}%</p>
                        <div className="mt-6 flex items-center justify-center gap-3 text-red-600 font-black text-[10px] uppercase tracking-widest">
                           {prediction.risk_score > 50 ? 'Critical Resistance' : 'Nominal Flux'}
                        </div>
                      </div>
                   </div>
                </div>

                <div className="mica p-12 rounded-[4rem] bg-[#02040a] text-white border-none relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,120,212,0.4)]">
                   <div className="absolute top-[-30%] right-[-10%] w-[60%] h-[160%] bg-primary/20 blur-[140px] animate-pulse" />
                   <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                      <div className="w-28 h-24 bg-white/10 rounded-[2.5rem] flex items-center justify-center backdrop-blur-3xl border border-white/10 shrink-0 shadow-2xl rotate-3">
                         <ShieldCheck className="w-12 h-12 text-primary" />
                      </div>
                      <div className="space-y-8 text-center md:text-left">
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-4 flex items-center justify-center md:justify-start gap-2">
                             <Sparkles className="w-3 h-3" /> Foundry Intelligence Protocol
                          </h4>
                          <h2 className="text-5xl font-black tracking-tight leading-[1.05] max-w-2xl">
                            {prediction.recommendation}
                          </h2>
                        </div>
                        <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                          <button className="bg-primary hover:bg-primary/90 px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all hover-lift shadow-[0_20px_40px_-10px_rgba(0,120,212,0.5)] flex items-center gap-3">
                             Initialize Certification <ChevronRight className="w-4 h-4" />
                          </button>
                          <button className="bg-white/5 border border-white/10 hover:bg-white/10 px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all">
                             Recalibrate Signals
                          </button>
                        </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SuccessPredictor;
