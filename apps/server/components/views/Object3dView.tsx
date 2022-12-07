import { Canvas } from '@react-three/fiber';
import { useCallback, useEffect, useState } from 'react';
import { useSocketContext } from '@utils/global';
import style from '@style/Object3d.module.scss';

import ObjectScene from 'components/ObjectScene';

export type Object3d = {
    name: string;
    minScale: number;
    maxScale: number;
    initialScale: number;
    zoomSpeed: number;
};

const cruiser: Object3d = {
    name: 'cruiser',
    minScale: 0.001,
    maxScale: 0.014,
    initialScale: 0.005,
    zoomSpeed: 0.0002,
};

const mark7: Object3d = {
    name: 'Mark 7',
    minScale: 0.1,
    maxScale: 2.5,
    initialScale: 1.5,
    zoomSpeed: 0.006,
};

const atom: Object3d = {
    name: 'atom',
    minScale: 0.001,
    maxScale: 0.013,
    initialScale: 0.005,
    zoomSpeed: 0.0002,
};

const Objects3D = [mark7, cruiser, atom];

export default function Object3DView({ isTeacher = false }) {
    const socket = useSocketContext();
    const [objState, setObjState] = useState<
        'rotateLeft' | 'rotateRight' | 'zoomIn' | 'zoomOut' | 'spawn' | null
    >(null);
    const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
    const [image, setImage] = useState<any>(Objects3D[currentObjectIndex]);

    function sendSpawnEvent() {
        socket.emit('3DState', 'spawn');
    }

    function sendVanishEvent() {
        socket.emit('3DState', 'vanish');
    }

    function sendRotateLeftEvent() {
        socket.emit('3DState', 'rotateLeft');

        setObjState('rotateLeft');
    }

    function sendRotateRightEvent() {
        socket.emit('3DState', 'rotateRight');
    }

    function sendZoomInEvent() {
        socket.emit('3DState', 'zoomIn');
    }

    function sendZoomOutEvent() {
        socket.emit('3DState', 'zoomOut');
    }

    const sendNewObjectEvent = useCallback(
        (index: number) => {
            socket.emit('object3d', index);
        },
        [socket]
    );

    const setObjectIndex = useCallback(
        (index: number) => {
            setCurrentObjectIndex(index);
            setImage(Objects3D[index]);
        },
        [setCurrentObjectIndex, setImage]
    );

    useEffect(() => {
        socket.on('spawn', () => {
            if (objState === null) {
                setObjState('spawn');
            }
        });

        socket.on('vanish', () => {
            setObjState(null);
        });

        socket.on('rotate_left', () => {
            setObjState('rotateLeft');
        });

        socket.on('rotate_right', () => {
            setObjState('rotateRight');
        });

        socket.on('zoom_in', () => {
            setObjState('zoomIn');
        });

        socket.on('zoom_out', () => {
            setObjState('zoomOut');
        });

        socket.on('3DState', (state) => {
            setObjState(state);
        });
        socket.on('object3d', (index: number) => {
            setObjectIndex(index);
        });

        return () => {
            socket.off('spawn');
            socket.off('vanish');
            socket.off('rotate_left');
            socket.off('rotate_right');
            socket.off('zoom_in');
            socket.off('zoom_out');
            socket.off('3DState');
            socket.off('object3d');
        };
    }, [
        socket,
        setObjState,
        setObjectIndex,
        setCurrentObjectIndex,
        setImage,
        objState,
    ]);

    useEffect(() => {
        socket.on('thumbs_right_gesture', () => {
            if (currentObjectIndex < Objects3D.length - 1) {
                sendNewObjectEvent(currentObjectIndex + 1);
            }
        });

        socket.on('thumbs_left_gesture', () => {
            if (currentObjectIndex > 0) {
                sendNewObjectEvent(currentObjectIndex - 1);
            }
        });

        return () => {
            socket.off('thumbs_right_gesture');
            socket.off('thumbs_left_gesture');
        };
    }, [socket, setObjectIndex, sendNewObjectEvent, currentObjectIndex]);

    if (objState === null) {
        return (
            <div className='center'>
                <div>
                    {isTeacher ? (
                        <>
                            <button className='button' onClick={sendSpawnEvent}>
                                Afficher
                            </button>
                        </>
                    ) : (
                        <>
                            <span className='loader'></span>
                            <p>En attente d&apos;un objet à afficher</p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={style.main}>
            <div className={style.canvas}>
                <Canvas>
                    <ambientLight color={/*'#ae3033'*/ 'white'} intensity={1} />

                    {/*<ambientLight color={'#f0db4f'} intensity={1} /> */}
                    <mesh position={[0, -1, 0]}>
                        <ObjectScene
                            isTeacher={isTeacher}
                            objState={objState}
                            img={image}
                        />
                    </mesh>
                </Canvas>
            </div>
            {isTeacher && (
                <div>
                    <div className={style.controls}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <button
                                className='button'
                                onClick={sendVanishEvent}
                            >
                                Masquer
                            </button>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <button
                                className='button'
                                onMouseDown={sendZoomInEvent}
                                onMouseUp={sendSpawnEvent}
                            >
                                Zoom +
                            </button>
                        </div>
                        <div>
                            <button
                                className='button'
                                onMouseDown={sendRotateLeftEvent}
                                onMouseUp={sendSpawnEvent}
                            >
                                Rotation Gauche
                            </button>
                        </div>
                        <div>
                            <button
                                className='button'
                                onMouseDown={sendRotateRightEvent}
                                onMouseUp={sendSpawnEvent}
                            >
                                Rotation Droite
                            </button>
                        </div>
                        <div
                            style={{ gridColumn: 'span 2' }}
                            onMouseDown={sendZoomOutEvent}
                            onMouseUp={sendSpawnEvent}
                        >
                            <button className='button'>Zoom -</button>
                        </div>
                    </div>

                    {currentObjectIndex > 0 && (
                        <div
                            className={style.arrow_left}
                            onClick={() => {
                                sendNewObjectEvent(currentObjectIndex - 1);
                            }}
                        ></div>
                    )}
                    {currentObjectIndex < Objects3D.length - 1 && (
                        <div
                            className={style.arrow_right}
                            onClick={() => {
                                sendNewObjectEvent(currentObjectIndex + 1);
                            }}
                        ></div>
                    )}
                </div>
            )}
        </div>
    );
}
