import React from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Award, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="glass p-6 rounded-2xl border border-white/20 dark:border-slate-800 shadow-xl">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-600 dark:text-${color}-400`}>
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          <TrendingUp className="w-3 h-3 mr-1" /> {trend}
        </span>
      )}
    </div>
    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
    <h3 className="text-3xl font-bold dark:text-white">{value}</h3>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black tracking-tight dark:text-white">Enterprise Insights</h1>
          <p className="text-slate-500 mt-1">Certification readiness and workforce intelligence overview.</p>
        </div>
        <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all flex items-center gap-2">
          Download Report <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Employees" value="1,284" icon={Users} trend="+12%" color="blue" />
        <StatCard title="Active Certs" value="452" icon={Award} trend="+5.4%" color="indigo" />
        <StatCard title="Ready Rate" value="78%" icon={CheckCircle2} trend="+8%" color="emerald" />
        <StatCard title="Pending Review" value="23" icon={AlertCircle} color="amber" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-8 rounded-3xl border border-white/20 dark:border-slate-800 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold dark:text-white">Certification Velocity</h3>
            <select className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1 text-xs font-bold outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0078d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0078d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    backgroundColor: '#fff',
                    padding: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0078d4" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl border border-white/20 dark:border-slate-800 shadow-2xl flex flex-col">
          <h3 className="text-xl font-bold dark:text-white mb-6">Upcoming Milestones</h3>
          <div className="flex-1 space-y-4">
            {[
              { label: 'Azure Architect Exp.', date: 'In 2 days', color: 'red' },
              { label: 'AWS DevOps Review', date: 'In 5 days', color: 'blue' },
              { label: 'Security+ Exam', date: 'Next week', color: 'amber' },
              { label: 'Docker Certification', date: 'In 12 days', color: 'indigo' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer">
                <div className={`w-2 h-10 rounded-full bg-${item.color}-500`}></div>
                <div className="flex-1">
                  <p className="text-sm font-bold dark:text-white">{item.label}</p>
                  <p className="text-[10px] text-slate-500">{item.date}</p>
                </div>
                <button className="text-slate-400 hover:text-primary transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 font-bold text-xs hover:border-primary hover:text-primary transition-all">
            View All Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
