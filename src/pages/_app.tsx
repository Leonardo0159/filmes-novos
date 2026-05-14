import '@/src/styles/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import RouteLoader from '@/src/components/RouteLoader';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <RouteLoader />
      <Component {...pageProps} />
    </>
  );
}
