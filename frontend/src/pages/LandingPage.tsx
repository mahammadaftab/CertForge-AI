import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Stars, Float, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { 
  BrainCircuit, Zap, Target, Network, Activity, ShieldCheck, 
  Cpu, LayoutDashboard, Globe, AlertTriangle, Lock, Users, 
  BarChart4, ArrowRight, PlayCircle, Search, CheckCircle2, 
  ArrowUpRight, BookOpen, Milestone, Terminal, Server
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- 3D Background Components ---
const NeuralCore = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={sphereRef} args={[1.2, 64, 64]} scale={1.2}>
        <MeshDistortMaterial color="#00E5FF" attach="material" distort={0.5} speed={2} roughness={0.1} metalness={0.9} transparent opacity={0.4} emissive="#8B5CF6" emissiveIntensity={0.8} wireframe />
      </Sphere>
      <Sphere args={[0.9, 32, 32]}>
        <meshStandardMaterial color="#8B5CF6" emissive="#8B5CF6" emissiveIntensity={1} toneMapped={false} />
      </Sphere>
    </Float>
  );
};

const ParticleSystem = () => {
  const count = 3000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }
  const pointsRef = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#00E5FF" size={0.03} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
};

const Scene3D = () => (
  <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} color="#00E5FF" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#8B5CF6" />
      <NeuralCore />
      <ParticleSystem />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  </div>
);

// --- Reusable UI ---
const SectionEyebrow = ({ text, icon: Icon, color = "text-primary" }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className={cn("flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 w-fit mx-auto mb-8 shadow-2xl backdrop-blur-md", color)}>
    {Icon && <Icon className="w-4 h-4" />}
    <span className="text-[10px] font-black uppercase tracking-[0.4em]">{text}</span>
  </motion.div>
);

const SectionTitle = ({ children }: any) => (
  <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: 0.1 }} className="text-5xl md:text-[5rem] font-black tracking-tighter text-white mb-8 leading-[0.85]">
    {children}
  </motion.h2>
);

// --- Section 1: Cinematic Hero ---
const HeroSection = ({ navigate }: { navigate: any }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#010204]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0A0F1E] via-[#010204] to-[#010204] z-0" />
      <Scene3D />

      <motion.div animate={{ x: mousePos.x * 20, y: mousePos.y * -20 }} transition={{ type: "spring", damping: 50, stiffness: 200 }} className="absolute top-[25%] left-[10%] w-56 p-5 bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2rem] hidden lg:block z-10 shadow-[0_0_50px_rgba(0,229,255,0.1)]">
        <span className="text-[9px] font-black uppercase tracking-widest text-primary mb-2 block">Readiness Score</span>
        <div className="flex items-center gap-3"><Target className="w-5 h-5 text-white/40"/><span className="text-2xl font-black text-white text-glow">84.2%</span></div>
      </motion.div>

      <motion.div animate={{ x: mousePos.x * -30, y: mousePos.y * 30 }} transition={{ type: "spring", damping: 50, stiffness: 200 }} className="absolute bottom-[30%] right-[10%] w-64 p-5 bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-[2rem] hidden lg:block z-10 shadow-[0_0_50px_rgba(139,92,246,0.1)]">
        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400 mb-2 block">Prediction Confidence</span>
        <div className="flex items-center gap-3"><Zap className="w-5 h-5 text-white/40"/><span className="text-2xl font-black text-white text-glow">92.8%</span></div>
      </motion.div>

      <motion.div style={{ y: y1, opacity }} className="relative z-20 text-center px-6 max-w-5xl mx-auto mt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center justify-center gap-3 mb-10">
           <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_15px_#00E5FF]" />
           <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/60">Live Intelligence OS</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 1, ease: "easeOut" }} className="text-6xl md:text-[8rem] font-black tracking-tighter text-white leading-[0.85] mb-10">
          Enterprise Certification <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-secondary drop-shadow-[0_0_50px_rgba(0,229,255,0.4)]">
            Intelligence.
          </span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xl md:text-2xl font-medium text-white/60 max-w-3xl mx-auto mb-16 leading-relaxed italic">
          Predict certification success before training begins. Power workforce readiness using multi-agent reasoning, predictive intelligence, and enterprise knowledge graphs.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button onClick={() => navigate('/login')} className="px-14 py-7 azure-gradient rounded-[3rem] font-black uppercase tracking-[0.2em] text-[11px] text-black shadow-[0_20px_50px_-10px_rgba(0,229,255,0.5)] hover:scale-105 active:scale-95 transition-all w-full sm:w-auto relative group overflow-hidden">
            <span className="relative z-10">Launch Intelligence OS</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0" />
          </button>
          <button className="px-14 py-7 bg-white/5 border border-white/10 rounded-[3rem] font-black uppercase tracking-[0.2em] text-[11px] text-white hover:bg-white/10 transition-all flex items-center justify-center gap-4 w-full sm:w-auto group backdrop-blur-xl">
            Watch Live Agent Flow <PlayCircle className="w-5 h-5 group-hover:text-primary transition-colors" />
          </button>
        </motion.div>
      </motion.div>

      <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-40 z-20">
         <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Scroll to Initialize</span>
         <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </div>
  );
};

