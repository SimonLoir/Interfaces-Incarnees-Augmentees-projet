import { Canvas } from '@react-three/fiber';
import { useCallback, useEffect, useState } from 'react';
import { useSocketContext } from '@utils/global';
import style from '@style/Object3d.module.scss';

import ObjectScene from 'components/ObjectScene';

export default function Object3DView({ isTeacher = false }) {
    const socket = useSocketContext();
    const [objState, setObjState] = useState<
        'rotateLeft' | 'rotateRight' | 'zoomIn' | 'zoomOut' | 'spawn' | null
    >(null);

    const setStateSpawn = useCallback(() => {
        setObjState('spawn');
        socket.emit('3DState', 'spawn');
    }, [socket]);

    const setStateRotateLeft = useCallback(() => {
        setObjState('rotateLeft');
        socket.emit('3DState', 'rotateLeft');
    }, [socket]);

    const setStateRotateRight = useCallback(() => {
        setObjState('rotateRight');
        socket.emit('3DState', 'rotateRight');
    }, [socket]);

    const setStateZoomIn = useCallback(() => {
        setObjState('zoomIn');
        socket.emit('3DState', 'zoomIn');
    }, [socket]);

    const setStateZoomOut = useCallback(() => {
        setObjState('zoomOut');
        socket.emit('3DState', 'zoomOut');
    }, [socket]);

    const setStateNull = useCallback(() => {
        setObjState(null);
        socket.emit('3DState', null);
    }, [socket]);

    useEffect(() => {
        socket.on('spawn', () => {
            setStateSpawn();
        });

        socket.on('vanish', () => {
            setStateNull();
        });

        socket.on('rotate_left', () => {
            setStateRotateLeft();
        });

        socket.on('rotate_right', () => {
            setStateRotateRight();
        });

        socket.on('zoom_in', () => {
            setStateZoomIn();
        });

        socket.on('zoom_out', () => {
            setStateZoomOut();
        });

        return () => {
            socket.off('spawn');
            socket.off('vanish');
            socket.off('rotate_left');
            socket.off('rotate_right');
            socket.off('zoom_in');
            socket.off('zoom_out');
        };
    }, [
        socket,
        setStateSpawn,
        setStateNull,
        setStateRotateLeft,
        setStateRotateRight,
        setStateZoomIn,
        setStateZoomOut,
    ]);

    useEffect(() => {
        socket.on('3DState', (state) => {
            setObjState(state);
        });

        return () => {
            socket.off('3DState');
        };
    }, [socket]);

    return (
        <div className={style.main}>
            {' '}
            {objState !== null && (
                <div className={style.object}>
                    <Canvas>
                        <ambientLight
                            color={/*'#ae3033'*/ 'white'}
                            intensity={1}
                        />

                        {/*<ambientLight color={'#f0db4f'} intensity={1} /> */}
                        <mesh position={[0, -1, 0]}>
                            <ObjectScene
                                isTeacher={isTeacher}
                                objState={objState}
                                img='Mark 7'
                            />
                        </mesh>
                    </Canvas>
                </div>
            )}
            {isTeacher && objState !== null && (
                <ul className={style.itemMain}>
                    <li
                        key={'rotateLeft'}
                        className={style.item}
                        onMouseDown={() => {
                            setStateRotateLeft();
                        }}
                        onMouseUp={() => {
                            setStateSpawn();
                        }}
                    >
                        Rotate right
                    </li>
                    <li
                        key={'rotateRight'}
                        className={style.item}
                        onMouseDown={() => {
                            setStateRotateRight();
                        }}
                        onMouseUp={() => {
                            setStateSpawn();
                        }}
                    >
                        Rotate left
                    </li>
                    <li
                        key={'zoomIn'}
                        className={style.item}
                        onMouseDown={() => {
                            setStateZoomIn();
                        }}
                        onMouseUp={() => {
                            setStateSpawn();
                        }}
                    >
                        Zoom in
                    </li>
                    <li
                        key={'zoomOut'}
                        className={style.item}
                        onMouseDown={() => {
                            setStateZoomOut();
                        }}
                        onMouseUp={() => {
                            setStateSpawn();
                        }}
                    >
                        Zoom out
                    </li>

                    <li
                        key={'vanish'}
                        className={style.item}
                        onClick={() => {
                            setStateNull();
                        }}
                    >
                        Vanish
                    </li>
                </ul>
            )}
            {isTeacher && objState === null && (
                <ul className={style.itemMain}>
                    <li
                        key={'spawn'}
                        className={style.item}
                        onClick={() => setStateSpawn()}
                    >
                        Spawn
                    </li>
                </ul>
            )}
        </div>
    );
}
