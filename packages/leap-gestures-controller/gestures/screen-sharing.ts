import { Gesture } from '../Interfaces';

export const screenSharingGesture: Gesture<'dynamic'> = {
    name: 'screen-sharing',
    description: 'Screen sharing',
    type: 'dynamic',
    coolDown: 2000,
    data: [
        {
            minDuration: 0,
            hands: [
                {
                    minGrabStrength: 0.7,
                },
            ],
        },

        {
            minDuration: 0,
            maxDuration: 2 * 1_000_000,
            hands: [
                {
                    maxGrabStrength: 0,

                    palmVelocity: {
                        minX: -100,
                        maxX: 100,
                        minY: 50,
                    },
                },
            ],
        },
    ],
};
