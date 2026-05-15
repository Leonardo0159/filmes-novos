import { render, screen } from '@testing-library/react';
import Series from '@/src/pages/series/index';

vi.mock('@/src/components/Header', () => ({ Header: vi.fn(() => <header data-testid="header" />) }));
vi.mock('@/src/components/Footer', () => ({ Footer: vi.fn(() => <footer data-testid="footer" />) }));
vi.mock('@/src/components/SeriesCarouselBanner', () => ({ default: vi.fn(() => <div data-testid="series-carousel" />) }));
vi.mock('@/src/components/FeaturedSeries', () => ({ default: vi.fn(() => <div data-testid="featured-series" />) }));

describe('Series page', () => {
  it('renders Header, SeriesCarousel, FeaturedSeries, and Footer', () => {
    render(<Series />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('series-carousel')).toBeInTheDocument();
    expect(screen.getByTestId('featured-series')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });


});
