import next from 'next';
import express, { Request, Response } from 'express';
import { NextServer, RequestHandler } from 'next/dist/server/next';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import IoClient from './IoClient';

export default class Server {
    private static instance: Server;
    private nextServer: NextServer;
    private handle: RequestHandler;
    private port: number;
    private io: SocketIOServer;
    private httpServer: HTTPServer;
    private expressServer: express.Express;
    private ioClient: IoClient;

    private constructor() {
        this.nextServer = next({ dev: process.env.NODE_ENV !== 'production' });
        this.handle = this.nextServer.getRequestHandler();
        this.port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
        this.expressServer = express();
        this.httpServer = createServer(this.expressServer);
        this.io = new SocketIOServer(this.httpServer);
        this.ioClient = new IoClient(this);
    }

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

    private setupSocketConnection() {}

    public static getInstance(): Server {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }

    public acceptScreenShare(sharer_id: string) {
        this.io.emit('screen_share_accepted', sharer_id);
    }

    public refuseScreenShare(sharer_id: string) {
        this.io.emit('screen_share_refused', sharer_id);
    }

    public pollAcceptionAnswer(sharer_id: string) {
        this.io.emit('approval', sharer_id);
    }

    public pollRefusalAnswer(sharer_id: string) {
        this.io.emit('refusal', sharer_id);
    }

    public setView(view: string) {
        this.io.emit('setView', view);
    }
}
