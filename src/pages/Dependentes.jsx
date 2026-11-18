import { useEffect, useState } from 'react'
import { areaPorNascimento } from '../lib/areas'
import { adicionarPessoa, garantirEu, removerPessoa } from '../lib/pessoas'
import './dependentes.css'

export default function Dependentes() {
  const [pessoas, setPessoas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  // estado do formulário
  const [nome, setNome] = useState('')
  const [nascimento, setNascimento] = useState('')
  const [parentesco, setParentesco] = useState('filho(a)')

  // Roda uma vez ao abrir a tela: busca as pessoas no banco
  useEffect(() => {
    garantirEu()
      .then(setPessoas)
      .catch(() => setErro('Não foi possível carregar as pessoas.'))
      .finally(() => setCarregando(false))
  }, [])

  async function aoEnviar(e) {
    e.preventDefault() // impede a página de recarregar
    setErro('')
    try {
      const nova = await adicionarPessoa({
        nome: nome.trim(),
        data_nascimento: nascimento,
        parentesco,
      })
      setPessoas([...pessoas, nova]) // acrescenta na lista sem recarregar
      setNome('')
      setNascimento('')
    } catch {
      setErro('Não foi possível salvar. Tente de novo.')
    }
  }

  async function aoRemover(pessoa) {
    if (!window.confirm(`Remover ${pessoa.nome}?`)) return
    try {
      await removerPessoa(pessoa.id)
      setPessoas(pessoas.filter((p) => p.id !== pessoa.id))
    } catch {
      setErro('Não foi possível remover.')
    }
  }

  const hoje = new Date().toISOString().slice(0, 10) // limite do campo de data

  return (
    <>
      <h1>Dependentes</h1>

      <form className="dep-form" onSubmit={aoEnviar}>
        <label>
          Nome
          <input value={nome} onChange={(e) => setNome(e.target.value)} required />
        </label>
        <label>
          Data de nascimento
          <input
            type="date"
            max={hoje}
            value={nascimento}
            onChange={(e) => setNascimento(e.target.value)}
            required
          />
        </label>
        <label>
          Parentesco
          <select value={parentesco} onChange={(e) => setParentesco(e.target.value)}>
            <option>filho(a)</option>
            <option>pai/mãe</option>
            <option>cônjuge</option>
            <option>outro</option>
          </select>
        </label>
        <button type="submit">Adicionar</button>
      </form>

      {erro && <p className="dep-erro" role="alert">{erro}</p>}
      {carregando && <p>Carregando...</p>}
      {!carregando && pessoas.length === 0 && <p>Nenhuma pessoa cadastrada ainda.</p>}

      <ul className="dep-lista">
        {pessoas.map((p) => (
          <li key={p.id} className="dep-card">
            <div>
              <strong>{p.nome}</strong>
              <span>{p.parentesco} · {areaPorNascimento(p.data_nascimento).nome}</span>
            </div>
            {p.parentesco !== 'eu' && (
              <button type="button" onClick={() => aoRemover(p)}>Remover</button>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}