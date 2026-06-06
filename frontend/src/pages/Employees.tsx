import React from 'react';
import { Filter, Plus, Mail, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

const Employees: React.FC = () => {
  const employees = [
    { name: 'Sarah Chen', role: 'Solutions Architect', team: 'Cloud Ops', status: 'Ready', score: 94 },
    { name: 'Marcus Miller', role: 'DevOps Engineer', team: 'Infrastructure', status: 'Learning', score: 62 },
    { name: 'Elena Rodriguez', role: 'Data Scientist', team: 'AI/ML', status: 'Assessment', score: 81 },
    { name: 'David Kim', role: 'Security Specialist', team: 'SecOps', status: 'Ready', score: 98 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight dark:text-white">Workforce Directory</h1>
          <p className="text-slate-500 mt-1">Manage employees and monitor their skill progression.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all">
            <Filter className="w-5 h-5" />
          </button>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/30 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Employee
          </button>
        </div>
      </div>

      <div className="glass overflow-hidden rounded-3xl border border-white/20 dark:border-slate-800 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-100/50 dark:bg-slate-800/50">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider pl-8">Employee</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Team</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Readiness</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right pr-8">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {employees.map((emp, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-4 pl-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">{emp.name}</p>
                      <p className="text-xs text-slate-500">{emp.role}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm font-medium dark:text-slate-300">{emp.team}</td>
                <td className="p-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    emp.status === 'Ready' ? "bg-emerald-100 text-emerald-700" : 
                    emp.status === 'Learning' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {emp.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden max-w-[100px] mx-auto">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        emp.score > 90 ? "bg-emerald-500" : emp.score > 70 ? "bg-blue-500" : "bg-amber-500"
                      )}
                      style={{ width: `${emp.score}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-bold mt-1 inline-block">{emp.score}%</span>
                </td>
                <td className="p-4 text-right pr-8">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                      <Mail className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Employees;
