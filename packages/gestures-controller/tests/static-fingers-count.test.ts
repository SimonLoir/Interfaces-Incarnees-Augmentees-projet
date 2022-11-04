import { describe, expect, test } from '@jest/globals';
import GestureController from '../GestureController';
import { oneFingerUpGesture } from '../gestures/hand-counting';
class Controller extends GestureController {
    constructor() {
        super({});
    }
}
describe('One finger', () => {
    let controller: Controller;

    beforeAll(() => {
        controller = new Controller();
    });

    test('1 finger - empty frame', () => {
        expect(() => {
            controller.matchStaticGesture(oneFingerUpGesture, {} as any);
        }).toThrow();
    });
});
