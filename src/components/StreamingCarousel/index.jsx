import { get } from '@/src/services/api';
import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import Link from 'next/link';
import { FaImage } from 'react-icons/fa';
import Image from 'next/image';

const TMDB_BASE_IMAGE_URL = "https://image.tmdb.org/t/p/original"; // Base URL para imagens do TMDB

const StreamingCarousel = ({ platform }) => {
    const [movies, setMovies] = useState([]);
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
            get(`https://api.themoviedb.org/3/discover/movie?language=pt-BR&page=1&with_watch_providers=${platformId}&watch_region=BR`)
                .then((movieRes) => {
                    // Buscar 5 séries da plataforma especificada
                    get(`https://api.themoviedb.org/3/discover/tv?language=pt-BR&page=1&with_watch_providers=${platformId}&watch_region=BR`)
                        .then((seriesRes) => {
                            if (movieRes && movieRes.results && seriesRes && seriesRes.results) {
                                setMovies(movieRes.results.slice(0, 5));
                                setSeries(seriesRes.results.slice(0, 5));
                                setIsLoading(false);
                            }
                        });
                });
        } else {
            console.error(`Plataforma "${platform}" não encontrada`);
        }

    }, [platform]);

    // Combine filmes e séries em uma única lista
    const combinedContent = [...movies, ...series];

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
                    combinedContent.map((content) => {
                        const isMovie = content.hasOwnProperty('title'); // Check if it's a movie based on the presence of the 'title' property
                        const title = isMovie ? content.title : content.name;
                        const releaseDate = isMovie ? content.release_date : content.first_air_date;

                        return (
                            <article key={content.id} className="relative">
                                <div className="h-[40rem] w-full relative overflow-hidden">
                                    <Image
                                        src={window.innerWidth >= 768
                                            ? `${TMDB_BASE_IMAGE_URL}${content.backdrop_path}`
                                            : `${TMDB_BASE_IMAGE_URL}${content.poster_path}`}
                                        alt={`Imagem promocional de ${isMovie ? "filme" : "série"} ${title}`}
                                        layout="fill"
                                        objectFit="cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center w-1/2">
                                    <div className="bg-black p-4 text-white flex flex-col gap-4 rounded-2xl opacity-90">
                                        <h2 className="text-2xl font-bold">{title}</h2>
                                        <p className="lg:block hidden">{content.overview}</p>
                                        <time dateTime={releaseDate}>Lançamento: {convertDate(releaseDate)}</time>
                                        <p>Nota: {content.vote_average}</p>
                                        <Link href={`/${isMovie ? "filme" : "serie"}/${encodeURIComponent(title.toLowerCase().replace(/ /g, '-'))}`}>
                                            <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                                                Ver detalhes
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        );
                    })
                )}
            </Slider>
        </div>
    );
}

export default StreamingCarousel;
