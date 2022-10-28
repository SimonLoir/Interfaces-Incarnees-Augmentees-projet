import GestureController, { FrameExporter } from 'gestures-controller';
import Leap from 'leapjs';
import * as fs from 'fs';
class Controller extends GestureController {
    private frameRate = 3;
    private frameStoreLength = this.frameRate * 3; // 3 seconds
    private frameStore: Leap.Frame[] = [];
    constructor() {
        console.log('Hello world from server');
        const controller = new Leap.Controller({});
        super(controller);
        controller.on('frame', (frame) => {
            if (
                frame.id %
                    Math.floor(frame.currentFrameRate / this.frameRate) !==
                0
            )
                return;

            console.log(this.frameStore.map((f) => f.id));
            this.frameStore.push(frame);
            if (this.frameStore.length > this.frameStoreLength)
                this.frameStore.shift();
        });
        controller.connect();
        process.on('SIGINT', () => {
            console.log('hello world');
            fs.writeFileSync(
                'data.json',
                JSON.stringify(
                    this.frameStore.map((frame) =>
                        new FrameExporter(frame).export()
                    )
                )
            );
            controller.disconnect();
        });
    }
}

new Controller();
