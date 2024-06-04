import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="bg-black text-white mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-wrap justify-between items-center">

                    {/* Logo e descrição */}
                    <div className="w-full md:w-1/4 mb-8 md:mb-0">
                        <Link href="/">
                            <div className="cursor-pointer flex items-center mb-4 hover:opacity-80 transition-opacity duration-150">
                                {
                                    /*
                                    <img src="/images/logoFilmesNovos.png" className="mr-3 h-6 sm:h-9" alt="Filmes Novos Logo" />
                                    */
                                }
                                <span className="self-center text-xl font-semibold whitespace-nowrap">Filmes Novos</span>
                            </div>
                        </Link>
                        <p className="text-sm text-gray-300">
                            Seu guia definitivo para novos lançamentos de filmes e séries.
                        </p>
                    </div>

                    {/* Links do site */}
                    <div className="w-full md:w-1/4 mb-8 md:mb-0">
                        <h4 className="mb-4 text-gold-500 font-bold">Links Úteis</h4>
                        <ul>
                            <li className="mb-2">
                                <Link href="/">
                                    <span className="hover:text-gold-500 cursor-pointer">Filmes</span>
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/series">
                                    <span className="hover:text-gold-500 cursor-pointer">Séries</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contatos */}
                    <div className="w-full md:w-1/4">
                        <h4 className="mb-4 text-gold-500 font-bold">Contato</h4>
                        <p className="text-sm text-gray-300 mb-2">Email: leo.sn159@gmail.com</p>
                        <p className="text-sm text-gray-300">Entre em contato para criar seu site!</p>
                    </div>
                </div>

                {/* Créditos */}
                <div className="mt-8 border-t border-gray-700 pt-6 text-center">
                    <p className="text-sm text-gray-400">© 2023 Filmes Novos. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
