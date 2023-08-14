import { get } from "@/src/services/api";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaSearch, FaAngleDown } from 'react-icons/fa';

export const Header = () => {
    const [hiddenMenu, setHiddenMenu] = useState("hidden");
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);

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

            // Buscar por filmes
            const searchMoviesUrl = `https://api.themoviedb.org/3/search/movie?language=pt-BR&query=${queryParam}`;
            const moviesResponse = await get(searchMoviesUrl);

            // Buscar por séries
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
        <header>
            <nav className="bg-black border-gray-200">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href="/">
                        <div className="flex items-center cursor-pointer">
                            <span className="self-center text-2xl font-semibold text-white">Filmes Novos</span>
                        </div>
                    </Link>
                    <button onClick={openMenu} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center rounded-lg md:hidden text-white focus:outline-none focus:ring-2 hover:bg-gold-500 hover:text-white">
                        <span className="sr-only">Open main menu</span>
                        <FaBars size={30} />
                    </button>
                    <div className={hiddenMenu + " w-full md:block md:w-auto relative"}>
                        <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-black border-gray-700">
                            <li>
                                <Link href="/">
                                    <div className="block py-2 pl-3 pr-4 text-white hover:text-gold-500">Filmes</div>
                                </Link>
                            </li>
                            <li>
                                <Link href="/series">
                                    <div className="block py-2 pl-3 pr-4 text-white hover:text-gold-500">Series</div>
                                </Link>
                            </li>
                            <li className="relative group">
                                <div className="flex flex-row items-center gap-2 py-2 pl-3 pr-4 text-white hover:text-gold-500 cursor-pointer" onClick={togglePlatformDropdown}>
                                    Catálogo <FaAngleDown />
                                </div>
                                {showPlatformDropdown && (
                                    <div className="absolute left-0 mt-2 w-48 py-2 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                        <Link onClick={togglePlatformDropdown} href="/catalago/amazon-prime-video">
                                            <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer">Amazon Prime Video</div>
                                        </Link>
                                        <Link onClick={togglePlatformDropdown} href="/catalago/netflix">
                                            <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer">Netflix</div>
                                        </Link>
                                        <Link onClick={togglePlatformDropdown} href="/catalago/disney-plus">
                                            <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer">Disney Plus</div>
                                        </Link>
                                        <Link onClick={togglePlatformDropdown} href="/catalago/star-plus">
                                            <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer">Star Plus</div>
                                        </Link>
                                        <Link onClick={togglePlatformDropdown} href="/catalago/hbo-max">
                                            <div className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer">HBO Max</div>
                                        </Link>
                                        {/* Adicione outras plataformas conforme necessário */}
                                    </div>
                                )}
                            </li>
                            <li className="flex items-center relative">
                                <input
                                    className="rounded-md p-2"
                                    type="text"
                                    placeholder="Buscar..."
                                    value={query}
                                    onChange={handleSearchChange}
                                />
                                <FaSearch size={20} className="absolute right-2 top-2" />

                                {searchResults && searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-md z-10 max-h-64 overflow-y-auto">
                                        {searchResults.map((result, index) => {
                                            // Verificar o tipo e definir o caminho e o título corretamente
                                            const path = result.type === 'movie' ? 'filme' : 'serie';
                                            const title = result.title || result.name;

                                            return (
                                                <Link onClick={() => setSearchResults([])} key={index} href={`/${path}/${title}`}>
                                                    <div className="block p-2 hover:bg-gray-200">{title}</div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    )
}
