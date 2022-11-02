import { Gesture } from '../Interfaces';

function gestureGenerator(direction: 'up' | 'down'): Gesture<'static'> {
    return {
        name: 'thumbs-' + direction,
        description: 'Thumbs-' + direction,
        type: 'static',
        data: {
            minDuration: 2 * 1_000_000,

            hands: [
                {
                    palmVelocity: {
                        maxX: 15,
                        maxY: 15,
                        maxZ: 15,
                    },
                    fingers: {
                        exactExtended: 1,
                        fingersInfo: [
                            {
                                type: 0,
                                extended: true,
                                ...(direction === 'up'
                                    ? { minDirectionY: 0.5 }
                                    : { maxDirectionY: -0.4 }),
                            },
                        ],
                    },
                },
            ],
        },
        cooldown: 2000,
    };
}

export const thumbsUpGesture: Gesture<'static'> = gestureGenerator('up');
export const thumbsDownGesture: Gesture<'static'> = gestureGenerator('down');
