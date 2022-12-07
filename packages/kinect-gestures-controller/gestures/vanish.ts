import { VectorModel } from 'project-types';
import { Gesture } from '../types';

const initFrameDirection: VectorModel = {
    maxZ: -0.5,
    minY: 0.25,
};
const finalFrameDirection: VectorModel = {
    maxY: -0.25,
    maxZ: -0.5,
};

export const VanishGesture: Gesture<'dynamic'> = {
    name: 'vanish',
    type: 'dynamic',
    description: 'Vanish the 3D Object',
    coolDown: 4000,
    data: [
        {
            minDuration: 0,
            body: {
                arms: [
                    {
                        direction: {
                            ...initFrameDirection,
                        },
                    },
                ],
                forearms: [
                    {
                        direction: {
                            ...initFrameDirection,
                        },
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
                        direction: {
                            ...finalFrameDirection,
                        },

                        velocityDiff: {
                            minY: -70,
                        },
                    },
                ],
                forearms: [
                    {
                        direction: {
                            ...finalFrameDirection,
                        },

                        velocityDiff: {
                            minY: -100,
                        },
                    },
                ],
            },
        },
    ],
};
