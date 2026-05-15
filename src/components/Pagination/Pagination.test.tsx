import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '.';

describe('Pagination', () => {
  const onPageChange = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when totalPages <= 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={onPageChange} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders page numbers when totalPages > 1', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );
    expect(screen.getByLabelText('Página 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Página 5')).toBeInTheDocument();
  });

  it('highlights current page', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
    );
    const currentBtn = screen.getByLabelText('Página 3');
    expect(currentBtn).toHaveAttribute('aria-current', 'page');
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );
    expect(screen.getByLabelText('Página anterior')).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />
    );
    expect(screen.getByLabelText('Próxima página')).toBeDisabled();
  });

  it('calls onPageChange when clicking a page number', async () => {
    const user = userEvent.setup();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />
    );
    await user.click(screen.getByLabelText('Página 3'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when clicking next', async () => {
    const user = userEvent.setup();
    render(
      <Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />
    );
    await user.click(screen.getByLabelText('Próxima página'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange when clicking previous', async () => {
    const user = userEvent.setup();
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />
    );
    await user.click(screen.getByLabelText('Página anterior'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('shows ellipsis for large page ranges', () => {
    render(
      <Pagination currentPage={10} totalPages={50} onPageChange={onPageChange} />
    );
    const ellipsis = screen.getAllByText('...');
    expect(ellipsis.length).toBeGreaterThanOrEqual(1);
  });
});
