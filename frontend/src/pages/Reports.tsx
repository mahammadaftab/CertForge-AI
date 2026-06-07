import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  BarChart2, 
  PieChart as PieChartIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../lib/api';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports/');
        setReports(response.data);
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center">
       <div className="flex flex-col items-center gap-8">
          <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_50px_rgba(0,242,255,0.3)]" />
          <span className="text-[12px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Compiling Intelligence Reports...</span>
       </div>
    </div>
  );

  return (
    <div className="space-y-16 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="space-y-6">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-xl border border-primary/20"><FileText className="w-6 h-6" /></div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] description">Archives / Neural Logs</span>
           </div>
           <h1 className="text-7xl font-black tracking-tighter dark:text-white leading-[0.85] mb-2">Neural <span className="text-primary text-glow">Reports.</span></h1>
           <p className="description text-xl font-medium max-w-2xl italic leading-relaxed">Synthesized workforce intelligence reports and system performance audits derived from recursive neural logic.</p>
        </div>
        <button className="bg-[#010204] dark:bg-white text-white dark:text-[#010204] px-12 py-6 rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all">
           Generate New Audit
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="mica p-32 rounded-[5rem] text-center space-y-10 border-white/5 bg-white/5 border-dashed relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 living-canvas opacity-5 pointer-events-none" />
           <div className="p-10 bg-foreground/5 dark:bg-white/5 rounded-full inline-block shadow-inner border border-white/5">
              <PieChartIcon className="w-24 h-24 text-white/30" />
           </div>
           <div className="space-y-4 relative z-10">
              <h2 className="text-5xl font-black text-white/30 tracking-tighter uppercase">No Active Reports</h2>
              <p className="description max-w-sm mx-auto italic font-medium">The system is currently aggregating neural flux data for the next intelligence cycle.</p>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           {reports.map((report, idx) => (
             <motion.div 
               key={report.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1, duration: 0.8 }}
               className="mica p-12 rounded-[4.5rem] border-white/10 hover:border-primary/40 transition-all duration-700 group relative flex flex-col justify-between shadow-2xl"
             >
                <div className="absolute inset-0 living-canvas opacity-0 group-hover:opacity-10 transition-opacity duration-1000" />
                <div className="relative z-10 space-y-10">
                   <div className="flex justify-between items-start">
                      <div className="p-5 bg-primary/10 rounded-[1.75rem] text-primary shadow-inner border border-primary/10">
                         <BarChart2 className="w-8 h-8 shadow-glow" />
                      </div>
                      <span className="px-5 py-2 rounded-full bg-foreground/5 dark:bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest description group-hover:border-primary/30 transition-all">
                         {report.type}
                      </span>
                   </div>
                   <div>
                      <h3 className="text-3xl font-black dark:text-white tracking-tighter mb-4 leading-none">{report.title}</h3>
                      <p className="text-md font-medium description leading-relaxed italic">"{report.summary}"</p>
                   </div>
                </div>
                <div className="relative z-10 mt-12 pt-10 border-t border-white/5 flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-foreground/10 dark:bg-white/10 flex items-center justify-center text-xs font-black description border border-white/10 shadow-2xl">
                         {report.generated_by?.full_name?.charAt(0) || 'Ω'}
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] description">Neural Core Synthesis</span>
                   </div>
                   <button className="p-5 mica rounded-2xl border-white/10 description hover:text-primary transition-all shadow-xl hover:scale-110 active:scale-95">
                      <Download className="w-6 h-6 shadow-glow" />
                   </button>
                </div>
             </motion.div>
           ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
