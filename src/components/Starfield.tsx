import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';

export default function Starfield() {
  // ✅ public フォルダ内の画像はパスで指定する
  // Starfield.tsx の texture 読み込みを以下のように分離する
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load('/star-texture.png'); // パスは public 直下で読み込み
  }, []);

  const starsRef = useRef<THREE.Points>(null);

  const starGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 1500;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 300;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const starMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 2,
        map: texture,
        transparent: true,
        alphaTest: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    [texture]
  );

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001;
    }
  });

  return <points ref={starsRef} geometry={starGeometry} material={starMaterial} />;
}
