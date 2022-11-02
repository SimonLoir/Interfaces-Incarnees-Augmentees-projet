export interface Gesture<T extends 'static' | 'dynamic'> {
    name: string;
    type: T;
    description: string;
    data: T extends 'static' ? Model : Model[];
}

export type FingerInfo = {
    type: number;
    extended: boolean;
    minDirectionX?: number;
    maxDirectionX?: number;
    minDirectionY?: number;
    maxDirectionY?: number;
    minDirectionZ?: number;
    maxDirectionZ?: number;
};

export type FingersModel =
    | {
          minExtended?: never;
          maxExtended?: never;
          exactExtended: number;
          fingersInfo?: FingerInfo[];
      }
    | {
          minExtended?: number;
          maxExtended?: number;
          exactExtended?: never;
          fingersInfo?: FingerInfo[];
      };
export interface Model {
    minDuration: number;
    maxDuration?: number;
    hands?: HandModel[];
    fingers?: FingersModel;
    handsCount?: number;
}

export interface HandModel {
    type?: 'left' | 'right';

    fingers?: FingersModel;

    palmPosition?: {
        minX?: number;
        maxX?: number;
        minY?: number;
        maxY?: number;
        minZ?: number;
        maxZ?: number;
    };

    palmVelocity?: {
        minX?: number;
        maxX?: number;
        minY?: number;
        maxY?: number;
        minZ?: number;
        maxZ?: number;
    };
    minGrabStrength?: number;
    maxGrabStrength?: number;
}

export interface FrameDiffExport {
    frame1: number;
    frame2: number;
    handCountDiff: number;
    commonHands: string[];
    fingerCountDiff: number;
    timeDiff: number;
    handDiffs: { [id: string]: HandDiffExport };
}

export interface HandDiffExport {
    type: 'left' | 'right';
    fingerCountDiff: number;
    velocityDiff: [number, number, number];
    commonFingers: string[];
    fingerDiff: { [id: string]: FingerDiffExport };
    palmPositionDiff: [number, number, number];
}

export interface FingerDiffExport {
    extend?: boolean;
    retract?: boolean;
}
