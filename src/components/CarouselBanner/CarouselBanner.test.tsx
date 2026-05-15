import { render, screen } from '@testing-library/react';
import CarouselBanner from '.';

const mockGet = vi.hoisted(() => vi.fn());
vi.mock('@/src/services/api', () => ({
  get: mockGet,
}));

vi.mock('react-slick', () => ({
  default: vi.fn(({ children }) => <div data-testid="slider">{children}</div>),
}));

const mockMovies = [
  { id: 1, title: 'Movie A', overview: 'Overview A', backdrop_path: '/a.jpg', release_date: '2024-03-15', vote_average: 8.5, popularity: 100, genre_ids: [] },
  { id: 2, title: 'Movie B', overview: 'Overview B', backdrop_path: '/b.jpg', release_date: '2024-01-10', vote_average: 7.2, popularity: 90, genre_ids: [] },
  { id: 3, title: 'Movie C', overview: 'Overview C', backdrop_path: '/c.jpg', release_date: '2024-05-20', vote_average: 9.0, popularity: 80, genre_ids: [] },
];

describe('CarouselBanner', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton initially', () => {
    mockGet.mockReturnValue(new Promise(() => {}));

    render(<CarouselBanner />);
    const skeletons = document.querySelectorAll('.skeleton-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders movie slides after data loads', async () => {
    mockGet.mockResolvedValue({ results: mockMovies });

    render(<CarouselBanner />);

    expect(await screen.findByText('Movie A')).toBeInTheDocument();
    expect(screen.getByText('Movie B')).toBeInTheDocument();
    expect(screen.getByText('Movie C')).toBeInTheDocument();
  });

  it('sorts movies by release_date descending', async () => {
    mockGet.mockResolvedValue({ results: mockMovies });

    render(<CarouselBanner />);

    const titles = await screen.findAllByRole('heading', { level: 2 });
    expect(titles[0]).toHaveTextContent('Movie C');
    expect(titles[1]).toHaveTextContent('Movie A');
    expect(titles[2]).toHaveTextContent('Movie B');
  });

  it('limits movies to 8', async () => {
    const manyMovies = Array.from({ length: 15 }, (_, i) => ({
      id: i, title: `Movie ${i}`, overview: '', backdrop_path: '',
      release_date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      vote_average: 5, popularity: 50, genre_ids: [],
    }));
    mockGet.mockResolvedValue({ results: manyMovies });

    render(<CarouselBanner />);

    const articles = await screen.findAllByRole('heading', { level: 2 });
    expect(articles.length).toBeLessThanOrEqual(8);
  });

  it('formats date as DD/MM/YYYY', async () => {
    mockGet.mockResolvedValue({ results: mockMovies });

    render(<CarouselBanner />);

    expect(await screen.findByText('15/03/2024')).toBeInTheDocument();
  });
});
