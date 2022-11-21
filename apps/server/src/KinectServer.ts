import Server from './Server';
import KinectGestureController from 'kinect-gestures-controller';

export default class KinectServer extends KinectGestureController {
    constructor(server: Server) {
        super([]);
        this.addEventListener('gesture', (g) => {
            console.log('received gesture', g);
            server.sendGesture(g);
        });
    }
}

/*

@@ -1,251 +1,30 @@
import Kinect2 from 'kinect2';
import Server from './Server';
import * as fs from 'fs';

#ifndef Kinect2_Structs_h
#define Kinect2_Structs_h

#include "Globals.h"

typedef struct _JSJoint
{
	float depthX;
	float depthY;
	float colorX;
	float colorY;
	float cameraX;
	float cameraY;
	float cameraZ;
	//
	bool hasFloorData;
	float floorDepthX;
	float floorDepthY;
	float floorColorX;
	float floorColorY;
	float floorCameraX;
	float floorCameraY;
	float floorCameraZ;
	//
	float orientationX;
	float orientationY;
	float orientationZ;
	float orientationW;
	//
	int jointType;
	//
	char trackingState;
} JSJoint;

typedef struct _JSBody
{
	bool tracked;
	bool hasPixels;
	UINT64 trackingId;
	char leftHandState;
	char rightHandState;
	JSJoint joints[JointType_Count];
} JSBody;

typedef struct _JSBodyFrame
{
	JSBody bodies[BODY_COUNT];
	//
	bool hasFloorClipPlane;
	float floorClipPlaneX;
	float floorClipPlaneY;
	float floorClipPlaneZ;
	float floorClipPlaneW;
	//
	float cameraAngle;
	float cosCameraAngle;
	float sinCameraAngle;
} JSBodyFrame;

#endif


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

function computeDiffBetweenJoints(joint1: Joint, joint2: Joint): number[] {
    const xDiff = Math.abs(joint1.cameraX - joint2.cameraX);
    const yDiff = Math.abs(joint1.cameraY - joint2.cameraY);
    const zDiff = Math.abs(joint1.cameraZ - joint2.cameraZ);
    return [xDiff, yDiff, zDiff];
}

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
import KinectGestureController from 'kinect-gestures-controller';

export default class GestureServer extends KinectGestureController {
    constructor(server: Server) {
        super([
            'thumb-position-down',
            'thumb-position-up',
            'screen-sharing',
            'swipe-left',
            'swipe-right',
            'scroll-right',
            'scroll-left',
            'one-extended-fingers',
            'two-extended-fingers',
            'three-extended-fingers',
            'four-extended-fingers',
            'five-extended-fingers',
            'six-extended-fingers',
            'seven-extended-fingers',
            'eight-extended-fingers',
            'nine-extended-fingers',
            'ten-extended-fingers',
        ]);
        this.addEventListener('gesture', (g) => {
            console.log('received gesture', g);
            server.sendGesture(g);
        });
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
                            body.joints[4].trackingState > 0 &&
                            body.joints[5].trackingState > 0
                        ) {
                            this.leftArmDiffStart = computeDiffBetweenJoints(
                                body.joints[4],
                                body.joints[5]
                            );
                        }
                        if (
                            body.joints[8].trackingState > 0 &&
                            body.joints[9].trackingState > 0
                        ) {
                            this.rightArmDiffStart = computeDiffBetweenJoints(
                                body.joints[8],
                                body.joints[9]
                            );
                        }
                        //open arm gesture
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
                        //close arm gesture
                        if (this.frameBuffer.length > 15) {
                            if (
                                this.leftArmDiffStart[2] > 0.04 &&
                                this.leftArmDiffEnd[2] > 0.04 &&
                                this.leftArmDiffEnd[0] -
                                    this.leftArmDiffStart[0] >
                                    0.04 -
                                        0.1 *
                                            (this.leftArmDiffStart[1] -
                                                this.leftArmDiffEnd[0]) &&
                                this.rightArmDiffStart[2] > 0.04 &&
                                this.rightArmDiffEnd[2] > 0.04 &&
                                this.rightArmDiffEnd[0] -
                                    this.rightArmDiffStart[0] >
                                    0.04 -
                                        0.1 *
                                            (this.leftArmDiffStart[1] -
                                                this.leftArmDiffEnd[0])
                            )
                                console.log('closed arms');
                        }
                        //clap gesture
                        if (this.frameBuffer.length > 15) {
                            if (
                                this.leftArmDiffStart[0] -
                                    this.leftArmDiffEnd[0] >
                                    0.02 -
                                        0.1 *
                                            (this.leftArmDiffStart[1] -
                                                this.leftArmDiffEnd[0]) &&
                                this.rightArmDiffStart[0] -
                                    this.rightArmDiffEnd[0] >
                                    0.02 -
                                        0.1 *
                                            (this.leftArmDiffStart[1] -
                                                this.leftArmDiffEnd[0]) &&
                                Math.abs(
                                    body.joints[7].cameraX -
                                        body.joints[11].cameraX
                                ) < 0.2 &&
                                Math.abs(
                                    body.joints[7].cameraY -
                                        body.joints[11].cameraY
                                ) < 0.2
                            ) {
                                console.log(
                                    'l wrist x : ',
                                    body.joints[7].cameraX
                                );
                                console.log(
                                    'r wrist x : ',
                                    body.joints[11].cameraX
                                );
                                console.log('clap');
                            }
                        }

                        if (this.frameBuffer.length > 29) {
                            this.frameBuffer.shift();

                            this.leftArmDiffEnd = computeDiffBetweenJoints(
                                body.joints[4],
                                body.joints[5]
                            );

                            this.rightArmDiffEnd = computeDiffBetweenJoints(
                                body.joints[8],
                                body.joints[9]
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
 */
