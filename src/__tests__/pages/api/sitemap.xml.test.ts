import handler from '@/src/pages/api/sitemap.xml';

const mockGet = vi.hoisted(() => vi.fn());
vi.mock('@/src/services/api', () => ({
  get: mockGet,
}));

function createMockRes() {
  const headers: Record<string, string> = {};
  let body = '';
  let statusCode = 200;

  return {
    setHeader: vi.fn((key: string, value: string) => { headers[key] = value; }),
    write: vi.fn((chunk: string) => { body += chunk; }),
    end: vi.fn(),
    status: vi.fn((code: number) => { statusCode = code; return { end: vi.fn() }; }),
    getHeaders: () => headers,
    getBody: () => body,
    getStatusCode: () => statusCode,
  };
}

describe('sitemap.xml handler', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('generates XML sitemap with movie and series URLs', async () => {
    mockGet.mockResolvedValue({ results: [{ id: 1, title: 'Movie One' }, { id: 2, name: 'Series One' }] });

    const req = {} as any;
    const res = createMockRes() as any;

    await handler(req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'text/xml');
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 's-maxage=86400, stale-while-revalidate');

    const xml = res.getBody();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset');
    expect(xml).toContain('/filme/movie-one');
    expect(xml).toContain('/serie/series-one');
  });

  it('handles empty results gracefully', async () => {
    mockGet.mockResolvedValue({ results: [] });

    const req = {} as any;
    const res = createMockRes() as any;

    await handler(req, res);

    const xml = res.getBody();
    expect(xml).toContain('<urlset');
    expect(xml).toContain('</urlset>');
  });

  it('handles fetch errors with 500 status', async () => {
    mockGet.mockRejectedValue(new Error('API Error'));

    const req = {} as any;
    const res = createMockRes() as any;

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
