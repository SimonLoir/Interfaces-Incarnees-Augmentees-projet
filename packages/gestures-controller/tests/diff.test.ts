import { describe, expect, test } from '@jest/globals';
import FingerDiff from '../diff/FingerDiff';
import FrameDiff from '../diff/FrameDiff';
import HandDiff from '../diff/HandDiff';
import {
    frame1,
    frame2,
    frameHand,
    frameHand2,
    frameHand3,
    frameHand4,
} from './dataset';
describe('fingers', () => {
    test('extends', () => {
        const diff = new FingerDiff(
            { extended: false, id: '1' } as any,
            { extended: true, id: '1' } as any
        );
        expect(diff.export()).toEqual({ extend: true });
    });

    test('retracts', () => {
        const diff = new FingerDiff(
            { extended: true, id: '1' } as any,
            { extended: false, id: '1' } as any
        );
        expect(diff.export()).toEqual({ retract: true });
    });

    test('different fingers', () => {
        expect(() => {
            new FingerDiff(
                { extended: true, id: '1' } as any,
                { extended: false, id: '2' } as any
            );
        }).toThrow();
    });
});

describe('hands', () => {
    test('different hands', () => {
        expect(
            () => new HandDiff({ id: '1' } as any, { id: '2' } as any, 1000)
        ).toThrow();
    });

    test('test move x axis', () => {
        const diff = new HandDiff(frameHand as any, frameHand2 as any, 1000);
        expect(diff.export().palmPositionDiff[0]).toBe(1);
    });

    test('test move y axis', () => {
        const diff = new HandDiff(frameHand as any, frameHand2 as any, 1000);
        expect(diff.export().palmPositionDiff[1]).toBe(2);
    });

    test('test move z axis', () => {
        const diff = new HandDiff(frameHand as any, frameHand2 as any, 1000);
        expect(diff.export().palmPositionDiff[2]).toBe(3);
    });

    test('no matching fingers', () => {
        const diff = new HandDiff(frameHand as any, frameHand2 as any, 1000);
        expect(diff.export().fingerCountDiff).toEqual(0);
        expect(diff.export().commonFingers.length).toEqual(0);
    });

    test('matching fingers', () => {
        const diff = new HandDiff(frameHand3 as any, frameHand4 as any, 1000);
        expect(diff.export().fingerCountDiff).toEqual(0);
        expect(diff.export().commonFingers.length).toEqual(2);
    });
});
describe('frames', () => {
    test('export hand frame', () => {
        const diff = new FrameDiff(frame1 as any, frame2 as any);
        expect(diff.export().handDiffs['12']).toBeDefined();
        expect(diff.export().commonHands).toEqual(['12']);
    });

    test('finger diff', () => {
        const diff = new FrameDiff(frame1 as any, frame2 as any);
        expect(diff.export().fingerCountDiff).toBe(0);
    });

    test('timestamp diff', () => {
        const diff = new FrameDiff(frame1 as any, frame2 as any);
        expect(diff.export().timeDiff).toBeGreaterThan(0);
    });
});
