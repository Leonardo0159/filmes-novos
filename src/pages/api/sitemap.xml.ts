import { get } from '@/src/services/api';
import type { NextApiRequest, NextApiResponse } from 'next';

interface TMDBItem {
  id: number;
  title?: string;
  name?: string;
}

interface TMDBResponse {
  results: TMDBItem[];
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const numberOfPagesToFetch = 50;
        let movies: TMDBItem[] = [];
        let series: TMDBItem[] = [];

        for (let i = 1; i <= numberOfPagesToFetch; i++) {
            const movieResponse = await get(`https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=${i}`) as TMDBResponse | null;
            if (movieResponse?.results) {
              movies = movies.concat(movieResponse.results);
            }
        }

        for (let i = 1; i <= numberOfPagesToFetch; i++) {
            const seriesResponse = await get(`https://api.themoviedb.org/3/tv/popular?language=pt-BR&page=${i}`) as TMDBResponse | null;
            if (seriesResponse?.results) {
              series = series.concat(seriesResponse.results);
            }
        }

        const baseUrl = 'https://filmesnovos.com.br';

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${movies
                .map(movie => {
                    const slug = encodeURIComponent((movie.title ?? '').toLowerCase().replace(/ /g, '-'));
                    return `
                <url>
                    <loc>${baseUrl}/filme/${slug}</loc>
                    <lastmod>${new Date().toISOString()}</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.9</priority>
                </url>
            `;
                })
                .join('')}
    ${series
                .map(serie => {
                    const slug = encodeURIComponent((serie.name ?? '').toLowerCase().replace(/ /g, '-'));
                    return `
                <url>
                    <loc>${baseUrl}/serie/${slug}</loc>
                    <lastmod>${new Date().toISOString()}</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.9</priority>
                </url>
            `;
                })
                .join('')}
</urlset>
`;

        res.setHeader('Content-Type', 'text/xml');
        res.write(sitemap);
        res.end();
    } catch {
        res.status(500);
        res.end();
    }
};
