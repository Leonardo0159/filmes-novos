import { render, screen } from '@testing-library/react';
import FeaturedSeries from '.';

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

const mockSeries = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  name: `Series ${i + 1}`,
  overview: `Overview ${i + 1}`,
  poster_path: `/p${i + 1}.jpg`,
  first_air_date: `2024-01-${String(i + 1).padStart(2, '0')}`,
  vote_average: 7 + i * 0.5,
  popularity: 100 - i * 10,
  genre_ids: [],
}));

describe('FeaturedSeries', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton initially', () => {
    mockGet.mockReturnValue(new Promise(() => {}));

    render(<FeaturedSeries />);
    const skeletons = document.querySelectorAll('.skeleton-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders series grid after data loads', async () => {
    mockGet.mockResolvedValue({ results: mockSeries, total_pages: 10, total_results: 50, page: 1 });

    render(<FeaturedSeries />);

    expect(await screen.findByText('Series 1')).toBeInTheDocument();
    expect(screen.getByText('Series 5')).toBeInTheDocument();
  });

  it('displays section title', async () => {
    mockGet.mockResolvedValue({ results: mockSeries, total_pages: 10, total_results: 50, page: 1 });

    render(<FeaturedSeries />);

    expect(await screen.findByText('Séries em Destaque')).toBeInTheDocument();
  });

  it('does not render pagination when totalPages is 1', async () => {
    mockGet.mockResolvedValue({ results: mockSeries, total_pages: 1, total_results: 5, page: 1 });

    render(<FeaturedSeries />);

    await screen.findByText('Series 1');
    expect(screen.queryByLabelText('Página anterior')).not.toBeInTheDocument();
  });
});
