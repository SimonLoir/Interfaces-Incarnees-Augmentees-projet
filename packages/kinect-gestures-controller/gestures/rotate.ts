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
/*
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
*/

export const rotateLeftGesture: Gesture<'dynamic'> = {
    name: 'rotate-left',
    type: 'dynamic',
    description: 'Rotates the 3D Object to the left',

    coolDown: 1_000,
    data: [
        {
            minDuration: 0,
            body: {
                arms: [
                    {
                        type: 'right',
                        direction: rightFrameDirection,
                    },
                    {
                        type: 'left',
                        direction: lowDirection,
                    },
                ],
                forearms: [
                    {
                        type: 'right',
                        direction: rightFrameDirection,
                    },
                    {
                        type: 'left',
                        direction: lowDirection,
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
                        type: 'right',
                        direction: leftFrameDirection,
                        velocityDiff: velocityDiffLeft,
                    },

                    {
                        type: 'left',
                        direction: lowDirection,
                    },
                ],
                forearms: [
                    {
                        type: 'right',
                        direction: leftFrameDirection,
                        velocityDiff: velocityDiffLeft,
                    },
                    {
                        type: 'left',
                        direction: lowDirection,
                    },
                ],
            },
        },
    ],
};

export const rotateRightGesture: Gesture<'dynamic'> = {
    name: 'rotate-right',
    type: 'dynamic',
    description: 'Rotates the 3D Object to the right',
    coolDown: 1_000,
    data: [
        {
            minDuration: 0,
            body: {
                arms: [
                    {
                        type: 'left',
                        direction: leftFrameDirection,
                    },
                    {
                        type: 'right',
                        direction: lowDirection,
                    },
                ],
                forearms: [
                    {
                        type: 'left',
                        direction: leftFrameDirection,
                    },
                    {
                        type: 'right',
                        direction: lowDirection,
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
                        type: 'left',
                        direction: rightFrameDirection,
                        velocityDiff: velocityDiffRight,
                    },

                    {
                        type: 'right',
                        direction: lowDirection,
                    },
                ],
                forearms: [
                    {
                        type: 'left',
                        direction: rightFrameDirection,
                        velocityDiff: velocityDiffRight,
                    },
                    {
                        type: 'right',
                        direction: lowDirection,
                    },
                ],
            },
        },
    ],
};
