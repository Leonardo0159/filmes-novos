import { get } from '@/src/services/api';
import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import type { TMDBMovie } from '@/src/types/tmdb';
import type { CarouselResponse } from './CarouselBanner.interfaces';
const TMDB_BASE_IMAGE_URL = "https://image.tmdb.org/t/p/original";

const CarouselBanner = () => {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    dotsClass: "slick-dots custom-dots",
  };

  useEffect(() => {
    get(`https://api.themoviedb.org/3/movie/now_playing?language=pt-BR&page=1`).then((res) => {
      const data = res as CarouselResponse | null;
      if (data && data.results) {
        const sorted = data.results
          .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
          .slice(0, 8);
        setMovies(sorted);
        setIsLoading(false);
      }
    });
  }, []);

  function convertDate(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  const renderSkeleton = () => (
    <div className="h-[30rem] md:h-[40rem] w-full skeleton-pulse rounded-none" />
  );

  return (
    <div className="overflow-hidden mt-16">
      <Slider {...settings}>
        {isLoading ? (
          Array(3).fill(0).map((_, idx) => <div key={idx}>{renderSkeleton()}</div>)
        ) : (
          movies.map((movie, idx) => (
            <article key={movie.id} className="relative">
              <div className="h-[30rem] md:h-[40rem] w-full relative overflow-hidden">
                <img
                  src={`${TMDB_BASE_IMAGE_URL}${movie.backdrop_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cinema-900 via-cinema-900/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-cinema-900/80 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16">
                <div className="max-w-screen-xl mx-auto">
                  <div className="max-w-xl animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center gap-1 text-gold-500 text-sm font-semibold">
                        <FaStar className="text-gold-500" /> {movie.vote_average?.toFixed(1)}
                      </span>
                      <span className="text-gray-400 text-sm">{convertDate(movie.release_date)}</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-3">{movie.title}</h2>
                    <p className="text-gray-300 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-6 leading-relaxed">{movie.overview}</p>
                    <Link href={`/filme/${encodeURIComponent(movie.title.toLowerCase().replace(/ /g, '-'))}`}>
                      <button className="btn-gold px-8 py-3 rounded-lg text-lg">
                        Ver detalhes
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </Slider>
    </div>
  );
};

export default CarouselBanner;
