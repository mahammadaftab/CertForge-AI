import api from './api';

export interface GraphNode {
  id: string;
  name: string;
  type: string;
  val: number;
}

export interface GraphLink {
  source: string;
  target: string;
  relation: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface RadarData {
  subject: string;
  A: number;
  fullMark: number;
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  details: any;
  time: string;
}

export interface PredictionResult {
  readiness_score: number;
  pass_probability: number;
  risk_score: number;
  dimensions: Record<string, number>;
  recommendation: string;
}

export const dashboardService = {
  getGraphData: async (): Promise<GraphData> => {
    const response = await api.get('/command-center/graph-data');
    return response.data;
  },

  getRadarData: async (): Promise<RadarData[]> => {
    const response = await api.get('/command-center/readiness-radar');
    return response.data;
  },

  getLiveFeed: async (): Promise<ActivityLog[]> => {
    const response = await api.get('/command-center/live-feed');
    return response.data;
  },

  runPrediction: async (data: any): Promise<PredictionResult> => {
    const response = await api.post('/predictor/predict', data);
    return response.data;
  },

  runOrchestration: async (data: any): Promise<any> => {
    const response = await api.post('/intelligence/orchestrate', data);
    return response.data;
  }
};
