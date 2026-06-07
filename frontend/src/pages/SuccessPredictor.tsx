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
    <div className="space-y-16 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 shadow-xl border border-amber-500/20"><Zap className="w-6 h-6" /></div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] description">ML / Success Engine</span>
           </div>
           <h1 className="text-8xl font-black tracking-tighter dark:text-white leading-[0.85] mb-2">Predictive <span className="text-primary text-glow">Modeling.</span></h1>
           <p className="description text-xl font-medium max-w-2xl italic leading-relaxed">Projecting workforce success trajectories using Scikit-Learn neural signatures and multi-domain flux analysis.</p>
        </div>
        <button 
          onClick={handlePredict}
          disabled={loading}
          className="bg-primary text-white font-bold px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-[0_20px_60px_-10px_rgba(0,242,255,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
        >
          {loading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Fingerprint className="w-5 h-5" />}
          Execute Prediction
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 mica p-12 rounded-[4rem] space-y-12 border-white/20 shadow-2xl relative overflow-hidden">
           <div className="absolute inset-0 living-canvas opacity-[0.03]" />
           <div className="flex items-center gap-4 relative z-10">
              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 shadow-inner">
                 <LineChart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black dark:text-white tracking-tighter">Signal Matrix</h3>
           </div>
           
           <div className="space-y-12 relative z-10">
              {[
                { label: 'Cumulative Study', val: studyHours, set: setStudyHours, min: 0, max: 100, icon: Hourglass, unit: 'HRS' },
                { label: 'Avg Assessment', val: assessmentScore, set: setAssessmentScore, min: 0, max: 100, icon: Target, unit: '%' },
                { label: 'Skill Coverage', val: skillCoverage, set: setSkillCoverage, min: 0, max: 100, icon: Brain, unit: '%' },
                { label: 'Team Influence', val: teamReadiness, set: setTeamReadiness, min: 0, max: 100, icon: TrendingUp, unit: '%' },
              ].map((item, i) => (
                <div key={i} className="space-y-6 group">
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] description group-hover:text-primary transition-colors">
                      <item.icon className="w-4 h-4" /> {item.label}
                    </div>
                    <span className="text-[12px] font-black text-primary bg-primary/10 px-3 py-1 rounded-xl shadow-inner">{item.val}{item.unit}</span>
                  </div>
                  <input 
                    type="range" 
                    min={item.min} 
                    max={item.max} 
                    value={item.val} 
                    onChange={(e) => item.set(parseInt(e.target.value))}
                    className="w-full h-2 bg-foreground/5 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>
              ))}
           </div>

           <div className="pt-12 border-t border-white/5 relative z-10">
              <div className="p-8 rounded-[3rem] bg-[#010204] border border-white/10 relative overflow-hidden shadow-2xl group cursor-pointer hover:border-primary/40 transition-all">
                 <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><Cpu className="w-16 h-16 text-primary" /></div>
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-3">Model Confidence</p>
                 <p className="text-xs font-bold description leading-relaxed italic relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">
                    "Proprietary Logistic Regression protocol v4.2 with balanced cross-domain signal standardization."
                 </p>
              </div>
           </div>
        </div>

        <div className="lg:col-span-8 space-y-12">
          <AnimatePresence mode="wait">
            {!prediction ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full min-h-[600px] mica rounded-[4.5rem] flex flex-col items-center justify-center text-center p-24 border-white/10 bg-white/20 dark:bg-white/5 border-dashed shadow-2xl"
              >
                <div className="p-12 bg-foreground/5 dark:bg-white/5 rounded-[3.5rem] mb-10 relative shadow-inner">
                  <Sparkles className="w-20 h-20 text-white/30" />
                  <div className="absolute inset-0 bg-primary/10 blur-3xl animate-pulse rounded-full" />
                </div>
                <h2 className="text-5xl font-black text-white/50 tracking-tighter mb-4 leading-none">Neural Core Standby</h2>
                <p className="description max-w-sm mt-4 text-lg font-medium leading-relaxed italic opacity-60">Synchronize workforce signals on the left and initialize the neural processor.</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 40, filter: 'blur(30px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ type: 'spring', damping: 25, stiffness: 100 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="mica p-16 rounded-[4.5rem] flex flex-col items-center justify-center relative overflow-hidden h-[480px] border-white/20 shadow-2xl">
                      <div className="absolute inset-0 living-canvas opacity-10 pointer-events-none" />
                      <h4 className="text-[11px] font-black description uppercase tracking-[0.4em] mb-10 z-10">Readiness Signature</h4>
                      <div className="w-full h-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="currentColor" opacity={0.03} />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 900, opacity: 0.3 }} />
                            <Radar
                              name="User"
                              dataKey="A"
                              stroke="#00f2ff"
                              strokeWidth={5}
                              fill="#00f2ff"
                              fillOpacity={0.45}
                              animationDuration={2000}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                   </div>

                   <div className="flex flex-col gap-10">
                      <div className="mica p-12 rounded-[4rem] flex-1 flex flex-col justify-center text-center group border-emerald-500/20 bg-emerald-500/5 shadow-[0_40px_80px_-20px_rgba(16,185,129,0.2)]">
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] description mb-4">Pass Probability</p>
                        <p className="text-[9rem] font-black text-emerald-500 group-hover:scale-110 transition-transform duration-1000 tracking-tighter leading-none">{prediction.pass_probability}%</p>
                        <div className="mt-8 flex items-center justify-center gap-4 text-emerald-600 font-black text-[11px] uppercase tracking-widest bg-emerald-500/10 py-2 px-6 rounded-full mx-auto shadow-lg">
                          <TrendingUp className="w-5 h-5 shadow-glow" /> Cognitive Surge Sync
                        </div>
                      </div>
                      <div className="mica p-12 rounded-[4rem] flex-1 flex flex-col justify-center text-center group border-pink-500/10 bg-pink-500/5 shadow-[0_40px_80px_-20px_rgba(255,0,122,0.15)]">
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] description mb-4">Burnout Resistance</p>
                        <p className="text-[9rem] font-black text-pink-500 group-hover:scale-110 transition-transform duration-1000 tracking-tighter leading-none">{prediction.risk_score}%</p>
                        <div className="mt-8 flex items-center justify-center gap-4 text-pink-600 font-black text-[11px] uppercase tracking-widest bg-pink-500/10 py-2 px-6 rounded-full mx-auto shadow-lg">
                           {prediction.risk_score > 50 ? 'Critical Resistance' : 'Nominal Flux Level'}
                        </div>
                      </div>
                   </div>
                </div>

                <div className="mica p-16 rounded-[5rem] bg-[#010204] text-white border-none relative overflow-hidden shadow-[0_80px_150px_-30px_rgba(0,242,255,0.4)]">
                   <div className="absolute top-[-40%] right-[-10%] w-[70%] h-[180%] bg-primary/30 blur-[160px] animate-pulse" />
                   <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                      <div className="w-32 h-28 bg-white/10 rounded-[3rem] flex items-center justify-center backdrop-blur-3xl border border-white/20 shrink-0 shadow-2xl rotate-6 group cursor-pointer hover:rotate-0 transition-transform duration-700">
                         <ShieldCheck className="w-16 h-16 text-primary shadow-glow" />
                      </div>
                      <div className="space-y-10 text-center lg:text-left">
                        <div>
                          <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-primary mb-5 flex items-center justify-center lg:justify-start gap-4">
                             <Sparkles className="w-4 h-4 shadow-glow" /> Intelligence Report Protocol
                          </h4>
                          <h2 className="text-6xl font-black tracking-tighter leading-[1.0] max-w-2xl text-glow">
                            {prediction.recommendation}
                          </h2>
                        </div>
                        <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
                          <button className="bg-primary hover:bg-primary/90 text-white font-bold px-14 py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-widest transition-all hover-lift shadow-[0_30px_60px_-15px_rgba(0,242,255,0.6)] flex items-center gap-5">
                             Initialize Certification <ChevronRight className="w-5 h-5" />
                          </button>
                          <button className="bg-white/5 border border-white/10 hover:bg-white/10 px-14 py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-xl">
                             Recalibrate Neural Signals
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
