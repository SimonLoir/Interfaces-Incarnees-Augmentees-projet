import Kinect2 from 'kinect2';
import Server from './Server';
import * as fs from 'fs';

type Joint = {
    depthX: number;
    depthY: number;
    colorX: number;
    colorY: number;
    cameraX: number;
    cameraY: number;
    cameraZ: number;
    orientationX: number;
    orientationY: number;
    orientationZ: number;
    orientationW: number;
    jointType: number;
    trackingState: number;
};

type KinectBody = {
    bodyIndex: number;
    tracked: boolean;
    trackingId: number;
    leftHandState: number;
    rightHandState: number;
    joints: Joint[];
};

export default class KinectServer {
    private frameBuffer: KinectBody[];

    constructor(private kinect: Kinect2, private server: Server) {
        // The Kinect2 server can use the server's socket connection to send data to the client
        // exemple: this.server.sendNextView() and this.server.sendPreviousView()
        kinect;
        server;
        this.frameBuffer = [];
    }

    startKinect = () => {
        if (this.kinect.open()) {
            this.kinect.openBodyReader();
            this.kinect.on('bodyFrame', (bodyFrame: any) => {
                bodyFrame.bodies.forEach((body: any) => {
                    if (body.tracked) {
                        /*if (
                            body.joints[4].trackingState !== 0 &&
                            body.joints[5].trackingState !== 0
                        )
                            console.log(
                                'left arm x : ' +
                                    body.joints[4].cameraX
                            );
                        if (
                            body.joints[8].trackingState !== 0 &&
                            body.joints[9].trackingState !== 0
                        )
                            console.log(
                                'right arm x : ' +
                                    body.joints[8].cameraX
                            );*/
                        if (this.frameBuffer.length > 29) {
                            this.frameBuffer.reverse().pop;
                            this.frameBuffer.reverse;
                            fs.writeFileSync(
                                '../tests/kinectBodyFrame.json',
                                JSON.stringify(this.frameBuffer)
                            );
                            this.kinect.close();
                        }
                        this.frameBuffer.push(body);
                    }
                });
            });
        }
    };
}
