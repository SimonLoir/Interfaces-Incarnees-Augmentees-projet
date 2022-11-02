import { Gesture } from '../Interfaces';

export const ThumbPositionUp: Gesture<'static'> = {
    name: 'thumb-position-up',
    description: '',
    type: 'static',
    data: {
        minDuration: 1,
        hands: [
            {
                fingers: {
                    exactExtended: 1,
                    details: {
                        thumb: {
                            extended: true,
                            direction: {
                                //To-do: TO DEFINE WITH THE LEAPMOTION !

                                minY: 0.5,
                            },
                        },
                    },
                },
            },
        ],
    },
};

export const ThumbPositionDown: Gesture<'static'> = {
    name: 'thumb-position-down',
    description: '',
    type: 'static',
    data: {
        minDuration: 1,
        hands: [
            {
                fingers: {
                    exactExtended: 1,
                    details: {
                        thumb: {
                            extended: true,
                            direction: {
                                ////To-do: TO DEFINE WITH THE LEAPMOTION !

                                minY: -0.4,
                            },
                        },
                    },
                },
            },
        ],
    },
};
