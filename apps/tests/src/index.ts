import GestureController from 'gestures-controller';
import Leap from 'leapjs';
class Controller extends GestureController {
    constructor() {
        const controller = new Leap.Controller({});
        super(controller);
        controller.on('frame', () => {});
        controller.connect();
    }
}

new Controller();
