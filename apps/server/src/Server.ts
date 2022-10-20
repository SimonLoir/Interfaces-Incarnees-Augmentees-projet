import next from 'next';
import Kinect2 from 'kinect2';
import express, { Request, Response } from 'express';
import { NextServer, RequestHandler } from 'next/dist/server/next';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import KinectServer from './KinectServer';

export default class Server {
    private static instance: Server;
    private nextServer: NextServer;
    private handle: RequestHandler;
    private port: number;
    private io: SocketIOServer;
    private kinect: Kinect2;
    private httpServer: HTTPServer;
    private expressServer: express.Express;
    private KinectServer: KinectServer;

    private constructor() {
        this.nextServer = next({ dev: process.env.NODE_ENV !== 'production' });
        this.handle = this.nextServer.getRequestHandler();
        this.port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
        this.kinect = new Kinect2();
        this.expressServer = express();
        this.httpServer = createServer(this.expressServer);
        this.io = new SocketIOServer(this.httpServer);
        this.KinectServer = new KinectServer(this.kinect, this);
    }

    public async start() {
        try {
            await this.nextServer.prepare();

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
        setInterval(() => {
            this.io.emit('time', new Date().toISOString());
        }, 1000);
    }

    public static getInstance(): Server {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }
}
