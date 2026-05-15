import { getMovieUrl, getSerieUrl, getContentUrl } from './navigation';

describe('getMovieUrl', () => {
  it('returns /filme/{slug}', () => {
    expect(getMovieUrl('Test Movie')).toBe('/filme/test-movie');
  });
});

describe('getSerieUrl', () => {
  it('returns /serie/{slug}', () => {
    expect(getSerieUrl('Test Serie')).toBe('/serie/test-serie');
  });
});

describe('getContentUrl', () => {
  it('returns movie URL when item has title', () => {
    expect(getContentUrl({ title: 'A Movie' })).toBe('/filme/a-movie');
  });

  it('returns series URL when item has name', () => {
    expect(getContentUrl({ name: 'A Series' })).toBe('/serie/a-series');
  });

  it('prefers title over name', () => {
    expect(getContentUrl({ title: 'Movie', name: 'Series' })).toBe('/filme/movie');
  });

  it('returns serie URL with empty slug for empty item', () => {
    expect(getContentUrl({})).toBe('/serie/');
  });
});
