import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = () => {
  const ref = useRef<any>();
  
  const points = useMemo(() => {
    const p = new Float32Array(4000 * 3);
    for (let i = 0; i < 4000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = time * 0.03;
      ref.current.rotation.x = time * 0.015;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={points} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#0078d4"
          size={0.04}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.6}
        />
      </Points>
    </group>
  );
};

const LivingOSBackground = () => {
  return (
    <div className="fixed inset-0 bg-[#02040a] -z-10">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ParticleField />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#02040a]/40 to-[#02040a] pointer-events-none" />
      <div className="absolute inset-0 living-canvas opacity-30 pointer-events-none" />
    </div>
  );
};

export default LivingOSBackground;
