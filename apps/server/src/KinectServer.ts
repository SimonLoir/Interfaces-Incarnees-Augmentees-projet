import Server from './Server';
import KinectGestureController from 'kinect-gestures-controller';

export default class KinectServer extends KinectGestureController {
    constructor(server: Server) {
        super([]);
        this.addEventListener('gesture', (g) => {
            server.sendGesture(g);
        });
    }
}
