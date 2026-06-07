
import { motion } from 'framer-motion';
import { Brain, BookOpen, Target, BarChart, Users, ShieldCheck } from 'lucide-react';

const agents = [
  { id: 1, name: 'Learning Agent', icon: Brain, color: '#00E5FF', desc: 'Ingests Microsoft Learn documentation instantly.' },
  { id: 2, name: 'Study Agent', icon: BookOpen, color: '#8B5CF6', desc: 'Generates custom curriculums based on skill gaps.' },
  { id: 3, name: 'Assessment Agent', icon: Target, color: '#FF00AA', desc: 'Administers real-world Azure scenarios dynamically.' },
  { id: 4, name: 'Readiness Agent', icon: BarChart, color: '#7CFF6B', desc: 'Predicts exact readiness scores with 94% accuracy.' },
  { id: 5, name: 'Manager Agent', icon: Users, color: '#00E5FF', desc: 'Alerts leadership of team readiness autonomously.' },
  { id: 6, name: 'Verification Agent', icon: ShieldCheck, color: '#FFD700', desc: 'Verifies continuous credentialing state securely.' }
];

const AgentsSection = () => {
  return (
    <section className="relative py-40 bg-[#0A0F1E] border-t border-[#00E5FF]/8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <p className="text-[#00E5FF] font-black uppercase tracking-[0.4em] text-sm mb-4">Autonomous Intelligence</p>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]">Neural Hive.</span></h2>
          <p className="text-white/55 text-xl font-medium max-w-2xl mx-auto mt-6 leading-relaxed">
            The specialized agents working 24/7 to guarantee workforce success.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, i) => (
            <motion.div 
              key={agent.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="os-glass p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none" style={{ backgroundImage: `linear-gradient(to bottom right, ${agent.color}, transparent)` }} />
              
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border border-white/10 relative z-10 transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: `${agent.color}20` }}>
                <agent.icon className="w-8 h-8" style={{ color: agent.color }} />
              </div>
              
              <h3 className="text-2xl font-black mb-4 relative z-10">{agent.name}</h3>
              <p className="text-white/60 leading-relaxed font-medium relative z-10">{agent.desc}</p>
              
              <div className="absolute -bottom-6 -right-6 text-[100px] font-black opacity-[0.03] pointer-events-none z-0 group-hover:opacity-10 transition-opacity duration-500" style={{ color: agent.color }}>
                0{agent.id}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgentsSection;
