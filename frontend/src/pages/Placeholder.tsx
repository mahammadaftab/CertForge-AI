import React from 'react';
import { Construction } from 'lucide-react';

const Placeholder: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
      <div className="p-6 rounded-full bg-primary/10 text-primary">
        <Construction className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-black tracking-tight dark:text-white">{title}</h1>
      <p className="description max-w-md">
        We are currently building the high-fidelity {title.toLowerCase()} experience. 
        Stay tuned for Microsoft Copilot integration and advanced analytics.
      </p>
    </div>
  );
};

export default Placeholder;
