import { render, screen } from '@testing-library/react';
import Home from '@/src/pages/index';

vi.mock('@/src/components/Header', () => ({ Header: vi.fn(() => <header data-testid="header" />) }));
vi.mock('@/src/components/Footer', () => ({ Footer: vi.fn(() => <footer data-testid="footer" />) }));
vi.mock('@/src/components/CarouselBanner', () => ({ default: vi.fn(() => <div data-testid="carousel" />) }));
vi.mock('@/src/components/FeaturedMovies', () => ({ default: vi.fn(() => <div data-testid="featured-movies" />) }));

describe('Home page', () => {
  it('renders Header, Carousel, FeaturedMovies, and Footer', () => {
    render(<Home />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('featured-movies')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });


});
