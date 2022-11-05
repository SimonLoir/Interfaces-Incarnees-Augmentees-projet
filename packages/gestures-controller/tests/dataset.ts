import Leap from 'leapjs';
import { Model } from '../Interfaces';
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
