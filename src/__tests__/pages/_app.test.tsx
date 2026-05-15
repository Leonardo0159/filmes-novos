import { render, screen } from '@testing-library/react';
import App from '@/src/pages/_app';

vi.mock('@/src/components/RouteLoader', () => ({
  default: vi.fn(() => <div data-testid="route-loader" />),
}));

describe('App', () => {
  it('renders RouteLoader and the page component', () => {
    const MockComponent = () => <div data-testid="page-component">Page Content</div>;
    render(<App Component={MockComponent} pageProps={{}} />);

    expect(screen.getByTestId('route-loader')).toBeInTheDocument();
    expect(screen.getByTestId('page-component')).toBeInTheDocument();
  });
});
