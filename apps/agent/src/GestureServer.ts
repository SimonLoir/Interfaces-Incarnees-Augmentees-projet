import Server from './Server';
import GestureController from 'gestures-controller';

export default class GestureServer extends GestureController {
    constructor(server: Server) {
        super({}, [
            'thumb-position-down',
            'thumb-position-up',
            'screen-sharing',
            'scroll-left',
            'scroll-right',
            'one-extended-fingers',
            'two-extended-fingers',
            'three-extended-fingers',
            'four-extended-fingers',
            'five-extended-fingers',
        ]);
        this.addEventListener('gesture', (g) => {
            console.log(g);
            server.sendGesture(g);
        });
    }
}
