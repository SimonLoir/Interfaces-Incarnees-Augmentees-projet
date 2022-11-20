import { Gesture } from '../types';

export const vanishGesture: Gesture<'dynamic'> = {
    name: 'vanish',
    type: 'dynamic',
    description: 'Makes the 3D Object disappear',
    coolDown: 1000,
    data: [],
};
