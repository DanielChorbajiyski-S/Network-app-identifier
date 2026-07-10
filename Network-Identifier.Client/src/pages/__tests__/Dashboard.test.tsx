import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from '../Dashboard';

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('Dashboard page', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('renders the page title', () => {
    vi.mocked(fetch).mockImplementationOnce(() => new Promise(() => {}));

    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Network Traffic Dashboard')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    vi.mocked(fetch).mockImplementationOnce(() => new Promise(() => {}));

    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Real-time packet capture statistics')).toBeInTheDocument();
  });

  it('renders DashboardStats and PacketChart', () => {
    vi.mocked(fetch).mockImplementationOnce(() => new Promise(() => {}));

    renderWithProviders(<Dashboard />);

    expect(screen.getByText('Total Packets Identified')).toBeInTheDocument();
    expect(screen.getByText('Packet Count by Application')).toBeInTheDocument();
  });
});
