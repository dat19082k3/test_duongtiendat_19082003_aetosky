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

export const getJobs = async (skip = 0, limit = 100): Promise<Job[]> => {
  const response = await apiClient.get<Job[]>('/jobs', {
    params: { skip, limit },
  });
  return response.data;
};

export const getJob = async (jobId: string): Promise<Job> => {
  const response = await apiClient.get<Job>(`/jobs/${jobId}`);
  return response.data;
};
