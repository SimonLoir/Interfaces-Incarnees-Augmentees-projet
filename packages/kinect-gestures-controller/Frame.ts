import { BodyFrame } from 'kinect2';
import { Body, joints as JoinTypes } from './types';
export default class Frame {
    private static id = 0;
    private __bodies: { [key: number]: Body } = {};
    private __timestamp: number = Date.now();
    private __id = Frame.id++;
    private __frameRate = 30;

    constructor(frame: BodyFrame) {
        frame.bodies.forEach((body) => {
            const newBody: Body = {} as Body;

            if (!body.tracked) return newBody;

            for (const joint of body.joints) {
                const jointType = JoinTypes[joint.jointType];
                if (joint.trackingState > 0) {
                    newBody[jointType] = joint;
                }
            }

            this.__bodies[body.trackingId] = newBody;
        });
        console.log(this.__id, this.__timestamp);
    }

    get id() {
        return this.__id;
    }

    get frameRate() {
        return this.__frameRate;
    }

    get body(): Body {
        return Object.values(this.__bodies)[0];
    }
}
