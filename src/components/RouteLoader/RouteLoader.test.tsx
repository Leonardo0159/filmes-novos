import { render, screen, act } from '@testing-library/react';
import RouteLoader from '.';

const mockOn = vi.fn();
const mockOff = vi.fn();
let routeChangeStartHandler: () => void;
let routeChangeCompleteHandler: () => void;
let routeChangeErrorHandler: () => void;

vi.mock('next/router', () => ({
  useRouter: vi.fn(() => ({
    events: {
      on: vi.fn((event: string, handler: () => void) => {
        if (event === 'routeChangeStart') routeChangeStartHandler = handler;
        if (event === 'routeChangeComplete') routeChangeCompleteHandler = handler;
        if (event === 'routeChangeError') routeChangeErrorHandler = handler;
      }),
      off: mockOff,
    },
  })),
}));

describe('RouteLoader', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders nothing initially', () => {
    const { container } = render(<RouteLoader />);
    expect(container.innerHTML).toBe('');
  });

  it('registers router events on mount', () => {
    render(<RouteLoader />);
    expect(routeChangeStartHandler).toBeDefined();
    expect(routeChangeCompleteHandler).toBeDefined();
    expect(routeChangeErrorHandler).toBeDefined();
  });

  it('unregisters router events on unmount', () => {
    const { unmount } = render(<RouteLoader />);
    unmount();
    expect(mockOff).toHaveBeenCalledWith('routeChangeStart', routeChangeStartHandler);
    expect(mockOff).toHaveBeenCalledWith('routeChangeComplete', routeChangeCompleteHandler);
    expect(mockOff).toHaveBeenCalledWith('routeChangeError', routeChangeErrorHandler);
  });

  it('shows loading bar on routeChangeStart', () => {
    render(<RouteLoader />);

    act(() => {
      routeChangeStartHandler();
    });

    const loadingBar = document.querySelector('.animate-loading-bar');
    expect(loadingBar).toBeInTheDocument();
  });

  it('shows overlay after 300ms delay', () => {
    render(<RouteLoader />);

    act(() => {
      routeChangeStartHandler();
    });

    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('hides overlay on routeChangeComplete', () => {
    render(<RouteLoader />);

    act(() => {
      routeChangeStartHandler();
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Carregando...')).toBeInTheDocument();

    act(() => {
      routeChangeCompleteHandler();
    });

    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
  });

  it('hides overlay on routeChangeError', () => {
    render(<RouteLoader />);

    act(() => {
      routeChangeStartHandler();
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText('Carregando...')).toBeInTheDocument();

    act(() => {
      routeChangeErrorHandler();
    });

    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
  });
});
