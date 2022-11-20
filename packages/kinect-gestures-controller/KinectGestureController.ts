import Kinect2 from 'kinect2';
import Frame from './Frame';
import { EventListeners, EventListenerStore, Gesture } from './types';
import { AbstractGesture, AbstractGestureController } from 'project-types';

export default class KinectGestureController extends AbstractGestureController<Frame> {
    protected frameRate = 4;
    protected frameStoreLength = this.frameRate * 3; // 3 seconds
    protected frameStore: Frame[] = [];
    protected kinectController: Kinect2;
    protected dynamicGestures: Gesture<'dynamic'>[] = [];
    protected staticGestures: Gesture<'static'>[] = [];

    constructor() {
        super();
        this.kinectController = new Kinect2();
        this.addEventListener('frame', (f) => {});
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
            if (frame.id % Math.floor(frame.frameRate / this.frameRate) === 0)
                return;
            // Add frame to frameStore
            this.frameStore.push(frame);
            // Remove old frames
            if (this.frameStore.length > this.frameStoreLength)
                this.frameStore.shift();
            // Emit frame event
            this.eventListeners.frame.forEach((l) => l(frame));

            // Get gesture listeners
            const gestureListeners = this.eventListeners.gesture;

            this.extractFromFrames(this.frameStore).forEach((gesture) => {
                gestureListeners.forEach((listener) => listener(gesture));
            });
        });
    }
    protected matchStaticGesture(
        gesture: Gesture<'static'>,
        frames: Frame[]
    ): boolean {
        return true;
    }

    protected matchDynamicGesture(
        gesture: Gesture<'dynamic'>,
        frame: Frame[]
    ): boolean {
        return true;
    }
}
