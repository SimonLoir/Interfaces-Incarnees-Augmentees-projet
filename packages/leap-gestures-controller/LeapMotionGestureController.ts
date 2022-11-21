import Leap from 'leapjs';
import {
    Model,
    Gesture,
    HandModel,
    FrameDiffExport,
    HandDiffExport,
    Finger,
    SingleFingerModel,
} from './Interfaces';
import {
    oneFingerUpGesture,
    twoFingersUpGesture,
    threeFingersUpGesture,
    fourFingersUpGesture,
    fiveFingersUpGesture,
    sixFingersUpGesture,
    sevenFingersUpGesture,
    eightFingersUpGesture,
    nineFingersUpGesture,
    tenFingersUpGesture,
} from './gestures/hand-counting';
import FrameDiff from './diff/FrameDiff';
import { screenSharingGesture } from './gestures/screen-sharing';
import { thumbDownGesture, thumbUpGesture } from './gestures/thumb-position';
import { swipeLeftGesture, swipeRightGesture } from './gestures/swipe';
import { scrollLeftGesture, scrollRightGesture } from './gestures/scroll';
import { AbstractGestureController } from 'project-types';

export default class LeapMotionGestureController extends AbstractGestureController<Leap.Frame> {
    protected frameRate = 4;
    protected frameStoreLength = this.frameRate * 3; // 3 seconds
    protected frameStore: Leap.Frame[] = [];
    protected staticGestures: Gesture<'static'>[] = [
        oneFingerUpGesture,
        twoFingersUpGesture,
        threeFingersUpGesture,
        fourFingersUpGesture,
        fiveFingersUpGesture,
        sixFingersUpGesture,
        sevenFingersUpGesture,
        eightFingersUpGesture,
        nineFingersUpGesture,
        tenFingersUpGesture,
        thumbDownGesture,
        thumbUpGesture,
    ];

    protected dynamicGestures: Gesture<'dynamic'>[] = [
        screenSharingGesture,
        swipeLeftGesture,
        swipeRightGesture,
        scrollLeftGesture,
        scrollRightGesture,
    ];
    protected leapController: Leap.Controller;

    constructor(
        controllerOptions: Leap.ControllerOptions,
        allowedGestures: string[] = []
    ) {
        super();
        this.leapController = new Leap.Controller(controllerOptions);
        this.setAllowedGestures(allowedGestures);

        this.initController();
    }

    /**
     * Initializes the Leap Motion controller by adding the proper event handlers.
     */
    initController() {
        this.leapController.on('frame', (frame) => {
            // Ensures a nearly steady frame rate
            if (
                frame.id %
                    Math.floor(frame.currentFrameRate / this.frameRate) !==
                0
            )
                return;
            this.handleFrame(frame);
        });
        this.leapController.connect();
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
     * Checks if the frame buffer matches the model of the gesture
     * @param gesture The gesture
     * @param frames A buffer of frames
     * @returns true if the buffer matches the model, false otherwise
     */
    protected matchStaticGesture(
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
        return this.checkDynamicPropertiesForModel(gesture.data, frameDiff);
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
        const { hands: handsInModel, fingers: fingersInModel } = model;
        const { hands: handsInFrame }: { hands: Leap.Hand[] } = frame;

        if (fingersInModel) {
            const { exactExtended, minExtended, maxExtended } = fingersInModel;
            // Computes the number of extended fingers
            const extendedFingers = handsInFrame
                .map(({ fingers }: { fingers: Leap.Finger[] }) =>
                    fingers.reduce(
                        (acc, finger) => (acc += finger.extended ? 1 : 0),
                        0
                    )
                )
                .reduce((a, b) => a + b, 0);

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
        }

        // If the model provides data about the hands
        if (handsInModel && handsInModel.length > 0) {
            //if (handsInGesture.length !== handsInFrame.length) return false;
            // Checks if there are enough hands in the frame
            //if (
            //    !model.allowOnlyOneHandMatch &&
            //    handsInFrame.length < handsInModel.length
            //)
            //    return false;

            let inValidCount = 0;
            for (const handInModel of handsInModel) {
                if (handInModel.type) {
                    // Gets the hand of the type specified in the model from the frame
                    const handInFrame = handsInFrame.find(
                        (h) => h.type === handInModel.type
                    );

                    // If the hand of the type specified in the model is not in the frame, the gesture does not match
                    if (!handInFrame) {
                        if (handInModel.onlyIfPresent !== true) inValidCount++;
                        continue;
                    }

                    // Checks if the hand matches the model
                    if (
                        !this.checkHandWithoutMotion(handInModel, handInFrame)
                    ) {
                        inValidCount++;
                        continue;
                    }
                } else {
                    // Checks if there is a hand in the frame that matches the model
                    if (
                        !handsInFrame.some((h) =>
                            this.checkHandWithoutMotion(handInModel, h)
                        )
                    ) {
                        inValidCount++;
                        continue;
                    }
                }
            }

            if (!model.allowOnlyOneHandMatch && inValidCount > 0) return false;
            if (
                model.allowOnlyOneHandMatch &&
                inValidCount === handsInModel.length
            )
                return false;
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
            palmNormal: palmNormalModel,
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

        if (
            palmNormalModel !== undefined &&
            !this.checkVectorModel(palmNormalModel, hand.palmNormal)
        )
            return false;
        if (
            palmPositionModel &&
            !this.checkVectorModel(palmPositionModel, hand.palmPosition)
        )
            // Check if the position of the palm in the frame matches the position of the one in the model
            return false;
        return true;
    }

    /**
     * Checks if two frames match the model considering the motion
     * @param model The model
     * @param diff The difference between the two frames
     * @returns true if the frames match the model, false otherwise
     */
    public checkDynamicPropertiesForModel(model: Model, diff: FrameDiff) {
        // Gets the hands in the model
        const exportDiff = diff.export();
        const { hands: handsInModel, allowOnlyOneHandMatch: oneMatch } = model;
        // Gets the hands difference in the frames
        const {
            handDiffs: handsInDiff,
        }: { handDiffs: { [key: string]: HandDiffExport } } = exportDiff;

        if (handsInModel && handsInModel.length > 0) {
            let inValidCount = 0;
            for (const handInModel of handsInModel) {
                if (handInModel.type) {
                    // Gets the hand of the type specified in the model from the frameDiff
                    const handDiff = Object.values(handsInDiff).find(
                        (h) => h.type === handInModel.type
                    );

                    // If the hand of the type specified in the model is not in the frameDiff, the gesture does not match
                    if (!handDiff) {
                        if (handInModel.onlyIfPresent !== true) inValidCount++;
                        continue;
                    }

                    // Checks if the hand matches the model considering the motion
                    if (!this.checkHandWithMotion(handInModel, handDiff)) {
                        inValidCount++;
                        continue;
                    }
                } else {
                    // Checks if there is a hand in the frameDiff that matches the model considering the motion
                    if (
                        !Object.values(handsInDiff).some((h) =>
                            this.checkHandWithMotion(handInModel, h)
                        )
                    ) {
                        inValidCount++;
                        continue;
                    }
                }
            }
            if (oneMatch && inValidCount === handsInModel.length) return false;
            if (!oneMatch && inValidCount > 0) return false;
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

    public destroy() {
        this.leapController.disconnect();
    }
}
