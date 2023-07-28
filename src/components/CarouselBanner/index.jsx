import { get } from '@/src/services/api';
import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import Link from 'next/link';

const TMDB_BASE_IMAGE_URL = "https://image.tmdb.org/t/p/original"; // Base URL para imagens do TMDB

const CarouselBanner = () => {
    const [movies, setMovies] = useState([]);

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
                    .slice(0, 5);
                setMovies(sortedMovies);
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

    return (
        <Slider {...settings}>
            {movies.map((movie) => (
                <article key={movie.id} className="relative">
                    <picture>
                        <source media="(min-width: 768px)" srcSet={`${TMDB_BASE_IMAGE_URL}${movie.backdrop_path}`} />
                        <img
                            src={`${TMDB_BASE_IMAGE_URL}${movie.poster_path}`}
                            alt={`Imagem promocional do filme ${movie.title}`}
                            className="h-[40rem] w-full object-cover"
                            loading="lazy"  // Lazy loading
                        />
                    </picture>
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
            ))}
        </Slider>
    );
}

export default CarouselBanner;
