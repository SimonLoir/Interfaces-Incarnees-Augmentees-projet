import { Gesture } from '../types';

export const rotateGesture: Gesture<'dynamic'> = {
    name: 'rotate',
    type: 'dynamic',
    description: 'Rotates the 3D Object',
    coolDown: 1000,
    data: [],
};
