declare module 'kinect2' {
    export class Kinect2 {
        constructor();
        open(): boolean;
        openBodyReader(): void;
        close(): void;
        on(event: string, callback: Function): void;
    }
    export default Kinect2;
}
