export interface DisqusPost {
  id: number;
  title?: string;
  name?: string;
}

export interface DisqusCommentsProps {
  post: DisqusPost;
}
