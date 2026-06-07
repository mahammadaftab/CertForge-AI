import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { team: 'Cloud Ops', readiness: 92, target: 80 },
  { team: 'Data Eng', readiness: 78, target: 85 },
  { team: 'Security', readiness: 95, target: 90 },
  { team: 'DevOps', readiness: 88, target: 80 },
  { team: 'App Dev', readiness: 71, target: 85 },
];

const AnalyticsSection = () => {
  return (
    <section className="relative py-40 border-t border-[#00E5FF]/8 overflow-hidden bg-[#0A0F1E]/50">
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
         
         <div className="flex-1 w-full max-w-xl os-window p-8 rounded-[2rem] border border-[#7CFF6B]/20 shadow-[0_0_50px_rgba(124,255,107,0.1)]">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="team" stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0A0F1E', border: '1px solid rgba(124,255,107,0.3)', borderRadius: '12px' }}
                  />
                  <Bar dataKey="readiness" fill="#7CFF6B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="flex-1 space-y-8">
            <p className="text-[#7CFF6B] font-black uppercase tracking-[0.4em] text-sm">Actionable Insights</p>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Workforce Readiness <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7CFF6B] to-[#00E5FF]">Analytics.</span></h2>
            <p className="text-white/55 text-xl font-medium leading-relaxed">
              Identify skill gaps instantly. The AI pinpoints exactly which teams are ready to certify and which ones need targeted interventions.
            </p>
            <ul className="space-y-4 pt-4">
              {['Live competency mapping', 'Automated intervention alerts', 'Voucher allocation optimization'].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-white/80 font-medium">
                  <div className="w-2 h-2 rounded-full bg-[#7CFF6B] shadow-[0_0_10px_#7CFF6B]" />
                  {feature}
                </li>
              ))}
            </ul>
         </div>

      </div>
    </section>
  );
};

export default AnalyticsSection;
