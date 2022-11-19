import Server from './Server';
import GestureController from 'gestures-controller';

export default class GestureServer extends GestureController {
    constructor(server: Server) {
        super({}, [
            'thumb-position-down',
            'thumb-position-up',
            'screen-sharing',
            'swipe-left',
            'swipe-right',
            'scroll-right',
            'scroll-left',
            'one-extended-fingers',
            'two-extended-fingers',
            'three-extended-fingers',
            'four-extended-fingers',
            'five-extended-fingers',
            'six-extended-fingers',
            'seven-extended-fingers',
            'eight-extended-fingers',
            'nine-extended-fingers',
            'ten-extended-fingers',
        ]);
        this.addEventListener('gesture', (g) => {
            console.log('received gesture', g);
            server.sendGesture(g);
        });
    }
}
