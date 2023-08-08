import FeaturedSeries from '@/src/components/FeaturedSeries'
import FireTvComponent from '@/src/components/FireTvComponent'
import { Footer } from '@/src/components/Footer'
import { Header } from '@/src/components/Header'
import SeriesCarouselBanner from '@/src/components/SeriesCarouselBanner'
import Head from 'next/head'


export default function Series() {
  return (
    <div>
      <Head>
        <title>Séries | Filmes Novos </title>
        <meta name="description" content="Filmes Novos traz para você os lançamentos mais recentes do cinema. Navegue por nossos destaques e descubra os melhores filmes para assistir." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta property="og:image" content="/FN.png" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
        {/* Adicione outras meta tags conforme necessário */}
      </Head>

      <div className='bg-gray-100'>
        <Header />
        <SeriesCarouselBanner />
        <FireTvComponent />
        <FeaturedSeries />
        <Footer />
      </div>

    </div>
  )
}
