import { AbstractGesture } from './AbstractGesture';
export type EventListeners<Frame, Gesture> = {
    frame: (frame: Frame) => void;
    gesture: (gesture: Gesture) => void;
};

export type EventListenerStore<Frame, Gesture> = {
    [K in keyof EventListeners<Frame, Gesture>]: EventListeners<
        Frame,
        Gesture
    >[K][];
};
export default abstract class AbstractGestureController<Frame> {
    private lastOccurrence: { [key: string]: number } = {};
    protected abstract frameRate: number;
    protected abstract frameStore: Frame[];
    protected abstract frameStoreLength: number;
    protected abstract staticGestures: AbstractGesture<'static'>[];
    protected abstract dynamicGestures: AbstractGesture<'dynamic'>[];
    abstract initController(): void;

    protected eventListeners: EventListenerStore<Frame, AbstractGesture<any>> =
        {
            frame: [],
            gesture: [],
        };

    protected handleFrame(frame: Frame) {
        // Stores the frame in the frame buffer
        this.frameStore.push(frame);

        // Removes the oldest frame if the buffer is too long
        if (this.frameStore.length > this.frameStoreLength)
            this.frameStore.shift();

        // Sends the frame to the event handlers of the frame event
        this.eventListeners.frame.forEach((listener) => listener(frame));

        const gestureListeners = this.eventListeners.gesture;

        this.extractFromFrames(this.frameStore).forEach((gesture) => {
            if (gesture.coolDown !== undefined) {
                // Checks that the gesture has not been triggered recently
                if (this.lastOccurrence[gesture.name] !== undefined) {
                    if (
                        Date.now() - this.lastOccurrence[gesture.name] <
                        gesture.coolDown
                    ) {
                        return;
                    }
                }
                // Stores the last time the gesture was triggered
                this.lastOccurrence[gesture.name] = Date.now();
            }
            // Sends the gesture to the event handlers of the gesture event
            gestureListeners.forEach((listener) => listener(gesture));
        });
    }

    /**
     * Adds an event listener to the controller
     * @param type The type of the event
     * @param handler The event handler
     * @returns A list containing the type of the event and the event handler
     */
    protected addEventListener<
        T extends keyof EventListeners<Frame, AbstractGesture<any>>
    >(type: T, handler: EventListeners<Frame, AbstractGesture<any>>[T]) {
        this.eventListeners[type].push(handler);
        return [type, handler] as [
            T,
            EventListeners<Frame, AbstractGesture<any>>[T]
        ];
    }

    /**
     * Removes an event listener from the controller
     * @param type The type of the event
     * @param handler The event handler
     */
    protected removeEventListener<
        T extends keyof EventListeners<Frame, AbstractGesture<any>>
    >(type: T, handler: EventListeners<Frame, AbstractGesture<any>>[T]) {
        this.eventListeners[type] = this.eventListeners[type].filter(
            (l) => l !== handler
        ) as EventListenerStore<Frame, AbstractGesture<any>>[T];
    }

    protected abstract matchStaticGesture(
        gesture: AbstractGesture<any>,
        frames: Frame[]
    ): boolean;

    protected abstract matchDynamicGesture(
        gesture: AbstractGesture<any>,
        frame: Frame[]
    ): boolean;

    /**
     * Extracts a list of gestures from a buffer of frames
     * @param frames A frame buffer
     * @returns a list of gestures found in the buffer
     */
    protected extractFromFrames(frames: Frame[]): AbstractGesture<any>[] {
        // A list of gestures found in the buffer
        const gesturesFound: AbstractGesture<any>[] = [];
        // A list of gestures that are currently being checked
        const gestures: AbstractGesture<any>[] = [
            ...this.staticGestures,
            ...this.dynamicGestures,
        ];

        for (const gesture of gestures) {
            if (gesture.type === 'static') {
                if (this.matchStaticGesture(gesture, frames)) {
                    gesturesFound.push(gesture);
                }
            } else if (gesture.type === 'dynamic') {
                if (this.matchDynamicGesture(gesture, frames)) {
                    gesturesFound.push(gesture);
                }
            }
        }

        return gesturesFound;
    }
}
