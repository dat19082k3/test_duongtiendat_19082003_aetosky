import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { JobDetail } from './JobDetail';
import * as api from '../api';

vi.mock('../api', () => ({
  getJob: vi.fn(),
}));

describe('JobDetail Page', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const baseJob: api.Job = {
    id: 'job_123',
    status: 'succeeded',
    created_at: '2026-07-03T09:00:00Z',
    finished_at: '2026-07-03T09:05:00Z',
    last_error: null,
  };

  const renderWithRouter = (jobId: string) => {
    return render(
      <MemoryRouter initialEntries={[`/jobs/${jobId}`]}>
        <Routes>
          <Route path="/jobs/:jobId" element={<JobDetail />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('displays job details correctly', async () => {
    vi.mocked(api.getJob).mockResolvedValue(baseJob);
    renderWithRouter('job_123');
    
    await waitFor(() => {
      expect(screen.getByText('Job Details: job_123')).toBeInTheDocument();
      expect(screen.getByText('SUCCEEDED')).toBeInTheDocument();
    });
  });

  it('displays error alert when job failed', async () => {
    const failedJob: api.Job = { ...baseJob, status: 'failed', last_error: 'Connection timeout' };
    vi.mocked(api.getJob).mockResolvedValue(failedJob);
    renderWithRouter('job_123');
    
    await waitFor(() => {
      expect(screen.getByText('Job Failed')).toBeInTheDocument();
      expect(screen.getByText('Connection timeout')).toBeInTheDocument();
    });
  });

  it('displays warning alert for inconsistent timestamps', async () => {
    const inconsistentJob: api.Job = { ...baseJob, status: 'running', finished_at: '2026-07-03T09:05:00Z' };
    vi.mocked(api.getJob).mockResolvedValue(inconsistentJob);
    renderWithRouter('job_123');
    
    await waitFor(() => {
      expect(screen.getByText('Inconsistent State Detected')).toBeInTheDocument();
    });
  });
});
