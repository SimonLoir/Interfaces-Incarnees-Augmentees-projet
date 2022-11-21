import { describe, expect, test } from '@jest/globals';
import Leap from 'leapjs';
import FrameExporter from '../FrameExporter';
describe('Frame exporter', () => {
    test('export badly shaped frame', () => {
        expect(() => new FrameExporter({} as any).export()).toThrow();
    });

    test('frame without hand', () => {
        expect(
            new FrameExporter({
                id: 30,
                hands: [],
                timestamp: 1,
            } as any).export()
        ).toEqual({ id: 30, hands: [], timestamp: 1 });
    });

    test('export finger', () => {
        expect(
            FrameExporter['prototype']['exportFingerData']({
                type: 0,
                direction: [1, 2, 3],
                stabilizedTipPosition: [4, 5, 6],
                length: 7,
                width: 8,
                timeVisible: 9,
                tipPosition: [10, 11, 12],
                tipVelocity: [13, 14, 15],
            } as any)
        ).toEqual({
            type: 'Thumb',
            direction: [1, 2, 3],
            stabilizedTipPosition: [4, 5, 6],
            length: 7,
            width: 8,
            timeVisible: 9,
            tipPosition: [10, 11, 12],
            tipVelocity: [13, 14, 15],
        });
    });

    test('frame with hand', () => {
        expect(
            new FrameExporter({
                id: 30,
                hands: [
                    {
                        id: '1',
                        type: 'left',
                        direction: [1, 2, 3],
                        palmNormal: [4, 5, 6],
                        palmPosition: [7, 8, 9],
                        palmVelocity: [10, 11, 12],
                        grabStrength: 1,
                        pinchStrength: 1,
                        stabilizedPalmPosition: [13, 14, 15],
                        sphereCenter: [16, 17, 18],
                        sphereRadius: 1,
                        fingers: [],
                        arm: {
                            basis: [[], [], []],
                        },
                    },
                ],
                timestamp: 1,
            } as Partial<Leap.Frame> as any).export()
        ).toEqual({
            id: 30,
            timestamp: 1,
            hands: [
                {
                    armBasis: [[], [], []],
                    type: 'left',
                    direction: [1, 2, 3],
                    palmNormal: [4, 5, 6],
                    palmPosition: [7, 8, 9],
                    palmVelocity: [10, 11, 12],
                    grabStrength: 1,
                    pinchStrength: 1,
                    stabilizedPalmPosition: [13, 14, 15],
                    sphereCenter: [16, 17, 18],
                    sphereRadius: 1,
                    fingers: [],
                },
            ],
        });
    });
});
