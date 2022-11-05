import { describe, expect, test } from '@jest/globals';
import GestureController from '..';
import {
    frameEmpty,
    frameWithLeftClosedFist,
    frameWithLeftHand,
    frameWithLeftOpenFist,
    frameWithRightClosedFist,
    frameWithRightHand,
    frameWithRightOpenFist,
    modelWithBothHands,
    modelWithHandClosed,
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
    });

    test('check static - has right hand fail', () => {
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
    });

    test('check static - has left hand fail', () => {
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

    test('check static - no hands', () => {
        expect(
            controller.checkStaticPropertiesForModel(
                modelWithBothHands,
                frameEmpty as any
            )
        ).toBe(false);
    });

    test('grab strength', () => {
        expect(
            controller.checkStaticPropertiesForModel(
                modelWithHandClosed,
                frameWithRightClosedFist as any
            )
        ).toBe(true);

        expect(
            controller.checkStaticPropertiesForModel(
                modelWithHandClosed,
                frameWithLeftClosedFist as any
            )
        ).toBe(true);
    });

    test('grab strength - fail', () => {
        expect(
            controller.checkStaticPropertiesForModel(
                modelWithHandClosed,
                frameWithLeftOpenFist as any
            )
        ).toBe(false);

        expect(
            controller.checkStaticPropertiesForModel(
                modelWithHandClosed,
                frameWithRightOpenFist as any
            )
        ).toBe(false);
    });

    test('match static empty buffer', () => {
        expect(
            controller.matchStaticGesture(
                {
                    name: '',
                    data: { minDuration: 1 },
                    type: 'static',
                    description: '',
                },
                []
            )
        ).toBe(false);
    });

    afterAll(() => {
        controller.destroy();
    });
});
