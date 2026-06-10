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
  Loader2,
  Sparkles,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { useAuth, UserRole } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CertificationCatalog: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [certifications, setCertifications] = useState<any[]>([]);
  const [enrolledPaths, setEnrolledPaths] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCertsAndProgress = async () => {
    setLoading(true);
    try {
      const [certsRes, progressRes] = await Promise.all([
        api.get('/certifications/'),
        api.get('/certifications/progress')
      ]);
      setCertifications(certsRes.data);
      setEnrolledPaths(progressRes.data);
    } catch (error) {
      console.error("Failed to fetch certifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertsAndProgress();
  }, []);

  const handleEnroll = async (certId: string) => {
    try {
       const res = await api.post('/certifications/enroll', { certification_id: certId });
       // Start learning immediately after enrollment
       await handleStartLearning(res.data._id || res.data.id);
    } catch (err) {
       console.error("Enrollment failed", err);
    }
  };

  const handleStartLearning = async (pathId: string) => {
     try {
        await api.post(`/certifications/start-learning/${pathId}`);
        navigate('/learning-path');
     } catch (err) {
        console.error("Failed to start session", err);
     }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/certifications/', { name, code, provider: 'Microsoft', level, description });
      setIsModalOpen(false);
      fetchCertsAndProgress();
      setName(''); setCode(''); setDescription('');
    } catch (error) {
      console.error("Creation failed", error);
    } finally {
      setSubmitting(false);
    }
  };

  const isAdmin = user?.role === UserRole.ROOT_ADMIN;

  const isEnrolled = (certId: string) => {
     return enrolledPaths.some(p => p.certification_id === certId);
  };

  const getPathForCert = (certId: string) => {
     return enrolledPaths.find(p => p.certification_id === certId);
  };

  const filteredCerts = certifications.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-16 pb-20 px-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 shadow-xl border border-emerald-500/20"><Award className="w-6 h-6" /></div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Registry / Blueprints</span>
           </div>
           <h1 className="text-7xl font-black tracking-tighter text-white leading-[0.85]">Neural <span className="text-primary text-glow">Discovery.</span></h1>
           <p className="description text-xl font-medium max-w-2xl italic leading-relaxed">Systematic exploration of enterprise-grade certification protocols and skill blueprints.</p>
        </div>
        <div className="flex items-center gap-6 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-96 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-primary transition-colors duration-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find protocols..." 
                className="w-full bg-white/5 border-2 border-white/10 rounded-3xl py-6 pl-16 pr-8 text-sm font-black text-white outline-none focus:border-emerald-500/40 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-500 shadow-2xl"
              />
           </div>
           {isAdmin && (
             <button 
               onClick={() => setIsModalOpen(true)}
               className="bg-emerald-600 text-white px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-[0_20px_50px_-10px_rgba(16,185,129,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
             >
                <Plus className="w-5 h-5" /> Register Protocol
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        <AnimatePresence>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[400px] os-glass rounded-[4rem] animate-pulse border-white/5" />
            ))
          ) : (
            filteredCerts.map((cert, idx) => {
              const enrolled = isEnrolled(cert.id || cert._id);
              const path = getPathForCert(cert.id || cert._id);
              
              return (
                <motion.div 
                  key={cert.id || cert._id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="os-glass p-12 rounded-[4rem] border-white/10 hover:border-emerald-500/40 transition-all duration-1000 group relative flex flex-col justify-between overflow-hidden cursor-pointer shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-primary/0 group-hover:from-emerald-500/5 group-hover:to-primary/5 transition-all duration-500 pointer-events-none" />
                  <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="w-20 h-20 rounded-[2rem] bg-white/10 flex items-center justify-center text-white/40 group-hover:text-emerald-500 transition-all duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-inner border border-white/5">
                        <Award className="w-10 h-10" />
                      </div>
                      <div className="flex flex-col items-end gap-3">
                         <span className="px-5 py-2 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/40 border border-white/10 group-hover:border-emerald-500/20 transition-all">
                           {cert.level}
                         </span>
                         {enrolled ? (
                           <div className="flex items-center gap-2 text-emerald-500">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-[9px] font-black uppercase tracking-widest text-glow">In Progress</span>
                           </div>
                         ) : (
                           <div className="flex items-center gap-2 text-primary/40">
                              <Fingerprint className="w-4 h-4" />
                              <span className="text-[9px] font-black uppercase tracking-widest">Available</span>
                           </div>
                         )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white leading-none tracking-tighter mb-4 group-hover:text-emerald-500 transition-colors">{cert.name}</h3>
                      <p className="text-md font-medium text-white/40 leading-relaxed line-clamp-3 italic">"{cert.description}"</p>
                    </div>
                  </div>
                  <div className="relative z-10 space-y-8 mt-10">
                     <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/5 pb-6 group-hover:border-emerald-500/20 transition-all">
                        <span className="flex items-center gap-3 text-primary/80"><Briefcase className="w-4 h-4" /> {cert.provider}</span>
                        <span className="flex items-center gap-3"><BookOpen className="w-4 h-4" /> {cert.code}</span>
                     </div>
                     <div className="flex justify-between items-center group-hover:translate-x-3 transition-transform duration-700">
                        <button 
                           onClick={() => enrolled ? handleStartLearning(path._id || path.id) : handleEnroll(cert._id || cert.id)}
                           className="flex-1 flex justify-between items-center bg-transparent border-none text-left outline-none"
                        >
                           <span className="text-[12px] font-black uppercase tracking-widest text-white">
                              {enrolled ? 'Resume Trajectory' : 'Initialize Cycle'}
                           </span>
                           <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-0 group-hover:scale-100 transition-transform duration-500">
                              <ArrowRight className="w-6 h-6" />
                           </div>
                        </button>
                     </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {isAdmin && (
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
                className="relative w-full max-w-2xl os-glass p-16 rounded-[4rem] border-white/20 shadow-[0_0_100px_rgba(0,242,255,0.2)]"
              >
                <div className="flex justify-between items-center mb-12">
                  <h2 className="text-4xl font-black text-white tracking-tighter">Register Protocol</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-4 hover:bg-white/10 rounded-2xl transition-all"><X className="w-8 h-8 text-white/20" /></button>
                </div>
                
                <form onSubmit={handleCreate} className="space-y-10">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 ml-3">Protocol Identity</label>
                    <input required value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-[2rem] py-6 px-10 text-lg font-black text-white outline-none focus:border-emerald-500/40 transition-all shadow-inner" placeholder="e.g. Azure Architect High-Level" />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 ml-3">Unique Code</label>
                        <input required value={code} onChange={e => setCode(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-[2rem] py-6 px-10 text-lg font-black text-white outline-none focus:border-emerald-500/40 transition-all shadow-inner" placeholder="AZ-305" />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 ml-3">Neural Complexity</label>
                        <select value={level} onChange={e => setLevel(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-[2rem] py-6 px-10 text-lg font-black text-white outline-none appearance-none cursor-pointer bg-black">
                          <option value="Beginner">Lvl 1 — Foundational</option>
                          <option value="Intermediate">Lvl 4 — Specialized</option>
                          <option value="Expert">Lvl 9 — Advanced</option>
                        </select>
                     </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 ml-3">Neural Blueprint Spec</label>
                    <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white/5 border-2 border-white/10 rounded-[2.5rem] py-8 px-10 text-lg font-medium text-white outline-none focus:border-emerald-500/40 transition-all h-40 resize-none shadow-inner italic" placeholder="Provide the cognitive requirements..." />
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
      )}
    </div>
  );
};

export default CertificationCatalog;
