export interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  popularity: number;
  type: 'movie' | 'series';
}

export interface PlatformLink {
  name: string;
  path: string;
}
