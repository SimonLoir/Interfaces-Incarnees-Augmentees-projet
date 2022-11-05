import { describe, expect, test } from '@jest/globals';
import GestureController from '..';
import { thumbUpGesture } from '../gestures/thumb-position';

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

    test('leap controller on frame', () => {
        const controller = new Controller();
        //@ts-ignore
        const emit = controller['leapController']['emit'].bind(
            controller['leapController']
        );

        emit('frame', { id: 2, currentFrameRate: controller['frameRate'] * 2 });
        expect(controller['frameStore'].length).toBe(1);

        emit('frame', { id: 3, currentFrameRate: controller['frameRate'] * 2 });
        expect(controller['frameStore'].length).toBe(1);
    });

    test('trigger frame event listener', () => {
        const controller = new Controller();
        //@ts-ignore
        const emit = controller['leapController']['emit'].bind(
            controller['leapController']
        );

        const listener = jest.fn();
        controller['addEventListener']('frame', listener);
        emit('frame', { id: 2, currentFrameRate: controller['frameRate'] * 2 });
        expect(listener).toBeCalledTimes(1);
    });

    test('trigger gesture event listener', () => {
        const controller = new Controller();
        //@ts-ignore
        const emit = controller['leapController']['emit'].bind(
            controller['leapController']
        );

        controller['extractFromFrames'] = () => [thumbUpGesture];

        const listener = jest.fn();
        controller['addEventListener']('gesture', listener);

        emit('frame', { id: 2, currentFrameRate: controller['frameRate'] * 2 });
        expect(listener).toBeCalledTimes(1);

        emit('frame', { id: 2, currentFrameRate: controller['frameRate'] * 2 });
        expect(listener).toBeCalledTimes(1);
    });
});
