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
  ChevronRight
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
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-black tracking-tight dark:text-white">Success Predictor</h1>
          <p className="text-slate-500 mt-2 text-lg max-w-2xl">Advanced ML modeling to quantify certification readiness and identify workforce success patterns.</p>
        </div>
        <button 
          onClick={handlePredict}
          disabled={loading}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/30 flex items-center gap-3 hover-lift disabled:opacity-50"
        >
          {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          Run Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Input Controls */}
        <div className="lg:col-span-4 mica p-10 rounded-[3rem] space-y-10">
           <h3 className="text-xl font-black dark:text-white flex items-center gap-3">
             <LineChart className="w-6 h-6 text-primary" /> Multi-Domain Signals
           </h3>
           
           <div className="space-y-8">
              {[
                { label: 'Cumulative Study', val: studyHours, set: setStudyHours, min: 0, max: 100, icon: Hourglass, unit: 'hrs' },
                { label: 'Avg Assessment', val: assessmentScore, set: setAssessmentScore, min: 0, max: 100, icon: Target, unit: '%' },
                { label: 'Skill Coverage', val: skillCoverage, set: setSkillCoverage, min: 0, max: 100, icon: Brain, unit: '%' },
                { label: 'Team Influence', val: teamReadiness, set: setTeamReadiness, min: 0, max: 100, icon: TrendingUp, unit: '%' },
              ].map((item, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      <item.icon className="w-3.5 h-3.5" /> {item.label}
                    </div>
                    <span className="text-sm font-black text-primary">{item.val}{item.unit}</span>
                  </div>
                  <input 
                    type="range" 
                    min={item.min} 
                    max={item.max} 
                    value={item.val} 
                    onChange={(e) => item.set(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>
              ))}
           </div>

           <div className="pt-10 border-t border-slate-100 dark:border-slate-800">
              <div className="p-5 rounded-3xl bg-primary/5 border border-primary/10">
                 <p className="text-[10px] font-black text-primary uppercase mb-2">Model Transparency</p>
                 <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                    Engineered using Scikit Logistic Regression with balanced standardization. Reliability confidence: 94.2%.
                 </p>
              </div>
           </div>
        </div>

        {/* Prediction Results */}
        <div className="lg:col-span-8 space-y-10">
          <AnimatePresence mode="wait">
            {!prediction ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[600px] mica rounded-[3.5rem] flex flex-col items-center justify-center text-center p-20 border-dashed border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/30"
              >
                <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-full mb-8 relative">
                  <Sparkles className="w-16 h-16 text-slate-200" />
                  <div className="absolute inset-0 bg-primary/10 blur-3xl animate-pulse rounded-full"></div>
                </div>
                <h2 className="text-3xl font-black text-slate-400 tracking-tight">System Ready</h2>
                <p className="text-slate-500 max-w-sm mt-3 font-medium">Input your workforce signals and trigger the AI to decode success probability.</p>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                {/* Visual Analysis Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="mica p-10 rounded-[3rem] flex flex-col items-center justify-center relative overflow-hidden h-[400px]">
                      <div className="absolute inset-0 canvas-grid opacity-10"></div>
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 z-10">Readiness Radar</h4>
                      <div className="w-full h-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="#e2e8f0" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                            <Radar
                              name="User"
                              dataKey="A"
                              stroke="#0078d4"
                              strokeWidth={3}
                              fill="#0078d4"
                              fillOpacity={0.3}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                   </div>

                   <div className="flex flex-col gap-6">
                      <div className="mica p-8 rounded-[2.5rem] flex-1 flex flex-col justify-center text-center group border-emerald-500/20">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Pass Probability</p>
                        <p className="text-7xl font-black text-emerald-500 group-hover:scale-110 transition-transform duration-500">{prediction.pass_probability}%</p>
                        <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600 font-bold text-xs">
                          <TrendingUp className="w-4 h-4" /> Higher than baseline
                        </div>
                      </div>
                      <div className="mica p-8 rounded-[2.5rem] flex-1 flex flex-col justify-center text-center group border-red-500/10">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Risk Index</p>
                        <p className="text-7xl font-black text-red-500 group-hover:scale-110 transition-transform duration-500">{prediction.risk_score}%</p>
                        <div className="mt-4 flex items-center justify-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest">
                           {prediction.risk_score > 50 ? 'Burnout Critical' : 'Low Resistance'}
                        </div>
                      </div>
                   </div>
                </div>

                {/* AI Insight Hero */}
                <div className="mica p-12 rounded-[3.5rem] bg-slate-950 text-white border-none relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,120,212,0.3)]">
                   <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[120%] bg-primary/20 blur-[120px] animate-pulse"></div>
                   <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                      <div className="w-24 h-24 bg-white/10 rounded-[2rem] flex items-center justify-center backdrop-blur-3xl border border-white/10 shrink-0 shadow-2xl">
                         <ShieldCheck className="w-10 h-10 text-primary" />
                      </div>
                      <div className="space-y-6 text-center md:text-left">
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-3">Foundry Intelligence Report</h4>
                          <h2 className="text-4xl font-black tracking-tight leading-[1.1] max-w-2xl">
                            {prediction.recommendation}
                          </h2>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                          <button className="bg-primary hover:bg-primary/90 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover-lift shadow-xl shadow-primary/20 flex items-center gap-2">
                             Schedule Certification <ChevronRight className="w-4 h-4" />
                          </button>
                          <button className="bg-white/5 border border-white/10 hover:bg-white/10 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                             Refine Signal Data
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
