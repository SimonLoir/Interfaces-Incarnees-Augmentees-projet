import next from 'next';
import Kinect2 from 'kinect2';
import express, { Request, Response } from 'express';
import { NextServer, RequestHandler } from 'next/dist/server/next';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import KinectServer from './KinectServer';
import { PeerServer } from 'peer';
import cors from 'cors';
import LeapMotionServer from './LeapMotionServer';
import { Gesture } from 'leap-gestures-controller';
import { AbstractGesture } from 'project-types';
import { Gesture as KinectGesture } from 'kinect-gestures-controller/types';

export default class Server {
    private static instance: Server;
    private nextServer: NextServer;
    private handle: RequestHandler;
    private port: number;
    private io: SocketIOServer;
    private httpServer: HTTPServer;
    private expressServer: express.Express;
    private kinectServer: KinectServer;
    private leapMotionServer: LeapMotionServer;
    private currentView: string = 'home';

    private constructor() {
        this.nextServer = next({ dev: process.env.NODE_ENV !== 'production' });
        this.handle = this.nextServer.getRequestHandler();
        this.port = process.env.PORT ? parseInt(process.env.PORT) : 3001;

        this.expressServer = express();
        this.expressServer.use(cors({ origin: '*' }));
        this.httpServer = createServer(this.expressServer);
        this.io = new SocketIOServer(this.httpServer);
        this.kinectServer = new KinectServer(this);
        PeerServer({ port: 3002, path: '/' });
        this.leapMotionServer = new LeapMotionServer(this);
    }

    /**
     * Starts a new server
     * @returns this
     */
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
                '/:id/approval',
                (req: Request, res: Response) => {
                    const id = req.params.id;
                    this.io.emit('approval', id);
                    console.log('+1 approval', id);
                    return res.send(id);
                }
            );

            this.expressServer.get(
                '/:id/refusal',
                (req: Request, res: Response) => {
                    const id = req.params.id;
                    this.io.emit('refusal', id);
                    console.log('+1 refusal', id);
                    return res.send(id);
                }
            );

            this.expressServer.get(
                '/answer/:id/:num',
                (req: Request, res: Response) => {
                    const id = req.params.id;
                    const num = req.params.num;
                    this.io.emit('answer', [num, id]);
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
            socket.on('QCMQuestion', (QCMQuestion: any) => {
                this.io.emit('QCMQuestion', QCMQuestion);
            });
            socket.on('3DRotation', (rotation: any) => {
                this.io.emit('3DRotation', rotation);
            });
            socket.on('3DZoom', (zoom: any) => {
                this.io.emit('3DZoom', zoom);
            });
            socket.on('3DState', (state: any) => {
                this.io.emit('3DState', state);
            });
            socket.on('document', (url: string) => {
                console.log('document', url);
                this.io.emit('document', url);
            });
            socket.on('pollEvent', (event: string) => {
                this.io.emit('pollEvent', event);
            });
            socket.on('QCMEvent', (event: string) => {
                this.io.emit('QCMEvent', event);
            });
            socket.on('object3d', (index: number) => {
                this.io.emit('object3d', index);
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
    public sendGesture(gesture: AbstractGesture<any>) {
        console.log(gesture.name);
        let kinectGesture = undefined;
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
            case 'thumb-position-left':
                this.io.emit('thumbs_left_gesture');
                break;
            case 'thumb-position-right':
                this.io.emit('thumbs_right_gesture');
                break;
            case 'swipe-left':
                this.io.emit('swipe_left_gesture');
                break;
            case 'swipe-right':
                this.io.emit('swipe_right_gesture');
                break;
            case 'scroll-right':
                this.io.emit('scroll_right_gesture');
                break;
            case 'scroll-left':
                this.io.emit('scroll_left_gesture');
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
            case 'six-extended-fingers':
                this.io.emit('extended_fingers_gesture', 5);
                break;
            case 'seven-extended-fingers':
                this.io.emit('extended_fingers_gesture', 6);
                break;
            case 'eight-extended-fingers':
                this.io.emit('extended_fingers_gesture', 7);
                break;
            case 'nine-extended-fingers':
                this.io.emit('extended_fingers_gesture', 8);
                break;
            case 'ten-extended-fingers':
                this.io.emit('extended_fingers_gesture', 9);
                break;
            case 'spawn':
                this.io.emit('spawn');
                break;
            case 'vanish':
                this.io.emit('vanish');
                break;

            case 'rotate-left':
                console.log('rotate_left');
                kinectGesture = gesture as KinectGesture<'dynamic'>;
                if (kinectGesture.found) {
                    if (kinectGesture.forearmsMovingType === 'left') {
                        this.io.emit(
                            'rotate_left_gesture',
                            Math.abs(
                                kinectGesture.found.frameDiff
                                    .forearmVelocityDiff!.left![0]
                            )
                        );
                    } else if (kinectGesture.forearmsMovingType === 'right') {
                        this.io.emit(
                            'rotate_left_gesture',
                            Math.abs(
                                kinectGesture.found.frameDiff
                                    .forearmVelocityDiff!.right![0]
                            )
                        );
                    }
                }

                break;
            case 'rotate-right':
                console.log('rotate_right');
                kinectGesture = gesture as KinectGesture<'dynamic'>;
                if (kinectGesture.found) {
                    if (kinectGesture.forearmsMovingType === 'left') {
                        this.io.emit(
                            'rotate_right_gesture',
                            Math.abs(
                                kinectGesture.found.frameDiff
                                    .forearmVelocityDiff!.left![0]
                            )
                        );
                    } else if (kinectGesture.forearmsMovingType === 'right') {
                        this.io.emit(
                            'rotate_right',
                            Math.abs(
                                kinectGesture.found.frameDiff
                                    .forearmVelocityDiff!.right![0]
                            )
                        );
                    }
                }

                break;

            case 'zoom':
                kinectGesture = gesture as KinectGesture<'dynamic'>;
                if (kinectGesture.found) {
                    const intensity =
                        kinectGesture.found!.frameDiff.distanceFrame2 /
                        kinectGesture.found!.frameDiff.forearmSpan;

                    this.io.emit('zoom_gesture', intensity);
                }

                break;

            default:
                break;
        }
    }
}
