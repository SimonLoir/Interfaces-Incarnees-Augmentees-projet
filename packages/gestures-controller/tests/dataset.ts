import Leap from 'leapjs';
import { HandModel, Model } from '../Interfaces';
export const frameWithRightHand: Partial<Leap.Frame> = {
    hands: [
        {
            type: 'right',
        },
    ],
};
export const modelWithRightHand: Model = {
    minDuration: 1_000_000,
    hands: [{ type: 'right' }],
};

export const frameWithLeftHand: Partial<Leap.Frame> = {
    hands: [
        {
            type: 'left',
        },
    ],
};
export const modelWithLeftHand: Model = {
    minDuration: 1_000_000,
    hands: [{ type: 'left' }],
};

export const modelWithBothHands: Model = {
    allowOnlyOneHandMatch: true,
    minDuration: 1_000_000,
    hands: [{ type: 'left' }, { type: 'right' }],
};

export const frameEmpty: Partial<Leap.Frame> = {
    hands: [],
};

export const frameWithRightClosedFist: Partial<Leap.Frame> = {
    hands: [
        {
            type: 'right',
            grabStrength: 1,
        },
    ],
};
export const frameWithLeftClosedFist: Partial<Leap.Frame> = {
    hands: [
        {
            type: 'left',
            grabStrength: 1,
        },
    ],
};

export const frameWithRightOpenFist: Partial<Leap.Frame> = {
    hands: [
        {
            type: 'right',
            grabStrength: 0,
        },
    ],
};
export const frameWithLeftOpenFist: Partial<Leap.Frame> = {
    hands: [
        {
            type: 'left',
            grabStrength: 0,
        },
    ],
};
export const modelWithHandClosed: Model = {
    minDuration: 1_000_000,
    hands: [{ minGrabStrength: 1 }],
};

export const frameHandWith3Fingers: Partial<Leap.Hand> = {
    type: 'right',
    fingers: [
        {
            type: 0,
            extended: true,
        },

        {
            type: 1,
            extended: true,
        },

        {
            type: 2,
            extended: true,
        },

        {
            type: 3,
            extended: false,
        },
    ] as Partial<Leap.Finger> as Leap.Finger[],
};

export const model3FingersHand: HandModel = {
    fingers: {
        exactExtended: 3,
    },
};

export const model4FingersHand: HandModel = {
    fingers: {
        exactExtended: 4,
    },
};

export const modelMin4Extended: HandModel = {
    fingers: {
        minExtended: 4,
    },
};

export const modelMax2Extended: HandModel = {
    fingers: {
        maxExtended: 2,
    },
};

export const modelHandWithLowGrabStrength: HandModel = {
    maxGrabStrength: 0.3,
};
