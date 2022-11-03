import Kinect2 from 'kinect2';
import Server from './Server';
import * as fs from 'fs';

export default class KinectServer {
    constructor(private kinect: Kinect2, private server: Server) {
        // The Kinect2 server can use the server's socket connection to send data to the client
        // exemple: this.server.sendNextView() and this.server.sendPreviousView()
        kinect;
        server;
    }

    startKinect = () => {
        if (this.kinect.open()) {
            this.kinect.openBodyReader();
            this.kinect.on('bodyFrame', (bodyFrame: any) => {
                bodyFrame.bodies.forEach((body: any) => {
                    if (body.tracked) {
                        fs.writeFileSync(
                            '../tests/kinectBodyFrame.json',
                            JSON.stringify(body)
                        );
                        this.kinect.close();
                    }
                });
            });
        }
    };
}
