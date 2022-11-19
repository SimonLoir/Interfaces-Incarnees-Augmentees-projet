import type { Gesture, HandModel } from '../Interfaces';

function horizontalHand(type: 'left' | 'right'): any {
    return {
        type: type,
        fingers: {
            minExtended: 4,
        },
        palmNormal: {
            maxX: 0.3,
            minX: -0.3,
            maxY: -0.7,
            mixY: -1,
        },
    };
}
function ForehandRight(): HandModel {
    return {
        type: 'right',
        fingers: {
            minExtended: 4,
        },
        palmNormal: {
            maxX: -0.5,
            minX: -1,
            minY: -1,
            maxY: -0.5,
        },
    };
}

function ForehandLeft(): HandModel {
    return {
        type: 'left',
        fingers: {
            minExtended: 4,
        },
        palmNormal: {
            maxX: 1,
            minX: 0.5,
            minY: -1,
            maxY: 0.5,
        },
    };
}

function BackhandRight(): HandModel {
    return {
        type: 'right',
        fingers: {
            minExtended: 4,
        },
        palmNormal: {
            maxX: 1,
            minX: 0.5,
            minY: -1,
            maxY: -0.5,
        },
    };
}

function BackhandLeft(): HandModel {
    return {
        type: 'left',
        fingers: {
            minExtended: 4,
        },
        palmNormal: {
            maxX: -0.5,
            minX: -1,
            minY: -1,
            maxY: -0.5,
        },
    };
}

export const scrollLeftGesture: Gesture<'dynamic'> = {
    name: 'scroll-left',
    type: 'dynamic',
    description: 'scroll left gesture',
    coolDown: 1000,
    data: [
        {
            minDuration: 0,
            hands: [horizontalHand('right'), horizontalHand('left')],
            allowOnlyOneHandMatch: true,
        },
        {
            minDuration: 0,
            maxDuration: 1.5 * 1_000_000,
            hands: [
                {
                    ...BackhandRight(),
                    palmVelocity: {
                        minX: -30,
                        maxX: 30,
                        minY: -30,
                        maxY: 30,
                        minZ: -30,
                        maxZ: 30,
                    },
                },
                {
                    ...ForehandLeft(),
                    palmVelocity: {
                        minX: -30,
                        maxX: 30,
                        minY: -30,
                        maxY: 30,
                        minZ: -30,
                        maxZ: 30,
                    },
                },
            ],
            allowOnlyOneHandMatch: true,
        },
    ],
};

export const scrollRightGesture: Gesture<'dynamic'> = {
    name: 'scroll-right',
    type: 'dynamic',
    description: 'scroll right gesture',
    coolDown: 1000,
    data: [
        {
            minDuration: 0,
            hands: [horizontalHand('right'), horizontalHand('left')],
            allowOnlyOneHandMatch: true,
        },
        {
            minDuration: 0,
            maxDuration: 1.5 * 1_000_000,
            hands: [
                {
                    ...BackhandLeft(),
                    palmVelocity: {
                        minX: -30,

                        maxX: 30,
                        minY: -30,
                        maxY: 30,
                        minZ: -30,
                        maxZ: 30,
                    },
                },
                {
                    ...ForehandRight(),
                    palmVelocity: {
                        minX: -30,
                        maxX: 30,
                        minY: -30,
                        maxY: 30,
                        minZ: -30,
                        maxZ: 30,
                    },
                },
            ],
            allowOnlyOneHandMatch: true,
        },
    ],
};
