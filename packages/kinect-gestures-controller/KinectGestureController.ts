import Kinect2, { Joint } from 'kinect2';
import Frame from './Frame';
import { BodyModel, Model, Gesture } from './types';
import {
    AbstractGesture,
    AbstractGestureController,
    Vector,
} from 'project-types';
import FrameDiff from './diff/FrameDiff';

export default class KinectGestureController extends AbstractGestureController<Frame> {
    protected frameRate = 8;
    protected frameStoreLength = this.frameRate * 3; // 3 seconds
    protected frameStore: Frame[] = [];

    protected dynamicGestures: Gesture<'dynamic'>[] = [];
    protected staticGestures: Gesture<'static'>[] = [];
    protected kinectController: Kinect2;
    constructor(allowedGestures: string[] = []) {
        super();
        this.kinectController = new Kinect2();
        this.setAllowedGestures(allowedGestures);
        if (this.kinectController.open()) {
            this.kinectController.openBodyReader();
            this.initController();
        }
    }
    /*
        Initializes the kinect Controller and adds the event listeners
    */
    public initController() {
        this.kinectController.on('bodyFrame', (bodyFrame) => {
            const frame = new Frame(bodyFrame);
            // Ensures a nearly steady frame rate
            if (frame.id % Math.floor(frame.frameRate / this.frameRate) !== 0)
                return;
            this.handleFrame(frame);
        });
    }
    protected matchStaticGesture(
        gesture: Gesture<'static'>,
        frames: Frame[]
    ): boolean {
        return false;
    }

    protected matchDynamicGesture(
        gesture: Gesture<'dynamic'>,
        frames: Frame[]
    ): boolean {
        if (frames.length < 3) return false;

        // Gets the last frame in the buffer
        let last = frames[frames.length - 1];
        // Gets the last frame in the model
        const lastFrameModel = gesture.data[gesture.data.length - 1];

        if (!this.checkStaticPropertiesForModel(lastFrameModel, last))
            return false;

        let lastFrameID = -2;
        // for each frame in the model
        for (let i = gesture.data.length - 2; i >= 0; i--) {
            const model = gesture.data[i];
            let found: Frame | undefined = undefined;

            //Check if we found a correpsonding frame in the real frames
            while (!found && -lastFrameID < frames.length) {
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

            const frameDiff = new FrameDiff(found, last);

            if (
                !this.checkDynamicPropertiesForModel(
                    gesture.data[i + 1],
                    frameDiff
                )
            ) {
                return false;
            }

            last = found;
        }

        return true;
    }

    protected checkStaticPropertiesForModel(
        model: Model,
        frame: Frame
    ): boolean {
        const { body: bodyModel } = model;
        const { arms: armsInModel, forearms: forearmsInModel } = bodyModel;

        if (armsInModel) {
            for (const arm of armsInModel) {
                const { type, direction } = arm;
                const { body } = frame;
                if (type === 'left') {
                    if (!body.ShoulderLeft || !body.ElbowLeft) return false;
                    const directionVector = this.generateDirectionBetweenJoints(
                        body.ShoulderLeft,
                        body.ElbowLeft
                    );
                    if (!this.checkVectorModel(direction, directionVector))
                        return false;
                } else if (type === 'right') {
                    if (!body.ShoulderRight || !body.ElbowRight) return false;
                    const directionVector = this.generateDirectionBetweenJoints(
                        body.ShoulderRight,
                        body.ElbowRight
                    );
                    if (!this.checkVectorModel(direction, directionVector))
                        return false;
                }
            }
        }

        if (forearmsInModel) {
            for (const forearm of forearmsInModel) {
                const { type, direction } = forearm;
                const { body } = frame;
                if (type === 'left') {
                    if (!body.ElbowLeft || !body.WristLeft) return false;
                    const directionVector = this.generateDirectionBetweenJoints(
                        body.ElbowLeft,
                        body.WristLeft
                    );
                    if (!this.checkVectorModel(direction, directionVector))
                        return false;
                } else if (type === 'right') {
                    if (!body.ElbowRight || !body.WristRight) return false;
                    const directionVector = this.generateDirectionBetweenJoints(
                        body.ElbowRight,
                        body.WristRight
                    );
                    if (!this.checkVectorModel(direction, directionVector))
                        return false;
                }
            }
        }

        return true;
    }

    protected checkDynamicPropertiesForModel(
        model: Model,
        frameDiff: FrameDiff
    ): boolean {
        return true;
    }

    // Utility function to compare Vectorial[3] min/max values

    protected generateDirectionBetweenJoints(
        firstJoint: Joint,
        secondJoint: Joint
    ): Vector {
        const direction: number[] = [];
        direction.push(secondJoint.cameraX - firstJoint.cameraX);
        direction.push(secondJoint.cameraY - firstJoint.cameraY);
        direction.push(secondJoint.cameraZ - firstJoint.cameraZ);
        const distance = Math.sqrt(
            direction[0] ** 2 + direction[1] ** 2 + direction[2] ** 2
        );
        return direction.map((value) => value / distance) as Vector;
    }
}
