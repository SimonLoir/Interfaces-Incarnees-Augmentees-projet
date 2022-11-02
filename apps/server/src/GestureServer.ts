import Server from './Server';
import GestureController from 'gestures-controller';

export default class GestureServer extends GestureController {
    constructor(private server: Server) {
        super({}, ['thumbs-down', 'thumbs-up', 'screen-sharing']);
        this.addEventListener('gesture', (g) => {
            console.log('received gesture', g);
            server.sendGesture(g);
        });
    }
}
