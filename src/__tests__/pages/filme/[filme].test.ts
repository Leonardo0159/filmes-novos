import { getServerSideProps } from '@/src/pages/filme/[filme]';

const mockGet = vi.hoisted(() => vi.fn());
vi.mock('@/src/services/api', () => ({
  get: mockGet,
}));

describe('MovieDetail getServerSideProps', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const createContext = (filme: string) => ({
    params: { filme },
    req: {} as any,
    res: {} as any,
    query: {},
    resolvedUrl: '',
  });

  it('returns movie with all data when found', async () => {
    const movieData = { id: 1, title: 'Test Movie', overview: 'Test', backdrop_path: '/b.jpg', poster_path: '/p.jpg', release_date: '2024-01-15', vote_average: 8.0, popularity: 100, genres: [{ id: 1, name: 'Action' }], runtime: 120, genre_ids: [] };

    mockGet
      .mockResolvedValueOnce({ results: [movieData] })
      .mockResolvedValueOnce({ results: [{ key: 'abc123', type: 'Trailer', site: 'YouTube', name: 'Trailer' }] })
      .mockResolvedValueOnce({ results: { BR: { flatrate: [{ provider_name: 'Netflix', logo_path: '/n.jpg' }] } } })
      .mockResolvedValueOnce({ results: [{ id: 1, title: 'Test Movie' }] })
      .mockResolvedValueOnce({ cast: [{ id: 10, name: 'Actor', character: 'Hero', profile_path: '/a.jpg' }] });

    const result = await getServerSideProps(createContext('test-movie') as any);
    const props = 'props' in result ? result.props : null;

    expect(props).not.toBeNull();
    expect(props!.movie).toEqual(movieData);
    expect(props!.trailerKey).toBe('abc123');
    expect(props!.watchProviders).toEqual([{ provider_name: 'Netflix', logo_path: '/n.jpg' }]);
    expect(props!.inTheaters).toBe(true);
    expect(props!.cast).toEqual([{ id: 10, name: 'Actor', character: 'Hero', profile_path: '/a.jpg' }]);
  });

  it('returns null movie when search returns no results', async () => {
    mockGet.mockResolvedValueOnce({ results: [] });

    const result = await getServerSideProps(createContext('unknown-movie') as any);
    const props = 'props' in result ? result.props : null;

    expect(props).not.toBeNull();
    expect(props!.movie).toBeNull();
    expect(props!.trailerKey).toBeNull();
    expect(props!.watchProviders).toEqual([]);
    expect(props!.inTheaters).toBe(false);
    expect(props!.cast).toEqual([]);
  });

  it('finds YouTube trailer of type Trailer', async () => {
    const movieData = { id: 1, title: 'Test', overview: '', backdrop_path: null, poster_path: null, release_date: '', vote_average: 0, popularity: 0, genre_ids: [] };

    mockGet
      .mockResolvedValueOnce({ results: [movieData] })
      .mockResolvedValueOnce({ results: [
        { key: 'teaser1', type: 'Teaser', site: 'YouTube', name: 'Teaser' },
        { key: 'trailer1', type: 'Trailer', site: 'YouTube', name: 'Official Trailer' },
      ]})
      .mockResolvedValueOnce({ results: {} })
      .mockResolvedValueOnce({ results: [] })
      .mockResolvedValueOnce({ cast: [] });

    const result = await getServerSideProps(createContext('test') as any);
    const props = 'props' in result ? result.props : null;

    expect(props!.trailerKey).toBe('trailer1');
  });

  it('extracts BR flatrate watch providers', async () => {
    const movieData = { id: 1, title: 'Test', overview: '', backdrop_path: null, poster_path: null, release_date: '', vote_average: 0, popularity: 0, genre_ids: [] };

    mockGet
      .mockResolvedValueOnce({ results: [movieData] })
      .mockResolvedValueOnce({ results: [] })
      .mockResolvedValueOnce({ results: { BR: { flatrate: [{ provider_name: 'Netflix', logo_path: '/n.jpg' }] } } })
      .mockResolvedValueOnce({ results: [] })
      .mockResolvedValueOnce({ cast: [] });

    const result = await getServerSideProps(createContext('test') as any);
    const props = 'props' in result ? result.props : null;

    expect(props!.watchProviders).toHaveLength(1);
    expect(props!.watchProviders[0].provider_name).toBe('Netflix');
  });

  it('limits cast to 10', async () => {
    const movieData = { id: 1, title: 'Test', overview: '', backdrop_path: null, poster_path: null, release_date: '', vote_average: 0, popularity: 0, genre_ids: [] };
    const manyCast = Array.from({ length: 20 }, (_, i) => ({ id: i, name: `Actor ${i}`, character: `Role ${i}`, profile_path: `/a${i}.jpg` }));

    mockGet
      .mockResolvedValueOnce({ results: [movieData] })
      .mockResolvedValueOnce({ results: [] })
      .mockResolvedValueOnce({ results: {} })
      .mockResolvedValueOnce({ results: [] })
      .mockResolvedValueOnce({ cast: manyCast });

    const result = await getServerSideProps(createContext('test') as any);
    const props = 'props' in result ? result.props : null;

    expect(props!.cast).toHaveLength(10);
  });
});
