// src/@types/react-three-fiber.d.ts
import * as THREE from 'three';
import { ReactThreeFiber } from '@react-three/fiber';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      // メッシュ関連
      mesh: ReactThreeFiber.Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
      sphereGeometry: ReactThreeFiber.Object3DNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
      meshStandardMaterial: ReactThreeFiber.MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;

      // ライト関連
      ambientLight: ReactThreeFiber.Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
      directionalLight: ReactThreeFiber.Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
    }
  }
}
