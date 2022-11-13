import { Canvas, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLoader } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { useSocketContext } from '@utils/global';

function Scene({ isTeacher = false }) {
    const socket = useSocketContext();
    const obj = useLoader(OBJLoader, '/3d-model.obj');
    const ref = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (!ref.current) return;
        if (isTeacher) {
            ref.current.rotateY(0.01);
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

    return (
        <mesh scale={0.05} position={[0, 0, -2]} ref={ref}>
            <primitive object={obj} />
            <meshStandardMaterial color={'orange'} />
        </mesh>
    );
}

export default function Object3DView({ isTeacher = false }) {
    return (
        <>
            <Canvas
                style={{
                    height: '100%',
                    width: '100%',
                    background: 'rgb(34, 34, 34)',
                }}
            >
                <ambientLight />
                <Scene isTeacher={isTeacher} />
            </Canvas>
        </>
    );
}
