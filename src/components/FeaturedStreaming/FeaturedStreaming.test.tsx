import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeaturedStreaming from '.';

const mockGet = vi.hoisted(() => vi.fn());
vi.mock('@/src/services/api', () => ({
  get: mockGet,
}));

const mockPush = vi.hoisted(() => vi.fn());
vi.mock('next/router', () => ({
  useRouter: vi.fn(() => ({
    events: { on: vi.fn(), off: vi.fn() },
    isReady: true,
    query: {},
    push: mockPush,
  })),
}));

const mockMovies = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  title: `Stream Movie ${i + 1}`,
  poster_path: `/p${i + 1}.jpg`,
  vote_average: 7.5 + i * 0.3,
  overview: `Overview ${i + 1}`,
  release_date: `2024-01-${String(i + 1).padStart(2, '0')}`,
}));

const mockSeries = Array.from({ length: 3 }, (_, i) => ({
  id: i + 10,
  name: `Stream Series ${i + 1}`,
  poster_path: `/ps${i + 1}.jpg`,
  vote_average: 8 + i * 0.2,
  overview: `Series Overview ${i + 1}`,
  first_air_date: `2024-02-${String(i + 1).padStart(2, '0')}`,
}));

describe('FeaturedStreaming', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton initially', () => {
    mockGet.mockReturnValue(new Promise(() => {}));

    render(<FeaturedStreaming platform="netflix" />);
    const skeletons = document.querySelectorAll('.skeleton-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders content items after data loads', async () => {
    mockGet.mockResolvedValue({ results: mockMovies, total_pages: 5, total_results: 15, page: 1 });

    render(<FeaturedStreaming platform="netflix" />);

    expect(await screen.findByText('Stream Movie 1')).toBeInTheDocument();
    expect(screen.getByText('Stream Movie 3')).toBeInTheDocument();
  });

  it('toggles between filmes and series tabs', async () => {
    const user = userEvent.setup();
    mockGet.mockResolvedValue({ results: mockMovies, total_pages: 5, total_results: 15, page: 1 });

    render(<FeaturedStreaming platform="netflix" />);

    mockGet.mockResolvedValue({ results: mockSeries, total_pages: 3, total_results: 9, page: 1 });

    await user.click(screen.getByText('Séries'));

    expect(await screen.findByText('Stream Series 1')).toBeInTheDocument();
  });

  it('formats platform name', async () => {
    mockGet.mockResolvedValue({ results: mockMovies, total_pages: 5, total_results: 15, page: 1 });

    render(<FeaturedStreaming platform="amazon-prime-video" />);

    expect(await screen.findByText(/Amazon Prime Video/)).toBeInTheDocument();
  });

  it('displays page number when totalPages > 1', async () => {
    mockGet.mockResolvedValue({ results: mockMovies, total_pages: 10, total_results: 200, page: 1 });

    render(<FeaturedStreaming platform="netflix" />);

    expect(await screen.findByText(/Página 1/)).toBeInTheDocument();
  });

  it('highlights active tab', async () => {
    const user = userEvent.setup();
    mockGet.mockResolvedValue({ results: mockMovies, total_pages: 5, total_results: 15, page: 1 });

    render(<FeaturedStreaming platform="netflix" />);

    await user.click(screen.getByText('Séries'));

    const seriesTab = screen.getByText('Séries');
    expect(seriesTab.className).toContain('bg-gold-500');
  });
});
