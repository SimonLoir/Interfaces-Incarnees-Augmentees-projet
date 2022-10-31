import GestureController, { FrameExporter } from 'gestures-controller';
import express from 'express';
import Leap from 'leapjs';
import * as fs from 'fs';

class Controller extends GestureController {
    private frameRate = 3;
    private frameStoreLength = this.frameRate * 3; // 3 seconds
    private frameStore: Leap.Frame[] = [];
    private listen = false;
    constructor() {
        const app = express();

        app.get('/toggle-listen', (req, res) => {
            this.listen = !this.listen;
            console.log('Listening: ' + this.listen);
            if (this.listen === false && this.frameStore.length > 0) {
                fs.writeFileSync(
                    'frame.json',
                    JSON.stringify({
                        frames: this.frameStore.map((f) =>
                            new FrameExporter(f).export()
                        ),
                        diff: this.frameStore.map((f, i) => {
                            const diff = [];

                            for (
                                let j = i + 1;
                                j < this.frameStore.length;
                                j++
                            ) {
                                diff.push(
                                    this.frameDiff(
                                        f,
                                        this.frameStore[j]
                                    ).export()
                                );
                            }
                            return diff;
                        }),
                    })
                );
                this.frameStore = [];
            }
            return res.send('Listening: ' + this.listen);
        });

        app.listen(8080);
        const controller = new Leap.Controller({});
        super(controller);
        controller.on('frame', (frame) => {
            if (
                frame.id %
                    Math.floor(frame.currentFrameRate / this.frameRate) !==
                0
            )
                return;

            //console.log(this.frameStore.map((f) => f.id));
            this.frameStore.push(frame);
            if (this.frameStore.length > this.frameStoreLength)
                this.frameStore.shift();
        });

        controller.connect();
    }
}

new Controller();
