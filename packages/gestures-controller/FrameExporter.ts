import Leap from 'leapjs';
export default class FrameExporter {
    constructor(private Frame: Leap.Frame) {}
    public export() {
        return {
            id: this.Frame.id,
            timestamp: this.Frame.timestamp,
            hands: this.Frame.hands.map((hand) => {
                return {
                    id: hand.id,
                    palmPosition: hand.palmPosition,
                    fingers: hand.fingers.map((finger: Leap.Finger) => {
                        return {
                            id: finger.id,
                            tipPosition: finger.tipPosition,
                            type: finger.type,
                            extended: finger.extended,
                        };
                    }),
                };
            }),
        };
    }
}
