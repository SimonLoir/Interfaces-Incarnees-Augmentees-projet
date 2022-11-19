import GestureController, { FrameExporter } from 'gestures-controller';
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
    }
}

new XBoxController();
console.log('test');
