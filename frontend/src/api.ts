import axios from 'axios';

// Get base URL from env if available, otherwise fallback to local server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface Job {
  id: string;
  status: string;
  created_at: string;
  finished_at: string | null;
  last_error: string | null;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PaginatedJobs {
  total: number;
  items: Job[];
}

export const getJobs = async (skip = 0, limit = 100, status = 'all'): Promise<PaginatedJobs> => {
  const response = await apiClient.get<any>('/jobs', {
    params: { skip, limit, status },
  });

  // Simple validation of API response shape
  if (!response.data || typeof response.data.total !== 'number' || !Array.isArray(response.data.items)) {
    throw new Error('Invalid API response: Expected {total, items} format');
  }

  const validJobs = response.data.items.map((item: any) => {
    // Graceful fallback for missing fields to avoid crashes
    return {
      id: item.id || `unknown_${Math.random()}`,
      status: item.status || 'unknown',
      created_at: item.created_at || new Date().toISOString(),
      finished_at: item.finished_at || null,
      last_error: item.last_error || null
    } as Job;
  });

  return {
    total: response.data.total,
    items: validJobs
  };
};

export const getJob = async (jobId: string): Promise<Job> => {
  const response = await apiClient.get<any>(`/jobs/${jobId}`);
  
  if (!response.data || typeof response.data !== 'object') {
    throw new Error('Invalid API response: Expected a job object');
  }

  return {
    id: response.data.id || jobId,
    status: response.data.status || 'unknown',
    created_at: response.data.created_at || new Date().toISOString(),
    finished_at: response.data.finished_at || null,
    last_error: response.data.last_error || null
  } as Job;
};
