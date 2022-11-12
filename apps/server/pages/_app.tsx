import '@style/index.scss';
import '@style/loader.scss';
import { useSocket, SocketContext, usePeer, PeerContext } from '@utils/global';
import Object3DView from 'components/views/Object3dView';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }: any) {
    const { connected, socket } = useSocket();
    const router = useRouter();
    if (!connected) return <div>Connecting...</div>;
    let element: JSX.Element = (
        <BaseApp Component={Component} pageProps={pageProps} />
    );
    if (router.asPath.includes('/3d'))
        element = (
            <div style={{ height: '100vh', width: '100vw' }}>
                <Object3DView></Object3DView>
            </div>
        );
    return (
        <SocketContext.Provider value={socket}>
            {element}
        </SocketContext.Provider>
    );
}

function BaseApp({ Component, pageProps }: any) {
    const { peer, error } = usePeer('teacher', {
        host: 'localhost',
        port: 3002,
    });
    if (error) return <>Error connecting to peer {error}</>;
    if (!peer) return <>Loading peer connection</>;
    return (
        <PeerContext.Provider value={peer}>
            <Component {...pageProps} />
        </PeerContext.Provider>
    );
}
