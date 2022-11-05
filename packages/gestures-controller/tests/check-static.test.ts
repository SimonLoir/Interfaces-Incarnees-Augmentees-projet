import { describe, expect, test } from '@jest/globals';
import GestureController from '..';
import {
    frameWithLeftHand,
    frameWithRightHand,
    modelWithBothHands,
    modelWithLeftHand,
    modelWithRightHand,
} from './dataset';

class Controller extends GestureController {
    constructor() {
        super({});
    }
}
describe('GestureController', () => {
    let controller: Controller;
    beforeAll(() => {
        controller = new Controller();
    });

    test('check static - has right hand', () => {
        expect(
            controller.checkStaticPropertiesForModel(
                modelWithRightHand,
                frameWithRightHand as any
            )
        ).toBe(true);
        expect(
            controller.checkStaticPropertiesForModel(
                modelWithRightHand,
                frameWithLeftHand as any
            )
        ).toBe(false);
    });

    test('check static - has left hand', () => {
        expect(
            controller.checkStaticPropertiesForModel(
                modelWithLeftHand,
                frameWithLeftHand as any
            )
        ).toBe(true);
        expect(
            controller.checkStaticPropertiesForModel(
                modelWithLeftHand,
                frameWithRightHand as any
            )
        ).toBe(false);
    });

    test('check static - at least right or left hand ', () => {
        expect(
            controller.checkStaticPropertiesForModel(
                modelWithBothHands,
                frameWithLeftHand as any
            )
        ).toBe(true);
        expect(
            controller.checkStaticPropertiesForModel(
                modelWithBothHands,
                frameWithRightHand as any
            )
        ).toBe(true);
    });

    afterAll(() => {
        controller.destroy();
    });
});
