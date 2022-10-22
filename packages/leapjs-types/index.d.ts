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

    export class Pointable {
        direction: [number, number, number];
        id: string;
        length: number;
        stabilizedTipPosition: [number, number, number];
        timeVisible: number;
        tipPosition: [number, number, number];
        tipVelocity: [number, number, number];
        touchDistance: number;
        tool: boolean;
        touchZone: string;
        width: number;
        valid: boolean;
        hand(): Hand;
        toString(): String;
    }
    export class Finger extends Pointable {
        bones: Bone[];
        carpPosition: [number, number, number];
        dipPosition: [number, number, number];
        distal: Bone;
        medial: Bone;
        extended: boolean;
        mcpPosition: [number, number, number];
        metacarpal: Bone;
        pipPosition: [number, number, number];
        proximal: Bone;
        type: number;
        invalid: boolean;
    }
    export class Hand {
        arm: Bone;
        confidence: number;
        direction: [number, number, number];
        fingers: Finger[];
        grabStrength: number;
        id: string;
        indexFinger: Finger;
        middleFinger: Finger;
        palmNormal: [number, number, number];
        palmPosition: [number, number, number];
        palmVelocity: [number, number, number];
        palmWidth: number;
        pinchStrength: number;
        pinky: Finger;
        pointables: Pointable[];
        ringFinger: Finger;
        sphereCenter: [number, number, number];
        sphereRadius: number;
        stabilizedPalmPosition: [number, number, number];
        thumb: Finger;
        timeVisible: number;
        tools: Pointable[];
        type: string;
        valid: boolean;

        finger(id: number): Finger;
        toString(): string;

        pitch(): number;
        roll(): number;
        rotationAngle(sinceFrame: Frame, axis?: any): number;
        rotationAxis(sinceFrame: Frame): any;
        rotationMatrix(sinceFrame: Frame): any;
        scaleFactor(sinceFrame: Frame): number;
        translation(sinceFrame: Frame): any;

        yaw(): number;
    }

    export class Bone {
        basis: [
            [number, number, number],
            [number, number, number],
            [number, number, number]
        ];
        length: number;
        nextJoint: number[];
        prevJoint: number[];
        type: number;
        width: number;
        center(): [number, number, number];
        direction(): [number, number, number];
        left(): boolean;
        lerp(
            out: [number, number, number],
            t: number
        ): [number, number, number];
        matrix(): [number, number, number];
    }
}
