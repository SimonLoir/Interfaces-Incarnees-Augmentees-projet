import { Gesture, HandModel } from '../Interfaces';

export const swipeLeftGesture: Gesture<'dynamic'> = {
    name: 'swipe-left',
    description: 'Swipe left',
    type: 'dynamic',
    coolDown: 1000,
    data: [
        {
            minDuration: 0,
            hands: [BackhandRight(), ForehandLeft()],
            allowOnlyOneHandMatch: true,
        },
        {
            minDuration: 0,
            maxDuration: 1.5 * 1_000_000,
            hands: [
                {
                    ...ForehandRight(),
                    palmVelocity: {
                        minX: 700,
                    },
                },
                {
                    ...BackhandLeft(),
                    palmVelocity: {
                        minX: 700,
                    },
                },
            ],
            allowOnlyOneHandMatch: true,
        },
    ],
};
export const swipeRightGesture: Gesture<'dynamic'> = {
    name: 'swipe-right',
    description: 'Swipe right',
    type: 'dynamic',
    coolDown: 1000,
    data: [
        {
            minDuration: 0,
            hands: [ForehandRight(), BackhandLeft()],
            allowOnlyOneHandMatch: true,
        },
        {
            minDuration: 0,

            maxDuration: 1.5 * 1_000_000,
            hands: [
                {
                    ...BackhandRight(),
                    palmVelocity: {
                        maxX: -700,
                    },
                },
                {
                    ...ForehandLeft(),
                    palmVelocity: {
                        maxX: -700,
                    },
                },
            ],
            allowOnlyOneHandMatch: true,
        },
    ],
};

function ForehandRight(): HandModel {
    return {
        type: 'right',
        fingers: {
            minExtended: 4,
        },
        palmNormal: {
            maxX: 0,
            minX: -1,
            maxY: 0.5,
            minZ: -1,
            maxZ: 0,
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
            minX: 0,
            maxY: 0.5,
            minZ: -1,
            maxZ: 0,
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
            maxX: 0,
            minX: -1,
            minY: -0.5,
            minZ: 0,
            maxZ: 1,
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
            maxX: 1,
            minX: 0,
            minY: -0.5,
            minZ: 0,
            maxZ: 1,
        },
    };
}