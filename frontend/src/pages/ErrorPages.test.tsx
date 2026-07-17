import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFound } from './NotFound';
import { ServerError } from './ServerError';

describe('Error Pages', () => {
  it('NotFound displays 404', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Sorry, the page you visited does not exist.')).toBeInTheDocument();
  });

  it('ServerError acts as ErrorBoundary and displays 500 when children throw', () => {
    // Suppress console.error for the intentional throw in this test
    const consoleError = console.error;
    console.error = () => {};

    const ProblemChild = () => {
      throw new Error('Test Error');
    };

    render(
      <ServerError>
        <ProblemChild />
      </ServerError>
    );

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('Sorry, something went wrong with the application.')).toBeInTheDocument();

    // Restore console.error
    console.error = consoleError;
  });
});
