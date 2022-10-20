import Kinect2 from 'kinect2';
import Server from './Server';

export default class KinectServer {
    constructor(private kinect: Kinect2, private server: Server) {
        console.log(kinect, server);
    }
}