// --- Section 2: The Problem ---
const ProblemSection = () => (
  <div className="py-40 relative z-10 px-6 max-w-[1600px] mx-auto border-t border-white/5 bg-gradient-to-b from-[#010204] to-transparent">
    <SectionEyebrow text="The Certification Crisis" icon={AlertTriangle} color="text-accent" />
    <div className="text-center mb-32">
      <SectionTitle>Training in the <span className="text-accent drop-shadow-[0_0_40px_rgba(255,0,170,0.4)]">Dark.</span></SectionTitle>
      <p className="text-2xl text-white/50 max-w-4xl mx-auto italic leading-relaxed">Traditional LMS platforms track completion, not comprehension. The result is massive expenditure with zero predictable ROI.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {[
        { stat: "82%", label: "Unpredictable Outcomes", desc: "Organizations cannot forecast if an employee will pass an exam before they sit for it.", color: "text-accent" },
        { stat: "$4.2M", label: "Wasted Expenditure", desc: "Average enterprise waste on failed certification attempts and redundant training.", color: "text-white" },
        { stat: "0%", label: "Readiness Visibility", desc: "No real-time insight into the actual cognitive readiness of the workforce.", color: "text-white/40" },
      ].map((item, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ delay: i * 0.2, duration: 0.8 }} className="p-16 bg-black/40 backdrop-blur-3xl rounded-[4rem] border border-white/5 hover:border-white/20 transition-all flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className={cn("text-8xl font-black tracking-tighter mb-8", item.color)}>{item.stat}</span>
          <span className="text-sm font-black uppercase tracking-[0.2em] text-white mb-6">{item.label}</span>
          <p className="text-sm font-medium text-white/40 leading-relaxed italic">"{item.desc}"</p>
        </motion.div>
      ))}
    </div>
  </div>
);

