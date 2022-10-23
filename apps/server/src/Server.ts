import next from 'next';
import Kinect2 from 'kinect2';
import express, { Request, Response } from 'express';
import { NextServer, RequestHandler } from 'next/dist/server/next';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import KinectServer from './KinectServer';
import { PeerServer } from 'peer';

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

    private constructor() {
        this.nextServer = next({ dev: process.env.NODE_ENV !== 'production' });
        this.handle = this.nextServer.getRequestHandler();
        this.port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
        this.kinect = new Kinect2();
        this.expressServer = express();
        this.httpServer = createServer(this.expressServer);
        this.io = new SocketIOServer(this.httpServer);
        this.kinectServer = new KinectServer(this.kinect, this);
        PeerServer({ port: 3002, path: '/' });
    }

    public async start() {
        try {
            await this.nextServer.prepare();

            this.expressServer.all('*', (req: Request, res: Response) => {
                if (req.url === '/test-screen-share') {
                    this.sendScreenShareProposition('hello_world');
                    return res.send('ok');
                }
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
            socket.on('screen_share_accepted', (sharer_id: string) => {
                console.log('screen_share_accepted', sharer_id);
                this.io.emit('screen_share_accepted', sharer_id);
            });
            socket.on('screen_share_refused', (sharer_id: string) => {
                this.io.emit('screen_share_refused', sharer_id);
            });
            socket.on('setView', (view: string) => {
                console.log('setView', view);
                this.io.emit('setView', view);
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
    public sendScreenShareProposition(sharer_id: string) {
        this.io.emit('screen-share-proposition', sharer_id);
    }
}
