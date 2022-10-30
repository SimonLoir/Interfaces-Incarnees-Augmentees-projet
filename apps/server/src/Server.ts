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

    public async start() {
        try {
            await this.nextServer.prepare();
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

    private setupSocketConnection() {
        console.log('setupSocketConnection');

        this.io.on('connection', (socket) => {
            console.log('connection');
            socket.on('screen_share_accepted', (sharerId: string) => {
                console.log('screen_share_accepted', sharerId);
                this.io.emit('screen_share_accepted', sharerId);
            });
            socket.on('screen_share_refused', (sharerId: string) => {
                this.io.emit('screen_share_refused', sharerId);
            });
            socket.on('setView', (view: string) => {
                console.log('setView', view);
                this.io.emit('setView', view);
            });
            socket.on('pollQuestion', (pollQuestion: string) => {
                this.io.emit('pollQuestion', pollQuestion);
            });
            socket.on('QCMQuestion', (QCMQuestion: string) => {
                this.io.emit('QCMQuestion', QCMQuestion);
            });
        });
    }

    public static getInstance(): Server {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }

    public sendNextView() {
        this.io.emit('next-view');
    }
    public sendPreviousView() {
        this.io.emit('previous-view');
    }
    public sendScreenShareProposition(sharerId: string) {
        this.io.emit('screen-share-proposition', sharerId);
    }
}
