import { get } from "@/src/services/api";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaSearch, FaAngleDown, FaTimes } from 'react-icons/fa';

export const Header = () => {
    const [hiddenMenu, setHiddenMenu] = useState("hidden");
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const togglePlatformDropdown = () => {
        setShowPlatformDropdown(prev => !prev);
    };

    const openMenu = () => {
        setHiddenMenu(prevState => (prevState === "hidden" ? "" : "hidden"));
    }

    const handleSearchChange = async (e) => {
        setQuery(e.target.value);

        if (e.target.value.trim()) {
            const queryParam = e.target.value;

            const searchMoviesUrl = `https://api.themoviedb.org/3/search/movie?language=pt-BR&query=${queryParam}`;
            const moviesResponse = await get(searchMoviesUrl);

            const searchSeriesUrl = `https://api.themoviedb.org/3/search/tv?language=pt-BR&query=${queryParam}`;
            const seriesResponse = await get(searchSeriesUrl);

            const moviesWithLabel = moviesResponse.results.map(movie => ({ ...movie, type: 'movie' }));
            const seriesWithLabel = seriesResponse.results.map(serie => ({ ...serie, type: 'series' }));

            const combinedResults = [...moviesWithLabel, ...seriesWithLabel];
            const sortedResults = combinedResults.sort((a, b) => b.popularity - a.popularity);
            setSearchResults(sortedResults);
        } else {
            setSearchResults([]);
        }
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass">
            <nav className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/">
                        <div className="flex items-center gap-2 cursor-pointer group">
                            <span className="text-2xl font-bold text-gold-500 group-hover:text-gold-600 transition-colors">Filmes Novos</span>
                        </div>
                    </Link>

                    <button onClick={openMenu} type="button" className="inline-flex items-center p-2 rounded-lg md:hidden text-gold-500 hover:bg-cinema-700 focus:outline-none transition-colors">
                        {hiddenMenu === "hidden" ? <FaBars size={22} /> : <FaTimes size={22} />}
                    </button>

                    <div className={hiddenMenu + " w-full md:block md:w-auto absolute md:static top-16 left-0 right-0 md:top-auto bg-cinema-800 md:bg-transparent border-b border-gold-500/10 md:border-0"}>
                        <ul className="flex flex-col md:flex-row md:items-center gap-1 p-4 md:p-0">
                            <li>
                                <Link href="/">
                                    <div className="px-4 py-2 text-gray-300 hover:text-gold-500 transition-colors font-medium text-sm tracking-wider uppercase">Filmes</div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/series">
                                    <div className="px-4 py-2 text-gray-300 hover:text-gold-500 transition-colors font-medium text-sm tracking-wider uppercase">Séries</div>
                                </Link>
                            </li>
                            <li className="relative">
                                <div className="flex items-center gap-1 px-4 py-2 text-gray-300 hover:text-gold-500 transition-colors font-medium text-sm tracking-wider uppercase cursor-pointer" onClick={togglePlatformDropdown}>
                                    Catálogo <FaAngleDown className={`text-xs transition-transform ${showPlatformDropdown ? 'rotate-180' : ''}`} />
                                </div>
                                {showPlatformDropdown && (
                                    <div className="absolute left-0 mt-1 w-56 py-2 glass rounded-xl shadow-2xl z-10" onMouseLeave={() => setShowPlatformDropdown(false)}>
                                        {[
                                            { name: 'Amazon Prime Video', path: 'amazon-prime-video' },
                                            { name: 'Netflix', path: 'netflix' },
                                            { name: 'Disney Plus', path: 'disney-plus' },
                                            { name: 'Star Plus', path: 'star-plus' },
                                            { name: 'HBO Max', path: 'hbo-max' },
                                        ].map(p => (
                                            <Link key={p.path} onClick={() => setShowPlatformDropdown(false)} href={`/catalago/${p.path}`}>
                                                <div className="block px-4 py-2.5 text-gray-300 hover:text-gold-500 hover:bg-cinema-700 transition-colors text-sm">{p.name}</div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </li>
                            <li className="relative md:ml-4">
                                <div className="flex items-center">
                                    <div className={`relative transition-all duration-300 ${searchOpen ? 'w-64' : 'w-9'}`}>
                                        <input
                                            className={`w-full rounded-lg py-2 pl-9 pr-3 text-sm bg-cinema-700 text-white border border-gold-500/20 focus:border-gold-500/50 focus:outline-none placeholder-gray-500 transition-all ${searchOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'}`}
                                            type="text"
                                            placeholder="Buscar filmes e séries..."
                                            value={query}
                                            onChange={handleSearchChange}
                                            onFocus={() => setSearchOpen(true)}
                                            onBlur={() => !query && setSearchOpen(false)}
                                        />
                                        <FaSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>

                                    {searchResults && searchResults.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-2 glass rounded-xl shadow-2xl z-10 max-h-80 overflow-y-auto">
                                            {searchResults.slice(0, 8).map((result, index) => {
                                                const path = result.type === 'movie' ? 'filme' : 'serie';
                                                const title = result.title || result.name;
                                                return (
                                                    <Link onClick={() => { setSearchResults([]); setQuery(''); }} key={index} href={`/${path}/${title}`}>
                                                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-cinema-700 transition-colors border-b border-white/5 last:border-0">
                                                            {result.poster_path && (
                                                                <img src={`https://image.tmdb.org/t/p/w92${result.poster_path}`} alt="" className="w-10 h-14 rounded object-cover" />
                                                            )}
                                                            <div>
                                                                <div className="text-sm font-medium text-white">{title}</div>
                                                                <div className="text-xs text-gray-400">{result.type === 'movie' ? 'Filme' : 'Série'}</div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}
