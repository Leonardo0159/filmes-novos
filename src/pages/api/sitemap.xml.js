import { get } from '@/src/services/api';

export default async (req, res) => {
    try {
        const numberOfPagesToFetch = 25;
        let movies = [];
        let series = [];

        // Fetch popular movies
        for (let i = 1; i <= numberOfPagesToFetch; i++) {
            const movieResponse = await get(`https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=${i}`);
            movies = movies.concat(movieResponse.results);
        }

        // Fetch popular series
        for (let i = 1; i <= numberOfPagesToFetch; i++) {
            const seriesResponse = await get(`https://api.themoviedb.org/3/tv/popular?language=pt-BR&page=${i}`);
            series = series.concat(seriesResponse.results);
        }

        // Define the base URL for your site
        const baseUrl = 'https://filmesnovos.com.br';

        // Create the sitemap XML
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${movies
                .map(movie => {
                    const slug = encodeURIComponent(movie.title.toLowerCase().replace(/ /g, '-'));
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
                    const slug = encodeURIComponent(serie.name.toLowerCase().replace(/ /g, '-'));
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

        // Set the content type as XML and send the sitemap
        res.setHeader('Content-Type', 'text/xml');
        res.write(sitemap);
        res.end();
    } catch (e) {
        res.statusCode = 500;
        res.end();
    }
};
