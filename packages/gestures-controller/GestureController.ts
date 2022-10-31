import Leap from 'leapjs';
import { Model, Gesture, HandModel, FrameDiffExport } from './Interfaces';
import { getAt } from '@utils/global';
import {
    oneFingerUpGesture,
    twoFingersUpGesture,
    threeFingersUpGesture,
    fourFingersUpGesture,
    fiveFingersUpGesture,
} from './gestures/hand-counting';
import FrameDiff from './FrameDiff';

console.log(oneFingerUpGesture);

export default abstract class GesturesController {
    protected staticGestures: Gesture<'static'>[] = [
        oneFingerUpGesture,
        twoFingersUpGesture,
        threeFingersUpGesture,
        fourFingersUpGesture,
        fiveFingersUpGesture,
    ];

    protected dynamicGestures: Gesture<'dynamic'>[] = [];

    constructor(
        protected LeapController: Leap.Controller,
        allowedGestures: string[] = []
    ) {
        if (allowedGestures.length !== 0) {
            this.staticGestures = this.staticGestures.filter((gesture) =>
                allowedGestures.includes(gesture.name)
            );
            this.dynamicGestures = this.dynamicGestures.filter((gesture) =>
                allowedGestures.includes(gesture.name)
            );
        }
    }

    public frameDiff(from: Leap.Frame, to: Leap.Frame) {
        return new FrameDiff(from, to);
    }

    public extractFromFrames(frames: Leap.Frame[]): Gesture<any>[] {
        const gesturesFound: Gesture<any>[] = [];
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

    public matchStaticGesture(
        gesture: Gesture<'static'>,
        frames: Leap.Frame[]
    ): boolean {
        const lastFrame = frames[frames.length - 1];
        if (!this.checkStaticPropertiesForModel(gesture.data, lastFrame))
            return false;

        const { minDuration } = gesture.data;
        let i = -2;
        let currentFrame = frames[frames.length + i];
        while (
            currentFrame &&
            currentFrame.timestamp - lastFrame.timestamp < minDuration
        ) {
            i--;
            currentFrame = frames[frames.length + i];
        }

        if (
            !currentFrame ||
            !this.checkStaticPropertiesForModel(gesture.data, currentFrame)
        )
            return false;

        const frameDiff = this.frameDiff(currentFrame, lastFrame);

        return this.checkDynamicPropertiesForModel(
            gesture.data,
            frameDiff.export()
        );
    }

    public matchDynamicGesture(
        gesture: Gesture<'dynamic'>,
        frames: Leap.Frame[]
    ): boolean {
        return false;
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
        const { fingers: fingersInModel } = model;

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

            if (minExtended !== undefined && extendedFingers < minExtended)
                return false;

            if (maxExtended !== undefined && extendedFingers > maxExtended)
                return false;
        }

        return true;
    }

    public checkDynamicPropertiesForModel(model: Model, diff: FrameDiffExport) {
        return false;
    }
}
