import { describe, expect, test } from '@jest/globals';
import LeapMotionGestureController from '../LeapMotionGestureController';
import { oneFingerUpGesture } from '../gestures/hand-counting';
class Controller extends LeapMotionGestureController {
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
