import api from './api';

export interface AgentStatusData {
  name: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  tasksProcessed: number;
  successRate: number;
  latency: string;
  currentState: string;
}

export interface AgentMemory {
  employee: string;
  certification: string;
  studyPlan: string;
  readiness: number;
}

export interface AgentExecutionLog {
  id: string;
  agent: string;
  action: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}

export const agentService = {
  getAgentStatus: async (): Promise<AgentStatusData[]> => {
    const response = await api.get('/intelligence/agents/status');
    return response.data;
  },

  getAgentMemory: async (employeeId: string): Promise<AgentMemory> => {
    const response = await api.get(`/intelligence/agents/memory/${employeeId}`);
    return response.data;
  },

  getLiveFeed: async (): Promise<AgentExecutionLog[]> => {
    const response = await api.get('/intelligence/agents/feed');
    return response.data;
  },

  executeWorkflow: async (payload: any): Promise<any> => {
    const response = await api.post('/intelligence/orchestrate', payload);
    return response.data;
  }
};
