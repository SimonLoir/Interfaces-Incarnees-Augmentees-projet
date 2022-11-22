import { VectorModel } from 'project-types';
import { Gesture } from '../types';

const directionLeft: VectorModel = {
    minX: -1,
    maxX: 0,
    minY: -0.5,
    maxY: 0.5,
    minZ: -1,
    maxZ: 0,
};

const directionRight: VectorModel = {
    minX: 0,
    maxX: 1,
    minY: -0.5,
    maxY: 0.5,
    minZ: -1,
    maxZ: 0,
};

export const zoomOutGesture: Gesture<'dynamic'> = {
    name: 'zoom-out',
    type: 'dynamic',
    description: 'Zooms out of the 3D Object Scene',
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
                        velocityDiff: {
                            minX: 70,
                            minY: -30,
                            maxY: 30,
                        },
                    },
                    {
                        type: 'right',

                        direction: { ...directionRight },
                        velocityDiff: {
                            maxX: -70,
                            minY: -30,
                            maxY: 30,
                        },
                    },
                ],

                forearms: [
                    {
                        type: 'left',
                        direction: { ...directionLeft },
                        velocityDiff: {
                            minX: 70,
                            minY: -30,
                            maxY: 30,
                        },
                    },
                    {
                        type: 'right',
                        direction: { ...directionRight },
                        velocityDiff: {
                            maxX: -70,
                            minY: -30,
                            maxY: 30,
                        },
                    },
                ],
            },
        },
    ],
};
