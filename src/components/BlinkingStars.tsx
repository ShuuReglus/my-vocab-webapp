'use client';
import { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';
// 透過PNGの丸い点画像を置いてね！

extend({ TextureLoader });

export function BlinkingStars({ count = 1000 }) {
  const meshRef = useRef<THREE.Points>(null!);

  // 星の位置
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      arr[i] = (Math.random() - 0.5) * 300;
    }
    return arr;
  }, [count]);

  // 星の透明度（アニメーション用）
  const alphas = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = Math.random();
    }
    return arr;
  }, [count]);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    return geom;
  }, [positions, alphas]);

  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load('/star-texture.png'); // public/star-texture.png に丸い星の画像置いてね
  }, []);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 1,
      map: texture,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending, // ✨キラキラ効果
      color: new THREE.Color(1, 1, 1),
    });
  }, [texture]);

  useFrame(() => {
    const attr = geometry.getAttribute('alpha');
    for (let i = 0; i < count; i++) {
      const blink = 0.5 + 0.5 * Math.sin(Date.now() * 0.001 + i);
      attr.setX(i, blink);
    }
    attr.needsUpdate = true;
  });

  return <points ref={meshRef} geometry={geometry} material={material} />;
}
