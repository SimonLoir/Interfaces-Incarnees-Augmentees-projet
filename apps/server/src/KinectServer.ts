import Kinect2 from 'kinect2';
import Server from './Server';

export default class KinectServer {
    constructor(private kinect: Kinect2, private server: Server) {
        console.log(kinect, server);
    }
}

//const Kinect2 = require('kinect2');
//const kinect = new Kinect2();

/*
        const startKinect = () => {
            if (kinect.open()) {
                kinect.openBodyReader();
                kinect.on('bodyFrame', (bodyFrame: any) => {
                    drawBodyFrame(bodyFrame);
                });
            }
        };

        startKinect();

let drawBodyFrame = (bodyFrame: any) => {
    let bodyIndex = 0;
    bodyFrame.array.forEach((body: any) => {
        console.log('Body nb ' + bodyIndex);
        if (body.tracked) {
            for (const jointType in body.joints) {
                const joint = body.joints[jointType];
                if (joint.trackingState > Kinect2.TrackingState.notTracked) {
                    console.log('hi2');
                }
            }
        }
    });
};

*/
