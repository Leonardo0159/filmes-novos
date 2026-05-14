import Head from 'next/head';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import StreamingCarousel from '@/src/components/StreamingCarousel';
import FeaturedStreaming from '@/src/components/FeaturedStreaming';

const Catalago = ({ nome }) => {

    function formatPlatformName(name) {
        return name
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    return (
        <div className="min-h-screen bg-cinema-900">
            <Head>
                <title>{nome ? `Catálogo - ${formatPlatformName(nome)}` : 'Carregando...'} | Filmes Novos</title>
                <meta name="description" content={nome ? `Explore os melhores filmes e séries disponíveis na plataforma ${formatPlatformName(nome)}.` : 'Carregando...'} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta charSet="utf-8" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ''} />
                <meta property="og:image" content="/FN.png" />
                <meta property="og:image:width" content="183" />
                <meta property="og:image:height" content="224" />
                <meta property="og:title" content={`Catálogo - ${formatPlatformName(nome)} | Filmes Novos`} />
                <meta property="og:description" content={nome && `Explore os melhores filmes e séries disponíveis na plataforma ${formatPlatformName(nome)}.`} />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />
            <StreamingCarousel platform={nome}/>
            <FeaturedStreaming platform={nome}/>
            <Footer />
        </div>
    );
};

export async function getServerSideProps(context) {
    const { nome } = context.params;
    return {
        props: { nome }
    }
}

export default Catalago;
