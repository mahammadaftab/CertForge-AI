import React from 'react';
import { 
  Network, 
  GitFork, 
  Target, 
  AlertTriangle, 
  Share2, 
  Activity,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const SemanticLayer: React.FC = () => {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-black tracking-tight dark:text-white">Fabric IQ</h1>
          <p className="description mt-2 text-lg">Semantic workforce ontology and relational knowledge graph.</p>
        </div>
        <div className="flex gap-4">
           <button className="mica px-6 py-3 rounded-2xl text-sm font-bold border-primary/20 text-primary flex items-center gap-2">
              <Network className="w-4 h-4" /> Re-index Graph
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Semantic Graph Visualization Placeholder */}
        <div className="lg:col-span-2 mica p-1 p-8 rounded-[3rem] min-h-[500px] relative overflow-hidden flex flex-col justify-center items-center os-glass">
           <div className="absolute inset-0 opacity-20 canvas-grid"></div>
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
             className="w-[400px] h-[400px] border-2 border-dashed border-primary/30 rounded-full flex items-center justify-center relative"
           >
              <div className="w-12 h-12 bg-primary rounded-xl absolute top-0 -translate-y-6 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                 <GitFork className="w-6 h-6" />
              </div>
              <div className="w-12 h-12 bg-emerald-500 rounded-xl absolute bottom-0 translate-y-6 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                 <Target className="w-6 h-6" />
              </div>
              <div className="w-12 h-12 bg-amber-500 rounded-xl absolute right-0 translate-x-6 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                 <Share2 className="w-6 h-6" />
              </div>
           </motion.div>
           <div className="mt-12 text-center relative z-10">
              <p className="text-white font-black text-2xl mb-2">Live Ontology Mapping</p>
              <p className="description text-sm">Discovering hidden skill paths and team dependencies in real-time.</p>
           </div>
        </div>

        {/* Semantic Insights */}
        <div className="space-y-8">
           <div className="mica p-8 rounded-[2.5rem] border-red-500/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-500/10 rounded-2xl text-red-500">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black dark:text-white">Critical Risks</h3>
              </div>
              <div className="space-y-4">
                 {[
                   { type: 'Single Point of Failure', desc: 'Only 1 member has "Azure Data Factory" skill.', sev: 'High' },
                   { type: 'Readiness Lag', desc: 'Cloud Ops team is 40% below target for AZ-104.', sev: 'Medium' },
                 ].map((risk, i) => (
                   <div key={i} className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-transparent hover:border-red-500/20 transition-all cursor-pointer">
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{risk.sev} Severity</span>
                        <Zap className="w-3 h-3 text-red-500 fill-red-500" />
                      </div>
                      <p className="text-sm font-bold dark:text-white mb-1">{risk.type}</p>
                      <p className="text-xs description font-medium">{risk.desc}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="mica p-8 rounded-[2.5rem]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black dark:text-white">Knowledge Flow</h3>
              </div>
              <div className="space-y-6">
                 {[
                   { label: 'Skill Transfer Rate', val: 74 },
                   { label: 'Cert Cross-Pollination', val: 32 },
                   { label: 'Ontology Density', val: 88 },
                 ].map((item, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase description">
                          <span>{item.label}</span>
                          <span className="text-primary">{item.val}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.val}%` }}
                            className="h-full bg-primary rounded-full" 
                          />
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SemanticLayer;
