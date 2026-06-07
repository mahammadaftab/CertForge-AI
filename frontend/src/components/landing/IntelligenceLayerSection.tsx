
import { motion } from 'framer-motion';
import { Layers, Activity, BrainCircuit } from 'lucide-react';

const IntelligenceLayerSection = () => {
  return (
    <section className="relative py-40 px-6 max-w-7xl mx-auto border-t border-[#00E5FF]/8 overflow-hidden">
      <div className="text-center mb-24 space-y-6">
         <p className="text-[#8B5CF6] font-black uppercase tracking-[0.4em] text-sm">Deep Integration</p>
         <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Microsoft <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#FF00AA]">Intelligence Layer.</span></h2>
         <p className="text-white/55 text-xl font-medium max-w-2xl mx-auto leading-relaxed">Three distinct neuro-engines powering the entire enterprise certification pipeline natively within the Microsoft ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <motion.div 
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           className="os-glass p-12 rounded-[3rem] border border-[#00E5FF]/20 relative overflow-hidden group"
         >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
               <BrainCircuit className="w-32 h-32 text-[#00E5FF]" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-[#00E5FF]/10 flex items-center justify-center mb-8 border border-[#00E5FF]/20 relative z-10">
               <BrainCircuit className="w-8 h-8 text-[#00E5FF]" />
            </div>
            <h3 className="text-3xl font-black mb-4 relative z-10">Foundry IQ</h3>
            <p className="text-white/60 font-medium leading-relaxed relative z-10">Agentic reasoning and document intelligence running directly on Azure AI Foundry.</p>
         </motion.div>

         <motion.div 
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ delay: 0.2 }}
           className="os-glass p-12 rounded-[3rem] border border-[#8B5CF6]/20 relative overflow-hidden group"
         >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
               <Activity className="w-32 h-32 text-[#8B5CF6]" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center mb-8 border border-[#8B5CF6]/20 relative z-10">
               <Activity className="w-8 h-8 text-[#8B5CF6]" />
            </div>
            <h3 className="text-3xl font-black mb-4 relative z-10">Work IQ</h3>
            <p className="text-white/60 font-medium leading-relaxed relative z-10">Workload analysis and capacity planning synchronized with Microsoft Graph.</p>
         </motion.div>

         <motion.div 
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ delay: 0.4 }}
           className="os-glass p-12 rounded-[3rem] border border-[#FF00AA]/20 relative overflow-hidden group"
         >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-30 transition-opacity">
               <Layers className="w-32 h-32 text-[#FF00AA]" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-[#FF00AA]/10 flex items-center justify-center mb-8 border border-[#FF00AA]/20 relative z-10">
               <Layers className="w-8 h-8 text-[#FF00AA]" />
            </div>
            <h3 className="text-3xl font-black mb-4 relative z-10">Fabric IQ</h3>
            <p className="text-white/60 font-medium leading-relaxed relative z-10">Enterprise data engineering and neural storage unified via Microsoft Fabric.</p>
         </motion.div>
      </div>
    </section>
  );
};

export default IntelligenceLayerSection;
