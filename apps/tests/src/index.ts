import GestureController from 'leap-gestures-controller';
import KinectController from 'kinect-gestures-controller';

class Controller extends GestureController {
    constructor() {
        super({}, []);

        this.addEventListener('frame', (f) => {});
        this.addEventListener('gesture', (g) => console.log(g));
    }
}

new Controller();

class XBoxController extends KinectController {
    constructor() {
        super();
        this.addEventListener('frame', (f) => {});
    }
}

new XBoxController();
