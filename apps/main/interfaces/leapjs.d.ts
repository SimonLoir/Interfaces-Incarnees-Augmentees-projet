declare module 'leapjs' {
    export interface ControllerOptions {
        host?: string;
        port?: number;
        enableGestures?: boolean;
        frameEventName?: 'animationFrame' | 'deviceFrame';
        useAllPlugins?: boolean;
        loopWhileDisconnected?: boolean;
    }

    export function loop(opt: ControllerOptions, callback: () => any): void;

    export interface ControllerEvents {
        connect: () => void;
        blur: () => void;
        deviceConnected: () => void;
        deviceDisconnected: () => void;
        focus: () => void;
        frame: (frame: Frame) => void;
        gesture: () => void;
        protocol: () => void;
    }

    export class Controller {
        constructor(opt: ControllerOptions);

        connect(): void;

        disconnect(): void;

        on<T extends keyof ControllerEvents>(
            event: T,
            callback: ControllerEvents[T]
        ): void;

        connected(): boolean;
        frame(frameID: number): any;
        setBackground(isBackground: boolean): void;
        setOptimizeHMD(isOptimizeHMD: boolean): void;
        streaming(): boolean;
    }

    export class Frame {
        constructor();
        currentFrameRate: number;
        fingers: any[];
        gestures: any[];
        hands: any[];
        id: number;
        interactionBox: any;
        pointables: any[];
        timestamp: number;
        valid: boolean;

        dump(): string;
        finger(id: number): any;
        hand(id: number): any;
        pointable(id: number): any;
        rotationAngle(sinceFrame: Frame, axis?: any): number;
        rotationAxis(sinceFrame: Frame): any;
        rotationMatrix(sinceFrame: Frame): any;
        scaleFactor(sinceFrame: Frame): number;
        toString(): string;
        translation(sinceFrame: Frame): any;
    }
}
