import { get } from '@/src/services/api';
import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import Link from 'next/link';
import { FaImage } from 'react-icons/fa';
import Image from 'next/image';

const TMDB_BASE_IMAGE_URL = "https://image.tmdb.org/t/p/original"; // Base URL para imagens do TMDB

const CarouselBanner = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        autoplay: true,
        autoplaySpeed: 5000
    };

    useEffect(() => {
        get(`https://api.themoviedb.org/3/movie/now_playing?language=pt-BR&page=1`).then((res) => {
            if (res && res.results) {
                const sortedMovies = res.results
                    .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
                    .slice(0, 10);
                setMovies(sortedMovies);
                setIsLoading(false);
            }
        })
    }, []);

    function convertDate(dateString) {
        if (!dateString) {
            return '';
        }
        const [year, month, day] = dateString.split('-');
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    }

    const renderSkeleton = () => (
        <div className="animate-pulse">
            <div className="h-[40rem] w-full bg-gray-400 rounded flex justify-center items-center">
                <FaImage size={50} className="text-gray-500" /> {/* Ícone representando a imagem */}
            </div>
            <div className="p-4 mt-4 space-y-4">
                <div className="h-6 bg-gray-400 rounded w-1/2"></div>
                <div className="h-4 bg-gray-400 rounded"></div>
                <div className="h-4 bg-gray-400 rounded w-1/3"></div>
            </div>
        </div>
    );

    return (
        <div className="overflow-x-hidden overflow-y-hidden">
            <Slider {...settings} style={{ maxWidth: '100vw' }}>
                {isLoading ? (
                    Array(10).fill(0).map((_, idx) => <div key={idx}>{renderSkeleton()}</div>)
                ) : (
                    movies.map((movie) => (
                        <article key={movie.id} className="relative">
                            <div className="h-[40rem] w-full relative overflow-hidden">
                                <Image
                                    src={window.innerWidth >= 768
                                        ? `${TMDB_BASE_IMAGE_URL}${movie.backdrop_path}`
                                        : `${TMDB_BASE_IMAGE_URL}${movie.poster_path}`}
                                    alt={`Imagem promocional do filme ${movie.title}`}
                                    layout="fill"
                                    objectFit="cover"
                                    loading="lazy"  // Lazy loading
                                />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center w-1/2">
                                <div className="bg-black p-4 text-white flex flex-col gap-4 rounded-2xl opacity-90">
                                    <h2 className="text-2xl font-bold">{movie.title}</h2>
                                    <p className="lg:block hidden">{movie.overview}</p>
                                    <time dateTime={movie.release_date}>Lançamento: {convertDate(movie.release_date)}</time>
                                    <p>Nota: {movie.vote_average}</p>
                                    <Link href={`/filme/${encodeURIComponent(movie.title.toLowerCase().replace(/ /g, '-'))}`}>
                                        <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                                            Ver detalhes
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </Slider>
        </div>
    );
}

export default CarouselBanner;
