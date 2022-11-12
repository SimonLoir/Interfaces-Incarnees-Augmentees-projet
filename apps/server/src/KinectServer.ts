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
    private leftArmDiffStart: number[];
    private rightArmDiffStart: number[];
    private leftArmDiffEnd: number[];
    private rightArmDiffEnd: number[];

    constructor(private kinect: Kinect2, private server: Server) {
        // The Kinect2 server can use the server's socket connection to send data to the client
        // exemple: this.server.sendNextView() and this.server.sendPreviousView()
        kinect;
        server;
        this.frameBuffer = [];
        this.leftArmDiffStart = [];
        this.rightArmDiffStart = [];
        this.leftArmDiffEnd = [];
        this.rightArmDiffEnd = [];
    }

    startKinect = () => {
        if (this.kinect.open()) {
            this.kinect.openBodyReader();
            this.kinect.on('bodyFrame', (bodyFrame: any) => {
                bodyFrame.bodies.forEach((body: any) => {
                    //arms diff for x : 0 < x <= 0.15/0.2
                    //arms diff for y : 0 < y < 0.18
                    //arms diff for z : 0.1 <= z
                    if (body.tracked) {
                        if (
                            body.joints[4].trackingState === 2 &&
                            body.joints[5].trackingState === 2
                        ) {
                            this.leftArmDiffStart = [];
                            this.leftArmDiffStart.push(
                                Math.abs(
                                    body.joints[4].cameraX -
                                        body.joints[5].cameraX
                                )
                            );
                            this.leftArmDiffStart.push(
                                Math.abs(
                                    body.joints[4].cameraY -
                                        body.joints[5].cameraY
                                )
                            );
                            this.leftArmDiffStart.push(
                                Math.abs(
                                    body.joints[5].cameraZ -
                                        body.joints[4].cameraZ
                                )
                            );
                        }
                        if (
                            body.joints[8].trackingState === 2 &&
                            body.joints[9].trackingState === 2
                        ) {
                            this.rightArmDiffStart = [];
                            this.rightArmDiffStart.push(
                                Math.abs(
                                    body.joints[8].cameraX +
                                        body.joints[9].cameraX
                                )
                            );
                            this.rightArmDiffStart.push(
                                Math.abs(
                                    body.joints[8].cameraY -
                                        body.joints[9].cameraY
                                )
                            );
                            this.rightArmDiffStart.push(
                                Math.abs(
                                    body.joints[9].cameraZ -
                                        body.joints[8].cameraZ
                                )
                            );
                        }
                        if (this.frameBuffer.length > 15) {
                            if (
                                this.leftArmDiffStart[2] > 0.04 &&
                                this.leftArmDiffEnd[2] > 0.04 &&
                                this.leftArmDiffStart[0] -
                                    this.leftArmDiffEnd[0] >
                                    0.04 -
                                        0.1 *
                                            (this.leftArmDiffStart[1] -
                                                this.leftArmDiffEnd[0]) &&
                                this.rightArmDiffStart[2] > 0.04 &&
                                this.rightArmDiffEnd[2] > 0.04 &&
                                this.rightArmDiffStart[0] -
                                    this.rightArmDiffEnd[0] >
                                    0.04 -
                                        0.1 *
                                            (this.leftArmDiffStart[1] -
                                                this.leftArmDiffEnd[0])
                            )
                                console.log('opened arms');
                        }
                        if (this.frameBuffer.length > 29) {
                            this.frameBuffer.reverse().pop;
                            this.frameBuffer.reverse;
                            this.leftArmDiffEnd = [];
                            this.leftArmDiffEnd.push(
                                Math.abs(
                                    body.joints[4].cameraX -
                                        body.joints[5].cameraX
                                )
                            );
                            this.leftArmDiffEnd.push(
                                Math.abs(
                                    body.joints[4].cameraY -
                                        body.joints[5].cameraY
                                )
                            );
                            this.leftArmDiffEnd.push(
                                Math.abs(
                                    body.joints[5].cameraZ -
                                        body.joints[4].cameraZ
                                )
                            );
                            this.rightArmDiffEnd = [];
                            this.rightArmDiffEnd.push(
                                Math.abs(
                                    body.joints[8].cameraX +
                                        body.joints[9].cameraX
                                )
                            );
                            this.rightArmDiffEnd.push(
                                Math.abs(
                                    body.joints[8].cameraY -
                                        body.joints[9].cameraY
                                )
                            );
                            this.rightArmDiffEnd.push(
                                Math.abs(
                                    body.joints[9].cameraZ -
                                        body.joints[8].cameraZ
                                )
                            );
                            fs.writeFileSync(
                                '../tests/kinectBodyFrame.json',
                                JSON.stringify(this.frameBuffer)
                            );
                            //this.kinect.close();
                        }
                        this.frameBuffer.push(body);
                    }
                });
            });
        }
    };
}
