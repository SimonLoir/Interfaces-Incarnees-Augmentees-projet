import Leap from 'leapjs';

export default class HandDiff {
    /* The delta between the number of fingers in the first hand and in the second hand */
    private fingerCountDiff: number = 0;

    constructor(private hand1: Leap.Hand, private hand2: Leap.Hand) {
        if (hand1.id !== hand2.id)
            throw new Error('The hands must have the same id');
        this.fingersDiff();
    }

    private fingersDiff() {
        // Counting the fingers in the first hand and in the second hand
        this.fingerCountDiff =
            this.hand2.fingers.length - this.hand1.fingers.length;
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
