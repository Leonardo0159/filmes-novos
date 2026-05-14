export interface PlatformInfo {
  id: number;
  nome: string;
  logo: string;
}

export interface ContentItem {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
  vote_average?: number;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
}

export interface StreamingCarouselProps {
  platform: string;
}
