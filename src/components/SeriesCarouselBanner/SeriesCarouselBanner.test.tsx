import { render, screen } from '@testing-library/react';
import SeriesCarouselBanner from '.';

const mockGet = vi.hoisted(() => vi.fn());
vi.mock('@/src/services/api', () => ({
  get: mockGet,
}));

vi.mock('react-slick', () => ({
  default: vi.fn(({ children }) => <div data-testid="slider">{children}</div>),
}));

const mockSeries = [
  { id: 1, name: 'Series A', overview: 'Overview A', backdrop_path: '/a.jpg', first_air_date: '2024-03-15', vote_average: 8.5, popularity: 100, genre_ids: [] },
  { id: 2, name: 'Series B', overview: 'Overview B', backdrop_path: '/b.jpg', first_air_date: '2024-01-10', vote_average: 7.2, popularity: 90, genre_ids: [] },
  { id: 3, name: 'Series C', overview: 'Overview C', backdrop_path: '/c.jpg', first_air_date: '2024-05-20', vote_average: 9.0, popularity: 80, genre_ids: [] },
];

describe('SeriesCarouselBanner', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton initially', () => {
    mockGet.mockReturnValue(new Promise(() => {}));

    render(<SeriesCarouselBanner />);
    const skeletons = document.querySelectorAll('.skeleton-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders series slides after data loads', async () => {
    mockGet.mockResolvedValue({ results: mockSeries });

    render(<SeriesCarouselBanner />);

    expect(await screen.findByText('Series A')).toBeInTheDocument();
    expect(screen.getByText('Series B')).toBeInTheDocument();
    expect(screen.getByText('Series C')).toBeInTheDocument();
  });

  it('sorts by first_air_date descending', async () => {
    mockGet.mockResolvedValue({ results: mockSeries });

    render(<SeriesCarouselBanner />);

    const titles = await screen.findAllByRole('heading', { level: 2 });
    expect(titles[0]).toHaveTextContent('Series C');
    expect(titles[1]).toHaveTextContent('Series A');
    expect(titles[2]).toHaveTextContent('Series B');
  });

  it('limits series to 8', async () => {
    const manySeries = Array.from({ length: 15 }, (_, i) => ({
      id: i, name: `Series ${i}`, overview: '', backdrop_path: '',
      first_air_date: `2024-01-${String(i + 1).padStart(2, '0')}`,
      vote_average: 5, popularity: 50, genre_ids: [],
    }));
    mockGet.mockResolvedValue({ results: manySeries });

    render(<SeriesCarouselBanner />);

    const titles = await screen.findAllByRole('heading', { level: 2 });
    expect(titles.length).toBeLessThanOrEqual(8);
  });
});
