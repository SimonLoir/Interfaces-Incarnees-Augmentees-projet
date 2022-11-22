declare module 'kinect2' {
    export type Joint = {
        depthX: number;
        depthY: number;
        colorX: number;
        colorY: number;
        cameraX: number;
        cameraY: number;
        cameraZ: number;
        hasFloorData: boolean;
        floorDepthX: number;
        floorDepthY: number;
        floorColorX: number;
        floorColorY: number;
        floorCameraX: number;
        floorCameraY: number;
        floorCameraZ: number;
        orientationX: number;
        orientationY: number;
        orientationZ: number;
        orientationW: number;
        jointType: number;
        trackingState: number;
    };

    export type Body = {
        tracked: boolean;
        joints: Joint[];
        trackingId: number;
        HandLeftState?: number;
        HandRightState?: number;
    };

    export type BodyFrame = {
        bodies: Body[];
    };

    export type Listeners = {
        bodyFrame: (bodyFrame: BodyFrame) => void;
    };

    export class Kinect2 {
        constructor();
        open(): boolean;
        openBodyReader(): void;
        close(): void;
        on<T extends keyof Listeners>(event: T, callback: Listeners[T]): void;
    }

    export default Kinect2;
}
