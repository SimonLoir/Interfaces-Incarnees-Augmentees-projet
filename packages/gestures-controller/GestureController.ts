import Leap from 'leapjs';
import {
    Model,
    Gesture,
    HandModel,
    FrameDiffExport,
    HandDiffExport,
} from './Interfaces';
import {
    oneFingerUpGesture,
    twoFingersUpGesture,
    threeFingersUpGesture,
    fourFingersUpGesture,
    fiveFingersUpGesture,
} from './gestures/hand-counting';
import FrameDiff from './diff/FrameDiff';
import { screenSharingGesture } from './gestures/screen-sharing';
import {
    thumbsDownGesture,
    thumbsUpGesture,
} from './gestures/thumbs_up_and_down';

interface EventListeners {
    frame: (frame: Leap.Frame) => void;
    gesture: (gesture: Gesture<any>) => void;
}

type EventListenerStore<T extends keyof EventListeners> = [
    T,
    EventListeners[T]
][];

export default abstract class GesturesController {
    private frameRate = 3;
    private frameStoreLength = this.frameRate * 3; // 3 seconds
    private frameStore: Leap.Frame[] = [];
    protected staticGestures: Gesture<'static'>[] = [
        oneFingerUpGesture,
        twoFingersUpGesture,
        threeFingersUpGesture,
        fourFingersUpGesture,
        fiveFingersUpGesture,
        thumbsUpGesture,
        thumbsDownGesture,
    ];

    protected dynamicGestures: Gesture<'dynamic'>[] = [screenSharingGesture];
    protected leapController: Leap.Controller;
    private eventListeners: EventListenerStore<keyof EventListeners> = [];

    constructor(
        controllerOptions: Leap.ControllerOptions,
        allowedGestures: string[] = []
    ) {
        this.leapController = new Leap.Controller(controllerOptions);
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
        this.initController();
    }

    private initController() {
        this.leapController.on('frame', (frame) => {
            if (
                frame.id %
                    Math.floor(frame.currentFrameRate / this.frameRate) !==
                0
            )
                return;

            this.frameStore.push(frame);
            if (this.frameStore.length > this.frameStoreLength)
                this.frameStore.shift();

            this.getListeners('frame').forEach((listener) => listener(frame));
            const gestureListeners = this.getListeners('gesture');
            this.extractFromFrames(this.frameStore).forEach((gesture) => {
                gestureListeners.forEach((listener) => listener(gesture));
            });
        });
        this.leapController.connect();
    }

    private getListeners<T extends keyof EventListeners>(
        type: T
    ): EventListeners[T][] {
        return this.eventListeners.reduce<EventListeners[T][]>(
            (acc, [eventType, eventListener]) => {
                if (eventType === type)
                    acc.push(eventListener as EventListeners[T]);
                return acc;
            },
            []
        );
    }

    protected addEventListener<T extends keyof EventListeners>(
        type: T,
        listener: EventListeners[T]
    ) {
        this.eventListeners.push([type, listener]);
        return [type, listener] as [T, EventListeners[T]];
    }

    protected removeEventListener<T extends keyof EventListeners>(
        type: T,
        listener: EventListeners[T]
    ) {
        this.eventListeners = this.eventListeners.filter(
            ([eventType, eventListener]) =>
                eventType !== type && eventListener !== listener
        );
    }

    public frameDiff(from: Leap.Frame, to: Leap.Frame) {
        return new FrameDiff(from, to);
    }

