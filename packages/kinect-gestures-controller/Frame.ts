import { BodyFrame } from 'kinect2';
import { Body, joints as JoinTypes } from './types';
export default class Frame {
    private __bodies: { [key: number]: Body } = {};
    constructor(frame: BodyFrame) {
        frame.bodies.forEach((body) => {
            const newBody: Body = {} as Body;

            if (!body.tracked) return newBody;

            for (const joint of body.joints) {
                const jointType = JoinTypes[joint.jointType];
                newBody[jointType] = joint;
            }

            this.__bodies[body.trackingId] = newBody;
        });
    }
}
