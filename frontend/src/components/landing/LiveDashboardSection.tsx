import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity } from 'lucide-react';
import axios from 'axios';

const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
});

const LiveDashboardSection = () => {
  const [feed, setFeed] = useState<any[]>([]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    const fetchFeed = async () => {
      try {
        const res = await publicApi.get('/command-center/live-feed');
        if (res.data) setFeed(res.data.slice(0, 5));
      } catch {
        // Fallback placeholder data if endpoint isn't fully ready
        setFeed([
          { id: 1, time: new Date().toISOString(), user: 'Study Agent', action: 'Curriculum Generated', details: 'AZ-104 tailored path' },
          { id: 2, time: new Date(Date.now() - 5000).toISOString(), user: 'Readiness Agent', action: 'Score Update', details: 'Cloud Ops +12%' },
          { id: 3, time: new Date(Date.now() - 15000).toISOString(), user: 'Manager Agent', action: 'Alert Dispatched', details: 'Voucher ready for User 4' },
        ]);
      }
    };

    fetchFeed();
    interval = setInterval(fetchFeed, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-40 border-t border-[#00E5FF]/8 overflow-hidden bg-[#0A0F1E]">
      <div className="absolute inset-0 bg-gradient-to-t from-[#00E5FF]/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
         
         <div className="flex-1 space-y-8">
            <p className="text-[#00E5FF] font-black uppercase tracking-[0.4em] text-sm">Real-Time Telemetry</p>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Live Intelligence <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6]">Dashboard.</span></h2>
            <p className="text-white/55 text-xl font-medium leading-relaxed">
              Watch CertForge autonomously execute enterprise workflows in real-time. No manual intervention required.
            </p>
         </div>

         <div className="flex-1 w-full max-w-xl os-window p-8 rounded-[2rem] border border-[#00E5FF]/20 shadow-[0_0_50px_rgba(0,229,255,0.15)]">
            <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
               <Terminal className="w-5 h-5 text-[#00E5FF]" />
               <span className="text-xs font-black uppercase tracking-[0.2em] text-white/50">System Logs / Live Feed</span>
               <Activity className="w-4 h-4 ml-auto text-emerald-500 animate-pulse" />
            </div>
            <div className="space-y-6 h-[300px] overflow-hidden relative">
               <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[rgba(10,15,30,0.65)] to-transparent z-10 pointer-events-none" />
               <AnimatePresence>
                  {feed.map((log: any, index: number) => (
                    <motion.div 
                      key={log.id || index}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="pl-4 border-l-2 border-[#00E5FF]/50 relative"
                    >
                       <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">
                          {new Date(log.time).toLocaleTimeString()} — {typeof log.user === 'object' ? JSON.stringify(log.user) : log.user}
                       </p>
                       <p className="text-sm font-medium text-white">
                          {typeof log.action === 'object' ? JSON.stringify(log.action) : log.action}: {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                       </p>
                    </motion.div>
                  ))}
               </AnimatePresence>
            </div>
         </div>

      </div>
    </section>
  );
};

export default LiveDashboardSection;
