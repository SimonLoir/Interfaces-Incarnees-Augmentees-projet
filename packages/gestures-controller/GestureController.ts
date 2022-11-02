import Leap from 'leapjs';
import {
    Model,
    Gesture,
    HandModel,
    FrameDiffExport,
    HandDiffExport,
    VectorModel,
    Finger,
    SingleFingerModel,
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
import { thumbDownGesture, thumbUpGesture } from './gestures/thumb-position';

type EventListeners = {
    frame: (frame: Leap.Frame) => void;
    gesture: (gesture: Gesture<any>) => void;
};

type EventListenerStore = {
    [K in keyof EventListeners]: EventListeners[K][];
};

export default abstract class GesturesController {
    private lastOccurrence: { [key: string]: number } = {};
    private frameRate = 3;
    private frameStoreLength = this.frameRate * 3; // 3 seconds
    private frameStore: Leap.Frame[] = [];
    protected staticGestures: Gesture<'static'>[] = [
        oneFingerUpGesture,
        twoFingersUpGesture,
        threeFingersUpGesture,
        fourFingersUpGesture,
        fiveFingersUpGesture,
        thumbDownGesture,
        thumbUpGesture,
    ];

    protected dynamicGestures: Gesture<'dynamic'>[] = [screenSharingGesture];
    protected leapController: Leap.Controller;
    private eventListeners: EventListenerStore = {
        frame: [],
        gesture: [],
    };

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

    /**
     * Initializes the Leap Motion controller by adding the proper event handlers.
     */
    private initController() {
        this.leapController.on('frame', (frame) => {
            // Ensures a nearly steady frame rate
            if (
                frame.id %
                    Math.floor(frame.currentFrameRate / this.frameRate) !==
                0
            )
                return;

            // Stores the frame in the frame buffer
            this.frameStore.push(frame);

            // Removes the oldest frame if the buffer is too long
            if (this.frameStore.length > this.frameStoreLength)
                this.frameStore.shift();

            // Sends the frame to the event handlers of the frame event
            this.eventListeners.frame.forEach((listener) => listener(frame));

            const gestureListeners = this.eventListeners.gesture;

            this.extractFromFrames(this.frameStore).forEach((gesture) => {
                if (gesture.cooldown !== undefined) {
                    // Checks that the gesture has not been triggered recently
                    if (this.lastOccurrence[gesture.name] !== undefined) {
                        if (
                            Date.now() - this.lastOccurrence[gesture.name] <
                            gesture.cooldown
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
        });
        this.leapController.connect();
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

    /**
     * Computes the difference between two frames
     * @param from The initial frame
     * @param to The final frame
     * @returns A FrameDiff object containing the difference between the two frames
     */
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
        // Checks if the grabStrength is hard enough if required
        if (
            maxGrabStrength !== undefined &&
            hand.grabStrength > maxGrabStrength
        )
            return false;
        // Checks if the grabStrength is soft enough if required
        if (
            minGrabStrength !== undefined &&
            hand.grabStrength < minGrabStrength
        )
            return false;

        if (fingersInModel) {
            const { exactExtended, minExtended, maxExtended } = fingersInModel;
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

            // Check if there are enough extended fingers
            if (minExtended !== undefined && extendedFingers < minExtended)
                return false;

            // Check if there are not too much extended fingers
            if (maxExtended !== undefined && extendedFingers > maxExtended)
                return false;

            // Map from finger name to finger id (id = index of finger in the array)
            const fingerMap: Finger[] = [
                'thumb',
                'indexFinger',
                'middleFinger',
                'ringFinger',
                'pinky',
            ];

            // Check if there is/are some fingers too inspect
            if (fingersInModel.details) {
                // For all the fingers for which we have a detail
                for (const finger of Object.keys(
                    fingersInModel.details
                ) as Finger[]) {
                    // fModel to get the SingleFingerModel of the finger
                    const fModel = fingersInModel.details[
                        finger as Finger
                    ] as SingleFingerModel;

                    // Check if the finger in the model and in the frame are both extended or unextended
                    if (
                        fModel.extended !== undefined &&
                        hand.fingers[fingerMap.indexOf(finger)].extended !==
                            fModel.extended
                    ) {
                        return false;
                    }
                    //Check if the direction of the finger in the frame matches with the one in the model
                    if (
                        fModel.direction &&
                        !this.checkVectorModel(
                            fModel.direction,
                            hand.fingers[fingerMap.indexOf(finger)].direction
                        )
                    ) {
                        return false;
                    }
                }
            }
        }

        // Check if the position of the palm in the frame matches the position of the one in the model
        if (
            palmPositionModel &&
            !this.checkVectorModel(palmPositionModel, hand.palmPosition)
        )
            return false;
        return true;
    }

    // Utility function to compare Vectorial[3] min/max values
    private checkVectorModel(
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
            if (
                palmVelocity &&
                !this.checkVectorModel(palmVelocity, diff.velocityDiff)
            )
                return false;
            return true;
        }
    }
}
