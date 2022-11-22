import { VectorModel } from 'project-types';
import { Gesture } from '../types';

const initFrameDirection: VectorModel = {
    minX: -0.3,
    maxX: 0.3,
    minY: 0,
    maxY: 0.3,
};
const finalFrameDirection: VectorModel = {
    minX: -0.3,
    maxX: 0.3,
    minY: 0.5,
};

export const spawnGesture: Gesture<'dynamic'> = {
    name: 'spawn',
    type: 'dynamic',
    description: 'Spawns the 3D Object',
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
