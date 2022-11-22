import { VectorModel } from 'project-types';
import { Gesture } from '../types';

const rightFrameDirection: VectorModel = {
    minX: 0.5,
    minY: -0.3,
    maxY: 0.3,
};
const leftFrameDirection: VectorModel = {
    maxX: -0.5,
    minY: -0.3,
    maxY: 0.3,
};

const velocityDiffLeft: VectorModel = {
    minX: -70,
    minY: -30,
    maxY: 30,
};
const velocityDiffRight: VectorModel = {
    maxX: 70,
    minY: -30,
    maxY: 30,
};

function GenerateRotateGesture(type: 'left' | 'right'): Gesture<'dynamic'> {
    return {
        name: 'rotate-' + type,
        type: 'dynamic',
        description: 'Rotates the 3D Object to the ' + type,
        coolDown: 1000,
        data: [
            {
                minDuration: 0,
                body: {
                    arms: [
                        {
                            direction:
                                type === 'right'
                                    ? leftFrameDirection
                                    : rightFrameDirection,
                        },
                    ],
                    forearms: [
                        {
                            direction:
                                type === 'right'
                                    ? leftFrameDirection
                                    : rightFrameDirection,
                        },
                    ],
                },
            },
            {
                minDuration: 0,
                maxDuration: 1 * 1_000_000,
                body: {
                    arms: [
                        {
                            direction:
                                type === 'right'
                                    ? rightFrameDirection
                                    : leftFrameDirection,
                            velocityDiff:
                                type === 'right'
                                    ? velocityDiffRight
                                    : velocityDiffLeft,
                        },
                    ],
                    forearms: [
                        {
                            direction:
                                type === 'right'
                                    ? rightFrameDirection
                                    : leftFrameDirection,
                            velocityDiff:
                                type === 'right'
                                    ? velocityDiffRight
                                    : velocityDiffLeft,
                        },
                    ],
                },
            },
        ],
    };
}

export const rotateLeftGesture = GenerateRotateGesture('left');
export const rotateRightGesture = GenerateRotateGesture('right');
