import { get } from '@/src/services/api';
import { useEffect, useState } from 'react';
import Slider from "react-slick";
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { getContentUrl } from '@/src/utils/navigation';
import type { StreamingCarouselProps, ContentItem, PlatformInfo } from './StreamingCarousel.interfaces';

const TMDB_BASE_IMAGE_URL = "https://image.tmdb.org/t/p/original";

const platformIds: PlatformInfo[] = [
  { id: 8, nome: "Netflix", logo: "/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg" },
  { id: 337, nome: "Disney Plus", logo: "/7rwgEs15tFwyR9NPQ5vpzxTj19Q.jpg" },
  { id: 119, nome: "Amazon Prime Video", logo: "/emthp39XA2YScoYL1p0sdbAH2WA.jpg" },
  { id: 619, nome: "Star Plus", logo: "/hR9vWd8hWEVQKD6eOnBneKRFEW3.jpg" },
  { id: 384, nome: "HBO Max", logo: "/Ajqyt5aNxNGjmF9uOfxArGrdf3X.jpg" },
  { id: 2, nome: "Apple TV", logo: "/peURlLlr8jggOwK53fJ5wdQl05y.jpg" },
];

const StreamingCarousel = ({ platform }: StreamingCarouselProps) => {
  const [movies, setMovies] = useState<ContentItem[]>([]);
  const [series, setSeries] = useState<ContentItem[]>([]);
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
    const platformId = platformIds.find(p => p.nome.toLowerCase().replace(/ /g, '-') === platform)?.id;

    if (platformId) {
      setIsLoading(true);
      Promise.all([
        get<{ results: ContentItem[] }>(`https://api.themoviedb.org/3/discover/movie?language=pt-BR&page=1&with_watch_providers=${platformId}&watch_region=BR`),
        get<{ results: ContentItem[] }>(`https://api.themoviedb.org/3/discover/tv?language=pt-BR&page=1&with_watch_providers=${platformId}&watch_region=BR`)
      ]).then(([movieData, seriesData]) => {
        if (movieData && movieData.results && seriesData && seriesData.results) {
          setMovies(movieData.results.slice(0, 5));
          setSeries(seriesData.results.slice(0, 5));
        }
        setIsLoading(false);
      });
    }
  }, [platform]);

  const combinedContent = [...movies, ...series];

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
          combinedContent.map((content, idx) => {
            const isMovie = content.hasOwnProperty('title');
            const title = (isMovie ? content.title : content.name) || '';
            const releaseDate = isMovie ? content.release_date : content.first_air_date;

            return (
              <article key={content.id} className="relative">
                <div className="h-[30rem] md:h-[40rem] w-full relative overflow-hidden">
                  <img
                    src={`${TMDB_BASE_IMAGE_URL}${content.backdrop_path}`}
                    alt={title}
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
                          <FaStar className="text-gold-500" /> {content.vote_average?.toFixed(1)}
                        </span>
                        <span className="text-gray-400 text-sm">{convertDate(releaseDate || '')}</span>
                      </div>
                      <h2 className="text-4xl md:text-6xl font-bold text-white mb-3">{title}</h2>
                      <p className="text-gray-300 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-6 leading-relaxed">{content.overview}</p>
                      <Link href={getContentUrl(content)}
                        className="btn-gold inline-block px-8 py-3 rounded-lg text-lg text-center">
                          Ver detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </Slider>
    </div>
  );
};

export default StreamingCarousel;