    /**
     * Extracts a list of gestures from a buffer of frames
     * @param frames A frame buffer
     * @returns a list of gestures found in the buffer
     */
    public extractFromFrames(frames: Leap.Frame[]): Gesture<any>[] {
        // A list of gestures found in the buffer
        const gesturesFound: Gesture<any>[] = [];
        // A list of gestures that are currently being checked
        const gestures: Gesture<any>[] = [
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
    /**
     * Checks if the frame buffer matches the model of the gesture
     * @param gesture The gesture
     * @param frames A buffer of frames
     * @returns true if the buffer matches the model, false otherwise
     */
    public matchStaticGesture(
        gesture: Gesture<'static'>,
        frames: Leap.Frame[]
    ): boolean {
        if (frames.length < 3) return false;
        // Gets the last frame in the buffer
        const lastFrame = frames[frames.length - 1];

        // Checks that the last frame matches the model. If it does not, the gesture does not match
        if (!this.checkStaticPropertiesForModel(gesture.data, lastFrame))
            return false;
        // Retrieves the minimum duration of the gesture from the model
        const { minDuration } = gesture.data;

        let i = -2;
        let firstFrame = frames[frames.length + i];

        // Gets the first frame that matches the model's duration
        while (
            firstFrame &&
            lastFrame.timestamp - firstFrame.timestamp > minDuration
        ) {
            i--;
            firstFrame = frames[frames.length + i];
        }

        // If there is no frame that matches the model's duration, the gesture does not match
        // if the first frame that matches the model's duration does not match the model, the gesture does not match
        if (
            !firstFrame ||
            !this.checkStaticPropertiesForModel(gesture.data, firstFrame)
        )
            return false;

        // Gets the differences between the first frame and the last frame
        const frameDiff = this.frameDiff(firstFrame, lastFrame);

        // Checks if the differences between the first frame and the last frame match the model
        return this.checkDynamicPropertiesForModel(
            gesture.data,
            frameDiff.export()
        );
    }

    public matchDynamicGesture(
        gesture: Gesture<'dynamic'>,
        frames: Leap.Frame[]
    ): boolean {
        if (frames.length < 3) return false;

        // Gets the last frame in the buffer
        let last = frames[frames.length - 1];
        const model = gesture.data[gesture.data.length - 1];
        let lastFrameID = -2;
        if (!this.checkStaticPropertiesForModel(model, last)) return false;

        for (let i = gesture.data.length - 2; i >= 0; i--) {
            let found: Leap.Frame | undefined = undefined;

            const model = gesture.data[i];

            while (found === undefined && -lastFrameID < frames.length) {
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

            const frameDiff = this.frameDiff(found, last);

            if (
                !this.checkDynamicPropertiesForModel(
                    gesture.data[i + 1],
                    frameDiff.export()
                )
            ) {
                return false;
            }

            last = found;
        }

        return true;
    }

    /**
     * Checks if the frame match the model without considering the motion
     * @param model The model of the hand
     * @param frame The leap motion frame
     * @returns true if the hand matches the model, false otherwise
     */
    public checkStaticPropertiesForModel(
        model: Model,
        frame: Leap.Frame
    ): boolean {
        const { hands: handsInModel } = model;
        const { hands: handsInFrame }: { hands: Leap.Hand[] } = frame;

        // If the model provides data about the hands
        if (handsInModel && handsInModel.length > 0) {
            //if (handsInGesture.length !== handsInFrame.length) return false;

            // Checks if there are enough hands in the frame
            if (handsInFrame.length < handsInModel.length) return false;

            for (const handInModel of handsInModel) {
                if (handInModel.type) {
                    // Gets the hand of the type specified in the model from the frame
                    const handInFrame = handsInFrame.find(
                        (h) => h.type === handInModel.type
                    );

                    // If the hand of the type specified in the model is not in the frame, the gesture does not match
                    if (!handInFrame) return false;

                    // Checks if the hand matches the model
                    if (!this.checkHandWithoutMotion(handInModel, handInFrame))
                        return false;
                } else {
                    // Checks if there is a hand in the frame that matches the model
                    if (
                        !handsInFrame.some((h) =>
                            this.checkHandWithoutMotion(handInModel, h)
                        )
                    )
                        return false;
                }
            }
        }
        return true;
    }

    /**
     * Checks if the hand matches the model without considering the motion
     * @param model The model of the hand
     * @param hand The leap motion hand
     * @returns true if the hand matches the model, false otherwise
     */
    public checkHandWithoutMotion(model: HandModel, hand: Leap.Hand): boolean {
        const {
            fingers: fingersInModel,
            maxGrabStrength,
            minGrabStrength,
            palmPosition: palmPositionModel,
        } = model;

        if (
            maxGrabStrength !== undefined &&
            hand.grabStrength > maxGrabStrength
        )
            return false;

        if (
            minGrabStrength !== undefined &&
            hand.grabStrength < minGrabStrength
        )
            return false;

        if (fingersInModel) {
            const { exactExtended, minExtended, maxExtended, fingersInfo } =
                fingersInModel;
            // Computes the number of extended fingers
            const extendedFingers = hand.fingers.reduce(
                (acc, finger) => (acc += finger.extended ? 1 : 0),
                0
            );

            // Checks if the number of extended fingers matches the model
            if (
                exactExtended !== undefined &&
                extendedFingers !== exactExtended
            )
                return false;

            if (minExtended !== undefined && extendedFingers < minExtended)
                return false;

            if (maxExtended !== undefined && extendedFingers > maxExtended)
                return false;

            if (fingersInfo !== undefined) {
                for (const finger of fingersInfo) {
                    const fingerFrame = hand.fingers[finger.type];
                    const [dirX, dirY, dirZ] = fingerFrame.direction;
                    if (fingerFrame === undefined) return false;
                    if (
                        finger.extended !== undefined &&
                        fingerFrame.extended !== finger.extended
                    )
                        return false;

                    if (
                        finger.maxDirectionX !== undefined &&
                        dirX > finger.maxDirectionX
                    )
                        return false;
                    if (
                        finger.minDirectionX !== undefined &&
                        dirX < finger.minDirectionX
                    )
                        return false;

                    if (
                        finger.maxDirectionY !== undefined &&
                        dirY > finger.maxDirectionY
                    )
                        return false;

                    if (
                        finger.minDirectionY !== undefined &&
                        dirY < finger.minDirectionY
                    )
                        return false;

                    if (
                        finger.maxDirectionZ !== undefined &&
                        dirZ > finger.maxDirectionZ
                    )
                        return false;

                    if (
                        finger.minDirectionZ !== undefined &&
                        dirZ < finger.minDirectionZ
                    )
                        return false;
                }
            }
        }

        if (palmPositionModel) {
            const { minX, minY, minZ, maxX, maxY, maxZ } = palmPositionModel;
            const [x, y, z] = hand.palmPosition;

            if (minX !== undefined && x < minX) return false;
            if (minY !== undefined && y < minY) return false;
            if (minZ !== undefined && z < minZ) return false;
            if (maxX !== undefined && x > maxX) return false;
            if (maxY !== undefined && y > maxY) return false;
            if (maxZ !== undefined && z > maxZ) return false;
        }

        return true;
    }

    /**
     * Checks if two frames match the model considering the motion
     * @param model The model
     * @param diff The difference between the two frames
     * @returns true if the frames match the model, false otherwise
     */
    public checkDynamicPropertiesForModel(model: Model, diff: FrameDiffExport) {
        // Gets the hands in the model
        const { hands: handsInModel } = model;
        // Gets the hands difference in the frames
        const {
            handDiffs: handsInDiff,
        }: { handDiffs: { [key: string]: HandDiffExport } } = diff;

        if (handsInModel && handsInModel.length > 0) {
            for (const handInModel of handsInModel) {
                if (handInModel.type) {
                    // Gets the hand of the type specified in the model from the frameDiff
                    const handDiff = Object.values(handsInDiff).find(
                        (h) => h.type === handInModel.type
                    );
                    // If the hand of the type specified in the model is not in the frameDiff, the gesture does not match
                    if (!handDiff) return false;

                    // Checks if the hand matches the model considering the motion
                    if (!this.checkHandWithMotion(handInModel, handDiff))
                        return false;
                } else {
                    // Checks if there is a hand in the frameDiff that matches the model considering the motion
                    if (
                        !Object.values(handsInDiff).some((h) =>
                            this.checkHandWithMotion(handInModel, h)
                        )
                    )
                        return false;
                }
            }
        }

        return true;
    }
    /**
     * Checks if the hand matches the model considering the motion
     * @param model The model of the hand
     * @param diff The difference between two frames
     * @returns true if the hand matches the model, false otherwise
     */
    public checkHandWithMotion(model: HandModel, diff: HandDiffExport) {
        // Gets the expected velocity values from the model
        const { palmVelocity } = model;

        if (palmVelocity) {
            // Gets the expected max and min values of velocity from the model
            const { maxX, maxY, maxZ, minX, minY, minZ } = palmVelocity;
            // Gets the actual velocity values from the diff
            const {
                velocityDiff: [velocityX, velocityY, velocityZ],
            } = diff;

            // Checks if the velocity values are in the expected range
            if (maxX !== undefined && velocityX > maxX) return false;
            if (maxY !== undefined && velocityY > maxY) return false;
            if (maxZ !== undefined && velocityZ > maxZ) return false;
            if (minX !== undefined && velocityX < minX) return false;
            if (minY !== undefined && velocityY < minY) return false;
            if (minZ !== undefined && velocityZ < minZ) return false;
        }
        return true;
    }
}
