import { Gesture } from '../Interfaces';

export const thumbUpGesture: Gesture<'static'> = {
    name: 'thumb-position-up',
    description: '',
    type: 'static',
    coolDown: 2000,
    data: {
        minDuration: 1_000_000,
        hands: [
            {
                palmVelocity: {
                    maxX: 15,
                    maxY: 15,
                    maxZ: 15,
                },
                fingers: {
                    exactExtended: 1,
                    details: {
                        thumb: {
                            extended: true,
                            direction: {
                                minY: 0.4,
                            },
                        },
                    },
                },
            },
        ],
    },
};

export const thumbDownGesture: Gesture<'static'> = {
    name: 'thumb-position-down',
    description: '',
    type: 'static',
    coolDown: 2000,
    data: {
        minDuration: 1_000_000,
        hands: [
            {
                palmVelocity: {
                    maxX: 15,
                    maxY: 15,
                    maxZ: 15,
                },
                fingers: {
                    exactExtended: 1,
                    details: {
                        thumb: {
                            extended: true,
                            direction: { maxY: -0.4 },
                        },
                    },
                },
            },
        ],
    },
};
