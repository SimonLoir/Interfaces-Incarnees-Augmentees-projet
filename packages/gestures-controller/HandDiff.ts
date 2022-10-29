import Leap from 'leapjs';
import FingerDiff from './FingerDiff';

export default class HandDiff {
    /* The delta between the number of fingers in the first hand and in the second hand */
    private fingerCountDiff: number = 0;
    private palmPositionDiff: [number, number, number] = [0, 0, 0];
    private commonFingers: string[] = [];
    private fingerDiffs: { [id: string]: FingerDiff } = {};

    constructor(private hand1: Leap.Hand, private hand2: Leap.Hand) {
        if (hand1.id !== hand2.id)
            throw new Error('The hands must have the same id');
        this.fingersDiff();
        this.palmDiff();
    }

    private fingersDiff() {
        // Counting the fingers in the first hand and in the second hand
        this.fingerCountDiff =
            this.hand2.fingers.length - this.hand1.fingers.length;

        // Finding the common fingers between the two hands
        this.hand1.fingers.forEach((finger1) => {
            this.hand2.fingers.forEach((finger2) => {
                if (finger1.id === finger2.id) {
                    this.commonFingers.push(finger1.id);
                    this.fingerDiffs[finger1.id] = new FingerDiff(
                        finger1,
                        finger2
                    );
                }
            });
        });
    }

    private palmDiff() {
        this.palmPositionDiff = [
            this.hand2.palmPosition[0] - this.hand1.palmPosition[0],
            this.hand2.palmPosition[1] - this.hand1.palmPosition[1],
            this.hand2.palmPosition[2] - this.hand1.palmPosition[2],
        ];
    }

    /**
     * Exports the data stored in the HandDiff
     */
    public export() {
        return {
            fingerCountDiff: this.fingerCountDiff,
        };
    }
}
