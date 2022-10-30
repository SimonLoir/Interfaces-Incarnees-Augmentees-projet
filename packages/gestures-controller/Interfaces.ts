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
