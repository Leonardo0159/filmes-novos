import Head from 'next/head';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import ReactGA from 'react-ga4';
import StreamingCarousel from '@/src/components/StreamingCarousel';

ReactGA.initialize('G-WBBLV0VBLB');

const Catalago = ({ nome }) => {

    console.log(nome);

    return (
        <div>
            <Head>
                <title>{nome ? `Catálogo - ${nome}` : 'Carregando...'} | Filmes Novos</title>
                <meta name="description" content={nome ? `Explore os melhores filmes e séries disponíveis na plataforma ${nome}.` : 'Carregando...'} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta charSet="utf-8" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={typeof window !== "undefined" ? window.location.href : ''} />
                <meta property="og:image" content="/FN.png" />
                <meta property="og:image:width" content="183" />
                <meta property="og:image:height" content="224" />
                <meta property="og:title" content={`Catálogo - ${nome} | Filmes Novos`} />
                <meta property="og:description" content={`Explore os melhores filmes e séries disponíveis na plataforma ${nome}.`} />

                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header />
            <StreamingCarousel platform={nome}/>
            <Footer />
        </div>
    );
};

export async function getServerSideProps(context) {
    const { nome } = context.params;

    return {
        props: {
            nome
        }
    }
}


export default Catalago;
