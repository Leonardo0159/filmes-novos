import { render, screen } from '@testing-library/react';
import { Logo } from '.';

describe('Logo', () => {
  it('renders header variant by default', () => {
    render(<Logo />);
    expect(screen.getByText('FILMES')).toBeInTheDocument();
    expect(screen.getByText('NOVOS')).toBeInTheDocument();
  });

  it('renders footer variant with larger sizes', () => {
    render(<Logo variant="footer" />);
    expect(screen.getByText('FILMES')).toHaveClass('text-3xl');
    expect(screen.getByText('NOVOS')).toHaveClass('text-xl');
  });

  it('renders header variant with smaller sizes', () => {
    render(<Logo variant="header" />);
    expect(screen.getByText('FILMES')).toHaveClass('text-xl');
    expect(screen.getByText('NOVOS')).toHaveClass('text-sm');
  });

  it('renders SVG with correct size for footer', () => {
    render(<Logo variant="footer" />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('width', '44');
    expect(svg).toHaveAttribute('height', '44');
  });

  it('renders SVG with correct size for header', () => {
    render(<Logo variant="header" />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('width', '36');
    expect(svg).toHaveAttribute('height', '36');
  });
});
