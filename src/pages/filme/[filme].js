import Head from 'next/head';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { get } from '@/src/services/api';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-WBBLV0VBLB');

const TMDB_BASE_IMAGE_URL = "https://image.tmdb.org/t/p/original";

const MovieDetail = ({ movie, trailerKey, watchProviders, inTheaters }) => {

    function getProviderUrl(providerName) {
        console.log(providerName)
        switch (providerName) {
            case 'Netflix':
                return 'https://www.netflix.com/';
            case 'Netflix basic with Ads':
                return 'https://www.netflix.com/';
            case 'HBO Max':
                return 'https://www.hbomax.com/';
            case 'Amazon Prime Video':
                return 'https://www.primevideo.com/';
            case 'Star Plus':
                return 'https://www.starplus.com/';
            case 'Paramount Plus':
                return 'https://www.paramountplus.com/';
            case 'Globoplay':
                return 'https://globoplay.globo.com/';
            case 'NOW':
                return 'https://www.clarotvmais.com.br/';
            case 'Paramount+ Amazon Channel':
                return 'https://www.primevideo.com/';
            case 'Paramount Plus Apple TV Channel':
                return 'https://www.apple.com/br/apple-tv-plus/';
            case 'Apple TV Plus':
                return 'https://www.apple.com/br/apple-tv-plus/';
            case 'Oi Play':
                return 'https://logintv.oi.com.br/';
            case 'Disney Plus':
                return 'https://www.disneyplus.com/';
            case 'Crunchyroll':
                return 'https://www.crunchyroll.com/';
            case 'Funimation Now':
                return 'https://www.funimation.com/';
            // Adicione mais cases conforme necessário
            default:
                return '#';  // retorna um link placeholder ou pode retornar null se preferir
        }
    }

    function handleLinkClick(providerName) {
        ReactGA.event({
            category: 'Watch Provider',
            action: 'Click',
            label: providerName
        });
    }

    return (
        <div>
            <Head>
                <title>{movie ? `${movie.title} - Resumo, Notas e Mais` : 'Carregando...'} | Filmes Novos</title>
                <meta name="description" content={movie ? `${movie.title}: ${movie.overview.substring(0, 155)}...` : 'Carregando...'} />
                <link rel="icon" href="/favicon.ico" />

                {/* Open Graph Tags */}
                {movie && (
                    <>
                        <meta property="og:title" content={`${movie.title} - Resumo, Notas e Mais | Filmes Novos`} />
                        <meta property="og:description" content={movie.overview.substring(0, 155)} />
                        <meta property="og:image" content={`${TMDB_BASE_IMAGE_URL}${movie.backdrop_path}`} />
                        <meta property="og:type" content="website" />
                    </>
                )}
            </Head>

            <Header />
            <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {movie ? (
                    <div>
                        <div className='flex flex-col md:flex-row gap-4 md:gap-12'>
                            <div className='flex-1'>
                                <img
                                    src={`${TMDB_BASE_IMAGE_URL}${movie.backdrop_path}`}
                                    alt={`Imagem de fundo do filme ${movie.title}`}
                                    className="w-full object-contain mb-8 rounded-lg shadow-md"
                                />
                            </div>
                            <div className='flex-1'>
                                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                                <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-lg mb-6">Nota: {movie.vote_average}</span>
                                <h2 className="text-2xl font-semibold mb-4">Sinopse</h2>
                                <p className="mb-8">{movie.overview}</p>
                                {/* TODO: Add buttons or links for other actions. */}
                            </div>
                        </div>

                        <div className='mt-6 relative border border-gray-500 rounded-xl p-6 bg-white shadow-lg'>
                            <h3 className='text-xl md:text-3xl font-bold text-center text-gray-800 absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white px-4'>
                                Onde posso assistir?
                            </h3>
                            {watchProviders.map((provider, index) => (
                                <a
                                    href={getProviderUrl(provider.provider_name)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    key={index}
                                    className='flex flex-row mt-4 items-center justify-center gap-4 text-xl font-bold mb-4 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-md hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg transform transition-all'
                                    onClick={() => handleLinkClick(provider.provider_name)}  // Adicione esta linha
                                >
                                    Assista agora no: <img
                                        src={`${TMDB_BASE_IMAGE_URL}${provider.logo_path}`}
                                        alt={`Imagem de fundo do filme ${movie.title}`}
                                        className="rounded w-16 h-16"
                                    />
                                </a>
                            ))}
                            {watchProviders.length === 0 && inTheaters && (
                                <p className='flex flex-row mt-4 items-center justify-center text-xl font-bold mb-4 p-4 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-md'>
                                    Em cartaz nos cinemas!
                                </p>
                            )}
                        </div>

                        {trailerKey && (
                            <div className='h-[14rem] md:h-[44rem] rounded-lg'>
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${trailerKey}`}
                                    frameborder="0"
                                    allowfullscreen
                                    className="mt-8 rounded-lg"
                                ></iframe>
                            </div>
                        )}

                    </div>
                ) : (
                    <div className="flex justify-center items-center min-h-screen">
                        {/* Replace the following with a spinner or loading component */}
                        <div className="spinner"></div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export async function getServerSideProps(context) {
    const { filme } = context.params;

    // Fetch movie details
    const searchUrl = `https://api.themoviedb.org/3/search/movie?language=pt-BR&query=${filme}`;
    const response = await get(searchUrl);

    // Verifica se o filme foi encontrado
    if (!response.results || response.results.length === 0) {
        return {
            props: {
                movie: null,
                trailerKey: null
            }
        };
    }

    const movie = response.results[0];

    // Fetch movie trailer
    const trailerUrl = `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=pt-BR`;
    const trailerResponse = await get(trailerUrl);
    const trailer = trailerResponse.results.find(video => video.type === "Trailer" && video.site === "YouTube");

    // Fetch watch providers
    const watchProvidersUrl = `https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?&language=pt-BR`;
    const watchProvidersResponse = await get(watchProvidersUrl);
    const watchProviders = watchProvidersResponse.results && watchProvidersResponse.results.BR
        ? watchProvidersResponse.results.BR.flatrate
        : [];

    // Fetch movies that are currently playing
    const nowPlayingUrl = `https://api.themoviedb.org/3/movie/now_playing?language=pt-BR&page=1`;
    const nowPlayingResponse = await get(nowPlayingUrl);
    const isPlaying = nowPlayingResponse.results.some(currentMovie => currentMovie.id === movie.id);

    return {
        props: {
            movie,
            trailerKey: trailer ? trailer.key : null,
            watchProviders,
            inTheaters: isPlaying
        }
    };
}

export default MovieDetail;
