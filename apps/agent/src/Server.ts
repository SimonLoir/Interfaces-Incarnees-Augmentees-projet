import next from 'next';
import express, { Request, Response } from 'express';
import { NextServer, RequestHandler } from 'next/dist/server/next';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import IoClient from './IoClient';
import LeapMotionServer from './LeapMotionServer';
import { AbstractGesture } from 'project-types';

export default class Server {
    private static instance: Server;
    private nextServer: NextServer;
    private handle: RequestHandler;
    private port: number;
    private io: SocketIOServer;
    private httpServer: HTTPServer;
    private expressServer: express.Express;
    private ioClient: IoClient;
    private leapMotionServer: LeapMotionServer;

    private constructor() {
        // Starts a next server
        this.nextServer = next({ dev: process.env.NODE_ENV !== 'production' });
        this.handle = this.nextServer.getRequestHandler();
        this.port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

        // Creates an express http server
        this.expressServer = express();

        // Creates a basic node http server on the express server
        this.httpServer = createServer(this.expressServer);

        // Creates a socket.io server on the http server
        this.io = new SocketIOServer(this.httpServer);

        // Creates a client connected to the teacher's server
        this.ioClient = new IoClient(this);

        // Creates a leap motion server to handle the leap motion gestures
        this.leapMotionServer = new LeapMotionServer(this);
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

    public showQCMQuestion(QCMQuestion: any) {
        this.io.emit('QCMQuestion', QCMQuestion);
    }

    public setPollConnection(msg: string) {
        this.io.emit('pollConnected', msg);
    }

    public downloadDocument(document: string) {
        this.io.emit('document', document);
    }
    public pollEvent(event: string) {
        this.io.emit('pollEvent', event);
    }
    public QCMEvent(event: string) {
        this.io.emit('QCMEvent', event);
    }

    public sendGesture(gesture: AbstractGesture<any>) {
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

            case 'scroll-left':
                this.io.emit('scroll_left_gesture');
                break;

            case 'scroll-right':
                this.io.emit('scroll_right_gesture');
                break;

            case 'one-extended-fingers':
                this.io.emit('extended_fingers_gesture', 0);
                break;

            case 'two-extended-fingers':
                this.io.emit('extended_fingers_gesture', 1);
                break;

            case 'three-extended-fingers':
                this.io.emit('extended_fingers_gesture', 2);
                break;

            case 'four-extended-fingers':
                this.io.emit('extended_fingers_gesture', 3);
                break;

            case 'five-extended-fingers':
                this.io.emit('extended_fingers_gesture', 4);
                break;

            default:
                break;
        }
    }
}
