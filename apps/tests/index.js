const Leap = require('leapjs');
const fs = require('fs');
const controller = new Leap.Controller();

let started = false;
let out = [];
const finger_names = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];

controller.on('frame', function (frame) {
    let { hands, id, timestamp, valid } = frame;
    console.log(
        'Frame id: ' +
            id +
            ', timestamp: ' +
            timestamp +
            ', hands: ' +
            hands.length
    );
    hands = hands.map((hand) => {
        let {
            confidence,
            direction,
            grabStrength,
            id,
            palmNormal,
            palmPosition,
            palmVelocity,
            pitch,
            roll,
            sphereCenter,
            sphereRadius,
            stabilizedPalmPosition,
            timeVisible,
            type,
            yaw,
            fingers,
        } = hand;
        fingers = fingers.map((finger) => {
            let { type, extended, hand } = finger;
            type = finger_names[type];
            try {
                hand = hand().id;
            } catch (e) {
                hand = null;
            }
            return { type, extended, hand };
        });
        return {
            confidence,
            direction,
            grabStrength,
            id,
            palmNormal,
            palmPosition,
            palmVelocity,
            //pitch: pitch(),
            //roll: roll(),
            sphereCenter,
            sphereRadius,
            stabilizedPalmPosition,
            timeVisible,
            type,
            //yaw: yaw(),
            fingers,
        };
    });

    if (hands.length > 0) {
        started = true;
        out.push({ id, timestamp, valid, hands });
    } else if (started) {
        started = false;
        fs.writeFileSync('data.json', JSON.stringify(out));
        out = [];
    }
});
controller.connect();
