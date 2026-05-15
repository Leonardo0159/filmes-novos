import { render, screen } from '@testing-library/react';
import DisqusComments from '.';

vi.mock('disqus-react', () => ({
  DiscussionEmbed: vi.fn(({ shortname, config }) => (
    <div data-testid="disqus-embed" data-shortname={shortname} data-identifier={config.identifier} data-title={config.title} />
  )),
}));

describe('DisqusComments', () => {
  it('renders DiscussionEmbed with correct shortname', () => {
    render(<DisqusComments post={{ id: 123, title: 'Test Movie' }} />);
    const embed = screen.getByTestId('disqus-embed');
    expect(embed).toHaveAttribute('data-shortname', 'https-www-filmesnovos-com-br');
  });

  it('passes post id as identifier', () => {
    render(<DisqusComments post={{ id: 456, title: 'Test Movie' }} />);
    const embed = screen.getByTestId('disqus-embed');
    expect(embed).toHaveAttribute('data-identifier', '456');
  });

  it('uses title from post', () => {
    render(<DisqusComments post={{ id: 1, title: 'Inception' }} />);
    const embed = screen.getByTestId('disqus-embed');
    expect(embed).toHaveAttribute('data-title', 'Inception');
  });

  it('uses name as fallback when title is absent', () => {
    render(<DisqusComments post={{ id: 1, name: 'Breaking Bad' }} />);
    const embed = screen.getByTestId('disqus-embed');
    expect(embed).toHaveAttribute('data-title', 'Breaking Bad');
  });

  it('uses "Sem título" when no title or name', () => {
    render(<DisqusComments post={{ id: 1 }} />);
    const embed = screen.getByTestId('disqus-embed');
    expect(embed).toHaveAttribute('data-title', 'Sem título');
  });
});
