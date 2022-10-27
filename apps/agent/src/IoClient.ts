import { io, Socket } from 'socket.io-client';
import Server from './Server';

export default class IoClient {
    private static instance: IoClient;
    private io: Socket;

    public constructor(private server: Server) {
        this.io = io('http://localhost:3001');
        this.io.on('screen_share_accepted', (sharer_id: string) => {
            console.log('agent:screen_share_accepted', sharer_id);
            server.acceptScreenShare(sharer_id);
        });
        this.io.on('screen_share_refused', (sharer_id: string) => {
            server.refuseScreenShare(sharer_id);
        });
        this.io.on('setView', (view: string) => {
            console.log('agent:setView', view);
            server.setView(view);
        });
        this.io.on('poll_set_question', (payload: { question: string }) => {
            console.log('agent:poll_set_question', payload);
            server.setPollQuestion(payload);
        });
    }
}
