import { AppProps } from 'next/app';
import '@style/index.scss';
export default function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
