export type AbstractGesture<T extends 'static' | 'dynamic'> = {
    name: string;
    type: T;
    description: string;
    data: T extends 'static' ? AbstractModel : AbstractModel[];
    coolDown?: number;
};

export type AbstractModel = {
    minDuration: number;
    maxDuration?: number;
};
