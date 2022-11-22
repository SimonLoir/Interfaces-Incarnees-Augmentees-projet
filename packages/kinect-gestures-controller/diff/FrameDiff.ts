import { Joint } from 'kinect2';
import { Vector } from 'project-types';
import Frame from '../Frame';
import AbstractFrameDiff from 'project-types/AbstractFrameDiff';
import { FrameDiffExport } from '../types';

export default class FrameDiff extends AbstractFrameDiff {
    protected timeDiff: number;
    protected armsVelocityDiff: {
        left: Vector | undefined;
        right: Vector | undefined;
    } = { left: undefined, right: undefined };
    protected armsPositionDiff: {
        left: Vector | undefined;
        right: Vector | undefined;
    } = { left: undefined, right: undefined };
    protected forearmsVelocityDiff: {
        left: Vector | undefined;
        right: Vector | undefined;
    } = { left: undefined, right: undefined };
    protected forearmsPositionDiff: {
        left: Vector | undefined;
        right: Vector | undefined;
    } = { left: undefined, right: undefined };

    constructor(private frame1: Frame, private frame2: Frame) {
        super();
        this.timeDiff = this.frame2.timestamp - this.frame1.timestamp;
        this.armsDiff();
        this.forearmsDiff();
    }

    protected armsDiff() {
        const leftArmMidFrame1: Vector = this.getMidBone(
            this.frame1.body.ShoulderLeft!,
            this.frame1.body.ElbowLeft!
        );
        const leftArmMidFrame2: Vector = this.getMidBone(
            this.frame2.body.ShoulderLeft!,
            this.frame2.body.ElbowLeft!
        );
        const rightArmMidFrame1: Vector = this.getMidBone(
            this.frame1.body.ShoulderRight!,
            this.frame1.body.ElbowRight!
        );
        const rightArmMidFrame2: Vector = this.getMidBone(
            this.frame2.body.ShoulderRight!,
            this.frame2.body.ElbowRight!
        );

        const {
            positionDiff: leftPositionDiff,
            velocityDiff: leftVelocityDiff,
        } = this.vectorDiff(leftArmMidFrame1, leftArmMidFrame2);

        this.armsPositionDiff.left = leftPositionDiff;
        this.armsVelocityDiff.left = leftVelocityDiff;

        const {
            positionDiff: rightPositionDiff,
            velocityDiff: rightVelocityDiff,
        } = this.vectorDiff(rightArmMidFrame1, rightArmMidFrame2);

        this.armsPositionDiff.right = rightPositionDiff;
        this.armsVelocityDiff.right = rightVelocityDiff;
    }

    protected forearmsDiff() {
        const leftForearmMidFrame1: Vector = this.getMidBone(
            this.frame1.body.ElbowLeft!,
            this.frame1.body.WristLeft!
        );
        const leftForearmMidFrame2: Vector = this.getMidBone(
            this.frame2.body.ElbowLeft!,
            this.frame2.body.WristLeft!
        );
        const rightForearmMidFrame1: Vector = this.getMidBone(
            this.frame1.body.ElbowRight!,
            this.frame1.body.WristRight!
        );
        const rightForearmMidFrame2: Vector = this.getMidBone(
            this.frame2.body.ElbowRight!,
            this.frame2.body.WristRight!
        );

        const {
            positionDiff: leftPositionDiff,
            velocityDiff: leftVelocityDiff,
        } = this.vectorDiff(leftForearmMidFrame1, leftForearmMidFrame2);

        this.forearmsPositionDiff.left = leftPositionDiff;
        this.forearmsVelocityDiff.left = leftVelocityDiff;

        const {
            positionDiff: rightPositionDiff,
            velocityDiff: rightVelocityDiff,
        } = this.vectorDiff(rightForearmMidFrame1, rightForearmMidFrame2);

        this.forearmsPositionDiff.right = rightPositionDiff;
        this.forearmsVelocityDiff.right = rightVelocityDiff;
    }

    protected getMidBone(joint1: Joint, joint2: Joint): Vector {
        return [
            (joint1.cameraX + joint2.cameraX) / 2,
            (joint1.cameraY + joint2.cameraY) / 2,
            (joint1.cameraZ + joint2.cameraZ) / 2,
        ];
    }

    protected vectorDiff(
        vector1: Vector,
        vector2: Vector
    ): { positionDiff: Vector; velocityDiff: Vector } {
        const positionDiff: Vector = [
            vector2[0] - vector1[0],
            vector2[1] - vector1[1],
            vector2[2] - vector1[2],
        ];

        const velocityDiff: Vector = positionDiff.map(
            (value) => (value / this.timeDiff) * 1_000_000
        ) as Vector;

        return { positionDiff, velocityDiff };
    }

    public export(): FrameDiffExport {
        return {
            frame1: this.frame1.id,
            frame2: this.frame2.id,
            armVelocityDiff: this.armsVelocityDiff,
            armsPositionDiff: this.armsPositionDiff,
            forearmVelocityDiff: this.forearmsVelocityDiff,
            forearmsPositionDiff: this.forearmsPositionDiff,
            timeDiff: this.timeDiff,
        };
    }
}
