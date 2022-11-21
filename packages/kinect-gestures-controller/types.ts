import { BodyFrame, Joint } from 'kinect2';
import { AbstractGesture, VectorModel, Vector } from 'project-types';
import { AbstractModel } from 'project-types/AbstractGesture';
import Frame from './Frame';

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
    [key in typeof joints[number]]?: Joint;
};
export interface Gesture<T extends 'static' | 'dynamic'>
    extends AbstractGesture<T> {
    data: T extends 'static' ? Model : Model[];
}

export type Model = AbstractModel & {
    body: BodyModel;
};

export type BodyModel = {
    arms?: JointsDiffModel[];
    forearms?: JointsDiffModel[];
};

export type JointsDiffModel = {
    type?: 'left' | 'right';
    direction: VectorModel;
    velocityDiff?: VectorModel;
};

export type FrameDiffExport = {
    frame1: number;
    frame2: number;
    armVelocityDiff: {
        left: Vector | undefined;
        right: Vector | undefined;
    };
    armPositionDiff: {
        left: Vector | undefined;
        right: Vector | undefined;
    };

    forearmVelocityDiff: {
        left: Vector | undefined;
        right: Vector | undefined;
    };

    forearmPositionDiff: {
        left: Vector | undefined;
        right: Vector | undefined;
    };
    timeDiff: number;
};
