import Link from "next/link";
import type {} from './Footer.interfaces';

export const Footer = () => {
  return (
    <footer className="bg-cinema-800 border-t border-gold-500/10 mt-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          <div>
            <Link href="/">
              <div className="cursor-pointer inline-block mb-4">
                <span className="text-2xl font-bold text-gold-500">Filmes Novos</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Seu guia definitivo para novos lançamentos de filmes e séries. Descubra onde assistir, leia sinopses e acompanhe as novidades do cinema e streaming.
            </p>
          </div>

          <div>
            <h4 className="text-gold-500 font-bold text-lg mb-4 uppercase tracking-wider">Navegar</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-gray-400 hover:text-gold-500 transition-colors text-sm cursor-pointer">Filmes</span>
                </Link>
              </li>
              <li>
                <Link href="/series">
                  <span className="text-gray-400 hover:text-gold-500 transition-colors text-sm cursor-pointer">Séries</span>
                </Link>
              </li>
              <li>
                <Link href="/catalago/netflix">
                  <span className="text-gray-400 hover:text-gold-500 transition-colors text-sm cursor-pointer">Catálogo Netflix</span>
                </Link>
              </li>
              <li>
                <Link href="/catalago/amazon-prime-video">
                  <span className="text-gray-400 hover:text-gold-500 transition-colors text-sm cursor-pointer">Catálogo Prime Video</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold-500 font-bold text-lg mb-4 uppercase tracking-wider">Contato</h4>
            <p className="text-sm text-gray-400 mb-2">Email: leo.sn159@gmail.com</p>
            <p className="text-sm text-gray-500">Entre em contato para criar seu site!</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-sm text-gray-500">&copy; 2023 Filmes Novos. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
