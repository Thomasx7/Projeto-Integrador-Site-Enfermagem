import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { calcularIdade } from '../lib/idade'

const IDADE_MINIMA = 18 // quem cria a conta é um adulto; os filhos entram como dependentes

// Confere os dados antes de enviar. Devolve a mensagem do problema, ou '' se estiver tudo certo
function validar({ nome, nascimento, senha, aceitou }) {
  if (nome.trim().split(/\s+/).length < 2) return 'Informe nome e sobrenome.'
  if (!nascimento) return 'Informe a data de nascimento.'

  const idade = calcularIdade(nascimento)
  if (idade === null || idade < 0 || idade > 120) return 'Confira a data de nascimento.'
  if (idade < IDADE_MINIMA) {
    return 'Para criar uma conta é preciso ter 18 anos ou mais. Depois de entrar, você cadastra seus filhos dentro da sua conta.'
  }

  if (senha.length < 8) return 'A senha precisa ter pelo menos 8 caracteres.'
  if (!aceitou) return 'Para continuar, aceite o uso dos seus dados de saúde.'
  return ''
}

export default function CriarConta() {
  const { cadastrar } = useAuth()
  const navegar = useNavigate()

  const [nome, setNome] = useState('')
  const [nascimento, setNascimento] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [aceitou, setAceitou] = useState(false)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [aguardandoEmail, setAguardandoEmail] = useState(false)

  // Hoje no formato AAAA-MM-DD, para o campo de data não aceitar o futuro
  const hoje = new Date().toLocaleDateString('en-CA')

  async function aoEnviar(evento) {
    evento.preventDefault()

    const problema = validar({ nome, nascimento, senha, aceitou })
    if (problema) {
      setErro(problema)
      return
    }

    setErro('')
    setEnviando(true)
    try {
      const { precisaConfirmar } = await cadastrar({
        nome: nome.trim(),
        nascimento,
        email: email.trim(),
        senha,
      })
      if (precisaConfirmar) setAguardandoEmail(true) // Supabase espera a confirmação do e-mail
      else navegar('/', { replace: true }) // conta criada e já logada
    } catch (e) {
      setErro(e.message)
    } finally {
      setEnviando(false)
    }
  }

  // Tela mostrada quando a conta exige confirmar o e-mail
  if (aguardandoEmail) {
    return (
      <main>
        <h1>Confirme seu e-mail</h1>
        <p>Enviamos um link para {email.trim()}. Abra o e-mail e clique no link para ativar a conta.</p>
        <Link to="/entrar">Já confirmei, quero entrar</Link>
      </main>
    )
  }

  return (
    <main>
      <h1>Criar conta</h1>
      <form onSubmit={aoEnviar}>
        <label htmlFor="nome">Nome completo</label>
        <input id="nome" required autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} />

        <label htmlFor="nascimento">Data de nascimento</label>
        <input
          id="nascimento"
          type="date"
          min="1900-01-01"
          max={hoje}
          required
          autoComplete="bday"
          value={nascimento}
          onChange={(e) => setNascimento(e.target.value)}
        />

        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="senha">Senha (pelo menos 8 caracteres)</label>
        <input
          id="senha"
          type="password"
          required
          autoComplete="new-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <label className="consentimento">
          <input type="checkbox" checked={aceitou} onChange={(e) => setAceitou(e.target.checked)} />
          Aceito que meus dados de saúde sejam usados para acompanhar vacinas. A foto da caderneta é enviada a um
          serviço de leitura de imagem e apagada depois da leitura.
        </label>

        {erro && <p role="alert">{erro}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? 'Criando conta…' : 'Criar conta'}
        </button>
      </form>
      <p>
        Já tem conta? <Link to="/entrar">Entrar</Link>
      </p>
    </main>
  )
}