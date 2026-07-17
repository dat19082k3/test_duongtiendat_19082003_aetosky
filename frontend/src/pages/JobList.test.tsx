import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { JobList } from './JobList';
import * as api from '../api';

vi.mock('../api', () => ({
  getJobs: vi.fn(),
}));

describe('JobList Page - Loading, Empty, Error states', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const renderWithRouter = (ui: React.ReactElement) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('shows loading state initially', async () => {
    vi.mocked(api.getJobs).mockImplementation(() => new Promise(() => {}));
    const { container } = renderWithRouter(<JobList />);
    const spinElement = container.querySelector('.ant-spin');
    expect(spinElement).toBeInTheDocument();
  });

  it('shows empty state when no jobs are returned', async () => {
    vi.mocked(api.getJobs).mockResolvedValue({ total: 0, items: [] });
    const { container } = renderWithRouter(<JobList />);
    await waitFor(() => {
      const emptyElement = container.querySelector('.ant-empty');
      expect(emptyElement).toBeInTheDocument();
    });
  });

  it('shows error state when API fails', async () => {
    vi.mocked(api.getJobs).mockRejectedValue(new Error('Network Error'));
    renderWithRouter(<JobList />);
    await waitFor(() => {
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Network Error')).toBeInTheDocument();
    });
  });
});
