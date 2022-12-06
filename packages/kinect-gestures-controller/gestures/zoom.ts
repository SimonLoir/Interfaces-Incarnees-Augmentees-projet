import { VectorModel } from 'project-types';
import { Gesture } from '../types';

const directionLeft: VectorModel = {
    minX: -1,
    maxX: 0.2,
    minY: -0.5,
    maxY: 0.5,
    minZ: -1,
    maxZ: 0,
};

const directionRight: VectorModel = {
    minX: -0.2,
    maxX: 1,
    minY: -0.5,
    maxY: 0.5,
    minZ: -1,
    maxZ: 0,
};

export const zoomGesture: Gesture<'dynamic'> = {
    name: 'zoom',
    type: 'dynamic',
    description: 'Zooms the 3D Object Scene (in or out)',
    coolDown: 0,
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
