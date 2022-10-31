import Leap from 'leapjs';
import { Gesture } from './Interfaces';
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
        return false;
    }

    public matchDynamicGesture(
        gesture: Gesture<'dynamic'>,
        frames: Leap.Frame[]
    ): boolean {
        return false;
    }
}
