import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import Server from './Server';
if (existsSync('.env.local')) dotenv.config({ path: '.env.local' });

(async () => {
    const server = await Server.getInstance().start();
    console.log(server);
})();
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
