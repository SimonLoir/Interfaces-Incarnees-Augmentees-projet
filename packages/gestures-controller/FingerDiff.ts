import Leap from 'leapjs';

export default class FingerDiff {
    private extend: boolean = false;
    private retract: boolean = false;
    constructor(private finger1: Leap.Finger, private finger2: Leap.Finger) {
        if (finger1.id !== finger2.id)
            throw new Error('The fingers must have the same id');

        if (finger1.extended !== finger2.extended) {
            this.extend = finger2.extended;
            this.retract = finger1.extended;
        }
    }

    public export() {
        return {
            ...(this.extend && { extend: this.extend }),
            ...(this.retract && { retract: this.retract }),
        };
    }
}
