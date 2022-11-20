import { Gesture } from '../types';

export const zoomInGesture: Gesture<'dynamic'> = {
    name: 'zoom-in',
    type: 'dynamic',
    description: 'Zooms in in the 3D Object Scene',
    coolDown: 1000,
    data: [],
};
