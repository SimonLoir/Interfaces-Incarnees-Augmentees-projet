import { VectorModel } from 'project-types';
import { Gesture } from '../types';

const rightFrameDirection: VectorModel = {
    minY: -0.3,
    maxY: 0.3,
};
const leftFrameDirection: VectorModel = {
    minY: -0.3,
    maxY: 0.3,
};

const lowDirection: VectorModel = {
    maxY: -0.5,
};

const velocityDiffLeft: VectorModel = {
    maxX: -150,
};
const velocityDiffRight: VectorModel = {
    minX: 150,
};

function GenerateRotateGesture(type: 'left' | 'right'): Gesture<'dynamic'> {
    return {
        name: 'rotate-' + type,
        type: 'dynamic',
        description: 'Rotates the 3D Object to the ' + type,
        coolDown: 3000,
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
                        {
                            direction: lowDirection,
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
                        {
                            direction: lowDirection,
                        },
                    ],
                },
            },
        ],
    };
}

export const rotateLeftGesture = GenerateRotateGesture('left');
export const rotateRightGesture = GenerateRotateGesture('right');
