import Leap from 'leapjs';
import { Gesture } from './Interfaces';
import gesture1 from './gestures/gesture1.json';
import FrameDiff from './FrameDiff';

console.log(gesture1);

export default abstract class GesturesController {
    protected gestures: Gesture[] = [gesture1 as Gesture];
    constructor(protected LeapController: Leap.Controller) {}
    public frameDiff(from: Leap.Frame, to: Leap.Frame) {
        return new FrameDiff(from, to);
    }
}
