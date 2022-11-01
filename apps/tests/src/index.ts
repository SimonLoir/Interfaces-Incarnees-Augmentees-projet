import GestureController from 'gestures-controller';

class Controller extends GestureController {
    constructor() {
        super({}, ['screen-sharing']);
        this.addEventListener('gesture', (g) => {
            console.log(g.name, g.type);
        });
    }
}

new Controller();
