export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  popularity: number;
  genre_ids?: number[];
  genres?: TMDBGenre[];
  runtime?: number;
}

export interface TMDBSeries {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  popularity: number;
  genre_ids?: number[];
  genres?: TMDBGenre[];
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TMDBWatchProvider {
  provider_name: string;
  logo_path: string;
}

export interface TMDBVideo {
  key: string;
  type: string;
  site: string;
  name: string;
}

export interface TMDBPaginatedResponse<T> {
  results: T[];
  total_pages: number;
  total_results: number;
  page: number;
}
