import Slider from "react-slick";
import ReactGA from 'react-ga4';
import Image from 'next/image';

ReactGA.initialize('G-WBBLV0VBLB');
const FireTvComponent = () => {

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        autoplay: true,
        autoplaySpeed: 10000
    };

    const frasesFireTv = [
        'Transforme sua TV comum em uma experiência inteligente com o Fire TV Stick da Amazon! Entretenimento ilimitado com seus filmes, séries e aplicativos favoritos, tudo ao alcance do seu controle remoto!',
        'O futuro da televisão está aqui! Com o Amazon Fire TV Stick, você tem acesso a milhares de canais, aplicativos e jogos. Assista, jogue e divirta-se como nunca antes, em uma interface simples e amigável.',
        'Acesse Netflix, YouTube, Prime Video e muito mais, tudo em um único dispositivo! Com o Fire TV Stick da Amazon, a qualidade e a conveniência se unem para oferecer a você a melhor experiência de visualização. Peça já o seu e descubra um novo mundo de entretenimento!'
    ];

    function handleLinkClick() {
        ReactGA.event({
            category: 'Fire TV',
            action: 'Click Fire TV',
            label: 'Fire TV'
        });
    }

    return (
        <section className="mx-4 flex flex-col-reverse md:flex-row max-w-screen-xl my-8 md:mx-auto px-4 sm:px-6 lg:px-8 md:py-8 bg-white border border-gray-100 rounded-xl shadow-lg">
            <div className=' py-10 w-full md:w-1/2 flex flex-col justify-center items-center'>
                <h2 className="text-2xl font-bold mb-4">Descubra o Fire TV Stick</h2>
                <p className="mb-8 text-center">Experimente um novo mundo de entretenimento com o Fire TV Stick da Amazon. Veja o que você pode desfrutar:</p>
                <div className="w-full md:w-3/4 px-8 mb-16 md:mb-4 p-4 h-52 rounded-lg">
                    <Slider {...settings}>
                        {frasesFireTv.map((frase, key) => (
                            <div key={key} className="text-center">
                                {frase}
                            </div>
                        ))}
                    </Slider>
                </div>
                <div>
                    <a className="bg-blue-500 text-white px-10 py-2 rounded-xl hover:bg-blue-600 transition"
                        target="_blank"
                        rel="noreferrer"
                        href="https://amzn.to/47Fjots"
                        onClick={handleLinkClick}>Saiba Mais</a>
                </div>
            </div>
            <div className='flex items-center justify-center py-10 w-full md:w-1/2'>
                <img src='/images/firetv.jpg' alt="Amazon Fire TV Stick" className='md:w-3/5 rounded-lg' />
            </div>
        </section>
    );
}

export default FireTvComponent;
