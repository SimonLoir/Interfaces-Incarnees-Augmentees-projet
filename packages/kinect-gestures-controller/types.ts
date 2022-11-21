import { BodyFrame, Joint } from 'kinect2';
import { AbstractGesture } from 'project-types';
import Frame from './Frame';

export type EventListeners = {
    frame: (frame: Frame) => void;
    gesture: (gesture: any) => void;
};

export type EventListenerStore = {
    [K in keyof EventListeners]: EventListeners[K][];
};

export const joints = [
    'SpineBase',
    'SpineMid',
    'Neck',
    'Head',
    'ShoulderLeft',
    'ElbowLeft',
    'WristLeft',
    'HandLeft',
    'ShoulderRight',
    'ElbowRight',
    'WristRight',
    'HandRight',
    'HipLeft',
    'KneeLeft',
    'AnkleLeft',
    'FootLeft',
    'HipRight',
    'KneeRight',
    'AnkleRight',
    'FootRight',
    'SpineShoulder',
    'HandTipLeft',
    'ThumbLeft',
    'HandTipRight',
    'ThumbRight',
] as const;

export type Body = {
    [key in typeof joints[number]]: Joint;
};
export interface Gesture<T extends 'static' | 'dynamic'>
    extends AbstractGesture<T> {
    data: T extends 'static' ? Model : Model[];
}

export type Model = {
    minDuration: number;
    maxDuration?: number;
    body: BodyModel;
};

export type BodyModel = {
    arms?: JointsDiffModel[];
    forearms?: JointsDiffModel[];
};

export type JointsDiffModel = {
    type?: 'left' | 'right';
    direction: DirectionVector;
    directionDiff?: DirectionVector;
};

export type DirectionVector = {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
    minZ?: number;
    maxZ?: number;
};
