import { get } from '@/src/services/api';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Image from 'next/image';

const TMDB_BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const FeaturedStreaming = ({ platform, initialPage }) => {
    const router = useRouter();
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [contentType, setContentType] = useState('movie');

    useEffect(() => {
        if (router.isReady) {
            const pageFromQuery = Number(router.query.pagina) || 1;
            setCurrentPage(pageFromQuery);
        }
    }, [router.isReady, router.query.pagina]);

    const platformIds = [
        {
            id: 8,
            nome: "Netflix",
            logo: "/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg"
        },
        {
            id: 337,
            nome: "Disney Plus",
            logo: "/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg"
        },
        {
            id: 119,
            nome: "Amazon Prime Video",
            logo: "/emthp39XA2YScoYL1p0sdbAH2WA.jpg"
        },
        {
            id: 619,
            nome: "Star Plus",
            logo: "/hR9vWd8hWEVQKD6eOnBneKRFEW3.jpg"
        },
        {
            id: 384,
            nome: "HBO Max",
            logo: "/Ajqyt5aNxNGjmF9uOfxArGrdf3X.jpg"
        },
        {
            id: 2,
            nome: "Apple TV",
            logo: "/peURlLlr8jggOwK53fJ5wdQl05y.jpg"
        },
    ];

    useEffect(() => {
        // Encontrar o ID da plataforma com base no nome fornecido
        const platformId = platformIds.find(p => p.nome.toLowerCase().replace(/ /g, '-') === platform)?.id;

        if (platformId) {
            setIsLoading(true);

            // Buscar 5 filmes da plataforma especificada
            get(`https://api.themoviedb.org/3/discover/${contentType}?language=pt-BR&page=${currentPage}&with_watch_providers=${platformId}&watch_region=BR`)
                .then((movieRes) => {
                    if (movieRes && movieRes.results) {
                        setMovies(movieRes.results.slice(0, 20));
                        setTotalPages(movieRes.total_pages);
                    }
                    setIsLoading(false);
                });
        } else {
            console.error(`Plataforma "${platform}" não encontrada`);
        }
    }, [currentPage, platform, contentType]);

    useEffect(() => {
        if (currentPage) {
            router.push(`/catalago/${platform.toLowerCase()}?pagina=${currentPage}`, undefined, { shallow: true });
        }
    }, [currentPage, platform]);

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
        const element = document.getElementById('titulo');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
        const element = document.getElementById('titulo');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    function convertDate(dateString) {
        if (!dateString) {
            return '';
        }
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    const renderSkeleton = () => (
        <div className="animate-pulse">
            <div className="rounded-lg overflow-hidden shadow-lg bg-gray-300 h-64 w-full"></div>
            <div className="p-4">
                <div className="h-5 bg-gray-400 rounded w-3/4"></div>
                <div className="h-4 bg-gray-400 rounded mt-2 w-1/2"></div>
                <div className="h-4 bg-gray-400 rounded mt-2 w-1/4"></div>
            </div>
        </div>
    );

    function formatPlatformName(name) {
        return name
            .split('-')  // Divide a string em um array usando o hífen como delimitador.
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitaliza a primeira letra de cada palavra.
            .join(' ');  // Junta as palavras novamente usando espaço como delimitador.
    }

    const renderMovieOrSeriesItem = () => {
        if (contentType == "movie") {
            return (
                <>
                    <h2 id='titulo' className="text-2xl mb-6 font-bold">{`Filmes em ${formatPlatformName(platform)}`}</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {isLoading ? (
                            Array(20).fill(0).map((_, idx) => <li key={idx}>{renderSkeleton()}</li>)
                        ) : (
                            movies.map(movie => (
                                <li key={movie.id} className="rounded-lg overflow-hidden shadow-lg bg-white">
                                    <Link href={`/filme/${encodeURIComponent(movie.title.toLowerCase().replace(/ /g, '-'))}`}>
                                        <div aria-label={movie.title}>  {/* Descriptive link text */}
                                            <Image
                                                src={`${TMDB_BASE_IMAGE_URL}${movie.poster_path}`}
                                                alt={`Poster do filme ${movie.title}`}
                                                layout="responsive"
                                                height={500}
                                                width={342}
                                                className="w-full object-cover h-auto"
                                            />
                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold">{movie.title}</h3>
                                                <p className="text-sm text-gray-500 mt-2">Lançamento: {convertDate(movie.release_date)}</p>
                                                <p className="text-sm text-gray-500 mt-2">Nota: {movie.vote_average}</p>
                                                <p className="text-sm text-gray-500 mt-2">{movie.overview}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))
                        )}
                    </ul>
                </>
            )
        } else if (contentType == "tv") {
            return (
                <>
                    <h2 id='titulo' className="text-2xl mb-6 font-bold">{`Séries em ${formatPlatformName(platform)}`}</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {isLoading ? (
                            Array(20).fill(0).map((_, idx) => <li key={idx}>{renderSkeleton()}</li>)
                        ) : (
                            movies.map(movie => (
                                <li key={movie.id} className="rounded-lg overflow-hidden shadow-lg bg-white">
                                    <Link href={`/serie/${encodeURIComponent(movie.name.toLowerCase().replace(/ /g, '-'))}`}>
                                        <div aria-label={movie.name}>  {/* Descriptive link text */}
                                            <Image
                                                src={`${TMDB_BASE_IMAGE_URL}${movie.poster_path}`}
                                                alt={`Poster da serie ${movie.name}`}
                                                layout="responsive"
                                                height={500}
                                                width={342}
                                                className="w-full object-cover h-auto"
                                            />
                                            <div className="p-4">
                                                <h3 className="text-lg font-semibold">{movie.name}</h3>
                                                <p className="text-sm text-gray-500 mt-2">Lançamento: {convertDate(movie.release_date)}</p>
                                                <p className="text-sm text-gray-500 mt-2">Nota: {movie.vote_average}</p>
                                                <p className="text-sm text-gray-500 mt-2">{movie.overview}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))
                        )}
                    </ul>
                </>
            )
        } else {
            return (
                <>
                </>
            )
        }
    }

    const handleAba = (nome) => {
        if (contentType === nome) {
            return
        }
        setMovies([]);
        setCurrentPage(1);
        setContentType(nome)
    }

    return (
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => handleAba('movie')}
                    className={`px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-gold-500 hover:text-black 
        ${contentType === 'movie' ? 'bg-gold-500 text-black' : 'bg-black text-gold-500'}`}
                >
                    Filmes
                </button>
                <button
                    onClick={() => handleAba('tv')}
                    className={`px-6 py-3 rounded-lg transition-colors duration-200 hover:bg-gold-500 hover:text-black 
        ${contentType === 'tv' ? 'bg-gold-500 text-black' : 'bg-black text-gold-500'}`}
                >
                    Séries
                </button>
            </div>

            {renderMovieOrSeriesItem()}
            <div className="mt-6 flex justify-between items-center">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 p-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                >
                    <FaChevronLeft />
                    Anterior
                </button>
                <span className="text-gray-700 font-semibold">Página {currentPage} de {totalPages}</span>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 p-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                >
                    Próximo
                    <FaChevronRight />
                </button>
            </div>
        </section>
    );
}

export async function getServerSideProps(context) {
    const platform = context.query.platform;
    const pageQuery = context.query.pagina || 1;

    return {
        props: {
            platform,
            initialPage: Number(pageQuery)
        }
    };
}

export default FeaturedStreaming;
