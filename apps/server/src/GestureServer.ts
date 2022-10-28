import Server from './Server';
import Leap from 'leapjs';
import GestureController from 'gestures-controller';

export default class GestureServer extends GestureController {
    constructor(private server: Server) {
        const controller = new Leap.Controller({});
        super(controller);

        console.log('Server started with gestures', this.gestures);

        controller.on('frame', (frame) => {
            if (frame.pointables.length > 0) {
                console.log(frame.pointables[0]);
            }
        });

        controller.connect();
    }
}
