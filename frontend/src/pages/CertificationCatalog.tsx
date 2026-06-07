import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Search, 
  Plus, 
  BookOpen,
  Briefcase,
  Sparkles,
  ArrowRight,
  Fingerprint,
  Box,
  X,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { cn } from '../lib/utils';

const CertificationCatalog: React.FC = () => {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [provider, setProvider] = useState('Microsoft');
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
      await api.post('/certifications/', { name, code, provider, level, description });
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
    <div className="space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500"><Award className="w-5 h-5" /></div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/30">Library / Blueprints</span>
           </div>
           <h1 className="text-6xl font-black tracking-tighter dark:text-white leading-[0.9]">Neural <span className="text-primary">Discovery.</span></h1>
           <p className="text-foreground/60 text-lg font-medium max-w-2xl italic">Systematic exploration of enterprise-grade certification protocols and skill blueprints.</p>
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find protocols..." 
                className="w-full bg-background dark:bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-black dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
           >
              <Plus className="w-4 h-4" /> Register Protocol
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[340px] mica rounded-[3rem] animate-pulse border-white/5" />
            ))
          ) : (
            certifications.map((cert, idx) => (
              <motion.div 
                key={cert.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="mica p-10 rounded-[3rem] border-white/10 hover:border-primary/40 transition-all duration-700 group relative flex flex-col justify-between overflow-hidden cursor-pointer bg-white/30 dark:bg-slate-900/30 h-[380px]"
              >
                <div className="absolute inset-0 living-canvas opacity-0 group-hover:opacity-10 transition-opacity duration-1000" />
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-foreground/5 to-foreground/10 dark:from-white/10 dark:to-white/5 flex items-center justify-center text-foreground/30 group-hover:text-primary transition-all duration-700 group-hover:rotate-12">
                      <Award className="w-8 h-8" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <span className="px-4 py-1.5 rounded-full bg-foreground/5 dark:bg-white/5 text-[9px] font-black uppercase tracking-widest text-foreground/40 border border-white/10 group-hover:border-primary/20 transition-all">
                         {cert.level}
                       </span>
                       <div className="flex items-center gap-1.5 text-emerald-500">
                          <Fingerprint className="w-3 h-3" />
                          <span className="text-[8px] font-black uppercase tracking-tighter">Verified Protocol</span>
                       </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black dark:text-white leading-tight mb-3 group-hover:text-primary transition-colors">{cert.name}</h3>
                    <p className="text-xs text-foreground/50 font-bold leading-relaxed line-clamp-3">{cert.description}</p>
                  </div>
                </div>
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.15em] text-foreground/30 border-b border-white/5 pb-4 group-hover:border-primary/20 transition-all">
                      <span className="flex items-center gap-2 text-primary/80"><Briefcase className="w-3.5 h-3.5" /> {cert.provider}</span>
                      <span className="flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> {cert.code}</span>
                   </div>
                   <div className="flex justify-between items-center group-hover:translate-x-2 transition-transform duration-700">
                      <span className="text-[11px] font-black uppercase tracking-widest text-foreground dark:text-white">Initialize Cycle</span>
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 scale-0 group-hover:scale-100 transition-transform duration-500">
                         <ArrowRight className="w-5 h-5" />
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#02040a]/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl mica p-12 rounded-[3rem] border-white/20"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black dark:text-white tracking-tighter">Register Protocol</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X className="w-6 h-6 text-foreground/30" /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Protocol Name</label>
                  <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-black dark:text-white outline-none focus:border-emerald-500/40 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Code</label>
                      <input required value={code} onChange={e => setCode(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-black dark:text-white outline-none focus:border-emerald-500/40 transition-all" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Level</label>
                      <select value={level} onChange={e => setLevel(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-black dark:text-white outline-none appearance-none">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                   </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-foreground/40 ml-1">Neural Description</label>
                  <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-black dark:text-white outline-none focus:border-emerald-500/40 transition-all h-32 resize-none" />
                </div>
                <button disabled={submitting} type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                   {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Fingerprint className="w-4 h-4" />}
                   Commit to Registry
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
