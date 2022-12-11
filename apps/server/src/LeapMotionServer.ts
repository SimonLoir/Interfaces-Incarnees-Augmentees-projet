import Server from './Server';
import LeapMotionGestureController from 'leap-gestures-controller';

export default class LeapMotionServer extends LeapMotionGestureController {
    /**
     * Creates an instance of LeapMotionServer.
     * @param server The server to send the gestures to.
     */
    constructor(server: Server) {
        // Allows only the following gestures
        super({}, [
            'thumb-position-down',
            'thumb-position-up',
            'thumb-position-left',
            'thumb-position-right',
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

        // Adds a listener for each gesture
        this.addEventListener('gesture', (g) => {
            // Sends the gesture to the http server
            server.sendGesture(g);
        });
    }
}
