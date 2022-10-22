import { Canvas, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLoader } from '@react-three/fiber';
import { useRef } from 'react';

function Scene() {
    const obj = useLoader(OBJLoader, '/3d-model.obj');
    const ref = useRef<THREE.Mesh>(null);

    useFrame(() => {
        ref.current?.rotateY(0.01);
    });

    return (
        <mesh scale={0.05} position={[0, 0, -2]} ref={ref}>
            <primitive object={obj} />
            <meshStandardMaterial color={'orange'} />
        </mesh>
    );
}

export default function App3DPage() {
    return (
        <>
            <Canvas
                style={{
                    height: '100vh',
                    width: '100vw',
                    background: 'rgb(34, 34, 34)',
                }}
            >
                <ambientLight />
                <Scene />
            </Canvas>
        </>
    );
}
