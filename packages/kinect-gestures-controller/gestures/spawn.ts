import { VectorModel } from 'project-types';
import { Gesture } from '../types';

const initFrameDirection: VectorModel = {
    maxZ: -0.5,
    maxY: -0.1,
};
const finalFrameDirection: VectorModel = {
    maxZ: -0.5,
    minY: 0.1,
};

export const spawnGesture: Gesture<'dynamic'> = {
    name: 'spawn',
    type: 'dynamic',
    description: 'Spawns the 3D Object',
    coolDown: 1000,
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
            maxDuration: 1.5 * 1_000_000,
            body: {
                arms: [
                    {
                        direction: {
                            ...finalFrameDirection,
                        },
                        velocityDiff: {
                            minY: 70,
                        },
                    },
                ],
                forearms: [
                    {
                        direction: {
                            ...finalFrameDirection,
                        },
                        velocityDiff: {
                            minY: 100,
                        },
                    },
                ],
            },
        },
    ],
};
