import { Gesture } from '../Interfaces';

function gestureGenerator(count: number, countStr: string): Gesture<'static'> {
    return {
        type: 'static',
        name: countStr + '-extended-fingers',
        description: countStr + ' extended on either the left or right hand',
        data: {
            minDuration: 1 * 1_000_000,
            hands: [
                {
                    palmVelocity: {
                        maxX: 15,
                        maxY: 15,
                        maxZ: 15,
                    },
                    fingers: {
                        exactExtended: count,
                    },
                },
            ],
        },
    };
}

export const oneFingerUpGesture: Gesture<'static'> = gestureGenerator(1, 'one');
export const twoFingersUpGesture: Gesture<'static'> = gestureGenerator(
    2,
    'two'
);
export const threeFingersUpGesture: Gesture<'static'> = gestureGenerator(
    3,
    'three'
);
export const fourFingersUpGesture: Gesture<'static'> = gestureGenerator(
    4,
    'four'
);
export const fiveFingersUpGesture: Gesture<'static'> = gestureGenerator(
    5,
    'five'
);
