import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCircle, 
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { cn } from '../lib/utils';

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
       <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 animate-pulse">Syncing Strategic Clusters...</span>
       </div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl text-primary"><UserCircle className="w-5 h-5" /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">Org Structure / Units</span>
           </div>
           <h1 className="text-6xl font-black tracking-tighter dark:text-white leading-[0.9]">Strategic <span className="text-primary">Clusters.</span></h1>
           <p className="text-foreground/60 text-lg font-medium max-w-2xl italic">Operational mapping of specialized workforce units and their neural alignment.</p>
        </div>
        <button className="bg-primary text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-105 transition-all">
           Register New Unit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {teams.map((team, idx) => (
          <motion.div 
            key={team.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="mica p-10 rounded-[3rem] border-white/10 hover:border-primary/40 transition-all duration-700 group relative flex flex-col justify-between overflow-hidden cursor-pointer shadow-2xl"
          >
            <div className="absolute inset-0 living-canvas opacity-0 group-hover:opacity-5 transition-opacity" />
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary group-hover:rotate-12 transition-transform duration-500 shadow-inner">
                    <Users className="w-8 h-8" />
                 </div>
                 <div className="px-4 py-2 rounded-full bg-foreground/5 dark:bg-white/5 border border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Node: {idx + 1}</span>
                 </div>
              </div>
              <div>
                 <h3 className="text-2xl font-black dark:text-white tracking-tighter mb-2 group-hover:text-primary transition-colors">{team.name}</h3>
                 <p className="text-sm font-medium text-foreground/50 line-clamp-2 italic leading-relaxed">"{team.description}"</p>
              </div>
            </div>
            <div className="relative z-10 mt-10 pt-6 border-t border-white/5 space-y-4">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-foreground/30">
                  <span>Leadership</span>
                  <span className="text-primary">{team.manager?.user?.full_name || 'Assigned'}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Neural Flux</span>
                  <div className="flex items-center gap-2 text-emerald-500">
                     <Activity className="w-3 h-3" />
                     <span className="text-xs font-black">94%</span>
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Teams;
