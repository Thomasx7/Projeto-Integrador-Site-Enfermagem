import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { areaPorNascimento } from '../lib/areas'
import { desmarcarDose, listarDoses, marcarDose } from '../lib/doses'
import { garantirEu } from '../lib/pessoas'
import { situacaoDaPessoa } from '../lib/situacao'
import { INFORMATIVAS } from '../lib/vacinas'
import './inicio.css'
import './caderneta.css'

const ROTULO = { tomada: 'Tomada', a_tomar: 'A tomar', atrasada: 'Em atraso', futura: 'Futura' }
const RESUMO = { em_dia: 'Em dia', a_tomar: 'A tomar', atrasada: 'Em atraso' }
const dataBR = (x) => (typeof x === 'string' ? new Date(x + 'T00:00:00') : x).toLocaleDateString('pt-BR')

// Texto da etiqueta de cada item
function etiqueta(i) {
  if (i.proxima) return i.situacao === 'atrasada' ? `Venceu em ${dataBR(i.proxima)}` : `Em dia até ${dataBR(i.proxima)}`
  if (i.situacao === 'tomada' && i.data) return `Tomada em ${dataBR(i.data)}`
  return ROTULO[i.situacao]
}

export default function Caderneta() {
  const [pessoas, setPessoas] = useState([])
  const [doses, setDoses] = useState([])
  const [erro, setErro] = useState('')
  const [params, setParams] = useSearchParams()

  useEffect(() => {
    garantirEu().then(setPessoas).catch(() => setErro('Não foi possível carregar as pessoas.'))
  }, [])

  const atual = pessoas.find((p) => p.id === params.get('pessoa')) ?? pessoas[0]
  const atualId = atual?.id

  // Busca as doses da pessoa escolhida
  const recarregar = useCallback(async () => {
    if (!atualId) return
    try {
      setDoses(await listarDoses(atualId))
    } catch {
      setErro('Não foi possível carregar a caderneta.')
    }
  }, [atualId])

  useEffect(() => {
    recarregar()
  }, [recarregar])

  // Caixinha: marca ou desmarca uma dose
  async function alternar(vacina, item) {
    setErro('')
    try {
      if (item.registroId) await desmarcarDose(item.registroId)
      else await marcarDose({ pessoa_id: atual.id, vacina, dose: item.id })
      await recarregar()
    } catch {
      setErro('Não foi possível salvar. Tente de novo.')
    }
  }

  // Vacinas que repetem: registra a data da dose
  async function registrarData(e, vacina) {
    e.preventDefault()
    const dia = e.target.elements.dia.value
    if (!dia) return
    e.target.reset()
    try {
      await marcarDose({ pessoa_id: atual.id, vacina, dose: dia, data_aplicacao: dia })
      await recarregar()
    } catch {
      setErro('Não foi possível salvar. Tente de novo.')
    }
  }

  if (!atual) return erro ? <p className="cad-erro">{erro}</p> : <p>Carregando...</p>

  const area = areaPorNascimento(atual.data_nascimento)
  const lista = situacaoDaPessoa(atual.data_nascimento, area.chave, doses)
  const atrasadas = lista.filter((x) => x.resumo === 'atrasada').length
  const aTomar = lista.filter((x) => x.resumo === 'a_tomar').length
  const hoje = new Date().toISOString().slice(0, 10)

  return (
    <>
      <h1>Caderneta de Vacinação</h1>

      <div className="seletor">
        {pessoas.map((p) => (
          <button key={p.id} className={p.id === atual.id ? 'ativo' : ''} onClick={() => setParams({ pessoa: p.id })}>
            {p.parentesco === 'eu' ? 'Eu' : p.nome.split(' ')[0]}
          </button>
        ))}
      </div>

      <p><strong>{atual.nome}</strong> · {area.nome}</p>
      <p className="cad-resumo">
        <span className="cad-numero atrasada">{atrasadas}</span> em atraso ·{' '}
        <span className="cad-numero a_tomar">{aTomar}</span> a tomar
      </p>
      <p className="cad-aviso">As regras ainda estão em revisão pela Enfermagem. Confirme sempre com a unidade de saúde.</p>
      {erro && <p className="cad-erro" role="alert">{erro}</p>}

      {lista.map(({ vacina: v, itens, resumo }) => (
        <section key={v.chave} className={`cad-card ${resumo}`}>
          <h2>{v.nome} <span className="cad-tag">{RESUMO[resumo]}</span></h2>
          {v.obs && <p className="cad-obs">{v.obs}</p>}
          {v.duvida && <p className="cad-duvida">{v.duvida}</p>}
          <ul>
            {itens.map((i) => (
              <li key={i.id} className={`cad-item ${i.situacao}`}>
                {v.tipo === 'doses' ? (
                  <label>
                    <input type="checkbox" checked={i.situacao === 'tomada'} onChange={() => alternar(v.chave, i)} />{' '}
                    {i.rotulo}
                  </label>
                ) : (
                  <span>{i.rotulo}</span>
                )}
                <span className="cad-tag">{etiqueta(i)}</span>
              </li>
            ))}
          </ul>
          {v.tipo === 'periodica' && (
            <form className="cad-form" onSubmit={(e) => registrarData(e, v.chave)}>
              <label>
                Data da dose
                <input type="date" name="dia" max={hoje} />
              </label>
              <button type="submit">Registrar</button>
            </form>
          )}
        </section>
      ))}

      <h2>Informações importantes</h2>
      <ul className="cad-info">
        {INFORMATIVAS[area.chave].map((t) => <li key={t}>{t}</li>)}
      </ul>
    </>
  )
}