import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { areaPorNascimento } from '../lib/areas'
import { DOENCAS } from '../lib/doencas'
import { garantirEu } from '../lib/pessoas'
import {
  adicionarMedicamento, listarCondicoes, listarMedicamentos, marcarCondicao, removerCondicao, removerMedicamento,
} from '../lib/remedios'
import './inicio.css'
import './caderneta.css'
import './cronicas.css'

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function Lista({ titulo, itens }) {
  if (itens.length === 0) return null
  return (
    <>
      <h3>{titulo}</h3>
      <ul className="cr-lista">{itens.map((t) => <li key={t}>{t}</li>)}</ul>
    </>
  )
}

export default function Cronicas() {
  const [pessoas, setPessoas] = useState([])
  const [condicoes, setCondicoes] = useState([])
  const [remedios, setRemedios] = useState([])
  const [erro, setErro] = useState('')
  const [params, setParams] = useSearchParams()
  // formulário do remédio
  const [nome, setNome] = useState('')
  const [dose, setDose] = useState('')
  const [horarios, setHorarios] = useState([''])
  const [dias, setDias] = useState([])
  const [outra, setOutra] = useState('')

  useEffect(() => {
    garantirEu().then(setPessoas).catch(() => setErro('Não foi possível carregar as pessoas.'))
  }, [])

  const atual = pessoas.find((p) => p.id === params.get('pessoa')) ?? pessoas[0]
  const atualId = atual?.id

  const recarregar = useCallback(async () => {
    if (!atualId) return
    try {
      setCondicoes(await listarCondicoes(atualId))
      setRemedios(await listarMedicamentos(atualId))
    } catch {
      setErro('Não foi possível carregar os dados.')
    }
  }, [atualId])

  useEffect(() => {
    recarregar()
  }, [recarregar])

  const avisarAlarme = () => window.dispatchEvent(new Event('remedios-mudaram'))

  async function alternarDoenca(chave) {
    setErro('')
    try {
      const existente = condicoes.find((c) => c.doenca === chave)
      if (existente) await removerCondicao(existente.id)
      else await marcarCondicao({ pessoa_id: atual.id, doenca: chave })
      await recarregar()
    } catch {
      setErro('Não foi possível salvar. Tente de novo.')
    }
  }

  async function salvarOutra(e) {
    e.preventDefault()
    if (!outra.trim()) return
    try {
      await marcarCondicao({ pessoa_id: atual.id, doenca: 'outra', outra_descricao: outra.trim() })
      setOutra('')
      await recarregar()
    } catch {
      setErro('Só é possível cadastrar uma "outra doença" por pessoa.')
    }
  }

  async function salvarRemedio(e) {
    e.preventDefault()
    setErro('')
    const hs = [...new Set(horarios.filter(Boolean))].sort()
    if (hs.length === 0) return setErro('Informe pelo menos um horário.')
    try {
      await adicionarMedicamento({
        pessoa_id: atual.id, nome: nome.trim(), dose: dose.trim() || null, horarios: hs, dias_semana: dias,
      })
      setNome(''); setDose(''); setHorarios(['']); setDias([])
      await recarregar()
      avisarAlarme()
    } catch {
      setErro('Não foi possível salvar o remédio.')
    }
  }

  async function apagarRemedio(r) {
    if (!window.confirm(`Remover ${r.nome}?`)) return
    try {
      await removerMedicamento(r.id)
      await recarregar()
      avisarAlarme()
    } catch {
      setErro('Não foi possível remover.')
    }
  }

  if (!atual) return erro ? <p className="cad-erro">{erro}</p> : <p>Carregando...</p>

  const area = areaPorNascimento(atual.data_nascimento)
  const paraAdulto = area.chave === 'adulto' || area.chave === 'idoso'
  const escolhidas = DOENCAS.filter((d) => condicoes.some((c) => c.doenca === d.chave))
  const outraCond = condicoes.find((c) => c.doenca === 'outra')

  return (
    <>
      <h1>Doenças e remédios</h1>
      <div className="seletor">
        {pessoas.map((p) => (
          <button key={p.id} className={p.id === atual.id ? 'ativo' : ''} onClick={() => setParams({ pessoa: p.id })}>
            {p.parentesco === 'eu' ? 'Eu' : p.nome.split(' ')[0]}
          </button>
        ))}
      </div>
      {erro && <p className="cad-erro" role="alert">{erro}</p>}

      {!paraAdulto ? (
        <p>Esta área é para adultos e idosos. Escolha outra pessoa acima.</p>
      ) : (
        <>
          <p className="cad-aviso">
            Conteúdo informativo, adaptado de páginas do Ministério da Saúde e ainda sem revisão da Enfermagem.
            Não substitui a consulta: confirme sempre com a unidade de saúde.
          </p>

          <h2>{atual.nome} tem alguma doença crônica?</h2>
          <div className="seletor">
            {DOENCAS.map((d) => (
              <button key={d.chave} className={condicoes.some((c) => c.doenca === d.chave) ? 'ativo' : ''}
                onClick={() => alternarDoenca(d.chave)}>
                {d.nome}
              </button>
            ))}
          </div>

          {outraCond ? (
            <p>
              Outra doença: <strong>{outraCond.outra_descricao}</strong>{' '}
              <button onClick={() => removerCondicao(outraCond.id).then(recarregar)}>Remover</button>
              <br /><em>Não há texto informativo para esta doença. Converse com a equipe de saúde.</em>
            </p>
          ) : (
            <form className="cad-form" onSubmit={salvarOutra}>
              <label>Outra doença
                <input value={outra} onChange={(e) => setOutra(e.target.value)} />
              </label>
              <button type="submit">Adicionar</button>
            </form>
          )}

          {escolhidas.map((d) => (
            <section key={d.chave} className="cad-card">
              <h2>{d.nome}</h2>
              <p>{d.oQueE}</p>
              <Lista titulo="Sintomas" itens={d.sintomas} />
              <Lista titulo="Sinais de alerta" itens={d.alerta} />
              <Lista titulo="Cuidados" itens={d.cuidados} />
              <p className="cad-obs">
                Fonte: <a href={d.fonte.url} target="_blank" rel="noreferrer">{d.fonte.titulo}</a>
              </p>
            </section>
          ))}

          <h2>Remédios</h2>
          <p className="cad-obs">O alarme toca e aparece na tela enquanto o site estiver aberto.</p>
          <form className="cr-form" onSubmit={salvarRemedio}>
            <label>Nome do remédio
              <input value={nome} onChange={(e) => setNome(e.target.value)} required />
            </label>
            <label>Dose (ex.: 50 mg)
              <input value={dose} onChange={(e) => setDose(e.target.value)} />
            </label>
            <fieldset>
              <legend>Horários</legend>
              {horarios.map((h, i) => (
                <input key={i} type="time" value={h}
                  onChange={(e) => setHorarios(horarios.map((x, j) => (j === i ? e.target.value : x)))} />
              ))}
              <button type="button" onClick={() => setHorarios([...horarios, ''])}>+ horário</button>
            </fieldset>
            <fieldset>
              <legend>Dias da semana (vazio = todos os dias)</legend>
              {DIAS.map((nomeDia, n) => (
                <label key={n} className="cr-dia">
                  <input type="checkbox" checked={dias.includes(n)}
                    onChange={() => setDias(dias.includes(n) ? dias.filter((x) => x !== n) : [...dias, n])} />
                  {nomeDia}
                </label>
              ))}
            </fieldset>
            <button type="submit">Salvar remédio</button>
          </form>

          <ul className="cr-remedios">
            {remedios.map((r) => (
              <li key={r.id} className="cad-card">
                <strong>{r.nome}</strong> {r.dose}
                <div className="cad-obs">
                  {r.horarios.join(' · ')}
                  {r.dias_semana?.length > 0 && ` · ${r.dias_semana.map((n) => DIAS[n]).join(', ')}`}
                </div>
                <button onClick={() => apagarRemedio(r)}>Remover</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}