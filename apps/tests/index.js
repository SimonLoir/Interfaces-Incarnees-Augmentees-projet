const Leap = require('leapjs');
const fs = require('fs');
const controller = new Leap.Controller();

let started = false;
let out = [];

controller.on('frame', function (frame) {
    const { hands, id, timestamp, valid } = frame;
    console.log(
        'Frame id: ' +
            id +
            ', timestamp: ' +
            timestamp +
            ', hands: ' +
            hands.length
    );
    hands = hands.map((hand) => {
        const {
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
        } = hand;

        return {
            confidence,
            direction,
            grabStrength,
            id,
            palmNormal,
            palmPosition,
            palmVelocity,
            pitch: pitch(),
            roll: roll(),
            sphereCenter,
            sphereRadius,
            stabilizedPalmPosition,
            timeVisible,
            type,
            yaw: yaw(),
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
