import type { Gesture, HandModel } from '../Interfaces';

// horizontal swipe of a han left or right going toward the left or the right
// The hand stays in same position during the movement (hand facing down)
export const HorizontalLeftSwipe: Gesture<'dynamic'> = {
    name: 'horizontal-swipe-left',
    description: 'Horizontal Swipe left',
    type: 'dynamic',
    coolDown: 1000,
    data: [
        {
            minDuration: 1.5 * 1_000_000,
            hands: [HandRight(), HandLeft()].map((hand) => ({
                ...hand,
                palmVelocity: {
                    minX: 700,
                },
            })),
            allowOnlyOneHandMatch: true,
        },
    ],
};

export const HorizontalRightSwipe: Gesture<'dynamic'> = {
    name: 'horizontal-swipe-right',
    description: 'Horizontal Swipe right',
    type: 'dynamic',
    coolDown: 1000,
    data: [
        {
            minDuration: 1.5 * 1_000_000,
            hands: [HandRight(), HandLeft()].map((hand) => ({
                ...hand,
                palmVelocity: {
                    maxX: -700,
                },
            })),
            allowOnlyOneHandMatch: true,
        },
    ],
};

function HandRight(): HandModel {
    return {
        type: 'right',
        fingers: {
            minExtended: 4,
        },
        palmNormal: {
            maxX: 0,
            minX: -1,
            maxY: -0.5,
            minZ: -1,
            maxZ: 0,
        },
    };
}

function HandLeft(): HandModel {
    return {
        type: 'left',
        fingers: {
            minExtended: 4,
        },
        palmNormal: {
            maxX: 1,
            minX: 0,
            maxY: -0.5,
            minZ: -1,
            maxZ: 0,
        },
    };
}
