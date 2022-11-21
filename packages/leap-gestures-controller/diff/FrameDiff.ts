import Leap from 'leapjs';
import HandDiff from './HandDiff';
import { FrameDiffExport } from '../Interfaces';
import AbstractFrameDiff from 'project-types/AbstractFrameDiff';
export default class FrameDiff extends AbstractFrameDiff {
    /* The delta between the number of hands in the first frame and in the second frame */
    private handCountDiff: number = 0;
    /* The ids of the hands that are common to both frames */
    private commonHands: string[] = [];
    /* The delta between the number of fingers in the first frame and in the second frame */
    private fingerCountDiff: number = 0;
    /* Store of HandDiffs for the hands in common */
    private handDiffs: { [id: string]: HandDiff } = {};

    protected timeDiff = 0;

    constructor(private frame1: Leap.Frame, private frame2: Leap.Frame) {
        super();
        this.timeDiff = this.frame2.timestamp - this.frame1.timestamp;
        this.handsDiff();
        this.fingersDiff();
    }

    public handsDiff() {
        // Counting the hands in the first frame and in the second frame
        this.handCountDiff =
            this.frame2.hands.length - this.frame1.hands.length;

        // Finding the common hands between the two frames
        this.frame1.hands.forEach((hand1) => {
            this.frame2.hands.forEach((hand2) => {
                if (hand1.id === hand2.id) {
                    this.commonHands.push(hand1.id);
                    this.handDiffs[hand1.id] = new HandDiff(
                        hand1,
                        hand2,
                        this.timeDiff
                    );
                }
            });
        });
    }

    public fingersDiff() {
        // Counting the fingers in the first frame and in the second frame
        this.fingerCountDiff =
            this.frame2.fingers.length - this.frame1.fingers.length;
    }

    /**
     * Exports the data stored in the FrameDiff
     */
    public export(): FrameDiffExport {
        return {
            frame1: this.frame1.id,
            frame2: this.frame2.id,
            handCountDiff: this.handCountDiff,
            commonHands: this.commonHands,
            fingerCountDiff: this.fingerCountDiff,
            timeDiff: this.timeDiff,
            handDiffs: Object.fromEntries(
                Object.entries(this.handDiffs).map(([key, value]) => [
                    key,
                    value.export(),
                ])
            ),
        };
    }
}
