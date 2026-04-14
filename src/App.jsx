import React, { useState, useRef } from 'react'
import Wheel from './components/Wheel'
import ParticipantManager from './components/ParticipantManager'
import WinnerReveal from './components/WinnerReveal'

function App() {
  const [participants, setParticipants] = useState([])
  const [winner, setWinner] = useState(null)
  const [isSpinning, setIsSpinning] = useState(false)
  
  // Secuencia trucada: posiciones (1-indexed) del participante que debe ganar en cada ronda.
  // Ej: si hay 16 participantes y la secuencia es [12, 3, 4, 16, 10, 14, 7, 9],
  // en la primera ronda gana el participante en la posición 12,
  // en la segunda ronda gana el que esté en la posición 3 de los restantes, etc.
  const sequenceRef = useRef([12, 3, 4, 16, 10, 14, 7, 9])

  const handleSpinComplete = (winnerName) => {
    setWinner(winnerName)
    setIsSpinning(false)
  }

  const advanceSequence = () => {
    sequenceRef.current = sequenceRef.current.slice(1)
  }

  const reset = () => {
    if (winner) {
      setParticipants(prev => prev.filter(p => p.name !== winner))
      advanceSequence()
    }
    setWinner(null)
    setIsSpinning(false)
  }

  return (
    <div className="min-h-screen transition-colors duration-500 bg-black text-white">
      <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col items-center">
        
        <header className="mb-12 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            <span className="text-gradient">Ruleta de Sorteo</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Sorteos rápidos, justos y visualmente increíbles.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-start">
          <section className="flex flex-col items-center space-y-8 order-2 lg:order-1">
            <ParticipantManager 
              participants={participants} 
              setParticipants={setParticipants} 
              disabled={isSpinning}
              isDark={true}
            />
          </section>

          <section className="flex flex-col items-center justify-center order-1 lg:order-2">
            <div className="relative">
              <Wheel 
                participants={participants} 
                onComplete={handleSpinComplete} 
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
                isDark={true}
                plannedSequence={sequenceRef.current}
              />
            </div>
          </section>
        </main>

        {winner && (
          <WinnerReveal winner={winner} onReset={reset} isDark={true} />
        )}

        <footer className="mt-20 text-slate-600 text-sm">
          &copy; 2026 Ruleta de Sorteo Premium. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  )
}

export default App
