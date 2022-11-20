import Kinect2 from 'kinect2';
import Frame from './Frame';
import { EventListeners, EventListenerStore } from './types';

export default class KinectGestureController {
    private eventListeners: EventListenerStore = {
        frame: [],
        gesture: [],
    };

    private frameRate = 4;
    private frameStoreLength = this.frameRate * 3; // 3 seconds
    private frameStore: Frame[] = [];

    constructor() {
        const kinect = new Kinect2();
        if (kinect.open()) {
            kinect.openBodyReader();
            kinect.on('bodyFrame', (bodyFrame) => {
                const frame = new Frame(bodyFrame);

                if (
                    frame.id %
                        Math.floor(frame.currentFrameRate / this.frameRate) ===
                    0
                ) {
                    this.frameStore.push(frame);
                    if (this.frameStore.length > this.frameStoreLength)
                        this.frameStore.shift();
                    this.eventListeners.frame.forEach((l) => l(frame));
                }
            });
        }

        this.addEventListener('frame', (f) => {});
    }

    /**
     * Adds an event listener to the controller
     * @param type The type of the event
     * @param handler The event handler
     * @returns A list containing the type of the event and the event handler
     */
    protected addEventListener<T extends keyof EventListeners>(
        type: T,
        handler: EventListeners[T]
    ) {
        this.eventListeners[type].push(handler);
        return [type, handler] as [T, EventListeners[T]];
    }

    /**
     * Removes an event listener from the controller
     * @param type The type of the event
     * @param handler The event handler
     */
    protected removeEventListener<T extends keyof EventListeners>(
        type: T,
        handler: EventListeners[T]
    ) {
        this.eventListeners[type] = this.eventListeners[type].filter(
            (l) => l !== handler
        ) as EventListenerStore[T];
    }
}
