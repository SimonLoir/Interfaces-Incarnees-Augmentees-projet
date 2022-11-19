import GestureController, { FrameExporter } from 'gestures-controller';

class Controller extends GestureController {
    constructor() {
        super({}, []);
        this.addEventListener('frame', (f) => {
            const fe = new FrameExporter(f);
        });
        this.addEventListener('gesture', (g) => console.log(g));
    }
}

new Controller();
