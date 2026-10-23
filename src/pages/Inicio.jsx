import { useAuth } from '../auth/useAuth'

// Tela provisória de quem está logado
export default function Inicio() {
  const { usuario, sair } = useAuth()
  // o nome foi guardado no cadastro, dentro de user_metadata
  const primeiroNome = (usuario?.user_metadata?.nome ?? '').split(' ')[0]

  return (
    <main>
      <h1>Olá{primeiroNome ? `, ${primeiroNome}` : ''}.</h1>
      <p>Sua conta está pronta.</p>
      <button type="button" onClick={sair}>Sair</button>
    </main>
  )
}