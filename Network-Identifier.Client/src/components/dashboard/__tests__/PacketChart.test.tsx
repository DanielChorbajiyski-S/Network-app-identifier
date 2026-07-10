import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PacketChart from '../PacketChart';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

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

describe('PacketChart', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('shows loading spinner while fetching', () => {
    vi.mocked(fetch).mockImplementationOnce(() => new Promise(() => {}));

    renderWithProviders(<PacketChart />);

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    expect(screen.getByText('Packet Count by Application')).toBeInTheDocument();
  });

  it('shows error message on fetch failure', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<PacketChart />);

    const error = await screen.findByText(/failed to load statistics/i);
    expect(error).toBeInTheDocument();
  });

  it('shows empty state when no data returned', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response);

    renderWithProviders(<PacketChart />);

    const empty = await screen.findByText(/no packet data available yet/i);
    expect(empty).toBeInTheDocument();
  });

  it('renders chart when data is available', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        YouTube: { TCP: 5000, UDP: 2000 },
        Netflix: { TCP: 3000 },
      }),
    } as Response);

    renderWithProviders(<PacketChart />);

    expect(await screen.findByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('renders stacked bars for each protocol', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        YouTube: { TCP: 5000, UDP: 2000 },
        Netflix: { TCP: 3000 },
      }),
    } as Response);

    renderWithProviders(<PacketChart />);

    await screen.findByTestId('bar-chart');
    const bars = screen.getAllByTestId('bar');
    expect(bars.length).toBe(2);
  });
});
