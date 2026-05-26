'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 280 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    const goldPalette = [
      [0.788, 0.663, 0.431],
      [0.910, 0.835, 0.639],
      [0.831, 0.686, 0.216],
      [0.545, 0.408, 0.188],
      [0.980, 0.950, 0.850],
    ]

    for (let i = 0; i < count; i++) {
      // Spread across a wider field, with some clustering near center
      const r = Math.random()
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 6 + r * 8

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12

      const c = goldPalette[Math.floor(Math.random() * goldPalette.length)]
      colors[i * 3] = c[0]
      colors[i * 3 + 1] = c[1]
      colors[i * 3 + 2] = c[2]

      sizes[i] = 0.03 + Math.random() * 0.07
    }

    return [positions, colors, sizes]
  }, [count])

  useFrame(state => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime

    mesh.current.rotation.y = t * 0.018
    mesh.current.rotation.x = Math.sin(t * 0.009) * 0.12

    // Smooth mouse parallax
    const targetX = mouseRef.current.x * 0.35
    const targetY = mouseRef.current.y * 0.35
    mesh.current.position.x += (targetX - mesh.current.position.x) * 0.04
    mesh.current.position.y += (targetY - mesh.current.position.y) * 0.04
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function ParticleField() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 58 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'default' }}
        dpr={[1, 1.5]}
      >
        <Particles />
      </Canvas>
    </div>
  )
}
