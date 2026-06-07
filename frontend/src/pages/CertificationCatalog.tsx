import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Search, 
  Plus, 
  BookOpen,
  Briefcase,
  ArrowRight,
  Fingerprint,
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';

const CertificationCatalog: React.FC = () => {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCerts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/certifications/');
      setCertifications(response.data);
    } catch (error) {
      console.error("Failed to fetch certifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/certifications/', { name, code, provider: 'Microsoft', level, description });
      setIsModalOpen(false);
      fetchCerts();
      setName(''); setCode(''); setDescription('');
    } catch (error) {
      console.error("Creation failed", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 shadow-xl border border-emerald-500/20"><Award className="w-6 h-6" /></div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] description">Library / Blueprints</span>
           </div>
           <h1 className="text-7xl font-black tracking-tighter dark:text-white leading-[0.85]">Neural <span className="text-primary text-glow">Discovery.</span></h1>
           <p className="description text-xl font-medium max-w-2xl italic leading-relaxed">Systematic exploration of enterprise-grade certification protocols and skill blueprints.</p>
        </div>
        <div className="flex items-center gap-6 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-96 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 description group-focus-within:text-primary transition-colors duration-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find protocols..." 
                className="w-full bg-background dark:bg-white/5 border-2 border-white/10 rounded-3xl py-6 pl-16 pr-8 text-sm font-black dark:text-white outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-500 shadow-2xl"
              />
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="bg-emerald-600 text-white px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-[0_20px_50px_-10px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
           >
              <Plus className="w-5 h-5" /> Register Protocol
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        <AnimatePresence>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[400px] mica rounded-[4rem] animate-pulse border-white/5 bg-white/5" />
            ))
          ) : (
            certifications.map((cert, idx) => (
              <motion.div 
                key={cert.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mica p-12 rounded-[4rem] border-white/10 hover:border-emerald-500/40 transition-all duration-1000 group relative flex flex-col justify-between overflow-hidden cursor-pointer bg-white/30 dark:os-glass opacity-80 h-[420px] shadow-2xl"
              >
                <div className="absolute inset-0 living-canvas opacity-0 group-hover:opacity-10 transition-opacity duration-1000" />
                <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-foreground/5 to-foreground/10 dark:from-white/10 dark:to-white/5 flex items-center justify-center description group-hover:text-emerald-500 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-inner border border-white/5">
                      <Award className="w-10 h-10" />
                    </div>
                    <div className="flex flex-col items-end gap-3">
                       <span className="px-5 py-2 rounded-full bg-foreground/5 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest description border border-white/10 group-hover:border-emerald-500/20 transition-all">
                         {cert.level}
                       </span>
                       <div className="flex items-center gap-2 text-emerald-500">
                          <Fingerprint className="w-4 h-4" />
                          <span className="text-[9px] font-black uppercase tracking-widest">Verified Logic</span>
                       </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black dark:text-white leading-none tracking-tighter mb-4 group-hover:text-emerald-500 transition-colors">{cert.name}</h3>
                    <p className="text-md font-medium description leading-relaxed line-clamp-3 italic">"{cert.description}"</p>
                  </div>
                </div>
                <div className="relative z-10 space-y-8">
                   <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] description border-b border-white/5 pb-6 group-hover:border-emerald-500/20 transition-all">
                      <span className="flex items-center gap-3 text-primary/80"><Briefcase className="w-4 h-4" /> {cert.provider}</span>
                      <span className="flex items-center gap-3"><BookOpen className="w-4 h-4" /> {cert.code}</span>
                   </div>
                   <div className="flex justify-between items-center group-hover:translate-x-3 transition-transform duration-700">
                      <span className="text-[12px] font-black uppercase tracking-widest text-white">Initialize Cycle</span>
                      <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-0 group-hover:scale-100 transition-transform duration-500">
                         <ArrowRight className="w-6 h-6" />
                      </div>
                   </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#010204]/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-2xl mica p-16 rounded-[4rem] border-white/20 shadow-[0_0_100px_rgba(0,242,255,0.2)]"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-black dark:text-white tracking-tighter">Register Protocol</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8 description" /></button>
              </div>
              
              <form onSubmit={handleCreate} className="space-y-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] description ml-3">Protocol Identity</label>
                  <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-[2rem] py-6 px-10 text-lg font-black dark:text-white outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-inner" placeholder="e.g. Azure Architect High-Level" />
                </div>
                <div className="grid grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-[0.3em] description ml-3">Unique Code</label>
                      <input required value={code} onChange={e => setCode(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-[2rem] py-6 px-10 text-lg font-black dark:text-white outline-none focus:border-emerald-500/40 transition-all shadow-inner" placeholder="AZ-305" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[11px] font-black uppercase tracking-[0.3em] description ml-3">Neural Complexity</label>
                      <select value={level} onChange={e => setLevel(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-[2rem] py-6 px-10 text-lg font-black dark:text-white outline-none appearance-none cursor-pointer">
                        <option value="Beginner" className="bg-[#010204]">Lvl 1 — Foundational</option>
                        <option value="Intermediate" className="bg-[#010204]">Lvl 4 — Specialized</option>
                        <option value="Expert" className="bg-[#010204]">Lvl 9 — Advanced</option>
                      </select>
                   </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-[0.3em] description ml-3">Neural Blueprint Spec</label>
                  <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-[2.5rem] py-8 px-10 text-lg font-medium dark:text-white outline-none focus:border-emerald-500/40 transition-all h-40 resize-none shadow-inner italic" placeholder="Provide the cognitive requirements..." />
                </div>
                <button disabled={submitting} type="submit" className="w-full bg-emerald-600 text-white py-7 rounded-[3rem] font-black uppercase tracking-widest text-xs shadow-[0_30px_60px_-10px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                   {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Fingerprint className="w-6 h-6" />}
                   Commit Protocol to Registry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CertificationCatalog;
