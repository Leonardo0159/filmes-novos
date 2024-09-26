import Slider from "react-slick";
import ReactGA from 'react-ga4';
import Image from 'next/image';

ReactGA.initialize('G-WBBLV0VBLB');
const EchoComponent = () => {

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: true,
        autoplay: true,
        autoplaySpeed: 10000
    };

    const frasesEcho = [
        'Com o Amazon Echo, controle seu entretenimento apenas com sua voz! Diga "Alexa, reproduza [nome do filme ou série]" e mergulhe em sua maratona de filmes e séries favoritas.',
        'Descubra a assistente virtual Alexa! Com o Amazon Echo, faça perguntas, ouça músicas, defina alarmes, controle dispositivos inteligentes e muito mais.',
        'Conecte-se e mantenha-se informado com notícias, previsão do tempo e informações de filmes e séries! O Amazon Echo é sua central de entretenimento e controle doméstico.'
    ];

    function handleLinkClick() {
        ReactGA.event({
            category: 'Echo',
            action: 'Click Echo',
            label: 'Echo'
        });
    }

    return (
        <section className="mx-4 flex flex-col-reverse md:flex-row max-w-screen-xl my-8 md:mx-auto px-4 sm:px-6 lg:px-8 md:py-8 bg-white border border-gray-100 rounded-xl shadow-lg">
            <div className=' py-10 w-full md:w-1/2 flex flex-col justify-center items-center'>
                <h2 className="text-2xl font-bold mb-4">Descubra o Amazon Echo</h2>
                <p className="mb-8 text-center">Explore um novo mundo de comodidade e entretenimento com o Amazon Echo. Veja o que você pode desfrutar:</p>
                <div className="w-full md:w-3/4 px-8 mb-16 md:mb-2 p-4 h-48 rounded-lg">
                    <Slider {...settings}>
                        {frasesEcho.map((frase, key) => (
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
                        href="https://amzn.to/3N0LAgV"
                        onClick={handleLinkClick}>Saiba Mais</a>
                </div>
            </div>
            <div className='flex items-center justify-center py-10 w-full md:w-1/2'>
                <img src='/images/echo.jpg' alt="Amazon Echo" className='md:w-3/5 rounded-lg' />
            </div>
        </section>
    );
}

export default EchoComponent;
