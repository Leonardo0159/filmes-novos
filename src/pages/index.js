import Head from 'next/head'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import CarouselBanner from '../components/CarouselBanner'
import FeaturedMovies from '../components/FeaturedMovies'

export default function Home() {
  return (
    <div className="min-h-screen bg-cinema-900">
      <Head>
        <title>Filmes Novos | Descubra os lançamentos mais recentes do cinema</title>
        <meta name="description" content="Filmes Novos traz para você os lançamentos mais recentes do cinema. Navegue por nossos destaques e descubra os melhores filmes para assistir." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta property="og:image" content="/FN.png" />
        <meta property="og:image:width" content="183" />
        <meta property="og:image:height" content="224" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Filmes Novos | Descubra os lançamentos mais recentes do cinema" />
        <meta property="og:description" content="Filmes Novos traz para você os lançamentos mais recentes do cinema. Navegue por nossos destaques e descubra os melhores filmes para assistir." />
        <meta property="og:url" content="https://www.filmesnovos.com.br/" />
        <meta property="og:site_name" content="Filmes Novos" />
        <meta property="og:locale" content="pt_BR" />
        <meta name="twitter:title" content="Filmes Novos | Descubra os lançamentos mais recentes do cinema" />
        <meta name="twitter:description" content="Filmes Novos traz para você os lançamentos mais recentes do cinema. Navegue por nossos destaques e descubra os melhores filmes para assistir." />
        <meta name="twitter:image" content="/FN.png" />
        <meta name="keywords" content="Filmes, Cinema, Novidades, Lançamentos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <CarouselBanner />
      <FeaturedMovies />
      <Footer />
    </div>
  )
}
