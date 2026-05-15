import { get } from './api';

describe('api.get', () => {
  const originalEnv = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_TMDB_API_KEY', 'test-token');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('returns parsed JSON on successful response', async () => {
    const mockData = { results: [{ id: 1 }] };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await get<typeof mockData>('https://api.example.com');
    expect(result).toEqual(mockData);
  });

  it('sets Authorization header with Bearer token', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await get('https://api.example.com');
    expect(global.fetch).toHaveBeenCalledWith('https://api.example.com', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer test-token',
        accept: 'application/json',
      },
    });
  });

  it('returns null on non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    const result = await get('https://api.example.com');
    expect(result).toBeNull();
  });

  it('returns null when fetch throws', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const result = await get('https://api.example.com');
    expect(result).toBeNull();
  });

  it('returns null when json parsing fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new Error('Parse error')),
    });

    const result = await get('https://api.example.com');
    expect(result).toBeNull();
  });
});
