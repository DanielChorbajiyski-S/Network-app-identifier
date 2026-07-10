import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RuleForm from '../RuleForm';

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

describe('RuleForm', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('renders the form title and all inputs', () => {
    renderWithProviders(<RuleForm />);

    expect(screen.getByText('Create Rule')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., Spotify, Discord')).toBeInTheDocument();
    expect(screen.getByDisplayValue('DnsKeyword')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., spotify\\.com')).toBeInTheDocument();
  });

  it('disables submit button while mutation is pending', async () => {
    vi.mocked(fetch).mockImplementationOnce(() => new Promise<Response>(() => {}));

    renderWithProviders(<RuleForm />);

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('e.g., Spotify, Discord'), 'Spotify');
    await user.type(screen.getByPlaceholderText('e.g., spotify\\.com'), 'spotify\\.com');
    await user.click(screen.getByRole('button', { name: /save signature rule/i }));

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  });

  it('shows success message after rule is saved', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response);

    renderWithProviders(<RuleForm />);

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('e.g., Spotify, Discord'), 'Spotify');
    await user.type(screen.getByPlaceholderText('e.g., spotify\\.com'), 'spotify\\.com');
    await user.click(screen.getByRole('button', { name: /save signature rule/i }));

    const success = await screen.findByText(/rule saved successfully/i);
    expect(success).toBeInTheDocument();
  });

  it('shows error message when save fails', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<RuleForm />);

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('e.g., Spotify, Discord'), 'Spotify');
    await user.type(screen.getByPlaceholderText('e.g., spotify\\.com'), 'spotify\\.com');
    await user.click(screen.getByRole('button', { name: /save signature rule/i }));

    const error = await screen.findByText(/error saving rule/i);
    expect(error).toBeInTheDocument();
  });

  it('clears inputs after successful submission', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response);

    renderWithProviders(<RuleForm />);

    const appNameInput = screen.getByPlaceholderText('e.g., Spotify, Discord');
    const keywordInput = screen.getByPlaceholderText('e.g., spotify\\.com');

    const user = userEvent.setup();
    await user.type(appNameInput, 'Spotify');
    await user.type(keywordInput, 'spotify\\.com');
    await user.click(screen.getByRole('button', { name: /save signature rule/i }));

    await screen.findByText(/rule saved successfully/i);
    expect(appNameInput).toHaveValue('');
    expect(keywordInput).toHaveValue('');
  });

  it('renders icon preview for entered app name', async () => {
    renderWithProviders(<RuleForm />);

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText('e.g., Spotify, Discord'), 'YouTube');

    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });
});
