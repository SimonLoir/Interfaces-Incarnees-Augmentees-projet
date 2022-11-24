import { Gesture } from '../Interfaces';

function gestureGenerator(count: number, countStr: string): Gesture<'static'> {
    return {
        type: 'static',
        name: countStr + '-extended-fingers',
        description: countStr + ' extended on either the left or right hand',
        coolDown: 4000,
        data: {
            minDuration: 1 * 1_000_000,
            hands: [
                {
                    type: 'right',
                    onlyIfPresent: true,
                    palmVelocity: {
                        maxX: 5,
                        maxY: 5,
                        maxZ: 5,
                    },
                },
                {
                    type: 'left',
                    onlyIfPresent: true,
                    palmVelocity: {
                        maxX: 5,
                        maxY: 5,
                        maxZ: 5,
                    },
                },
            ],
            fingers: {
                exactExtended: count,
            },
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

export const sixFingersUpGesture: Gesture<'static'> = gestureGenerator(
    6,
    'six'
);

export const sevenFingersUpGesture: Gesture<'static'> = gestureGenerator(
    7,
    'seven'
);

export const eightFingersUpGesture: Gesture<'static'> = gestureGenerator(
    8,
    'eight'
);

export const nineFingersUpGesture: Gesture<'static'> = gestureGenerator(
    9,
    'nine'
);

export const tenFingersUpGesture: Gesture<'static'> = gestureGenerator(
    10,
    'ten'
);
