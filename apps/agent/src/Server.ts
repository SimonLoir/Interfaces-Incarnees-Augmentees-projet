import next from 'next';
import express, { Request, Response } from 'express';
import { NextServer, RequestHandler } from 'next/dist/server/next';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import IoClient from './IoClient';
import { Gesture } from 'gestures-controller';
import GestureServer from './GestureServer';

export default class Server {
    private static instance: Server;
    private nextServer: NextServer;
    private handle: RequestHandler;
    private port: number;
    private io: SocketIOServer;
    private httpServer: HTTPServer;
    private expressServer: express.Express;
    private ioClient: IoClient;
    private gestureServer: GestureServer;

    private constructor() {
        this.nextServer = next({ dev: process.env.NODE_ENV !== 'production' });
        this.handle = this.nextServer.getRequestHandler();
        this.port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
        this.expressServer = express();
        this.httpServer = createServer(this.expressServer);
        this.io = new SocketIOServer(this.httpServer);
        this.ioClient = new IoClient(this);
        this.gestureServer = new GestureServer(this);
    }

    /**
     * Starts a web server using next and express
     * All the API routes can be edited here
     * @returns this
     */
    public async start() {
        try {
            await this.nextServer.prepare();

            this.expressServer.all('*', (req: Request, res: Response) => {
                return this.handle(req, res);
            });

            this.httpServer.listen(this.port, (err?: any) => {
                if (err) throw err;
                console.log(`> Ready on localhost:${this.port}`);
            });
            this.setupSocketConnection();
            return this;
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    }

    /**
     * Sets up the socket connection
     */
    private setupSocketConnection() {}

    /**
     * Returns a single instance of the server
     * @returns
     */
    public static getInstance(): Server {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }

    /**
     * Tells the client that a screen share has been accepted
     * @param sharerId The id of the sharer
     */
    public acceptScreenShare(sharerId: string) {
        this.io.emit('screen_share_accepted', sharerId);
    }

    /**
     * Tells the client that a screen share has been rejected
     * @param sharerId The id of the peer that was rejected
     */
    public refuseScreenShare(sharerId: string) {
        this.io.emit('screen_share_refused', sharerId);
    }

    /**
     * Tells the client that the current view may have changed
     * @param view The name of the view
     */
    public setView(view: string) {
        this.io.emit('setView', view);
    }

    public showPollQuestion(pollQuestion: string) {
        this.io.emit('pollQuestion', pollQuestion);
    }

    public showQCMQuestion(QCMQuestion: string) {
        this.io.emit('QCMQuestion', QCMQuestion);
    }

    public setPollConnection(msg: string) {
        this.io.emit('pollConnected', msg);
    }

    public sendGesture(gesture: Gesture<any>) {
        switch (gesture.name) {
            case 'screen-sharing':
                this.io.emit('screen_share_gesture');
                break;
            case 'thumb-position-up':
                this.io.emit('thumbs_up_gesture');
                break;
            case 'thumb-position-down':
                this.io.emit('thumbs_down_gesture');
                break;
            default:
                break;
        }
    }
}
