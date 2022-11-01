import { io, Socket } from 'socket.io-client';
import Server from './Server';

export default class IoClient {
    private io: Socket;

    public constructor(server: Server) {
        const host = process.env.NEXT_PUBLIC_SERVER_HOST || 'localhost';
        const port = process.env.NEXT_PUBLIC_SERVER_PORT || '3001';
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

        this.io.on('QCMQuestion', (QCMQuestion: string) => {
            server.showQCMQuestion(QCMQuestion);
        });

        this.io.on('new-poll-participation', (msg: string) => {
            server.setPollConnection('connected');
        });
    }
}
