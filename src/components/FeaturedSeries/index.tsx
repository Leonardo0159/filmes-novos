import { get } from '@/src/services/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import Pagination from '@/src/components/Pagination';
import { getSerieUrl } from '@/src/utils/navigation';
import type { TMDBSeries, TMDBPaginatedResponse } from '@/src/types/tmdb';
import type { FeaturedSeriesProps } from './FeaturedSeries.interfaces';


const TMDB_BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const FeaturedSeries = ({ initialPage }: FeaturedSeriesProps) => {
  const router = useRouter();
  const [series, setSeries] = useState<TMDBSeries[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage ?? 1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      const pageFromQuery = Number(router.query.pagina) || 1;
      setCurrentPage(pageFromQuery);
    }
  }, [router.isReady, router.query.pagina]);

  useEffect(() => {
    const fetchSeries = async () => {
      setIsLoading(true);
      const data = await get<TMDBPaginatedResponse<TMDBSeries>>(`https://api.themoviedb.org/3/tv/popular?language=pt-BR&page=${currentPage}`);
      if (data && data.results) {
        setSeries(data.results);
        setTotalPages(data.total_pages);
      }
      setIsLoading(false);
    };
    fetchSeries();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/series?pagina=${page}`, undefined, { shallow: true });
  };

  function convertDate(dateString: string): string {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  }

  const renderSkeleton = () => (
    <div>
      <div className="rounded-xl overflow-hidden skeleton-pulse h-[340px] w-full"></div>
      <div className="p-4 space-y-2">
        <div className="h-5 skeleton-pulse rounded w-3/4"></div>
        <div className="h-4 skeleton-pulse rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 id="titulo" className="text-3xl md:text-4xl font-bold text-white">Séries em Destaque</h2>
        {!isLoading && totalPages > 1 && (
          <span className="text-sm text-gray-500">Página {currentPage} de {totalPages}</span>
        )}
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {isLoading ? (
          Array(20).fill(0).map((_, idx) => <li key={idx}>{renderSkeleton()}</li>)
        ) : (
          series.map((serie, idx) => (
            <li key={serie.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
              <Link href={getSerieUrl(serie.name)}>
                <div className="group cursor-pointer">
                  <div className="relative rounded-xl overflow-hidden card-gradient-border">
                    <img
                      src={`${TMDB_BASE_IMAGE_URL}${serie.poster_path}`}
                      alt={serie.name}
                      className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cinema-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-cinema-900/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-gold-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaStar size={10} /> {serie.vote_average?.toFixed(1)}
                    </div>
                  </div>
                  <div className="mt-3 px-1">
                    <h3 className="text-sm md:text-base font-semibold text-white truncate group-hover:text-gold-500 transition-colors">{serie.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{convertDate(serie.first_air_date)}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>

      {!isLoading && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </section>
  );
};

export default FeaturedSeries;
