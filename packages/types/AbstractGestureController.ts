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
export default abstract class AbstractGestureController<Frame, Gesture> {
    protected eventListeners: EventListenerStore<Frame, Gesture> = {
        frame: [],
        gesture: [],
    };
    abstract initController(): void;

    /**
     * Adds an event listener to the controller
     * @param type The type of the event
     * @param handler The event handler
     * @returns A list containing the type of the event and the event handler
     */
    protected addEventListener<T extends keyof EventListeners<Frame, Gesture>>(
        type: T,
        handler: EventListeners<Frame, Gesture>[T]
    ) {
        this.eventListeners[type].push(handler);
        return [type, handler] as [T, EventListeners<Frame, Gesture>[T]];
    }

    /**
     * Removes an event listener from the controller
     * @param type The type of the event
     * @param handler The event handler
     */
    protected removeEventListener<
        T extends keyof EventListeners<Frame, Gesture>
    >(type: T, handler: EventListeners<Frame, Gesture>[T]) {
        this.eventListeners[type] = this.eventListeners[type].filter(
            (l) => l !== handler
        ) as EventListenerStore<Frame, Gesture>[T];
    }
}
