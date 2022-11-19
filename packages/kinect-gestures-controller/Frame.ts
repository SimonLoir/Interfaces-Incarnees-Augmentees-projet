import { BodyFrame } from 'kinect2';
import { Body, joints as JoinTypes } from './types';
export default class Frame {
    private __bodies: Body[] = [];
    constructor(initialFrame: BodyFrame) {
        this.__bodies = initialFrame.bodies.map((body) => {
            const newBody: Body = {} as Body;
            for (const joint of body.joints) {
                const jointType = JoinTypes[joint.jointType];
                newBody[jointType] = joint;
            }
            return newBody;
        });
    }
}
