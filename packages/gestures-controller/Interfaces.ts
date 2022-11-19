export type Gesture<T extends 'static' | 'dynamic'> = {
    name: string;
    type: T;
    description: string;
    data: T extends 'static' ? Model : Model[];
    coolDown?: number;
};
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

export type VectorModel = {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
    minZ?: number;
    maxZ?: number;
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

export type Model = {
    minDuration: number;
    maxDuration?: number;
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
