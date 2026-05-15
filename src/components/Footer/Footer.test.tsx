import { render, screen } from '@testing-library/react';
import { Footer } from '.';

vi.mock('@/src/components/Logo', () => ({
  Logo: vi.fn(() => <div data-testid="logo">Logo</div>),
}));

describe('Footer', () => {
  it('renders Logo with footer variant', () => {
    render(<Footer />);
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Footer />);
    expect(screen.getByText('Filmes')).toBeInTheDocument();
    expect(screen.getByText('Séries')).toBeInTheDocument();
    expect(screen.getByText('Catálogo Netflix')).toBeInTheDocument();
    expect(screen.getByText('Catálogo Prime Video')).toBeInTheDocument();
  });

  it('renders Navegar section heading', () => {
    render(<Footer />);
    expect(screen.getByText('Navegar')).toBeInTheDocument();
  });

  it('renders Contato section heading', () => {
    render(<Footer />);
    expect(screen.getByText('Contato')).toBeInTheDocument();
  });

  it('renders contact email', () => {
    render(<Footer />);
    expect(screen.getByText(/leo\.sn159@gmail\.com/)).toBeInTheDocument();
  });

  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2023 Filmes Novos/)).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<Footer />);
    expect(screen.getByText(/Seu guia definitivo/)).toBeInTheDocument();
  });
});
