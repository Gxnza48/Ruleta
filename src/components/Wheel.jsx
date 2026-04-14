import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { RotateCw } from 'lucide-react'

const COLORS = [
  '#6366f1', '#ec4899', '#06b6d4', '#f59e0b', 
  '#10b981', '#a855f7', '#f43f5e', '#3b82f6'
]

const Wheel = ({ participants, onComplete, isSpinning, setIsSpinning, isDark, plannedSequence }) => {
  const canvasRef = useRef(null)
  const wheelRef = useRef(null)
  const rotationRef = useRef(0)
  
  // Draw the wheel segments
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const size = 500
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 10

    ctx.clearRect(0, 0, size, size)

    if (participants.length === 0) {
      // Draw empty wheel
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 5
      ctx.stroke()
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.fill()
      return
    }

    const angleStep = (Math.PI * 2) / participants.length

    participants.forEach((p, i) => {
      const startAngle = i * angleStep
      const endAngle = (i + 1) * angleStep

      // Draw segment
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      
      ctx.fillStyle = COLORS[i % COLORS.length]
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw text
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(startAngle + angleStep / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = 'white'
      ctx.font = 'bold 20px Outfit'
      ctx.fillText(p.name, radius - 40, 10)
      ctx.restore()
    })

    // Center deco
    ctx.beginPath()
    ctx.arc(centerX, centerY, 40, 0, Math.PI * 2)
    ctx.fillStyle = '#1e293b'
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 4
    ctx.stroke()
  }, [participants])

  const spin = () => {
    if (participants.length < 2 || isSpinning) return

    setIsSpinning(true)
    
    // GSAP Performance optimization for 144fps+
    gsap.ticker.fps(240)
    
    const count = participants.length
    
    // Determine winner based on sequence (position-based, 1-indexed)
    let winnerIndex = -1
    if (plannedSequence && plannedSequence.length > 0) {
      // The sequence value represents the 1-indexed position of the winner
      // in the CURRENT participant list (after previous winners have been removed)
      const targetPosition = plannedSequence[0]
      
      // Convert 1-indexed position to 0-indexed array index
      const targetIndex = targetPosition - 1
      
      // Validate the index is within bounds of current participants
      if (targetIndex >= 0 && targetIndex < count) {
        winnerIndex = targetIndex
      }
    }

    // Fallback to random if sequence is empty or position out of bounds
    if (winnerIndex === -1) {
      winnerIndex = Math.floor(Math.random() * count)
    }

    const angleStep = 360 / count
    
    // Calculate precise target rotation to land at the top (270 degrees)
    // We add a random offset so the pointer doesn't stop exactly at the center every single time
    const randomOffset = (Math.random() - 0.5) * (angleStep * 0.8) // Avoid landing on exact segment boundaries
    const segmentCenter = (winnerIndex * angleStep) + (angleStep / 2) + randomOffset
    
    // We want: (rotationRef.current + totalRotation) % 360 == (270 - segmentCenter)
    // Calculate safely with negative bounds handling
    const currentRotation = ((rotationRef.current % 360) + 360) % 360
    const desiredFinalAngle = (270 - segmentCenter + 360) % 360
    
    let rotationToAdd = (desiredFinalAngle - currentRotation + 360) % 360
    
    // Add minimum full turns for impact
    rotationToAdd += 360 * 10 
    
    rotationRef.current += rotationToAdd

    gsap.to(wheelRef.current, {
      rotation: rotationRef.current,
      duration: 5,
      ease: 'power4.out',
      onComplete: () => {
        onComplete(participants[winnerIndex].name)
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative group">
        {/* Glow effect */}
        <div className={`absolute -inset-4 rounded-full blur-3xl transition-opacity duration-1000 ${isSpinning ? 'opacity-100 animate-pulse' : 'opacity-0'} ${isDark ? 'bg-green-500/10' : 'bg-green-500/30'}`}></div>
        
        {/* Pointer (Arrow) */}
        <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-10 drop-shadow-xl">
          <svg width="40" height="50" viewBox="0 0 40 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 50L0 0H40L20 50Z" fill={isDark ? "#22c55e" : "#16a34a"} />
            <path d="M20 40L6 4H34L20 40Z" fill="white" fillOpacity="0.9" />
          </svg>
        </div>

        <div ref={wheelRef} className={`relative z-0 shadow-2xl rounded-full overflow-hidden border-8 transition-colors duration-500 ${isDark ? 'border-white/5' : 'border-white'}`}>
          <canvas 
            ref={canvasRef} 
            width={500} 
            height={500} 
            className="w-[320px] h-[320px] md:w-[500px] md:h-[500px]"
          />
        </div>
      </div>

      <button
        onClick={spin}
        disabled={isSpinning || participants.length < 2}
        className="group relative flex items-center gap-3 px-12 py-5 rounded-2xl premium-gradient text-white font-bold text-xl shadow-lg hover:shadow-indigo-500/25 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100 overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]"></div>
        <RotateCw className={isSpinning ? 'animate-spin' : ''} />
        <span>¡GIRAR!</span>
      </button>
      
      {participants.length < 2 && !isSpinning && (
        <p className="text-slate-500 animate-pulse">Agrega al menos 2 participantes para girar</p>
      )}
    </div>
  )
}

export default Wheel