// --- Section 3: The CertForge Solution ---
const SolutionSection = () => {
  const nodes = [
    { label: 'Employee Node', icon: Users, color: 'text-white' },
    { label: 'Learning Agent', icon: BookOpen, color: 'text-emerald-400' },
    { label: 'Assessment Agent', icon: ShieldCheck, color: 'text-amber-400' },
    { label: 'Readiness Agent', icon: Target, color: 'text-blue-400' },
    { label: 'Prediction Agent', icon: Zap, color: 'text-primary' },
    { label: 'Executive Intel', icon: BarChart4, color: 'text-secondary' },
  ];

  return (
    <div className="py-40 relative z-10 px-6 max-w-[1600px] mx-auto overflow-hidden">
      <SectionEyebrow text="The Solution Architecture" icon={Network} />
      <div className="text-center mb-32">
        <SectionTitle>A Multi-Agent <span className="text-primary text-glow">Ecosystem.</span></SectionTitle>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 relative max-w-6xl mx-auto">
         <div className="hidden md:block absolute top-12 left-10 right-10 h-1 bg-white/5 -translate-y-1/2 z-0" />
         <motion.div 
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeInOut" }} style={{ originX: 0 }}
            className="hidden md:block absolute top-12 left-10 right-10 h-1 bg-gradient-to-r from-transparent via-primary to-transparent -translate-y-1/2 z-0 opacity-80 blur-[2px]" 
         />

         {nodes.map((node, i) => (
           <motion.div 
             key={i} initial={{ opacity: 0, scale: 0.5, y: 20 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ delay: i * 0.2, duration: 0.6 }}
             className="relative z-10 flex flex-col items-center gap-6 group"
           >
              <div className="w-24 h-24 bg-[#0A0F1E] rounded-[2.5rem] border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:border-primary/40 transition-all duration-500 relative overflow-hidden">
                 <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <node.icon className={cn("w-10 h-10 relative z-10", node.color)} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 text-center max-w-[120px]">{node.label}</span>
           </motion.div>
         ))}
      </div>
    </div>
  );
};

// --- Section 4: Live Agent Orchestration ---
const OrchestrationSection = () => {
  const agents = [
    { label: 'Learning Agent', icon: BookOpen, color: 'text-emerald-400', active: true },
    { label: 'Assessment Agent', icon: ShieldCheck, color: 'text-amber-400', active: true },
    { label: 'Readiness Agent', icon: Target, color: 'text-blue-400', active: true },
    { label: 'Prediction Agent', icon: Zap, color: 'text-primary', active: true },
    { label: 'Executive Intel', icon: BarChart4, color: 'text-secondary', active: false },
  ];

  return (
    <div className="py-40 relative z-10 px-6 max-w-[1600px] mx-auto overflow-hidden border-t border-white/5 bg-gradient-to-b from-white/[0.01] to-transparent">
      <SectionEyebrow text="Command Center" icon={Terminal} color="text-white" />
      <div className="text-center mb-32">
        <SectionTitle>Live Agent <span className="text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.4)]">Orchestration.</span></SectionTitle>
        <p className="text-xl text-white/50 max-w-3xl mx-auto italic">An ecosystem of specialized neural agents processing tasks, routing data, and synthesizing executive intelligence in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-8 os-window p-16 rounded-[4rem] border border-white/10 shadow-2xl min-h-[600px] flex flex-col bg-black/60 backdrop-blur-3xl relative overflow-hidden">
            <div className="absolute inset-0 living-canvas opacity-20" />
            <div className="flex items-center gap-4 mb-12 border-b border-white/5 pb-8 relative z-10">
               <Activity className="w-6 h-6 text-primary animate-pulse" />
               <span className="text-sm font-black uppercase tracking-[0.3em] text-white/60">Global Agent Trace Stream</span>
            </div>
            <div className="flex-1 space-y-6 overflow-hidden relative z-10">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 pointer-events-none z-10" />
               {[
                 { a: "Learning Agent", m: "Synthesized AZ-305 4-week trajectory for 12 nodes.", t: "0.1s", c: "text-emerald-400" },
                 { a: "Assessment Agent", m: "Evaluated 450 scenarios. Neural flux nominal.", t: "1.2s", c: "text-amber-400" },
                 { a: "Readiness Agent", m: "Global readiness index updated to 84.2%.", t: "2.4s", c: "text-blue-400" },
                 { a: "Prediction Agent", m: "Recalculated success probabilities for Security Dept.", t: "3.1s", c: "text-primary" },
                 { a: "Foundry IQ", m: "Generated Executive Insight Briefing #492.", t: "4.5s", c: "text-secondary" },
               ].map((log, i) => (
                 <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }} className="flex gap-6 items-start p-8 bg-white/5 rounded-[2.5rem] border border-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-[11px] font-mono text-white/20 mt-1">{log.t}</span>
                    <div>
                       <span className={cn("text-[11px] font-black uppercase tracking-widest block mb-2", log.c)}>{log.a}</span>
                       <span className="text-lg font-bold text-white/90">{log.m}</span>
                    </div>
                 </motion.div>
               ))}
            </div>
         </motion.div>

         <div className="lg:col-span-4 flex flex-col gap-6 justify-center">
            {agents.map((node, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-6 p-8 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl group hover:border-primary/40 transition-all">
                 <div className="w-16 h-16 rounded-[2rem] bg-black border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <node.icon className={cn("w-8 h-8", node.color)} />
                 </div>
                 <div className="flex-1">
                    <h3 className="text-xl font-black tracking-tight text-white">{node.label}</h3>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mt-2">{node.active ? 'Processing Trace' : 'Awaiting Pipeline'}</p>
                 </div>
                 {node.active && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_#10b981]" />}
              </motion.div>
            ))}
         </div>
      </div>
    </div>
  );
};

