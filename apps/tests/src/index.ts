import GestureController, { FrameExporter } from 'gestures-controller';

class Controller extends GestureController {
    constructor() {
        super({}, []);
        this.addEventListener('frame', (f) => {
            const fe = new FrameExporter(f);
            console.log(JSON.stringify(fe.export().hands[0]?.palmPosition));
        });
        this.addEventListener('gesture', (g) => console.log(g));
    }
}

new Controller();
