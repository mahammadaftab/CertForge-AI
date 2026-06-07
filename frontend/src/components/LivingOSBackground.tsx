import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const NeuralNetwork = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const count = 180;
  
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = [];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
      vel.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015
        )
      );
    }
    return { positions: pos, velocities: vel };
  }, [count]);

  const linesGeometry = useMemo(() => new THREE.BufferGeometry(), []);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;
    
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    // Update positions
    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities[i].x;
      pos[i * 3 + 1] += velocities[i].y;
      pos[i * 3 + 2] += velocities[i].z;
      
      // Bounce off boundaries
      if (Math.abs(pos[i * 3]) > 8) velocities[i].x *= -1;
      if (Math.abs(pos[i * 3 + 1]) > 8) velocities[i].y *= -1;
      if (Math.abs(pos[i * 3 + 2]) > 8) velocities[i].z *= -1;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Build lines
    const linePositions = [];
    const lineColors = [];
    
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const distSq = dx * dx + dy * dy + dz * dz;
        
        if (distSq < 5) { // Connect if distance < sqrt(5) ~ 2.2
          linePositions.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
          
          const alpha = Math.max(0, 1.0 - Math.sqrt(distSq) / 2.2);
          // Electric Cyan lines: r=0, g=0.898, b=1.0 (#00E5FF)
          lineColors.push(0, 0.898, 1, alpha * 0.5, 0, 0.898, 1, alpha * 0.5);
        }
      }
    }
    
    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    linesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 4));
    
    // Slow global rotation
    const time = state.clock.getElapsedTime();
    const globalRotY = time * 0.05;
    pointsRef.current.rotation.y = globalRotY;
    linesRef.current.rotation.y = globalRotY;
  });

  return (
    <group rotation={[0, 0, Math.PI / 8]}>
      <Points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <PointMaterial transparent color="#00E5FF" size={0.06} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.8} />
      </Points>
      <lineSegments ref={linesRef} geometry={linesGeometry}>
        <lineBasicMaterial vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
};

const LivingOSBackground = () => {
  return (
    <div className="fixed inset-0 bg-[#0A0F1E] -z-10">
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        <NeuralNetwork />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1E]/80 via-[#0A0F1E]/40 to-[#0A0F1E] pointer-events-none" />
      <div className="absolute inset-0 living-canvas opacity-30 pointer-events-none" />
    </div>
  );
};

export default LivingOSBackground;
