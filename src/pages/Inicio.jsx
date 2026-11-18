import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { areaPorNascimento } from '../lib/areas'
import { calcularIdade } from '../lib/idade'
import { garantirEu } from '../lib/pessoas'
import './inicio.css'

export default function Inicio() {
  const [pessoas, setPessoas] = useState([])
  const [carregando, setCarregando] = useState(true)

  // Ao abrir: busca as pessoas (e cria o "eu" se ainda não existir)
  useEffect(() => {
    garantirEu()
      .then(setPessoas)
      .finally(() => setCarregando(false))
  }, [])

  // O primeiro nome vem da linha "eu"
  const eu = pessoas.find((p) => p.parentesco === 'eu')
  const primeiroNome = eu?.nome.split(' ')[0]

  return (
    <>
      <h1>Olá{primeiroNome ? `, ${primeiroNome}` : ''}!</h1>
      <p>Escolha uma pessoa para ver a área dela.</p>
      {carregando && <p>Carregando...</p>}

      <ul className="pessoas-grid">
        {pessoas.map((p) => {
          const area = areaPorNascimento(p.data_nascimento)
          return (
            <li key={p.id} className="pessoa-card">
              <strong>{p.nome}</strong>
              <span>
                {p.parentesco === 'eu' ? 'Você' : p.parentesco} ·{' '}
                {calcularIdade(p.data_nascimento)} anos
              </span>
              <span className="pessoa-area">{area.nome}</span>
              <Link to={`/minha-area?pessoa=${p.id}`}>Abrir área</Link>
            </li>
          )
        })}
      </ul>

      <Link to="/dependentes">Gerenciar dependentes</Link>
    </>
  )
}