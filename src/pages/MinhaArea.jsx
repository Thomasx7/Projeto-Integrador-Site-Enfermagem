import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { areaPorNascimento } from '../lib/areas'
import { garantirEu } from '../lib/pessoas'
import './inicio.css'

// O que cada área terá (vamos construindo nas próximas etapas)
const O_QUE_TEM = {
  crianca: ['Caderneta de vacinação', 'Dicas para os pais', 'Registro de crescimento'],
  adolescente: ['Caderneta de vacinação', 'Explicação de cada vacina', 'Mitos e verdades'],
  adulto: ['Caderneta de vacinação', 'Doenças crônicas', 'Medicamentos com alarme'],
  idoso: ['Caderneta de vacinação', 'Doenças crônicas', 'Medicamentos com alarme'],
}

export default function MinhaArea() {
  const [pessoas, setPessoas] = useState([])
  // a pessoa escolhida fica no endereço: /minha-area?pessoa=ID
  const [params, setParams] = useSearchParams()

  useEffect(() => {
    garantirEu().then(setPessoas)
  }, [])

  if (pessoas.length === 0) return <p>Carregando...</p>

  // se não vier pessoa no endereço, usa a primeira da lista
  const atual = pessoas.find((p) => p.id === params.get('pessoa')) ?? pessoas[0]
  const area = areaPorNascimento(atual.data_nascimento)

  return (
    <>
      <h1>Minha área</h1>

      <div className="seletor">
        {pessoas.map((p) => (
          <button
            key={p.id}
            className={p.id === atual.id ? 'ativo' : ''}
            onClick={() => setParams({ pessoa: p.id })}
          >
            {p.parentesco === 'eu' ? 'Eu' : p.nome.split(' ')[0]}
          </button>
        ))}
      </div>

      <section className="area-painel">
        <h2>{area.nome}</h2>
        <p>{atual.nome}</p>
        <ul>
          {O_QUE_TEM[area.chave].map((item) => (
            <li key={item}>{item} <em>(em breve)</em></li>
          ))}
        </ul>
      </section>
    </>
  )
}