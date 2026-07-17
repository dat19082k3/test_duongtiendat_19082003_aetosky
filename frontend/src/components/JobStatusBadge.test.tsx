import { describe, it, expect } from "vitest";
import { render, screen } from '@testing-library/react';
import { JobStatusBadge } from './JobStatusBadge';

describe('JobStatusBadge', () => {
  it('renders queued status correctly', () => {
    render(<JobStatusBadge status="queued" />);
    expect(screen.getByText('QUEUED')).toBeInTheDocument();
  });

  it('renders running status correctly', () => {
    render(<JobStatusBadge status="running" />);
    expect(screen.getByText('RUNNING')).toBeInTheDocument();
  });

  it('renders succeeded status correctly', () => {
    render(<JobStatusBadge status="succeeded" />);
    expect(screen.getByText('SUCCEEDED')).toBeInTheDocument();
  });

  it('renders failed status correctly', () => {
    render(<JobStatusBadge status="failed" />);
    expect(screen.getByText('FAILED')).toBeInTheDocument();
  });

  it('renders unknown/unrecognized status gracefully', () => {
    render(<JobStatusBadge status="WEIRD_STATUS" />);
    expect(screen.getByText('WEIRD_STATUS')).toBeInTheDocument();
  });
});
