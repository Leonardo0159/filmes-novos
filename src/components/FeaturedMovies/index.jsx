import { get } from '@/src/services/api';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';  // Importe o useRouter
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const TMDB_BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const FeaturedMovies = ({ initialPage }) => {
    const router = useRouter();
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(initialPage);  // Use initialPage aqui
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        // Atualize o currentPage se o query.pagina mudar
        if (router.isReady) {
            const pageFromQuery = Number(router.query.pagina) || 1;
            setCurrentPage(pageFromQuery);
        }
    }, [router.isReady, router.query.pagina]);

    useEffect(() => {
        const fetchMovies = async () => {
            const data = await get(`https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=${currentPage}`);
            if (data && data.results) {
                setMovies(data.results.slice(0, 20));
                setTotalPages(data.total_pages);
            }
        };

        fetchMovies();
    }, [currentPage]);

    useEffect(() => {
        if (currentPage) {
            router.push(`/?pagina=${currentPage}`, undefined, { shallow: true });
        }
    }, [currentPage]);

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

    return (
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 id='titulo' className="text-2xl mb-6 font-bold">Filmes Destaques</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map(movie => (
                    <li key={movie.id} className="rounded-lg overflow-hidden shadow-lg bg-white">
                        <Link href={`/filme/${encodeURIComponent(movie.title.toLowerCase().replace(/ /g, '-'))}`}>
                            <div aria-label={movie.title}>  {/* Descriptive link text */}
                                <img
                                    src={`${TMDB_BASE_IMAGE_URL}${movie.poster_path}`}
                                    alt={`Poster do filme ${movie.title}`}
                                    className="w-full object-cover h-auto"
                                    loading="lazy"  // Lazy loading
                                />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold">{movie.title}</h3>
                                    <p className="text-sm text-gray-500 mt-2">Lançamento: {convertDate(movie.release_date)}</p>
                                    <p className="text-sm text-gray-500 mt-2">Nota: {movie.vote_average}</p>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
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
    const pageQuery = context.query.pagina || 1;
    return {
        props: {
            initialPage: Number(pageQuery)  // Passe o valor da página como uma propriedade
        }
    };
}

export default FeaturedMovies;
