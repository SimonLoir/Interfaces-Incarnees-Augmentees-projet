import type { Gesture } from '../Interfaces';

function horizontalHand(): any {
    return {
        fingers: {
            minExtended: 4,
        },
        palmNormal: {
            maxX: 0.3,
            minX: -0.3,
            maxY: -0.3,
        },
    };
}

function ScrollBuilder(type: 'left' | 'right'): Gesture<'dynamic'> {
    return {
        name: 'scroll-' + type,
        type: 'dynamic',
        description: `scroll ${type} gesture`,
        coolDown: 1000,
        data: [
            {
                minDuration: 0,
                hands: [horizontalHand()],
                allowOnlyOneHandMatch: true,
            },
            {
                minDuration: 0,
                maxDuration: 1 * 1_000_000,
                hands: [
                    {
                        ...horizontalHand(),

                        palmVelocity: {
                            minX: type === 'left' ? -2000 : 300,
                            maxX: type === 'left' ? -300 : 2000,
                        },
                    },
                ],
            },
        ],
    };
}

export const scrollLeftGesture: Gesture<'dynamic'> = ScrollBuilder('left');

export const scrollRightGesture: Gesture<'dynamic'> = ScrollBuilder('right');
