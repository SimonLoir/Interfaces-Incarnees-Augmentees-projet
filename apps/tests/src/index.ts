import GestureController from 'gestures-controller';

class Controller extends GestureController {
    constructor() {
        super({}, ['thumbs-up', 'thumbs-down']);
        this.addEventListener('gesture', (g) => {
            console.log(g.name, g.type);
        });
    }
}

new Controller();
