import Server from './Server';
import GestureController from 'gestures-controller';

export default class GestureServer extends GestureController {
    constructor(private server: Server) {
        super({}, [
            'thumb-position-down',
            'thumb-position-up',
            'screen-sharing',
        ]);
        this.addEventListener('gesture', (g) => {
            console.log('received gesture', g);
            server.sendGesture(g);
        });
    }
}