// --- Section 5: Foundry IQ ---
const FoundryIQSection = () => (
  <div className="py-40 relative z-10 px-6 max-w-7xl mx-auto">
    <SectionEyebrow text="Foundry IQ" icon={BrainCircuit} color="text-secondary" />
    <div className="text-center mb-32">
      <SectionTitle>Reasoning Beyond <span className="text-secondary drop-shadow-[0_0_40px_rgba(139,92,246,0.6)]">Dashboards.</span></SectionTitle>
    </div>
    
    <div className="os-window p-12 md:p-24 rounded-[5rem] border border-secondary/30 bg-secondary/5 relative overflow-hidden shadow-[0_0_150px_rgba(139,92,246,0.15)]">
       <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none"><BrainCircuit className="w-[500px] h-[500px] text-secondary" /></div>
       
       <div className="relative z-10 max-w-4xl space-y-20">
          <div className="flex gap-8 items-start">
             <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 border border-secondary/30 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                <Search className="w-10 h-10 text-secondary" />
             </div>
             <div className="pt-4"><h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.1]">"Which departments are at highest risk for the upcoming Azure rollouts?"</h3></div>
          </div>

          <div className="pl-10 md:pl-32 border-l-4 border-secondary/30 space-y-16">
             <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
                <span className="text-[12px] font-black uppercase tracking-[0.3em] text-secondary flex items-center gap-3"><Activity className="w-5 h-5" /> System Reasoning</span>
                <p className="text-xl font-medium text-white/60 italic leading-relaxed">Scanning global readiness registry... Detected 18% proficiency drop in Data Science unit... Cross-referencing learning velocity.</p>
             </motion.div>
             <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="space-y-4">
                <span className="text-[12px] font-black uppercase tracking-[0.3em] text-emerald-400 flex items-center gap-3"><CheckCircle2 className="w-5 h-5" /> Evidence Retrieved</span>
                <p className="text-xl font-medium text-white/60 italic leading-relaxed">Data Science Avg Readiness: 64% | Enterprise Threshold: 85%.</p>
             </motion.div>
             <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="p-12 bg-secondary/10 border border-secondary/30 rounded-[3rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-secondary mb-6 block relative z-10">Foundry IQ Insight</span>
                <p className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight relative z-10">Strategic Intervention Required: The Data Science unit shows a critical skill gap in distributed architectures. Recommend deploying a specialized 'Azure Data Factory' sprint immediately.</p>
             </motion.div>
          </div>
       </div>
    </div>
  </div>
);

