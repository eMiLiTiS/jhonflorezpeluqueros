'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 300 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    // Gold color palette
    const goldColors = [
      [0.788, 0.663, 0.431], // #C9A96E
      [0.910, 0.835, 0.639], // #E8D5A3
      [0.831, 0.686, 0.188], // #D4AF30
      [0.545, 0.408, 0.188], // #8A6830
    ]

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10

      const c = goldColors[Math.floor(Math.random() * goldColors.length)]
      colors[i * 3] = c[0]
      colors[i * 3 + 1] = c[1]
      colors[i * 3 + 2] = c[2]
    }

    return [positions, colors]
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return
    const time = state.clock.elapsedTime

    mesh.current.rotation.y = time * 0.02
    mesh.current.rotation.x = Math.sin(time * 0.01) * 0.1

    // Subtle mouse parallax
    mesh.current.position.x = mouseRef.current.x * 0.3
    mesh.current.position.y = mouseRef.current.y * 0.3
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

export default function ParticleField() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Particles />
      </Canvas>
    </div>
  )
}
