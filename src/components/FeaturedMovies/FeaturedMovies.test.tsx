import { render, screen } from '@testing-library/react';
import FeaturedMovies from '.';

const mockGet = vi.hoisted(() => vi.fn());
vi.mock('@/src/services/api', () => ({
  get: mockGet,
}));

const mockPush = vi.hoisted(() => vi.fn());
const mockOn = vi.hoisted(() => vi.fn());
const mockOff = vi.hoisted(() => vi.fn());

vi.mock('next/router', () => ({
  useRouter: vi.fn(() => ({
    events: { on: mockOn, off: mockOff },
    isReady: true,
    query: {},
    push: mockPush,
  })),
}));

const mockMovies = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  title: `Movie ${i + 1}`,
  overview: `Overview ${i + 1}`,
  poster_path: `/p${i + 1}.jpg`,
  release_date: `2024-01-${String(i + 1).padStart(2, '0')}`,
  vote_average: 7 + i * 0.5,
  popularity: 100 - i * 10,
  genre_ids: [],
}));

describe('FeaturedMovies', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton initially', () => {
    mockGet.mockReturnValue(new Promise(() => {}));

    render(<FeaturedMovies />);
    const skeletons = document.querySelectorAll('.skeleton-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders movie grid after data loads', async () => {
    mockGet.mockResolvedValue({ results: mockMovies, total_pages: 10, total_results: 50, page: 1 });

    render(<FeaturedMovies />);

    expect(await screen.findByText('Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Movie 5')).toBeInTheDocument();
  });

  it('displays section title', async () => {
    mockGet.mockResolvedValue({ results: mockMovies, total_pages: 10, total_results: 50, page: 1 });

    render(<FeaturedMovies />);

    expect(await screen.findByText('Filmes em Destaque')).toBeInTheDocument();
  });

  it('does not render pagination when totalPages is 1', async () => {
    mockGet.mockResolvedValue({ results: mockMovies, total_pages: 1, total_results: 5, page: 1 });

    render(<FeaturedMovies />);

    await screen.findByText('Movie 1');
    expect(screen.queryByLabelText('Página anterior')).not.toBeInTheDocument();
  });
});
