import Server from './Server';
import LeapMotionGestureController from 'leap-gestures-controller';

export default class LeapMotionServer extends LeapMotionGestureController {
    /**
     * Creates a LeapMotionServer instance attached to the http server.
     * @param server The server to send the gestures to.
     */
    constructor(server: Server) {
        // Allows only the following gestures
        super({}, [
            'thumb-position-down',
            'thumb-position-up',
            'screen-sharing',
            'scroll-left',
            'scroll-right',
            'one-extended-fingers',
            'two-extended-fingers',
            'three-extended-fingers',
            'four-extended-fingers',
            'five-extended-fingers',
        ]);

        // Adds a listener for each gesture
        this.addEventListener('gesture', (g) => {
            // Sends the gesture to the http server
            server.sendGesture(g);
        });
    }
}
