import { describe, expect, test } from '@jest/globals';
import GestureController from '../GestureController';
describe('vector model check', () => {
    test('valid vectors', () => {
        const checkVectorModel =
            GestureController['prototype']['checkVectorModel'];
        expect(checkVectorModel({}, [0, 0, 0])).toBe(true);

        expect(checkVectorModel({ minX: -1 }, [0, 0, 0])).toBe(true);
        expect(checkVectorModel({ maxX: 1 }, [0, 0, 0])).toBe(true);

        expect(checkVectorModel({ minY: -1 }, [0, 0, 0])).toBe(true);
        expect(checkVectorModel({ maxY: 1 }, [0, 0, 0])).toBe(true);

        expect(checkVectorModel({ minZ: -1 }, [0, 0, 0])).toBe(true);
        expect(checkVectorModel({ maxZ: 1 }, [0, 0, 0])).toBe(true);
    });

    test('invalid vectors', () => {
        const checkVectorModel =
            GestureController['prototype']['checkVectorModel'];

        expect(checkVectorModel({ minX: -1 }, [-2, 0, 0])).toBe(false);
        expect(checkVectorModel({ maxX: 1 }, [2, 0, 0])).toBe(false);

        expect(checkVectorModel({ minY: -1 }, [0, -2, 0])).toBe(false);
        expect(checkVectorModel({ maxY: 1 }, [0, 2, 0])).toBe(false);

        expect(checkVectorModel({ minZ: -1 }, [0, 0, -2])).toBe(false);
        expect(checkVectorModel({ maxZ: 1 }, [0, 0, 2])).toBe(false);
    });
});
