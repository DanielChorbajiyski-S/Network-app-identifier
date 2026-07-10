import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App landing page', () => {
  it('renders the title', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Network Identifier')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const configLink = screen.getByRole('link', { name: /open configuration/i });
    const dashboardLink = screen.getByRole('link', { name: /open dashboard/i });

    expect(configLink).toBeInTheDocument();
    expect(dashboardLink).toBeInTheDocument();
    expect(configLink).toHaveAttribute('href', '/config');
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
  });
});
