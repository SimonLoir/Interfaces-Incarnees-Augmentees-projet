import GestureController, { FrameExporter } from 'gestures-controller';

class Controller extends GestureController {
    constructor() {
        super({}, []);
        this.addEventListener('frame', (f) => {
            console.log(JSON.stringify(new FrameExporter(f).export()));
        });
    }
}

new Controller();
