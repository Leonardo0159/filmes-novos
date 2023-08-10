import { DiscussionEmbed } from 'disqus-react';

const DisqusComments = ({ post }) => {

    const disqusShortname = 'https-www-filmesnovos-com-br'; // Obtido ao criar sua conta no Disqus
    const disqusConfig = {
        url: typeof window !== "undefined" ? window.location.href : '',  // use o URL canônico do seu filme
        identifier: post.id,  // Um identificador único para o filme
        title: post.title ? post.title : post.name ? post.name : 'Sem título',  // Usa o título, se disponível, senão usa o nome, senão usa "Sem título"
    };

    return (
        <div className='mt-20'>
            <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
        </div>
    );
};

export default DisqusComments;
