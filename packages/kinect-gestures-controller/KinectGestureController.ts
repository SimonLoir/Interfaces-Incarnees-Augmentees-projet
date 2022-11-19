import Kinect2 from 'kinect2';
import { EventListeners, EventListenerStore } from './types';

export default class KinectGestureController {
    private eventListeners: EventListenerStore = {
        frame: [],
        gesture: [],
    };

    constructor() {
        const kinect = new Kinect2();
        if (kinect.open()) {
            kinect.openBodyReader();
            kinect.on('bodyFrame', (bodyFrame) => {
                this.eventListeners.frame.forEach((l) => l(bodyFrame));
            });
        }
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
