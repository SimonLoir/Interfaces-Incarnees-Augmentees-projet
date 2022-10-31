export interface Gesture<T extends 'static' | 'dynamic'> {
    name: string;
    type: T;
    description: string;
    data: T extends 'static' ? Model : Model[];
}

export interface Model {
    minDuration: number;
    maxDuration?: number;
    hands?: HandModel[];
    exactExtendedFingers?: number;
    minExtendedFingers?: number;
    maxExtendedFingers?: number;
    handsCount?: number;
}

export interface HandModel {
    type?: 'left' | 'right';

    fingers?:
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
