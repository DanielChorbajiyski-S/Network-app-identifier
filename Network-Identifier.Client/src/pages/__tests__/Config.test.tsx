import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Config from '../Config';

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

describe('Config page', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('renders the Create Rule form', () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response);

    renderWithProviders(<Config />);

    expect(screen.getByText('Create Rule')).toBeInTheDocument();
  });

  it('renders the Active Network Rules section', () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response);

    renderWithProviders(<Config />);

    expect(screen.getByText('Active Network Rules')).toBeInTheDocument();
  });

  it('renders with full-screen background', () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response);

    const { container } = renderWithProviders(<Config />);
    const outerDiv = container.firstElementChild;
    expect(outerDiv?.className).toContain('min-h-screen');
  });
});
