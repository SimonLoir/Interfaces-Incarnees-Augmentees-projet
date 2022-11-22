import GestureController from 'leap-gestures-controller';
import KinectController from 'kinect-gestures-controller';
import { Gesture } from 'kinect-gestures-controller/types';

class Controller extends GestureController {
    constructor() {
        super({}, []);

        this.addEventListener('frame', (f) => {
            f.hands.forEach((h) => {
                console.log(h.palmNormal);
            });
        });
        this.addEventListener('gesture', (g) => console.log(g));
    }
}

new Controller();

class XBoxController extends KinectController {
    constructor() {
        super();
        this.addEventListener('gesture', (g) => {
            console.log(g);
            if (g.name === 'zoom_out') {
                console.log(
                    (g as Gesture<'dynamic'>).found?.frameDiff.armsPositionDiff
                );
            }
        });
    }
}

new XBoxController();
