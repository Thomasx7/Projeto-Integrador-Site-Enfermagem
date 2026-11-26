import { useEffect, useRef, useState } from 'react'
import { listarTodosMedicamentos } from '../lib/remedios'
import '../pages/cronicas.css'

// Apito curto (se o navegador permitir som)
function tocar() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const o = ctx.createOscillator()
    o.frequency.value = 880
    o.connect(ctx.destination)
    o.start()
    setTimeout(() => { o.stop(); ctx.close() }, 700)
  } catch { /* sem som: o aviso na tela continua */ }
}

export default function AlarmeRemedios() {
  const [remedios, setRemedios] = useState([])
  const [avisos, setAvisos] = useState([])
  const jaAvisou = useRef(new Set()) // evita avisar duas vezes o mesmo horário

  // Carrega os remédios ao abrir, a cada 5 min e quando a tela de remédios avisar que mudou
  useEffect(() => {
    let vivo = true
    const buscar = () => listarTodosMedicamentos().then((l) => vivo && setRemedios(l)).catch(() => {})
    buscar()
    const t = setInterval(buscar, 5 * 60 * 1000)
    window.addEventListener('remedios-mudaram', buscar)
    return () => { vivo = false; clearInterval(t); window.removeEventListener('remedios-mudaram', buscar) }
  }, [])

  // A cada 15 segundos, vê se algum horário chegou
  useEffect(() => {
    const verificar = () => {
      const agora = new Date()
      const hhmm = agora.toTimeString().slice(0, 5)
      remedios.forEach((r) => {
        const hoje = !r.dias_semana || r.dias_semana.length === 0 || r.dias_semana.includes(agora.getDay())
        if (!hoje || !r.horarios.includes(hhmm)) return
        const id = `${r.id}-${agora.toDateString()}-${hhmm}`
        if (jaAvisou.current.has(id)) return
        jaAvisou.current.add(id)
        tocar()
        setAvisos((a) => [...a, { id, texto: `${r.pessoas?.nome ?? ''}: ${r.nome} ${r.dose ?? ''} (${hhmm})` }])
      })
    }
    verificar()
    const t = setInterval(verificar, 15000)
    return () => clearInterval(t)
  }, [remedios])

  if (avisos.length === 0) return null
  return (
    <div className="alarme" role="alert">
      {avisos.map((a) => (
        <div key={a.id} className="alarme-item">
          <span><strong>Hora do remédio:</strong> {a.texto}</span>
          <button onClick={() => setAvisos((l) => l.filter((x) => x.id !== a.id))}>Ok</button>
        </div>
      ))}
    </div>
  )
}