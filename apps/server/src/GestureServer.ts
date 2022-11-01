import Server from './Server';
import GestureController from 'gestures-controller';

export default class GestureServer extends GestureController {
    constructor(private server: Server) {
        super({});
        this.addEventListener('gesture', (g) => {
            server.sendGesture(g);
        });
    }
}
