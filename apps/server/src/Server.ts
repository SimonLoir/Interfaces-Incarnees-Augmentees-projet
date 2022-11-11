import next from 'next';
import Kinect2 from 'kinect2';
import express, { Request, Response } from 'express';
import { NextServer, RequestHandler } from 'next/dist/server/next';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import KinectServer from './KinectServer';
import { PeerServer } from 'peer';
import cors from 'cors';
import GestureServer from './GestureServer';
import { Gesture } from 'gestures-controller';

export default class Server {
    private static instance: Server;
    private nextServer: NextServer;
    private handle: RequestHandler;
    private port: number;
    private io: SocketIOServer;
    private kinect: Kinect2;
    private httpServer: HTTPServer;
    private expressServer: express.Express;
    private kinectServer: KinectServer;
    private gestureServer: GestureServer;
    private currentView: string = 'home';

    private constructor() {
        this.nextServer = next({ dev: process.env.NODE_ENV !== 'production' });
        this.handle = this.nextServer.getRequestHandler();
        this.port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
        this.kinect = new Kinect2();
        this.expressServer = express();
        this.expressServer.use(cors({ origin: '*' }));
        this.httpServer = createServer(this.expressServer);
        this.io = new SocketIOServer(this.httpServer);
        this.kinectServer = new KinectServer(this.kinect, this);
        PeerServer({ port: 3002, path: '/' });
        this.gestureServer = new GestureServer(this);
    }

    /**
     * Starts a new server
     * @returns this
     */
    public async start() {
        try {
            await this.nextServer.prepare();
            //this.kinectServer.startKinect();
            this.expressServer.get(
                '/connect/:id',
                (req: Request, res: Response) => {
                    const id = req.params.id;
                    this.io.emit('new-peer', id);
                    console.log('new-peer', id);
                    return res.send(id);
                }
            );

            this.expressServer.get(
                '/approval/:id',
                (req: Request, res: Response) => {
                    const id = req.params.id;
                    this.io.emit('approval', id);
                    console.log('+1 approval', id);
                    return res.send(id);
                }
            );

            this.expressServer.get(
                '/refusal/:id',
                (req: Request, res: Response) => {
                    const id = req.params.id;
                    this.io.emit('refusal', id);
                    console.log('+1 refusal', id);
                    return res.send(id);
                }
            );

            this.expressServer.get(
                '/answer/:num/:id',
                (req: Request, res: Response) => {
                    const id = req.params.id;
                    const num = req.params.num;
                    this.io.emit('answer' + num, id);
                    console.log('+1 answer ' + num + ' ', id);
                    return res.send(id);
                }
            );

            this.expressServer.get(
                '/poll-connect/*',
                (req: Request, res: Response) => {
                    this.io.emit('new-poll-participation', 'hi student');
                    console.log('new-poll-participation');
                    return res.send('hi student');
                }
            );

            this.expressServer.get(
                '/current-view',
                (req: Request, res: Response) => {
                    return res.send(this.currentView);
                }
            );

            this.expressServer.all('*', (req: Request, res: Response) => {
                return this.handle(req, res);
            });

            this.httpServer.listen(this.port, (err?: any) => {
                if (err) throw err;
                console.log(
                    `> Ready on localhost:${this.port} - env ${process.env.NODE_ENV}`
                );
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
    private setupSocketConnection() {
        this.io.on('connection', (socket) => {
            console.log('new connection');
            socket.emit('setView', this.currentView);
            socket.on('screen_share_accepted', (sharerId: string) => {
                this.io.emit('screen_share_accepted', sharerId);
            });
            socket.on('screen_share_refused', (sharerId: string) => {
                this.io.emit('screen_share_refused', sharerId);
            });
            socket.on('setView', (view: string) => {
                this.io.emit('setView', view);
                this.currentView = view;
            });
            socket.on('pollQuestion', (pollQuestion: string) => {
                this.io.emit('pollQuestion', pollQuestion);
            });
            socket.on('QCMQuestion', (QCMQuestion: string) => {
                this.io.emit('QCMQuestion', QCMQuestion);
            });
        });

        setInterval(() => {
            this.io.emit('setView', this.currentView);
        }, 1000);
    }

    /**
     * Gets a singleton instance of the server
     * @returns A new server
     */
    public static getInstance(): Server {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }

    /**
     * Tells the client to go to the next view
     */
    public sendNextView() {
        this.io.emit('next-view');
    }
    /**
     * Tells the client to go to the previous view
     */
    public sendPreviousView() {
        this.io.emit('previous-view');
    }

    /**
     * Sends a gesture to the client
     * @param gesture The gesture to send
     */
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
            case 'swipe-left':
                this.io.emit('swipe_left_gesture');
                break;
            case 'swipe-right':
                this.io.emit('swipe_right_gesture');
                break;
            default:
                break;
        }
    }
}
