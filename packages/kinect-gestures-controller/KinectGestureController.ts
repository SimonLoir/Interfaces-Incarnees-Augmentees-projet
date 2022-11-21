import Kinect2 from 'kinect2';
import Frame from './Frame';
import { EventListeners, EventListenerStore, Gesture } from './types';
import { AbstractGesture, AbstractGestureController } from 'project-types';

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
        frame: Frame[]
    ): boolean {
        return true;
    }
}
