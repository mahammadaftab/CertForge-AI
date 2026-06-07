import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCircle, 
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../lib/api';

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get('/teams/');
        setTeams(response.data);
      } catch (error) {
        console.error("Failed to fetch teams", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center">
       <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_30px_rgba(0,242,255,0.3)]" />
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">Syncing Strategic Clusters...</span>
       </div>
    </div>
  );

  return (
    <div className="space-y-16 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-xl border border-primary/20"><UserCircle className="w-6 h-6" /></div>
              <span className="text-[11px] font-black uppercase tracking-[0.5em] description">Org Structure / Units</span>
           </div>
           <h1 className="text-7xl font-black tracking-tighter dark:text-white leading-[0.85]">Strategic <span className="text-primary text-glow">Clusters.</span></h1>
           <p className="description text-xl font-medium max-w-2xl italic leading-relaxed">Operational mapping of specialized workforce units and their neural alignment trajectories.</p>
        </div>
        <button className="bg-primary text-white font-bold px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-[0_20px_50px_-10px_rgba(0,242,255,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group">
           Initialize Unit <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {teams.map((team, idx) => (
          <motion.div 
            key={team.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mica p-12 rounded-[4rem] border-white/10 hover:border-primary/40 transition-all duration-1000 group relative flex flex-col justify-between overflow-hidden cursor-pointer shadow-2xl"
          >
            <div className="absolute inset-0 living-canvas opacity-0 group-hover:opacity-10 transition-opacity duration-1000" />
            <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-start">
                 <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 shadow-inner border border-primary/10">
                    <Users className="w-10 h-10" />
                 </div>
                 <div className="px-5 py-2.5 rounded-full bg-foreground/5 dark:bg-white/5 border border-white/10 shadow-xl group-hover:border-primary/30 transition-all">
                    <span className="text-[11px] font-black uppercase tracking-widest description">NODE-UID: {idx + 101}</span>
                 </div>
              </div>
              <div>
                 <h3 className="text-3xl font-black dark:text-white tracking-tighter mb-4 group-hover:text-primary transition-colors leading-none">{team.name}</h3>
                 <p className="text-md font-medium description line-clamp-2 italic leading-relaxed opacity-80">"{team.description}"</p>
              </div>
            </div>
            <div className="relative z-10 mt-12 pt-8 border-t border-white/5 space-y-6">
               <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest description">
                  <span>Unit Controller</span>
                  <span className="text-primary text-glow">{team.manager?.user?.full_name || 'Assigned'}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black uppercase tracking-widest description">Neural Flux Index</span>
                  <div className="flex items-center gap-3 text-emerald-500">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                     <span className="text-sm font-black tracking-tighter">94.2%</span>
                  </div>
               </div>
            </div>
            {/* Visual Indicator of Activity */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-foreground/5 overflow-hidden">
               <motion.div 
                 initial={{ x: '-100%' }}
                 animate={{ x: '100%' }}
                 transition={{ duration: 3 + idx, repeat: Infinity, ease: "linear" }}
                 className="w-1/3 h-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-40"
               />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Teams;
