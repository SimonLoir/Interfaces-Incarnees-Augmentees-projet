import { Gesture, HandModel, VectorModel } from '../Interfaces';
/*
arm basis down : [[0.43,0.61,-0.65],[-0.45,0.78,0.48]]
palmNormalDown : [0.26,-0.75,-0.59]
arm basis up : [[-0.51,-0.60,0.60],[0.38,-0.79,-0.47]]
palmNormalUp : [-0.21,0.75,0.62]


PalmNormal analysis :
- normal thumbs-up : expected[-1,0,0]
- turned thumbs-up : expected[0,0,1]
- normal thumbs-down : expected[1,0,0]
- turned thumbs-down : expected[0,0,-1]
*/
function getBase(type: 'right' | 'left'): HandModel {
    return {
        type,

        palmVelocity: {
            maxX: 15,
            maxY: 15,
            maxZ: 15,
        },

        minGrabStrength: 1,
    };
}

function thumbGestureBuilder(
    type: 'up' | 'down',
    palmNormalRight: VectorModel,
    palmNormalLeft: VectorModel
): Gesture<'static'> {
    return {
        name: 'thumb-position-' + type,
        type: 'static',
        description: `Thumbs ${type} gesture`,
        coolDown: 1000,
        data: {
            minDuration: 1_000_000,
            allowOnlyOneHandMatch: true,
            hands: [
                {
                    ...getBase('right'),

                    palmNormal: palmNormalRight,
                },

                {
                    ...getBase('left'),

                    palmNormal: palmNormalLeft,
                },
            ],
        },
    };
}

export const thumbUpGesture: Gesture<'static'> = thumbGestureBuilder(
    'up',
    {
        minY: -0.35,
        maxY: 0.35,
        minX: -1,
        maxX: 0,
        minZ: 0,
        maxZ: 1,
    },
    {
        minY: -0.35,
        maxY: 0.35,
        minX: 0,
        maxX: 1,
        minZ: -1,
        maxZ: 0,
    }
);

export const thumbDownGesture: Gesture<'static'> = thumbGestureBuilder(
    'down',
    {
        minY: -0.35,
        maxY: 0.25,
        minX: 0,
        maxX: 1,
        minZ: -1,
        maxZ: 0,
    },
    {
        minY: -0.35,
        maxY: 0.25,
        minX: -1,
        maxX: 0,
        minZ: -1,
        maxZ: 0,
    }
);
