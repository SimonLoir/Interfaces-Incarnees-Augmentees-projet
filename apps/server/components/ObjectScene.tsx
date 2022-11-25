import { Canvas, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { useLoader } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useSocketContext } from '@utils/global';
import {
    MeshStandardMaterial,
    Mesh,
    TextureLoader,
    MeshBasicMaterial,
    Scene,
} from 'three';
import style from '@style/Object3d.module.scss';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

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
    img: string;
}): JSX.Element {
    const ref = useRef<THREE.Mesh>(null);
    const scene = <mesh scale={2} position={[0, 0, 0]} ref={ref}></mesh>;
    const loader = new MTLLoader();
    let obj = null;
    loader.load(img + '/' + img + '.mtl', (materials) => {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        obj = objLoader.load(img + '/' + img + '.obj', (object) => {
            ref.current?.add(object);
        });
    });

    const socket = useSocketContext();

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

    console.log(scene);
    return scene;
}
