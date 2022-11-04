import { describe, expect, test } from '@jest/globals';
import GestureController from '..';

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

    test('export from empty frame buffer', () => {
        expect(controller.extractFromFrames([])).toEqual([]);
    });

    afterAll(() => {
        controller.destroy();
    });
});
