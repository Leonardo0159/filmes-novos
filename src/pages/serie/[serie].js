import { useRouter } from 'next/router';
import Head from 'next/head';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { get } from '@/src/services/api';
import ReactGA from 'react-ga4';
import FireTvComponent from '@/src/components/FireTvComponent';
import Image from 'next/image';
import EchoComponent from '@/src/components/EchoComponent';
import DisqusComments from '@/src/components/DisqusComments';

ReactGA.initialize('G-WBBLV0VBLB');

const TMDB_BASE_IMAGE_URL = "https://image.tmdb.org/t/p/original";

const SeriesDetail = ({ serie, trailerKey, watchProviders, cast, crew }) => {

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
                return 'https://www.primevideo.com/?&_encoding=UTF8&tag=leonardo045-20&linkCode=ur2&linkId=7c9e0037a5e3e1b66933e544844fa25a&camp=1789&creative=9325';
            case 'Star Plus':
                return 'https://www.starplus.com/';
            case 'Paramount Plus':
                return 'https://www.paramountplus.com/';
            case 'Globoplay':
                return 'https://globoplay.globo.com/';
            case 'NOW':
                return 'https://www.clarotvmais.com.br/';
            case 'Paramount+ Amazon Channel':
                return 'https://www.primevideo.com/offers/?benefitId=paramountplusbr&_encoding=UTF8&tag=leonardo045-20&linkCode=ur2&linkId=b9a5fd1a3b2119291087918391546a47&camp=1789&creative=9325';
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
            case 'Looke':
                return 'https://www.primevideo.com/offers/?benefitId=lookebr&tag=leonardo045-20';
            case 'Looke Amazon Channel':
                return 'https://www.primevideo.com/offers/?benefitId=lookebr&tag=leonardo045-20';
            case 'Starz Play Amazon Channel':
                return 'https://www.primevideo.com/offers/?benefitId=starzplaybr&tag=leonardo045-20';
            case 'Lionsgate Plus':
                return 'https://www.primevideo.com/offers/?benefitId=starzplaybr&tag=leonardo045-20';
            // Adicione mais cases conforme necessário
            default:
                return '#';  // retorna um link placeholder ou pode retornar null se preferir
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
        <div>
            <Head>
                <title>{serie ? `${serie.name} - Resumo, Notas e Mais` : 'Carregando...'} | Séries Novas</title>
                <meta name="description" content={serie ? `${serie.name}: ${serie.overview.substring(0, 155)}...` : 'Carregando...'} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta charSet="utf-8" />
                <meta property="og:image" content="/FN.png" />
                <meta property="og:image:width" content="183" />
                <meta property="og:image:height" content="224" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ''} />
                <link rel="icon" href="/favicon.ico" />
                {/* Open Graph Tags */}
                {serie && (
                    <>
                        <meta property="og:title" content={`${serie.name} - Resumo, Notas e Mais | Séries Novas`} />
                        <meta property="og:description" content={serie.overview.substring(0, 155)} />
                    </>
                )}
            </Head>

            <Header />
            <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {serie ? (
                    <div>
                        <div className='flex flex-col md:flex-row gap-4 md:gap-12'>
                            <div className='flex-1'>
                                <img
                                    src={`${TMDB_BASE_IMAGE_URL}${serie.backdrop_path}`}
                                    alt={`Imagem de fundo da série ${serie.name}`}
                                    className="w-full object-contain mb-8 rounded-lg shadow-md"
                                />
                            </div>
                            <div className='flex-1'>
                                <h1 className="text-4xl font-bold mb-2">{serie.name}</h1>
                                <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-lg mb-6">Nota: {serie.vote_average}</span>
                                <h2 className="text-2xl font-semibold mb-4">Sinopse</h2>
                                <p className="mb-8">{serie.overview}</p>
                                {/* TODO: Add buttons or links for other actions. */}
                            </div>
                        </div>

                        {watchProviders && watchProviders.length > 0 && (
                            <div className='mt-6 relative border border-gray-500 rounded-xl p-6 bg-white shadow-lg'>
                                <h3 className='text-xl md:text-3xl font-bold text-center text-gray-800 absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white px-4'>
                                    Onde posso assistir?
                                </h3>
                                {watchProviders && watchProviders.map((provider, index) => (
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
                                            alt={`Imagem de fundo do filme ${serie.name}`}
                                            className="rounded w-16 h-16"
                                        />
                                    </a>
                                ))}
                            </div>
                        )}


                        <FireTvComponent />

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

                        {cast && cast.length > 0 && (
                            <div className="mt-6 border border-gray-500 rounded-xl p-6 bg-white shadow-lg">
                                <h3 className='text-xl md:text-3xl font-bold text-center text-gray-800 mb-4'>
                                    Elenco Principal
                                </h3>
                                <div className='flex flex-wrap gap-6'>
                                    {cast.slice(0, 10).map(actor => (
                                        <div key={actor.id} className='flex flex-col items-center'>
                                            <img
                                                src={`${TMDB_BASE_IMAGE_URL}${actor.profile_path}`}
                                                alt={`Foto de ${actor.name}`}
                                                className="w-24 h-24 object-cover rounded-full mb-2"
                                            />
                                            <span className='text-md font-semibold'>{actor.name}</span>
                                            <span className='text-sm'>{actor.character}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <EchoComponent />

                        <DisqusComments post={serie} />

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
    const { serie: serieName } = context.params;

    // Fetch series details
    const searchUrl = `https://api.themoviedb.org/3/search/tv?language=pt-BR&query=${serieName}`;
    const response = await get(searchUrl);

    // Verifica se a série foi encontrada
    if (!response.results || response.results.length === 0) {
        return {
            props: {
                serie: null,
                trailerKey: null,
                watchProviders: []
            }
        };
    }

    const serie = response.results[0];

    // Fetch series trailer
    const trailerUrl = `https://api.themoviedb.org/3/tv/${serie.id}/videos?&language=pt-BR`;
    const trailerResponse = await get(trailerUrl);
    const trailer = trailerResponse.results.find(video => video.type === "Trailer" && video.site === "YouTube");

    // Fetch watch providers
    const watchProvidersUrl = `https://api.themoviedb.org/3/tv/${serie.id}/watch/providers?&language=pt-BR`;
    const watchProvidersResponse = await get(watchProvidersUrl);
    const watchProviders = watchProvidersResponse.results && watchProvidersResponse.results.BR
        ? watchProvidersResponse.results.BR.flatrate
        : [];

    const creditsUrl = `https://api.themoviedb.org/3/tv/${serie.id}/credits?language=pt-BR`;
    const creditsResponse = await get(creditsUrl);
    const cast = creditsResponse.cast;
    const crew = creditsResponse.crew;

    return {
        props: {
            serie,
            trailerKey: trailer ? trailer.key : null,
            watchProviders: watchProviders || null,
            cast,
            crew
        }
    };
}

export default SeriesDetail;
