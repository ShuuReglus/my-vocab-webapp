// global.d.ts
//import { BufferGeometry, Points, PointsMaterial, TextureLoader, AdditiveBlending } from 'three';

import { ThreeElements } from '@react-three/fiber';

declare module '@react-three/fiber' {
  namespace JSX {
    interface IntrinsicElements {
      primitive: ThreeElements['primitive'];
    }
  }
}
