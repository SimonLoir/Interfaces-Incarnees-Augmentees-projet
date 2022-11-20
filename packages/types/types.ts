import { BodyFrame, Joint } from 'kinect2';
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

export type Gesture = {
    name: string;
    description: string;
    data: [];
    coolDown?: number;
};
