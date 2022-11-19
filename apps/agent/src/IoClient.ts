import { io, Socket } from 'socket.io-client';
import { getServerInfo } from '../utils/network';
import Server from './Server';

export default class IoClient {
    private io: Socket;

    public constructor(server: Server) {
        const { host, port } = getServerInfo();
        this.io = io(`http://${host}:${port}`);
        this.io.on('screen_share_accepted', (sharerId: string) => {
            server.acceptScreenShare(sharerId);
        });
        this.io.on('screen_share_refused', (sharerId: string) => {
            server.refuseScreenShare(sharerId);
        });
        this.io.on('setView', (view: string) => {
            server.setView(view);
        });
        this.io.on('pollQuestion', (pollQuestion: string) => {
            server.showPollQuestion(pollQuestion);
        });

        this.io.on('QCMQuestion', (QCMQuestion: any) => {
            server.showQCMQuestion(QCMQuestion);
        });

        this.io.on('new-poll-participation', (msg: string) => {
            server.setPollConnection('connected');
        });

        this.io.on('document', (document: string) => {
            console.log('document', document);
            server.downloadDocument(document);
        });
        this.io.on('pollEvent', (event: string) => {
            server.pollEvent(event);
        });
        this.io.on('QCMEvent', (event: string) => {
            server.QCMEvent(event);
        });
    }
}
