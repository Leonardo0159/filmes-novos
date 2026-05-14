import Head from 'next/head';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { get } from '@/src/services/api';
import ReactGA from 'react-ga4';
import DisqusComments from '@/src/components/DisqusComments';
import { FaStar, FaCalendar, FaClock } from 'react-icons/fa';

ReactGA.initialize('G-WBBLV0VBLB');

const TMDB_BASE_IMAGE_URL = "https://image.tmdb.org/t/p/original";

const MovieDetail = ({ movie, trailerKey, watchProviders, inTheaters, cast }) => {

    function getProviderUrl(providerName) {
        switch (providerName) {
            case 'Netflix': return 'https://www.netflix.com/';
            case 'Netflix basic with Ads': return 'https://www.netflix.com/';
            case 'HBO Max': return 'https://www.hbomax.com/';
            case 'Amazon Prime Video': return 'https://amzn.to/4egLU7v';
            case 'Star Plus': return 'https://www.starplus.com/';
            case 'Paramount Plus': return 'https://www.paramountplus.com/';
            case 'Globoplay': return 'https://globoplay.globo.com/';
            case 'NOW': return 'https://www.clarotvmais.com.br/';
            case 'Paramount+ Amazon Channel': return 'https://www.primevideo.com/offers/?benefitId=paramountplusbr&_encoding=UTF8&tag=leonardo045-20&linkCode=ur2&linkId=b9a5fd1a3b2119291087918391546a47&camp=1789&creative=9325';
            case 'Paramount Plus Apple TV Channel': return 'https://www.apple.com/br/apple-tv-plus/';
            case 'Apple TV Plus': return 'https://www.apple.com/br/apple-tv-plus/';
            case 'Oi Play': return 'https://logintv.oi.com.br/';
            case 'Disney Plus': return 'https://www.disneyplus.com/';
            case 'Crunchyroll': return 'https://www.crunchyroll.com/';
            case 'Funimation Now': return 'https://www.funimation.com/';
            case 'Looke': return 'https://www.primevideo.com/offers/?benefitId=lookebr&tag=leonardo045-20';
            case 'Looke Amazon Channel': return 'https://www.primevideo.com/offers/?benefitId=lookebr&tag=leonardo045-20';
            case 'Starz Play Amazon Channel': return 'https://www.primevideo.com/offers/?benefitId=starzplaybr&tag=leonardo045-20';
            case 'Lionsgate Plus': return 'https://www.primevideo.com/offers/?benefitId=starzplaybr&tag=leonardo045-20';
            default: return '#';
        }
    }

    function handleLinkClick(providerName) {
        ReactGA.event({
            category: 'Watch Provider',
            action: 'Click Link Streaming',
            label: providerName
        });
    }

    return (
        <div className="min-h-screen bg-cinema-900">
            <Head>
                <title>{movie ? `${movie.title} - Resumo, Notas e Mais` : 'Carregando...'} | Filmes Novos</title>
                <meta name="description" content={movie ? `${movie.title}: ${movie.overview?.substring(0, 155)}...` : 'Carregando...'} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta charSet="utf-8" />
                <meta property="og:image" content="/FN.png" />
                <meta property="og:image:width" content="183" />
                <meta property="og:image:height" content="224" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ''} />
                <link rel="icon" href="/favicon.ico" />
                {movie && (
                    <>
                        <meta property="og:title" content={`${movie.title} - Resumo, Notas e Mais | Filmes Novos`} />
                        <meta property="og:description" content={movie.overview?.substring(0, 155)} />
                    </>
                )}
            </Head>

            <Header />

            {movie ? (
                <>
                    <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
                        <img
                            src={`${TMDB_BASE_IMAGE_URL}${movie.backdrop_path}`}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-cinema-900 via-cinema-900/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-cinema-900/80 via-transparent to-transparent" />
                    </div>

                    <main className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 md:-mt-64 z-10">
                        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                            <div className="flex-shrink-0 w-full md:w-80">
                                <div className="rounded-2xl overflow-hidden shadow-2xl card-gradient-border">
                                    <img
                                        src={`${TMDB_BASE_IMAGE_URL}${movie.poster_path}`}
                                        alt={movie.title}
                                        className="w-full aspect-[2/3] object-cover"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 pt-4 md:pt-16">
                                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{movie.title}</h1>

                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <span className="flex items-center gap-2 bg-gold-500/10 text-gold-500 px-3 py-1.5 rounded-full text-sm font-semibold">
                                        <FaStar className="text-gold-500" /> {movie.vote_average?.toFixed(1)}
                                    </span>
                                    {movie.release_date && (
                                        <span className="flex items-center gap-2 text-gray-400 text-sm">
                                            <FaCalendar className="text-gold-500" /> {new Date(movie.release_date).toLocaleDateString('pt-BR')}
                                        </span>
                                    )}
                                    {movie.runtime && (
                                        <span className="flex items-center gap-2 text-gray-400 text-sm">
                                            <FaClock className="text-gold-500" /> {Math.floor(movie.runtime / 60)}h{movie.runtime % 60}m
                                        </span>
                                    )}
                                    {movie.genres && movie.genres.map(g => (
                                        <span key={g.id} className="glass px-3 py-1 rounded-full text-xs text-gray-300">{g.name}</span>
                                    ))}
                                </div>

                                <div className="glass rounded-2xl p-6 mb-8">
                                    <h2 className="text-xl font-bold text-gold-500 mb-3 uppercase tracking-wider">Sinopse</h2>
                                    <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                                </div>

                                {watchProviders && watchProviders.length > 0 && (
                                    <div className="glass rounded-2xl p-6 mb-8">
                                        <h3 className="text-xl font-bold text-gold-500 mb-4 uppercase tracking-wider">Onde Assistir</h3>
                                        <div className="flex flex-wrap gap-3">
                                            {watchProviders.map((provider, index) => (
                                                <a key={index}
                                                    href={getProviderUrl(provider.provider_name)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => handleLinkClick(provider.provider_name)}
                                                    className="flex items-center gap-3 px-5 py-3 bg-cinema-700 hover:bg-cinema-600 rounded-xl transition-colors border border-gold-500/10 hover:border-gold-500/30">
                                                    <img src={`${TMDB_BASE_IMAGE_URL}${provider.logo_path}`} alt={provider.provider_name} className="w-8 h-8 rounded-lg" />
                                                    <span className="text-sm font-semibold text-white">{provider.provider_name}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {watchProviders && watchProviders.length === 0 && inTheaters && (
                                    <div className="glass rounded-2xl p-6 mb-8">
                                        <p className="text-lg font-semibold text-red-400">Em cartaz nos cinemas!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {trailerKey && (
                            <div className="mt-12">
                                <h3 className="text-2xl font-bold text-gold-500 mb-4 uppercase tracking-wider">Trailer</h3>
                                <div className="aspect-video rounded-2xl overflow-hidden glass">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${trailerKey}`}
                                        frameBorder="0"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                            </div>
                        )}

                        {cast && cast.length > 0 && (
                            <div className="mt-12">
                                <h3 className="text-2xl font-bold text-gold-500 mb-6 uppercase tracking-wider">Elenco Principal</h3>
                                <div className="flex gap-4 overflow-x-auto pb-4">
                                    {cast.slice(0, 10).map(actor => (
                                        <div key={actor.id} className="flex-shrink-0 w-28 text-center">
                                            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-2 ring-2 ring-gold-500/20">
                                                {actor.profile_path ? (
                                                    <img src={`${TMDB_BASE_IMAGE_URL}${actor.profile_path}`} alt={actor.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-cinema-700 flex items-center justify-center text-gray-500 text-xs">Sem foto</div>
                                                )}
                                            </div>
                                            <p className="text-sm font-semibold text-white truncate">{actor.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{actor.character}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <DisqusComments post={movie} />
                    </main>
                </>
            ) : (
                <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
                    <div className="spinner"></div>
                </main>
            )}

            <Footer />
        </div>
    );
};

export async function getServerSideProps(context) {
    const { filme } = context.params;

    const searchUrl = `https://api.themoviedb.org/3/search/movie?language=pt-BR&query=${filme}`;
    const response = await get(searchUrl);

    if (!response.results || response.results.length === 0) {
        return { props: { movie: null, trailerKey: null } };
    }

    const movie = response.results[0];

    const [trailerResponse, watchProvidersResponse, nowPlayingResponse, creditsResponse] = await Promise.all([
        get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?language=pt-BR`),
        get(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?language=pt-BR`),
        get(`https://api.themoviedb.org/3/movie/now_playing?language=pt-BR&page=1`),
        get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?language=pt-BR`),
    ]);

    const trailer = trailerResponse?.results?.find(video => video.type === "Trailer" && video.site === "YouTube");
    const watchProviders = watchProvidersResponse?.results?.BR?.flatrate || [];
    const isPlaying = nowPlayingResponse?.results?.some(m => m.id === movie.id);
    const cast = (creditsResponse?.cast || []).slice(0, 10).map(({ id, name, character, profile_path }) => ({ id, name, character, profile_path }));

    return {
        props: {
            movie,
            trailerKey: trailer ? trailer.key : null,
            watchProviders,
            inTheaters: isPlaying || false,
            cast,
        }
    };
}

export default MovieDetail;
