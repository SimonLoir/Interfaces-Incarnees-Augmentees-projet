import Kinect2 from 'kinect2';
import Frame from './Frame';
import { EventListeners, EventListenerStore, Gesture } from './types';
import { AbstractGestureController } from 'project-types';

export default class KinectGestureController extends AbstractGestureController<
    Frame,
    Gesture
> {
    private frameRate = 4;
    private frameStoreLength = this.frameRate * 3; // 3 seconds
    private frameStore: Frame[] = [];
    private kinectController: Kinect2;
    protected gestures: Gesture[] = [];

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

    public extractFromFrames(frames: Frame[]): Gesture[] {
        const gesturesFound: Gesture[] = [];
        // require better implementation of type Gesture
        for (const gesture of this.gestures) {
            if (this.matchGesture(gesture, frames)) {
                gesturesFound.push(gesture);
            }
        }

        return gesturesFound;
    }

    public matchGesture(gesture: Gesture, frames: Frame[]): boolean {
        // Create Gesture recognition logic here
        // require better implementation of type Gesture
        return false;
    }
}
