import { AbstractGesture, VectorModel } from 'project-types';
import { AbstractModel } from 'project-types/AbstractGesture';

export interface Gesture<T extends 'static' | 'dynamic'>
    extends AbstractGesture<T> {
    data: T extends 'static' ? Model : Model[];
}
export type BasicFingersModel =
    | {
          minExtended?: never;
          maxExtended?: never;
          exactExtended: number;
      }
    | {
          minExtended?: number;
          maxExtended?: number;
          exactExtended?: never;
      };

export type FingersModel = BasicFingersModel & {
    details?: { [k in Finger]?: SingleFingerModel };
};

export type Finger =
    | 'thumb'
    | 'indexFinger'
    | 'middleFinger'
    | 'ringFinger'
    | 'pinky';

export type SingleFingerModel = {
    direction?: VectorModel;
    extended?: boolean;
};

export type Model = AbstractModel & {
    hands?: HandModel[];
    fingers?: BasicFingersModel;
    handsCount?: number;
    allowOnlyOneHandMatch?: boolean;
};

export type HandModel = {
    type?: 'left' | 'right';

    fingers?: FingersModel;
    palmNormal?: VectorModel;
    palmPosition?: VectorModel;

    palmVelocity?: VectorModel;
    minGrabStrength?: number;
    maxGrabStrength?: number;
    onlyIfPresent?: boolean;
};

export type FrameDiffExport = {
    frame1: number;
    frame2: number;
    handCountDiff: number;
    commonHands: string[];
    fingerCountDiff: number;
    timeDiff: number;
    handDiffs: { [id: string]: HandDiffExport };
};

export type HandDiffExport = {
    type: 'left' | 'right';
    fingerCountDiff: number;
    velocityDiff: [number, number, number];
    commonFingers: string[];
    fingerDiff: { [id: string]: FingerDiffExport };
    palmPositionDiff: [number, number, number];
};

export type FingerDiffExport = {
    extend?: boolean;
    retract?: boolean;
};
