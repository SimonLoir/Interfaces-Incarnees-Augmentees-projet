import GestureController from 'gestures-controller';

class Controller extends GestureController {
    constructor() {
        super({});
        const l = this.addEventListener('frame', (f) => {
            console.log(f.id);
        });
        this.addEventListener('gesture', (g) => {
            console.log(g.name, g.type);
        });
        setTimeout(() => this.removeEventListener(l[0], l[1]), 2000);
    }
}

new Controller();
