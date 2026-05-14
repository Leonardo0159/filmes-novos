import { get } from '@/src/services/api';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import Pagination from '@/src/components/Pagination';

const TMDB_BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const FeaturedStreaming = ({ platform, initialPage }) => {
    const router = useRouter();
    const [items, setItems] = useState([]);
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
        { id: 8, nome: "Netflix" },
        { id: 337, nome: "Disney Plus" },
        { id: 119, nome: "Amazon Prime Video" },
        { id: 619, nome: "Star Plus" },
        { id: 384, nome: "HBO Max" },
        { id: 2, nome: "Apple TV" },
    ];

    useEffect(() => {
        const platformId = platformIds.find(p => p.nome.toLowerCase().replace(/ /g, '-') === platform)?.id;

        if (platformId) {
            setIsLoading(true);
            get(`https://api.themoviedb.org/3/discover/${contentType}?language=pt-BR&page=${currentPage}&with_watch_providers=${platformId}&watch_region=BR`)
                .then((res) => {
                    if (res && res.results) {
                        setItems(res.results.slice(0, 20));
                        setTotalPages(res.total_pages);
                    }
                    setIsLoading(false);
                });
        }
    }, [currentPage, platform, contentType]);

    useEffect(() => {
        if (currentPage) {
            router.push(`/catalago/${platform}?pagina=${currentPage}`, undefined, { shallow: true });
        }
    }, [currentPage, platform]);

    function convertDate(dateString) {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    function formatPlatformName(name) {
        return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <h2 id='titulo' className="text-3xl md:text-4xl font-bold text-white">
                    {contentType === 'movie' ? 'Filmes' : 'Séries'} em {formatPlatformName(platform)}
                </h2>
                <div className="flex items-center gap-3">
                    <div className="flex glass rounded-lg p-1">
                        <button onClick={() => { setContentType('movie'); setItems([]); setCurrentPage(1); }}
                            className={`px-5 py-2 rounded-md text-sm font-semibold tracking-wider uppercase transition-all ${contentType === 'movie' ? 'bg-gold-500 text-cinema-900' : 'text-gray-400 hover:text-white'}`}>
                            Filmes
                        </button>
                        <button onClick={() => { setContentType('tv'); setItems([]); setCurrentPage(1); }}
                            className={`px-5 py-2 rounded-md text-sm font-semibold tracking-wider uppercase transition-all ${contentType === 'tv' ? 'bg-gold-500 text-cinema-900' : 'text-gray-400 hover:text-white'}`}>
                            Séries
                        </button>
                    </div>
                    {!isLoading && totalPages > 1 && (
                        <span className="text-sm text-gray-500">Página {currentPage} de {totalPages}</span>
                    )}
                </div>
            </div>

            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {isLoading ? (
                    Array(20).fill(0).map((_, idx) => <li key={idx}>{renderSkeleton()}</li>)
                ) : (
                    items.map((item, idx) => {
                        const title = item.title || item.name;
                        const isMovie = contentType === 'movie';
                        return (
                            <li key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                                <Link href={`/${isMovie ? 'filme' : 'serie'}/${encodeURIComponent(title.toLowerCase().replace(/ /g, '-'))}`}>
                                    <div className="group cursor-pointer">
                                        <div className="relative rounded-xl overflow-hidden card-gradient-border">
                                            <img
                                                src={`${TMDB_BASE_IMAGE_URL}${item.poster_path}`}
                                                alt={title}
                                                className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-cinema-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <div className="absolute top-2 right-2 flex items-center gap-1 bg-cinema-900/80 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-gold-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <FaStar size={10} /> {item.vote_average?.toFixed(1)}
                                            </div>
                                        </div>
                                        <div className="mt-3 px-1">
                                            <h3 className="text-sm md:text-base font-semibold text-white truncate group-hover:text-gold-500 transition-colors">{title}</h3>
                                            <p className="text-xs text-gray-500 mt-1">{convertDate(item.release_date || item.first_air_date)}</p>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })
                )}
            </ul>

            {!isLoading && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            )}
        </section>
    );
}

export async function getServerSideProps(context) {
    const { nome } = context.params;
    const pageQuery = context.query.pagina || 1;
    return {
        props: {
            platform: nome,
            initialPage: Number(pageQuery)
        }
    };
}

export default FeaturedStreaming;
