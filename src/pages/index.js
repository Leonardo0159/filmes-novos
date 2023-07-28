import Head from 'next/head'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import CarouselBanner from '../components/CarouselBanner'
import FeaturedMovies from '../components/FeaturedMovies'
import { useEffect } from 'react'
import ReactGA from 'react-ga4';

ReactGA.initialize('G-WBBLV0VBLB');
export default function Home() {

  useEffect(() => {
    ReactGA.send("pageview");
  })

  return (
    <div>
      <Head>
        <title>Filmes Novos | Descubra os lançamentos mais recentes do cinema</title>
        <meta name="description" content="Filmes Novos traz para você os lançamentos mais recentes do cinema. Navegue por nossos destaques e descubra os melhores filmes para assistir." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        {/* Adicione outras meta tags conforme necessário */}
      </Head>

      <div className='bg-gray-100'>
        <Header />
        <CarouselBanner />
        <FeaturedMovies />
        <Footer />
      </div>

    </div>
  )
}
