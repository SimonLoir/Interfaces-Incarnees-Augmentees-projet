export type AbstractGesture<T extends 'static' | 'dynamic'> = {
    name: string;
    type: T;
    description: string;
    coolDown?: number;
};
