export interface PlatformId {
  id: number;
  nome: string;
}

export interface ContentItem {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average?: number;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
}

export interface FeaturedStreamingProps {
  platform: string;
  initialPage?: number;
}
