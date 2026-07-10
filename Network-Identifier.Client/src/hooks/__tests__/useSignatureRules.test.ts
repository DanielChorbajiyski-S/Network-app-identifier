import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('useSignatureRules', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('fetches rules from /api/statistics/rules', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ YouTube: ['youtube\\.com'] }),
    } as Response);

    const response = await fetch('/api/statistics/rules');
    const data = await response.json();

    expect(fetch).toHaveBeenCalledWith('/api/statistics/rules');
    expect(data).toEqual({ YouTube: ['youtube\\.com'] });
  });

  it('returns empty object when no rules exist', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    } as Response);

    const data = await fetch('/api/statistics/rules').then(r => r.json());
    expect(Object.keys(data)).toHaveLength(0);
  });

  it('throws when GET fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 500 } as Response);

    const response = await fetch('/api/statistics/rules');
    expect(response.ok).toBe(false);
  });
});

describe('useAddSignatureRule', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  const validPayload = { appName: 'Spotify', criterionType: 'DnsKeyword', value: 'spotify\\.com' };

  it('sends POST to /api/statistics/rules/addRule', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response);

    const response = await fetch('/api/statistics/rules/addRule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    });

    expect(fetch).toHaveBeenCalledWith('/api/statistics/rules/addRule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    });
    expect(response.ok).toBe(true);
  });

  it('rejects when POST returns non-ok', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 400 } as Response);

    const response = await fetch('/api/statistics/rules/addRule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    });

    expect(response.ok).toBe(false);
  });
});

describe('SignatureRulePayload type', () => {
  it('has required fields', () => {
    const payload = { appName: 'Test', criterionType: 'DnsKeyword', value: 'test\\.com' };
    expect(payload).toHaveProperty('appName');
    expect(payload).toHaveProperty('criterionType');
    expect(payload).toHaveProperty('value');
  });
});

describe('RulesData type', () => {
  it('maps app names to keyword arrays', () => {
    const data: Record<string, string[]> = {
      YouTube: ['youtube\\.com', 'googlevideo\\.com'],
      Spotify: ['spotify\\.com'],
    };
    expect(Array.isArray(data.YouTube)).toBe(true);
    expect(data.YouTube).toHaveLength(2);
    expect(data.Spotify).toHaveLength(1);
  });
});
