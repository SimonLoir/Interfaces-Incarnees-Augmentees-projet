import { Gesture, HandModel } from '../Interfaces';

export const swipeRightGesture: Gesture<'dynamic'> = {
    name: 'swipe-right',
    description: 'Swipe right',
    type: 'dynamic',
    coolDown: 1000,
    data: [
        {
            minDuration: 0,
            hands: [RightHand(), LeftHand()],
            allowOnlyOneHandMatch: true,
        },
        {
            minDuration: 0,

            maxDuration: 1.5 * 1_000_000,
            hands: [
                {
                    ...RightHand(),
                    palmVelocity: {
                        minX: 700,
                    },
                },
                {
                    ...LeftHand(),
                    palmVelocity: {
                        minX: 700,
                    },
                },
            ],
            allowOnlyOneHandMatch: true,
        },
    ],
};

export const swipeLeftGesture: Gesture<'dynamic'> = {
    name: 'swipe-left',
    description: 'Swipe left',
    type: 'dynamic',
    coolDown: 1000,
    data: [
        {
            minDuration: 0,
            hands: [LeftHand(), RightHand()],
            allowOnlyOneHandMatch: true,
        },
        {
            minDuration: 0,
            maxDuration: 1.5 * 1_000_000,
            hands: [
                {
                    ...LeftHand(),
                    palmVelocity: {
                        maxX: -700,
                    },
                },
                {
                    ...RightHand(),
                    palmVelocity: {
                        maxX: -700,
                    },
                },
            ],
            allowOnlyOneHandMatch: true,
        },
    ],
};

function RightHand(): HandModel {
    return {
        type: 'right',

        fingers: {
            minExtended: 4,
        },
        palmNormal: {
            maxX: -0.3,
            minX: -1,
            maxY: 0.7,
            minY: -0.7,
        },
    };
}

function LeftHand(): HandModel {
    return {
        type: 'left',

        fingers: {
            minExtended: 4,
        },
        palmNormal: {
            maxX: 1,
            minX: 0.3,
            maxY: 0.7,
            minY: -0.7,
        },
    };
}
