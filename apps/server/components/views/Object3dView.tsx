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

    if (objState === null) {
        return (
            <div className='center'>
                <div>
                    {isTeacher ? (
                        <>
                            <button
                                className='button'
                                onClick={() => setStateSpawn()}
                            >
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
                            img='Mark 7'
                        />
                    </mesh>
                </Canvas>
            </div>
            {isTeacher && (
                <div className={style.controls}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <button
                            className='button'
                            onClick={() => setStateNull()}
                        >
                            Masquer
                        </button>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <button
                            className='button'
                            onMouseDown={() => {
                                setStateZoomIn();
                            }}
                            onMouseUp={() => {
                                setStateSpawn();
                            }}
                        >
                            Zoom +
                        </button>
                    </div>
                    <div>
                        <button
                            className='button'
                            onMouseDown={() => {
                                setStateRotateLeft();
                            }}
                            onMouseUp={() => {
                                setStateSpawn();
                            }}
                        >
                            Rotation Gauche
                        </button>
                    </div>
                    <div>
                        <button
                            className='button'
                            onMouseDown={() => {
                                setStateRotateRight();
                            }}
                            onMouseUp={() => {
                                setStateSpawn();
                            }}
                        >
                            Rotation Droite
                        </button>
                    </div>
                    <div
                        style={{ gridColumn: 'span 2' }}
                        onMouseDown={() => {
                            setStateZoomOut();
                        }}
                        onMouseUp={() => {
                            setStateSpawn();
                        }}
                    >
                        <button className='button'>Zoom -</button>
                    </div>
                </div>
            )}
        </div>
    );
}
