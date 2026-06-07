import { Check, X } from 'lucide-react';

const ComparisonSection = () => {
  const features = [
    { name: 'Multi-Agent Autonomous Orchestration', us: true, them: false },
    { name: 'Real-Time Telemetry & Predictive Readiness', us: true, them: false },
    { name: 'Native Microsoft Fabric/Graph Integration', us: true, them: false },
    { name: 'Static Course Provisioning', us: true, them: true },
    { name: 'Proactive Manager Interventions', us: true, them: false },
    { name: 'Automated ROI & Voucher Tracking', us: true, them: false },
  ];

  return (
    <section className="relative py-40 px-6 border-t border-[#00E5FF]/8 overflow-hidden bg-[#0A0F1E]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-24 space-y-6">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter">Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]">CertForge AI.</span></h2>
          <p className="text-white/55 text-xl font-medium max-w-2xl mx-auto leading-relaxed">The difference between a passive learning management system and an active intelligence platform.</p>
        </div>

        <div className="os-glass rounded-[3rem] border border-white/5 overflow-hidden">
          <div className="grid grid-cols-12 border-b border-white/5 bg-white/5">
            <div className="col-span-6 p-6 md:p-8 text-[11px] font-black uppercase tracking-widest text-white/50">Feature Capability</div>
            <div className="col-span-3 p-6 md:p-8 text-[11px] font-black uppercase tracking-widest text-white/50 text-center">Legacy LMS</div>
            <div className="col-span-3 p-6 md:p-8 text-[11px] font-black uppercase tracking-widest text-[#00E5FF] text-center border-l border-[#00E5FF]/20 bg-[#00E5FF]/5">CertForge AI</div>
          </div>
          
          {features.map((feat, i) => (
            <div key={i} className="grid grid-cols-12 border-b border-white/5 hover:bg-white/5 transition-colors">
              <div className="col-span-6 p-6 md:p-8 font-medium text-white/80">{feat.name}</div>
              <div className="col-span-3 p-6 md:p-8 flex items-center justify-center">
                {feat.them ? <Check className="w-5 h-5 text-white/30" /> : <X className="w-5 h-5 text-red-500/50" />}
              </div>
              <div className="col-span-3 p-6 md:p-8 flex items-center justify-center border-l border-[#00E5FF]/20 bg-[#00E5FF]/5">
                {feat.us ? <Check className="w-6 h-6 text-[#00E5FF] drop-shadow-[0_0_10px_rgba(0,229,255,0.8)]" /> : <X className="w-5 h-5 text-red-500" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
