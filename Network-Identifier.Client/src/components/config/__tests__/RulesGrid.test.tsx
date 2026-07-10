import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RulesGrid from '../RulesGrid';

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

describe('RulesGrid', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('renders the section title', () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response);

    renderWithProviders(<RulesGrid />);
    expect(screen.getByText('Active Network Rules')).toBeInTheDocument();
  });

  it('shows loading spinner initially', () => {
    vi.mocked(fetch).mockImplementationOnce(() => new Promise<Response>(() => {}));

    renderWithProviders(<RulesGrid />);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('shows empty state when no rules exist', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response);

    renderWithProviders(<RulesGrid />);

    const emptyMsg = await screen.findByText(/no active rules found/i);
    expect(emptyMsg).toBeInTheDocument();
  });

  it('displays rules grouped by app name', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({ YouTube: ['youtube\\.com', 'googlevideo\\.com'], Spotify: ['spotify\\.com'] }) } as Response);

    renderWithProviders(<RulesGrid />);

    expect(await screen.findByText('YouTube')).toBeInTheDocument();
    expect(screen.getByText('Spotify')).toBeInTheDocument();
    expect(screen.getByText('youtube\\.com')).toBeInTheDocument();
    expect(screen.getByText('googlevideo\\.com')).toBeInTheDocument();
    expect(screen.getByText('spotify\\.com')).toBeInTheDocument();
  });

  it('shows error message on fetch failure', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<RulesGrid />);

    const errorMsg = await screen.findByText(/failed to load rules/i);
    expect(errorMsg).toBeInTheDocument();
  });

  it('renders app icons for each rule', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({ YouTube: ['youtube\\.com'] }) } as Response);

    renderWithProviders(<RulesGrid />);

    await screen.findByText('YouTube');
    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });
});
