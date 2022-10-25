import Server from './Server';
import Leap from 'leapjs';

export default class GestureServer {
    constructor(private server: Server) {
        const controller = new Leap.Controller({});

        controller.on('frame', (frame) => {
            if (frame.pointables.length > 0) {
                console.log(frame.pointables[0]);
            }
        });

        controller.connect();
    }
}
