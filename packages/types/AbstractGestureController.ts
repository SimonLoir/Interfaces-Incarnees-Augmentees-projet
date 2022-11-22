import { VectorModel } from '.';
import AbstractFrameDiff from './AbstractFrameDiff';
import { AbstractGesture, AbstractModel } from './AbstractGesture';
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
export default abstract class AbstractGestureController<
    Frame extends { timestamp: number }
> {
    private lastOccurrence: { [key: string]: number } = {};
    protected abstract frameRate: number;
    protected abstract frameStore: Frame[];
    protected abstract frameStoreLength: number;
    protected abstract staticGestures: AbstractGesture<'static'>[];
    protected abstract dynamicGestures: AbstractGesture<'dynamic'>[];
    abstract initController(): void;

    protected setAllowedGestures(allowedGestures: string[]) {
        if (allowedGestures.length !== 0) {
            // Filters the static gestures to keep only the allowed ones
            this.staticGestures = this.staticGestures.filter((gesture) =>
                allowedGestures.includes(gesture.name)
            );

            // Filters the dynamic gestures to keep only the allowed ones
            this.dynamicGestures = this.dynamicGestures.filter((gesture) =>
                allowedGestures.includes(gesture.name)
            );
        }
    }

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
        gesture: AbstractGesture<'static'>,
        frames: Frame[]
    ): boolean;

    /**
     * Checks if the frame buffer matches the model of the gesture
     * @param gesture The gesture
     * @param frames A buffer of frames
     * @returns true if the buffer matches the model, false otherwise
     */
    protected matchDynamicGesture(
        gesture: AbstractGesture<'dynamic'>,
        frames: Frame[]
    ): boolean {
        if (frames.length < 3) return false;

        // Gets the last frame in the buffer
        let last = frames[frames.length - 1];
        // Gets the last frame in the model
        const lastFrameModel = gesture.data[gesture.data.length - 1];

        if (!this.checkStaticPropertiesForModel(lastFrameModel, last))
            return false;

        let lastFrameID = -2;
        // for each frame in the model
        for (let i = gesture.data.length - 2; i >= 0; i--) {
            const model = gesture.data[i];
            let found: Frame | undefined = undefined;

            //Check if we found a corresponding frame in the real frames
            while (!found && -lastFrameID < frames.length) {
                const frame = frames[frames.length + lastFrameID];
                const duration = last.timestamp - frame.timestamp;
                if (
                    model.maxDuration !== undefined &&
                    duration > model.maxDuration
                )
                    return false;

                if (
                    model.minDuration !== undefined &&
                    duration < model.minDuration
                ) {
                    lastFrameID--;
                    continue;
                }

                if (this.checkStaticPropertiesForModel(model, frame)) {
                    found = frame;
                }
                lastFrameID--;
            }
            if (found === undefined) return false;

            const frameDiff = this.frameDiff(found, last, gesture);

            if (
                !this.checkDynamicPropertiesForModel(
                    gesture.data[i + 1],
                    frameDiff
                )
            ) {
                return false;
            }

            last = found;
        }

        return true;
    }

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
    // Utility function to compare Vectorial[3] min/max values
    protected checkVectorModel(
        vectorModel: VectorModel,
        vector: [number, number, number]
    ) {
        const { minX, minY, minZ, maxX, maxY, maxZ } = vectorModel;
        const [x, y, z] = vector;
        if (minX !== undefined && x < minX) return false;
        if (minY !== undefined && y < minY) return false;
        if (minZ !== undefined && z < minZ) return false;
        if (maxX !== undefined && x > maxX) return false;
        if (maxY !== undefined && y > maxY) return false;
        if (maxZ !== undefined && z > maxZ) return false;
        return true;
    }

    protected abstract frameDiff(
        frame1: Frame,
        frame2: Frame,
        gesture?: AbstractGesture<any>
    ): AbstractFrameDiff;

    protected abstract checkStaticPropertiesForModel(
        model: AbstractModel,
        frame: Frame
    ): boolean;

    protected abstract checkDynamicPropertiesForModel(
        model: AbstractModel,
        frameDiff: AbstractFrameDiff
    ): boolean;
}
