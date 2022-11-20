import { Gesture } from '../types';

export const zoomOutGesture: Gesture<'dynamic'> = {
    name: 'zoom-out',
    type: 'dynamic',
    description: 'Zooms out in the 3D Object Scene',
    coolDown: 1000,
    data: [],
};
