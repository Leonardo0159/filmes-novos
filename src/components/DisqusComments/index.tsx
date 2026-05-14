import { DiscussionEmbed } from 'disqus-react';
import type { DisqusCommentsProps } from './DisqusComments.interfaces';

const DisqusComments = ({ post }: DisqusCommentsProps) => {
  const disqusShortname = 'https-www-filmesnovos-com-br';
  const disqusConfig = {
    url: typeof window !== "undefined" ? window.location.href : '',
    identifier: String(post.id),
    title: post.title ?? post.name ?? 'Sem título',
  };

  return (
    <div className="mt-20">
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
};

export default DisqusComments;
