import { get } from '@/src/services/api';
import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import Link from 'next/link';
import { FaImage } from 'react-icons/fa';

const TMDB_BASE_IMAGE_URL = "https://image.tmdb.org/t/p/original"; // Base URL para imagens do TMDB

const SeriesCarouselBanner = () => {
    const [series, setSeries] = useState([]);
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
        get(`https://api.themoviedb.org/3/tv/on_the_air?language=pt-BR&page=1`).then((res) => {
            if (res && res.results) {
                const sortedSeries = res.results
                    .sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date))
                    .slice(0, 10);
                setSeries(sortedSeries);
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
                    series.map((serie) => (
                        <article key={serie.id} className="relative">
                            <picture>
                                <source media="(min-width: 768px)" srcSet={`${TMDB_BASE_IMAGE_URL}${serie.backdrop_path}`} />
                                <img
                                    src={`${TMDB_BASE_IMAGE_URL}${serie.poster_path}`}
                                    alt={`Imagem promocional da série ${serie.name}`}
                                    className="h-[40rem] w-full object-cover"
                                    loading="lazy"
                                />
                            </picture>
                            <div className="absolute inset-0 flex items-center justify-center w-1/2">
                                <div className="bg-black p-4 text-white flex flex-col gap-4 rounded-2xl opacity-90">
                                    <h2 className="text-2xl font-bold">{serie.name}</h2>
                                    <p className="lg:block hidden">{serie.overview}</p>
                                    <time dateTime={serie.first_air_date}>Lançamento: {convertDate(serie.first_air_date)}</time>
                                    <p>Nota: {serie.vote_average}</p>
                                    <Link href={`/serie/${encodeURIComponent(serie.name.toLowerCase().replace(/ /g, '-'))}`}>
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

export default SeriesCarouselBanner;
