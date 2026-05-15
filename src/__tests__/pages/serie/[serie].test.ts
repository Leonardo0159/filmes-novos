import { getServerSideProps } from '@/src/pages/serie/[serie]';

const mockGet = vi.hoisted(() => vi.fn());
vi.mock('@/src/services/api', () => ({
  get: mockGet,
}));

describe('SeriesDetail getServerSideProps', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const createContext = (serie: string) => ({
    params: { serie },
    req: {} as any,
    res: {} as any,
    query: {},
    resolvedUrl: '',
  });

  it('returns serie with all data when found', async () => {
    const serieData = { id: 1, name: 'Test Series', overview: 'Test', backdrop_path: '/b.jpg', poster_path: '/p.jpg', first_air_date: '2024-01-15', vote_average: 8.0, popularity: 100, genres: [{ id: 1, name: 'Drama' }], genre_ids: [] };

    mockGet
      .mockResolvedValueOnce({ results: [serieData] })
      .mockResolvedValueOnce({ results: [{ key: 'trailer1', type: 'Trailer', site: 'YouTube', name: 'Trailer' }] })
      .mockResolvedValueOnce({ results: { BR: { flatrate: [{ provider_name: 'HBO Max', logo_path: '/h.jpg' }] } } })
      .mockResolvedValueOnce({ cast: [{ id: 10, name: 'Actor', character: 'Hero', profile_path: '/a.jpg' }] });

    const result = await getServerSideProps(createContext('test-series') as any);
    const props = 'props' in result ? result.props : null;

    expect(props).not.toBeNull();
    expect(props!.serie).toEqual(serieData);
    expect(props!.trailerKey).toBe('trailer1');
    expect(props!.watchProviders).toEqual([{ provider_name: 'HBO Max', logo_path: '/h.jpg' }]);
    expect(props!.cast).toEqual([{ id: 10, name: 'Actor', character: 'Hero', profile_path: '/a.jpg' }]);
  });

  it('returns null serie when search returns no results', async () => {
    mockGet.mockResolvedValueOnce({ results: [] });

    const result = await getServerSideProps(createContext('unknown-series') as any);
    const props = 'props' in result ? result.props : null;

    expect(props).not.toBeNull();
    expect(props!.serie).toBeNull();
    expect(props!.trailerKey).toBeNull();
    expect(props!.watchProviders).toEqual([]);
    expect(props!.cast).toEqual([]);
  });

  it('extracts watch providers from BR flatrate', async () => {
    const serieData = { id: 1, name: 'Test', overview: '', backdrop_path: null, poster_path: null, first_air_date: '', vote_average: 0, popularity: 0, genre_ids: [] };

    mockGet
      .mockResolvedValueOnce({ results: [serieData] })
      .mockResolvedValueOnce({ results: [] })
      .mockResolvedValueOnce({ results: { BR: { flatrate: [{ provider_name: 'Disney Plus', logo_path: '/d.jpg' }] } } })
      .mockResolvedValueOnce({ cast: [] });

    const result = await getServerSideProps(createContext('test') as any);
    const props = 'props' in result ? result.props : null;

    expect(props!.watchProviders).toHaveLength(1);
    expect(props!.watchProviders[0].provider_name).toBe('Disney Plus');
  });

  it('limits cast to 10', async () => {
    const serieData = { id: 1, name: 'Test', overview: '', backdrop_path: null, poster_path: null, first_air_date: '', vote_average: 0, popularity: 0, genre_ids: [] };
    const manyCast = Array.from({ length: 15 }, (_, i) => ({ id: i, name: `Actor ${i}`, character: `Role ${i}`, profile_path: `/a${i}.jpg` }));

    mockGet
      .mockResolvedValueOnce({ results: [serieData] })
      .mockResolvedValueOnce({ results: [] })
      .mockResolvedValueOnce({ results: {} })
      .mockResolvedValueOnce({ cast: manyCast });

    const result = await getServerSideProps(createContext('test') as any);
    const props = 'props' in result ? result.props : null;

    expect(props!.cast).toHaveLength(10);
  });
});
