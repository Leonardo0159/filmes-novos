import { render, screen } from '@testing-library/react';
import StreamingCarousel from '.';

const mockGet = vi.hoisted(() => vi.fn());
vi.mock('@/src/services/api', () => ({
  get: mockGet,
}));

vi.mock('react-slick', () => ({
  default: vi.fn(({ children }) => <div data-testid="slider">{children}</div>),
}));

describe('StreamingCarousel', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton initially', () => {
    mockGet.mockReturnValue(new Promise(() => {}));

    render(<StreamingCarousel platform="netflix" />);
    const skeletons = document.querySelectorAll('.skeleton-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders combined movie and series content after data loads', async () => {
    mockGet
      .mockResolvedValueOnce({
        results: [{ id: 1, title: 'Movie 1', backdrop_path: '/m1.jpg', vote_average: 8, overview: 'M1', release_date: '2024-01-01' }],
      })
      .mockResolvedValueOnce({
        results: [{ id: 2, name: 'Series 1', backdrop_path: '/s1.jpg', vote_average: 7.5, overview: 'S1', first_air_date: '2024-02-01' }],
      });

    render(<StreamingCarousel platform="netflix" />);

    expect(await screen.findByText('Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Series 1')).toBeInTheDocument();
  });

  it('identifies content type by title property', async () => {
    mockGet
      .mockResolvedValueOnce({
        results: [
          { id: 1, title: 'Inception', backdrop_path: '/i.jpg', vote_average: 8.5, overview: 'A mind-bending thriller', release_date: '2010-07-16' },
        ],
      })
      .mockResolvedValueOnce({
        results: [
          { id: 2, name: 'Breaking Bad', backdrop_path: '/bb.jpg', vote_average: 9.0, overview: 'Chemistry teacher turned meth kingpin', first_air_date: '2008-01-20' },
        ],
      });

    render(<StreamingCarousel platform="netflix" />);

    await screen.findByText('Inception');
    const movieSection = screen.getByText('A mind-bending thriller');
    expect(movieSection).toBeInTheDocument();
    expect(screen.getByText('Chemistry teacher turned meth kingpin')).toBeInTheDocument();
  });

  it('renders Ver detalhes links', async () => {
    mockGet
      .mockResolvedValueOnce({
        results: [{ id: 1, title: 'Test Movie', backdrop_path: '/t.jpg', vote_average: 7, overview: 'Test', release_date: '2024-01-01' }],
      })
      .mockResolvedValueOnce({ results: [] });

    render(<StreamingCarousel platform="netflix" />);

    const links = await screen.findAllByText('Ver detalhes');
    expect(links.length).toBeGreaterThan(0);
  });
});
