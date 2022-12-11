import Server from './Server';
import KinectGestureController from 'kinect-gestures-controller';

export default class KinectServer extends KinectGestureController {
    /**
     * Creates an instance of KinectServer.
     * @param server The server to send the gestures to.
     */
    constructor(server: Server) {
        // Allows all gestures
        super([]);

        // Adds a listener for each gesture
        this.addEventListener('gesture', (g) => {
            // Sends the gesture to the http server
            server.sendGesture(g);
        });
    }
}
