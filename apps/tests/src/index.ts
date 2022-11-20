import GestureController from 'gestures-controller';
import KinectController from 'kinect-gestures-controller';
import * as fs from 'fs';
import Frame from 'kinect-gestures-controller/Frame';

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
