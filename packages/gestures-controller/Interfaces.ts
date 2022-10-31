export interface Gesture<T extends 'static' | 'dynamic'> {
    name: string;
    type: T;
    description: string;
    data: T extends 'static' ? Features : Features[];
}

export interface Features {
    hands?: HandFeatures[];
    extendedFingersCount?: number;
    handsCount?: number;
}

export interface HandFeatures {
    type?: 'left' | 'right';
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
