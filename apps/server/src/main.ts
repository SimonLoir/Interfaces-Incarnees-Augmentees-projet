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
const Kinect2 = require('kinect2');
const kinect = new Kinect2();

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

        const startKinect = () => {
            if (kinect.open()) {
                kinect.openBodyReader();
                kinect.on('bodyFrame', (bodyFrame: any) => {
                    drawBodyFrame(bodyFrame);
                });
            }
        };

        startKinect();

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

let drawBodyFrame = (bodyFrame: any) => {
    let bodyIndex = 0
    bodyFrame.array.forEach((body: any) => {
        console.log("Body nb " + bodyIndex);
        if(body.tracked) {
            for(const jointType in body.joints){
                const joint = body.joints[jointType];
                if(joint.trackingState > Kinect2.TrackingState.notTracked) {
                    console.log("hi2");
                }
            }
        }
    });
};