import { Canvas, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLoader } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useSocketContext } from '@utils/global';
import { MeshStandardMaterial, Mesh } from 'three';
import style from '@style/Object3d.module.scss';

function Scene({
    isTeacher = false,
    objState,
}: {
    isTeacher: boolean;
    objState:
        | 'rotateLeft'
        | 'rotateRight'
        | 'zoomIn'
        | 'zoomOut'
        | 'spawn'
        | null;
}) {
    const socket = useSocketContext();
    const obj = useLoader(OBJLoader, '/3d-model.obj');
    const ref = useRef<THREE.Mesh>(null);

    function zoomIn() {
        if (!ref.current) return;
        if (ref.current.scale.x < 0.045) {
            ref.current.scale.x += 0.001;
            ref.current.scale.y += 0.001;
            ref.current.scale.z += 0.001;
        }
    }

    function zoomOut() {
        if (!ref.current) return;
        if (ref.current.scale.x > 0.005) {
            ref.current.scale.x -= 0.001;
            ref.current.scale.y -= 0.001;
            ref.current.scale.z -= 0.001;
        }
    }

    function rotateLeft() {
        if (!ref.current) return;
        ref.current.rotateY(-0.02);
    }

    function rotateRight() {
        if (!ref.current) return;
        ref.current.rotateY(0.02);
    }

    useFrame(() => {
        if (!ref.current) return;
        if (isTeacher) {
            console.log(objState);

            if (objState === 'rotateLeft' || objState === 'rotateRight') {
                objState === 'rotateLeft' ? rotateLeft() : rotateRight();
                const { x, y, z } = ref.current.rotation;
                socket.emit('3DRotation', { x, y, z });
            } else if (objState === 'zoomIn' || objState === 'zoomOut') {
                objState === 'zoomIn' ? zoomIn() : zoomOut();
                const { x: sx, y: sy, z: sz } = ref.current.scale;
                socket.emit('3DZoom', { x: sx, y: sy, z: sz });
            }
        }
    });

    useEffect(() => {
        socket.on('3DRotation', ({ x, y, z }) => {
            if (!ref.current) return;
            ref.current.rotation.set(x, y, z);
        });
        socket.on('3DZoom', ({ x, y, z }) => {
            if (!ref.current) return;
            ref.current.scale.set(x, y, z);
        });

        return () => {
            socket.off('3DRotation');
            socket.off('3DZoom');
        };
    }, [socket]);

    obj.children.forEach((child) => {
        console.log(child);
        if (child instanceof Mesh) {
            child.material = new MeshStandardMaterial({
                color: '#ae3033',
                //color: '#f0db4f',
            });
        }
    });
    return (
        <mesh scale={0.04} position={[0, 0, 0]} ref={ref}>
            <primitive object={obj}></primitive>
        </mesh>
    );
}

export default function Object3DView({ isTeacher = false }) {
    const socket = useSocketContext();
    useEffect(() => {
        socket.on('spawn', () => {
            setObjState('spawn');
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

        return () => {
            socket.off('spawn');
            socket.off('vanish');
            socket.off('rotate_left');
            socket.off('rotate_right');
            socket.off('zoom_in');
            socket.off('zoom_out');
        };
    }, [socket]);

    const [objState, setObjState] = useState<
        'rotateLeft' | 'rotateRight' | 'zoomIn' | 'zoomOut' | 'spawn' | null
    >(null);

    return (
        <div className={style.main}>
            {' '}
            {objState !== null && (
                <div className={style.object}>
                    <Canvas>
                        <ambientLight color={'#ae3033'} intensity={1} />

                        {/*<ambientLight color={'#f0db4f'} intensity={1} /> */}
                        <Scene isTeacher={isTeacher} objState={objState} />
                    </Canvas>
                </div>
            )}
            {isTeacher && objState !== null && (
                <ul className={style.itemMain}>
                    <li
                        key={'rotateLeft'}
                        className={style.item}
                        onMouseDown={() => {
                            setObjState('rotateRight');
                        }}
                        onMouseUp={() => {
                            setObjState('spawn');
                        }}
                    >
                        Rotate right
                    </li>
                    <li
                        key={'rotateRight'}
                        className={style.item}
                        onMouseDown={() => {
                            setObjState('rotateLeft');
                        }}
                        onMouseUp={() => {
                            setObjState('spawn');
                        }}
                    >
                        Rotate left
                    </li>
                    <li
                        key={'zoomIn'}
                        className={style.item}
                        onMouseDown={() => {
                            setObjState('zoomIn');
                        }}
                        onMouseUp={() => {
                            setObjState('spawn');
                        }}
                    >
                        Zoom in
                    </li>
                    <li
                        key={'zoomOut'}
                        className={style.item}
                        onMouseDown={() => {
                            setObjState('zoomOut');
                        }}
                        onMouseUp={() => {
                            setObjState('spawn');
                        }}
                    >
                        Zoom out
                    </li>

                    <li
                        key={'vanish'}
                        className={style.item}
                        onClick={() => setObjState(null)}
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
                        onClick={() => setObjState('spawn')}
                    >
                        Spawn
                    </li>
                </ul>
            )}
        </div>
    );
}
