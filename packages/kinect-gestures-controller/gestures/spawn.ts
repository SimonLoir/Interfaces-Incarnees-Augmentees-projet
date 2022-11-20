import { Gesture } from '../types';

export const spawnGesture: Gesture<'dynamic'> = {
    name: 'spawn',
    type: 'dynamic',
    description: 'Spawns the 3D Object',
    coolDown: 1000,
    data: [],
};
