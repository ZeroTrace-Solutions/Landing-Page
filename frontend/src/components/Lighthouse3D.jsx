import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const LighthouseModel = () => {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      {/* Foundation */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.4, 8]} />
        <meshStandardMaterial color="#ffffff" wireframe={true} transparent opacity={0.1} />
      </mesh>

      {/* Base Pedestal */}
      <mesh position={[0, -0.8, 0]}>
        <cylinderGeometry args={[2, 2.3, 1.2, 8]} />
        <meshStandardMaterial color="#ffffff" wireframe={true} transparent opacity={0.2} />
      </mesh>

      {/* Intermediate Ring 1 */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[2.1, 2.1, 0.1, 8]} />
        <meshStandardMaterial color="#ffffff" wireframe={true} transparent opacity={0.3} />
      </mesh>

      {/* Main Tower (Lower) */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[1.2, 1.8, 3.5, 8]} />
        <meshStandardMaterial color="#ffffff" wireframe={true} transparent opacity={0.2} />
      </mesh>

      {/* Gallery Deck */}
      <mesh position={[0, 3.3, 0]}>
        <cylinderGeometry args={[1.5, 1.3, 0.2, 8]} />
        <meshStandardMaterial color="#ffffff" wireframe={true} transparent opacity={0.4} />
      </mesh>

      {/* Upper Tower / Lantern House */}
      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 1.2, 8]} />
        <meshStandardMaterial color="#ffffff" wireframe={true} transparent opacity={0.3} />
      </mesh>

      {/* Roof / Dome */}
      <mesh position={[0, 4.8, 0]}>
        <sphereGeometry args={[0.8, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ffffff" wireframe={true} transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export const Lighthouse3D = () => {
  return (
    <div className="w-full h-full aspect-square relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 2, 18], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, 5, -10]} intensity={1} color="#ffffff" />

        <Float
          speed={1.5}
          rotationIntensity={0.8}
          floatIntensity={1.2}
          floatingRange={[-0.5, 0.5]}
        >
          <LighthouseModel />
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};

export default Lighthouse3D;
