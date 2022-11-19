import GestureController from 'gestures-controller';
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
        this.addEventListener('frame', (f) => console.log(f));
    }
}

new XBoxController();
console.log('test');
