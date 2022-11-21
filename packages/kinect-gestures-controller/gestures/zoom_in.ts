import { Gesture, DirectionVector } from '../types';

const directionLeft: DirectionVector = {
    minX: -1,
    maxX: 0,
    minY: -0.5,
    maxY: 0.5,
    minZ: -1,
    maxZ: 0,
};

const directionRight: DirectionVector = {
    minX: 0,
    maxX: 1,
    minY: -0.5,
    maxY: 0.5,
    minZ: -1,
    maxZ: 0,
};

export const zoomInGesture: Gesture<'dynamic'> = {
    name: 'zoom-in',
    type: 'dynamic',
    description: 'Zooms in in the 3D Object Scene',
    coolDown: 1000,
    data: [
        {
            minDuration: 0,
            body: {
                arms: [
                    {
                        type: 'left',
                        direction: { ...directionLeft },
                    },
                    {
                        type: 'right',
                        direction: { ...directionRight },
                    },
                ],

                forearms: [
                    {
                        type: 'left',
                        direction: { ...directionLeft },
                    },
                    {
                        type: 'right',
                        direction: { ...directionRight },
                    },
                ],
            },
        },
        {
            minDuration: 0,
            maxDuration: 0.5 * 1_000_000,
            body: {
                arms: [
                    {
                        type: 'left',
                        direction: { ...directionLeft },
                        directionDiff: {},
                    },
                    {
                        type: 'right',

                        direction: { ...directionRight },
                    },
                ],

                forearms: [
                    {
                        type: 'left',
                        direction: { ...directionLeft },
                    },
                    {
                        type: 'right',
                        direction: { ...directionRight },
                    },
                ],
            },
        },
    ],
};
