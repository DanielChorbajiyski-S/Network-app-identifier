import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardStats from '../DashboardStats';

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

describe('DashboardStats', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('shows loading placeholders while fetching', () => {
    vi.mocked(fetch).mockImplementationOnce(() => new Promise<Response>(() => {}));

    renderWithProviders(<DashboardStats />);

    const placeholders = screen.getAllByText('...');
    expect(placeholders.length).toBeGreaterThanOrEqual(1);
  });

  it('displays total packets and apps tracked', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({ YouTube: { TCP: 5000, UDP: 2000 }, Netflix: { TCP: 3000 } }) } as Response);

    renderWithProviders(<DashboardStats />);

    const total = await screen.findByText((content) => content.replace(/\D/g, '') === '10000');
    expect(total).toBeInTheDocument();

    const count = await screen.findByText('2');
    expect(count).toBeInTheDocument();
  });

  it('renders the stat card labels', () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response);

    renderWithProviders(<DashboardStats />);

    expect(screen.getByText('Total Packets Identified')).toBeInTheDocument();
    expect(screen.getByText('Apps Tracked')).toBeInTheDocument();
  });

  it('shows 0 for both stats when data is empty', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response);

    renderWithProviders(<DashboardStats />);

    const zeros = await screen.findAllByText('0');
    expect(zeros.length).toBe(2);
  });
});
