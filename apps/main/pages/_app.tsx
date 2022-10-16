import { AppProps } from 'next/app';
import '../style/index.scss';
import { useSocket } from '../utils/sockets';
export default function MyApp({ Component, pageProps }: AppProps) {
    const { connected, socket } = useSocket();
    if (!connected) return <div>Connecting...</div>;
    console.log(socket);
    return <Component {...pageProps} />;
}
