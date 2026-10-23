import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function Entrar() {
  const { entrar } = useAuth()

  // cada useState guarda uma informação da tela
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function aoEnviar(evento) {
    evento.preventDefault() // impede o navegador de recarregar a página
    setErro('')
    setEnviando(true)
    try {
      await entrar(email.trim(), senha)
      // deu certo: o AuthProvider percebe e a RotaVisitante leva para o início
    } catch {
      setErro('E-mail ou senha incorretos.')
    } finally {
      setEnviando(false) // sempre destrava o botão, com erro ou sem
    }
  }

  return (
    <main>
      <h1>Entrar</h1>
      <form onSubmit={aoEnviar}>
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // atualiza a memória a cada tecla
        />

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          required
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {erro && <p role="alert">{erro}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
      <p>
        Não tem conta? <Link to="/criar-conta">Criar conta</Link>
      </p>
    </main>
  )
}