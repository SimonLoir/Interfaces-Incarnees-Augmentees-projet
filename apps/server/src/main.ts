import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import next from 'next';
import { Server } from 'socket.io';
import { createServer } from 'http';

if (existsSync('.env.local')) dotenv.config({ path: '.env.local' });

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3001;

(async () => {
    try {
        await app.prepare();
        const server = express();
        const httpServer = createServer(server);
        const io = new Server(httpServer);

        io.on('connection', (s) => {
            console.log('a user connected');
            s.on('message', (msg) => console.log(msg));
        });

        setInterval(() => {
            io.emit('time', new Date().toISOString());
        }, 1000);

        server.all('*', (req: Request, res: Response) => {
            return handle(req, res);
        });

        httpServer.listen(port, (err?: any) => {
            if (err) throw err;
            console.log(
                `> Ready on localhost:${port} - env ${process.env.NODE_ENV}`
            );
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
