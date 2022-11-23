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
    const obj = useLoader(OBJLoader, '/js.obj');
    const ref = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (!ref.current) return;
        if (isTeacher) {
            if (objState === 'rotateRight') ref.current.rotateY(0.01);
            if (objState === 'rotateLeft') ref.current.rotateY(-0.01);
            if (objState === 'zoomIn') {
                if (ref.current.scale.x < 0.05) {
                    ref.current.scale.x += 0.001;
                    ref.current.scale.y += 0.001;
                    ref.current.scale.z += 0.001;
                }
            }

            if (objState === 'zoomOut') {
                if (ref.current.scale.x > 0) {
                    ref.current.scale.set(
                        ref.current.scale.x - 0.001,
                        ref.current.scale.y - 0.001,
                        ref.current.scale.z - 0.001
                    );
                }
            }
            console.log(ref.current.scale);
            const { x, y, z } = ref.current.rotation;

            socket.emit('3DRotation', { x, y, z });
        }
    });

    useEffect(() => {
        socket.on('3DRotation', ({ x, y, z }) => {
            if (!ref.current) return;
            ref.current.rotation.set(x, y, z);
        });

        return () => {
            socket.off('3DRotation');
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
        socket.on('spawn', () => {});

        socket.on('vanish', () => {});

        socket.on('rotate_left', () => {});

        socket.on('rotate_right', () => {});

        socket.on('zoom_in', () => {});

        socket.on('zoom_out', () => {});

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
        <>
            {' '}
            {objState !== null && (
                <div className={style.main}>
                    <Canvas>
                        <ambientLight color={'#ae3033'} intensity={1} />

                        {/*<ambientLight color={'#f0db4f'} intensity={1} /> */}
                        <Scene isTeacher={isTeacher} objState={objState} />
                    </Canvas>
                </div>
            )}
            {isTeacher && objState !== null && (
                <div className={style.itemMain}>
                    <span
                        key={'rotateLeft'}
                        className={style.item}
                        onClick={() => setObjState('rotateRight')}
                    >
                        Rotate right
                    </span>
                    <span
                        key={'rotateRight'}
                        className={style.item}
                        onClick={() => setObjState('rotateLeft')}
                    >
                        Rotate left
                    </span>
                    <span
                        key={'zoomIn'}
                        className={style.item}
                        onClick={() => setObjState('zoomIn')}
                    >
                        Zoom in
                    </span>
                    <span
                        key={'zoomOut'}
                        className={style.item}
                        onClick={() => setObjState('zoomOut')}
                    >
                        Zoom out
                    </span>

                    <span
                        key={'vanish'}
                        className={style.item}
                        onClick={() => setObjState(null)}
                    >
                        Vanish
                    </span>
                </div>
            )}
            {isTeacher && objState === null && (
                <div className={style.itemMain}>
                    <span
                        key={'spawn'}
                        className={style.item}
                        onClick={() => setObjState('spawn')}
                    >
                        Spawn
                    </span>
                </div>
            )}
        </>
    );
}
