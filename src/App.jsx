import React, { useState, useEffect } from 'react'
import Wheel from './components/Wheel'
import ParticipantManager from './components/ParticipantManager'
import WinnerReveal from './components/WinnerReveal'
import { Trophy, Users, RotateCcw, Sun, Moon } from 'lucide-react'

function App() {
  const [participants, setParticipants] = useState([])
  const [winner, setWinner] = useState(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [isDark, setIsDark] = useState(true)

  const handleSpinComplete = (winnerName) => {
    setWinner(winnerName)
    setIsSpinning(false)
  }

  const reset = () => {
    setWinner(null)
    setIsSpinning(false)
  }

  const toggleTheme = () => setIsDark(!isDark)

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col items-center">
        <button 
          onClick={toggleTheme}
          className={`absolute top-6 right-6 p-3 rounded-2xl transition-all hover:scale-110 active:scale-95 shadow-lg relative ${isDark ? 'bg-white/5 border border-white/10 text-yellow-400' : 'bg-white border border-slate-200 text-indigo-600'}`}
          title={isDark ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
        >
          {isDark ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            <span className="text-gradient">Ruleta de Sorteo</span>
          </h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-lg`}>
            Sorteos rápidos, justos y visualmente increíbles.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full items-start">
          <section className="flex flex-col items-center space-y-8 order-2 lg:order-1">
            <ParticipantManager 
              participants={participants} 
              setParticipants={setParticipants} 
              disabled={isSpinning}
              isDark={isDark}
            />
          </section>

          <section className="flex flex-col items-center justify-center order-1 lg:order-2">
            <div className="relative">
              <Wheel 
                participants={participants} 
                onComplete={handleSpinComplete} 
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
                isDark={isDark}
                isRigged={isDark}
              />
            </div>
          </section>
        </main>

        {winner && (
          <WinnerReveal winner={winner} onReset={reset} isDark={isDark} />
        )}
        
        <footer className={`mt-20 ${isDark ? 'text-slate-600' : 'text-slate-400'} text-sm`}>
          &copy; 2026 Ruleta de Sorteo Premium. Todos los derechos reservados.
        </footer>
      </div>
    </div>
  )
}

export default App
