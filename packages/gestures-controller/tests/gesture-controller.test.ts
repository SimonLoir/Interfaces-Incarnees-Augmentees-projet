import { describe, expect, test } from '@jest/globals';
import GestureController from '..';

class Controller extends GestureController {
    constructor(gestures?: string[]) {
        super({}, gestures);
    }
}
describe('GestureController', () => {
    test('export from empty frame buffer', () => {
        const controller = new Controller();
        expect(controller.extractFromFrames([])).toEqual([]);
        controller.destroy();
    });

    test('select static gestures', () => {
        const controller = new Controller(['one-extended-fingers']);
        const controller2 = new Controller();

        expect(controller['staticGestures'].length).toBe(1);
        expect(controller['staticGestures'].length).toBeLessThanOrEqual(
            controller2['staticGestures'].length
        );

        expect(controller['dynamicGestures'].length).toBe(0);
        expect(controller['dynamicGestures'].length).toBeLessThanOrEqual(
            controller2['dynamicGestures'].length
        );

        controller.destroy();
        controller2.destroy();
    });

    test('event listeners', () => {
        const controller = new Controller();
        const listener = jest.fn();
        controller['addEventListener']('frame', listener);
        expect(controller['eventListeners'].frame.length).toBe(1);
        expect(controller['eventListeners'].frame[0]).toBe(listener);
        controller['removeEventListener']('frame', listener);
        expect(controller['eventListeners'].frame.length).toBe(0);
        controller.destroy();
    });
});