// --- Section 6, 7 & 8: Work, Fabric, Graph (Grid Layout) ---
const IntelligenceGridSection = () => (
  <div className="py-40 relative z-10 px-6 max-w-[1600px] mx-auto border-t border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
       
       {/* Work IQ */}
       <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="os-glass p-16 rounded-[4rem] border border-white/10 flex flex-col gap-12 min-h-[600px] bg-black/40">
          <SectionEyebrow text="Work IQ" icon={Zap} color="text-amber-400" />
          <h3 className="text-5xl font-black text-white tracking-tighter text-center leading-[0.9]">Workforce <br/>Signals Engine.</h3>
          <div className="flex-1 grid grid-cols-2 gap-6 mt-8">
             {[
               { label: 'Velocity', val: 'High', color: 'text-emerald-400' },
               { label: 'Engagement', val: '88%', color: 'text-primary' },
               { label: 'Latency', val: '12ms', color: 'text-white' },
               { label: 'Completion', val: '94%', color: 'text-secondary' },
             ].map((stat, i) => (
               <div key={i} className="bg-white/5 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center border border-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">{stat.label}</span>
                  <span className={cn("text-4xl font-black", stat.color)}>{stat.val}</span>
               </div>
             ))}
          </div>
       </motion.div>

       {/* Fabric IQ */}
       <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="os-glass p-16 rounded-[4rem] border border-white/10 flex flex-col gap-12 min-h-[600px] bg-black/40">
          <SectionEyebrow text="Fabric IQ" icon={BarChart4} color="text-primary" />
          <h3 className="text-5xl font-black text-white tracking-tighter text-center leading-[0.9]">Enterprise <br/>Analytics Layer.</h3>
          <div className="flex-1 mt-10 relative flex flex-col justify-end bg-white/5 rounded-[3rem] border border-white/5 p-10 overflow-hidden">
             <div className="flex items-end justify-between h-56 gap-4 relative z-10">
                {[40, 60, 45, 80, 65, 95].map((h, i) => (
                  <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ delay: 0.5 + (i * 0.1), duration: 1.5, ease: "easeOut" }} className="w-full bg-gradient-to-t from-primary/20 to-primary rounded-t-2xl relative group">
                     <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity bg-black px-4 py-2 rounded-xl">{h}%</div>
                  </motion.div>
                ))}
             </div>
             <div className="w-full h-px bg-white/20 mt-6 relative z-10" />
             <div className="flex justify-between mt-6 relative z-10">
                <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">Q1</span>
                <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">Q2</span>
                <span className="text-[11px] font-black text-primary uppercase tracking-widest">Forecast</span>
             </div>
          </div>
       </motion.div>

       {/* Knowledge Graph */}
       <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="os-window p-16 rounded-[4rem] border border-white/10 flex flex-col gap-12 min-h-[600px] lg:col-span-1 md:col-span-2 bg-black/40 overflow-hidden relative">
          <SectionEyebrow text="Knowledge Graph" icon={Network} color="text-emerald-400" />
          <h3 className="text-5xl font-black text-white tracking-tighter text-center leading-[0.9] relative z-10">Semantic <br/>Ontology Mapping.</h3>
          <div className="flex-1 mt-10 relative flex items-center justify-center">
             <Network className="w-56 h-56 text-white/10 animate-pulse relative z-10" />
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[300px] h-[300px] border-[3px] border-emerald-500/20 rounded-full animate-[spin_15s_linear_infinite] border-dashed" />
                <div className="absolute w-[200px] h-[200px] border-[2px] border-primary/20 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
             </div>
             <motion.div animate={{ y: [-15, 15, -15] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-1/4 left-1/4 w-6 h-6 bg-emerald-500 rounded-full shadow-[0_0_25px_#10b981] z-10" />
             <motion.div animate={{ y: [15, -15, 15] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-primary rounded-full shadow-[0_0_25px_#00E5FF] z-10" />
          </div>
       </motion.div>

    </div>
  </div>
);

// --- Section 10: Security & RBAC ---
const SecuritySection = () => (
  <div className="py-40 relative z-10 px-6 max-w-[1600px] mx-auto border-t border-white/5">
    <div className="text-center mb-32">
      <SectionEyebrow text="Enterprise Security" icon={ShieldCheck} color="text-white" />
      <SectionTitle>Military-Grade <span className="text-white border-b-4 border-primary">RBAC.</span></SectionTitle>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
       {[
         { role: "Associate", scope: "Personal Readiness", desc: "Access to localized learning paths, adaptive assessments, and personal Work IQ metrics.", color: "text-emerald-400", bg: "bg-emerald-400/5", border: "border-emerald-400/20" },
         { role: "Controller", scope: "Operational Intel", desc: "Access to the Workforce Matrix, Team Readiness scoring, and Fabric IQ analytics.", color: "text-blue-400", bg: "bg-blue-400/5", border: "border-blue-400/20" },
         { role: "Root Admin", scope: "Global Orchestration", desc: "Full systemic control. Access to Agent Studio, System Settings, and Foundry IQ engine.", color: "text-purple-400", bg: "bg-purple-400/5", border: "border-purple-400/20" },
       ].map((tier, i) => (
         <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className={cn("p-16 rounded-[4rem] border backdrop-blur-3xl relative overflow-hidden group", tier.bg, tier.border)}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Lock className={cn("w-16 h-16 mb-10", tier.color)} />
            <h3 className="text-5xl font-black text-white tracking-tighter mb-4">{tier.role}</h3>
            <p className="text-[12px] font-black uppercase tracking-[0.2em] text-white/40 mb-10 border-b border-white/10 pb-8">{tier.scope}</p>
            <p className="text-lg font-medium text-white/60 leading-relaxed mb-10 italic">"{tier.desc}"</p>
         </motion.div>
       ))}
    </div>
  </div>
);

// --- Section 11 & 12: Impact & Final CTA ---
const ImpactAndCTASection = ({ navigate }: { navigate: any }) => (
  <div className="py-40 relative z-10 px-6 max-w-6xl mx-auto text-center border-t border-white/5">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-48">
       {[
         { val: "1.2M+", label: "Predictions Generated" },
         { val: "450k", label: "Assessments Scored" },
         { val: "99.9%", label: "Inference Uptime" },
         { val: "0.00", label: "Data Breaches" },
       ].map((stat, i) => (
         <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex flex-col items-center">
            <span className="text-6xl md:text-7xl font-black text-white tracking-tighter mb-4 text-glow">{stat.val}</span>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40">{stat.label}</span>
         </motion.div>
       ))}
    </div>

    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-16 relative">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/20 rounded-full blur-[250px] pointer-events-none" />
       
       <h2 className="text-7xl md:text-[8rem] font-black tracking-tighter text-white leading-[0.85] relative z-10">
         Transform Certification <br/> Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-secondary drop-shadow-[0_0_40px_rgba(0,229,255,0.5)]">Intelligence.</span>
       </h2>
       
       <div className="flex flex-col sm:flex-row items-center justify-center gap-8 relative z-10">
          <button onClick={() => navigate('/login')} className="px-16 py-8 azure-gradient rounded-[4rem] font-black uppercase tracking-[0.25em] text-sm text-black shadow-[0_20px_80px_-15px_rgba(0,229,255,0.6)] hover:scale-105 active:scale-95 transition-all w-full sm:w-auto relative group overflow-hidden">
            <span className="relative z-10">Initialize Platform</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0" />
          </button>
       </div>

       <div className="pt-24 flex flex-wrap justify-center gap-8 md:gap-12 text-white/30 font-black text-[11px] uppercase tracking-[0.5em] relative z-10">
          <span>Microsoft Foundry</span>
          <span className="hidden md:inline">•</span>
          <span>Azure Native</span>
          <span className="hidden md:inline">•</span>
          <span>Enterprise Ready</span>
       </div>
    </motion.div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#010204] font-sans selection:bg-primary selection:text-black overflow-hidden relative">
      <HeroSection navigate={navigate} />
      <ProblemSection />
      <SolutionSection />
      <OrchestrationSection />
      <FoundryIQSection />
      <IntelligenceGridSection />
      <SecuritySection />
      <ImpactAndCTASection navigate={navigate} />
    </div>
  );
};

export default LandingPage;
