import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Header } from '.';

vi.mock('@/src/services/api', () => ({
  get: vi.fn(),
}));

const mockPush = vi.fn();
const mockOn = vi.fn();
const mockOff = vi.fn();

vi.mock('next/router', () => ({
  useRouter: vi.fn(() => ({
    events: { on: mockOn, off: mockOff },
    isReady: true,
    query: {},
    push: mockPush,
  })),
}));

vi.mock('@/src/components/Logo', () => ({
  Logo: vi.fn(() => <div data-testid="logo">Logo</div>),
}));

describe('Header', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Filmes')).toBeInTheDocument();
    expect(screen.getByText('Séries')).toBeInTheDocument();
    expect(screen.getByText('Catálogo')).toBeInTheDocument();
  });

  it('renders logo', () => {
    render(<Header />);
    expect(screen.getByTestId('logo')).toBeInTheDocument();
  });

  it('toggles platform dropdown on click', async () => {
    const user = userEvent.setup();
    render(<Header />);

    expect(screen.queryByText('Amazon Prime Video')).not.toBeInTheDocument();

    await user.click(screen.getByText('Catálogo'));

    expect(screen.getByText('Amazon Prime Video')).toBeInTheDocument();
    expect(screen.getByText('Netflix')).toBeInTheDocument();
    expect(screen.getByText('Disney Plus')).toBeInTheDocument();
  });
});
