import React, { useState } from 'react'
import { Plus, Trash2, Edit2, UserPlus, AlertCircle } from 'lucide-react'

const ParticipantManager = ({ participants, setParticipants, disabled, isDark }) => {
  const [inputValue, setInputValue] = useState('')
  const [editingId, setEditingId] = useState(null)

  const addParticipant = (e) => {
    e.preventDefault()
    if (!inputValue.trim() || participants.length >= 16) return

    if (editingId !== null) {
      setParticipants(participants.map(p => p.id === editingId ? { ...p, name: inputValue.trim() } : p))
      setEditingId(null)
    } else {
      setParticipants([...participants, { id: Date.now(), name: inputValue.trim() }])
    }
    setInputValue('')
  }

  const removeParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id))
  }

  const startEdit = (p) => {
    setInputValue(p.name)
    setEditingId(p.id)
  }

  return (
    <div className={`w-full max-w-md glass p-6 rounded-3xl animate-in fade-in slide-in-from-left duration-700 ${isDark ? 'dark' : 'light'}`}>
      <div className="flex items-center gap-2 mb-6 text-xl font-bold font-heading">
        <UserPlus className="text-green-500" />
        <h2 className={isDark ? 'text-white' : 'text-slate-800'}>Participantes <span className="text-sm font-normal text-slate-400">({participants.length}/16)</span></h2>
      </div>

      <form onSubmit={addParticipant} className="flex gap-2 mb-6">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nombre del participante..."
          className={`flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all placeholder:text-slate-500 ${isDark ? 'bg-slate-900/50 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
          maxLength={20}
          disabled={disabled || (participants.length >= 16 && editingId === null)}
        />
        <button
          type="submit"
          disabled={disabled || (!inputValue.trim()) || (participants.length >= 16 && editingId === null)}
          className="premium-gradient p-3 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
        >
          {editingId !== null ? <Edit2 size={24} className="text-white" /> : <Plus size={24} className="text-white" />}
        </button>
      </form>

      {participants.length === 0 && (
        <div className={`flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-2xl ${isDark ? 'text-slate-500 border-white/5' : 'text-slate-400 border-slate-200'}`}>
          <AlertCircle size={32} className="mb-2 opacity-20" />
          <p>Agrega nombres para comenzar</p>
        </div>
      )}

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {participants.map((p) => (
          <div 
            key={p.id} 
            className={`flex items-center justify-between p-3 rounded-xl border transition-colors group ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`}
          >
            <span className={`font-medium truncate mr-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{p.name}</span>
            <div className={`flex gap-1 transition-opacity ${disabled ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
              <button 
                onClick={() => startEdit(p)}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-50 text-slate-400 hover:text-slate-600'}`}
                disabled={disabled}
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => removeParticipant(p.id)}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/20 text-slate-400 hover:text-red-400' : 'hover:bg-red-50 text-slate-400 hover:text-red-500'}`}
                disabled={disabled}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ParticipantManager
