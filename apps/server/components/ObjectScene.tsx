import { useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useEffect, useRef } from 'react';
import { useSocketContext } from '@utils/global';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { Object3d } from './views/Object3dView';

export default function ObjectScene({
    isTeacher = false,
    objState,
    img,
}: {
    isTeacher: boolean;
    objState:
        | 'rotateLeft'
        | 'rotateRight'
        | 'zoomIn'
        | 'zoomOut'
        | 'spawn'
        | null;
    img: Object3d;
}): JSX.Element {
    const ref = useRef<THREE.Mesh>(null);
    const scene = (
        <mesh scale={img.initialScale} position={[0, 0, 0]} ref={ref}></mesh>
    );

    useEffect(() => {
        ref.current?.clear();
        const loader = new MTLLoader();
        loader.load(img.name + '/' + img.name + '.mtl', (materials) => {
            materials.preload();
            const objLoader = new OBJLoader();
            objLoader.setMaterials(materials);
            objLoader.load(img.name + '/' + img.name + '.obj', (object) => {
                ref.current?.add(object);
            });
        });
    }, [img]);

    const socket = useSocketContext();

    function zoomIn() {
        if (!ref.current) return;
        if (ref.current.scale.x < img.maxScale) {
            ref.current.scale.x += img.zoomSpeed;
            ref.current.scale.y += img.zoomSpeed;
            ref.current.scale.z += img.zoomSpeed;
        }
    }

    function zoomOut() {
        if (!ref.current) return;
        if (ref.current.scale.x > img.minScale) {
            ref.current.scale.x -= img.zoomSpeed;
            ref.current.scale.y -= img.zoomSpeed;
            ref.current.scale.z -= img.zoomSpeed;
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

    return scene;
}
