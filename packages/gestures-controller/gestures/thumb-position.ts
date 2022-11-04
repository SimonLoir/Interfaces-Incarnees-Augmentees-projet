import { Gesture } from '../Interfaces';
/*
arm basis down : [[0.43,0.61,-0.65],[-0.45,0.78,0.48]]
palmNormalDown : [0.26,-0.75,-0.59]
arm basis up : [[-0.51,-0.60,0.60],[0.38,-0.79,-0.47]]
palmNormalUp : [-0.21,0.75,0.62]


PalmNormal analysis :
- normal thumbs-up : expected[-1,0,0]
- turned thumbs-up : expected[0,0,1]
- normal thumbs-down : expected[1,0,0]
- turned thumbs-down : expected[0,0,-1]
*/
export const thumbUpGesture: Gesture<'static'> = {
    name: 'thumb-position-up',
    description: '',
    type: 'static',
    coolDown: 2000,
    data: {
        minDuration: 1_000_000,
        hands: [
            {
                type: 'right',
                palmVelocity: {
                    maxX: 15,
                    maxY: 15,
                    maxZ: 15,
                },
                palmNormal: {
                    minY: -0.25,
                    maxY: 0.25,
                    minX: -1,
                    maxX: 0,
                    minZ: 0,
                    maxZ: 1,
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
            {
                type: 'left',
                palmVelocity: {
                    maxX: 15,
                    maxY: 15,
                    maxZ: 15,
                },
                palmNormal: {
                    minY: -0.25,
                    maxY: 0.25,
                    minX: 0,
                    maxX: 1,
                    minZ: 0,
                    maxZ: 1,
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
                type: 'right',
                palmNormal: {
                    minY: -0.25,
                    maxY: 0.25,
                    minX: 0,
                    maxX: 1,
                    minZ: -1,
                    maxZ: 0,
                },
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
            {
                type: 'left',
                palmNormal: {
                    minY: -0.25,
                    maxY: 0.25,
                    minX: -1,
                    maxX: 0,
                    minZ: -1,
                    maxZ: 0,
                },
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
