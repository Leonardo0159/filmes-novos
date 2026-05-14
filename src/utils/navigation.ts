import { createSlug } from './slug';

export function getMovieUrl(title: string): string {
  return `/filme/${createSlug(title)}`;
}

export function getSerieUrl(name: string): string {
  return `/serie/${createSlug(name)}`;
}

export function getContentUrl(item: { title?: string; name?: string }): string {
  const title = item.title || item.name || '';
  const isMovie = !!item.title;
  return isMovie ? getMovieUrl(title) : getSerieUrl(title);
}
