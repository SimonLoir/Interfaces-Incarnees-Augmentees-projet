import { Gesture } from '../Interfaces';

export const screenSharingGesture: Gesture<'dynamic'> = {
    name: 'screen-sharing',
    description: 'Screen sharing',
    type: 'dynamic',
    cooldown: 2000,
    data: [
        {
            minDuration: 0,
            hands: [
                {
                    minGrabStrength: 0.7,
                    palmPosition: {
                        maxY: 190,
                        minY: 30,
                    },
                },
            ],
        },

        {
            minDuration: 0,
            maxDuration: 2 * 1_000_000,
            hands: [
                {
                    maxGrabStrength: 0,
                    palmPosition: {
                        minY: 190,
                    },
                    palmVelocity: {
                        minX: -30,
                        maxX: 30,
                        minY: 100,
                        maxZ: -100,
                    },
                },
            ],
        },
    ],
};
