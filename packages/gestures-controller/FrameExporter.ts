import Leap from 'leapjs';
export default class FrameExporter {
    public fingerNames = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];
    constructor(private Frame: Leap.Frame) {}

    private exportHandData(hand: Leap.Hand) {
        return {
            armBasis: hand.arm.basis,
            type: hand.type,
            direction: hand.direction,
            palmNormal: hand.palmNormal,
            palmPosition: hand.palmPosition,
            palmVelocity: hand.palmVelocity,
            grabStrength: hand.grabStrength,
            pinchStrength: hand.pinchStrength,
            stabilizedPalmPosition: hand.stabilizedPalmPosition,
            sphereCenter: hand.sphereCenter,
            sphereRadius: hand.sphereRadius,
            fingers: hand.fingers.map(this.exportFingerData.bind(this)),
        };
    }

    private exportFingerData(finger: Leap.Finger) {
        return {
            type: this.fingerNames[finger.type],
            direction: finger.direction,
            stabilizedTipPosition: finger.stabilizedTipPosition,
            length: finger.length,
            width: finger.width,
            timeVisible: finger.timeVisible,
            tipPosition: finger.tipPosition,
            tipVelocity: finger.tipVelocity,
        };
    }

    public export() {
        return {
            id: this.Frame.id,
            timestamp: this.Frame.timestamp,
            hands: this.Frame.hands.map(this.exportHandData.bind(this)),
        };
    }
}
