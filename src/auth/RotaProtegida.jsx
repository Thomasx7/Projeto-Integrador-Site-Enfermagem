import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './useAuth'

// Guarda das telas internas: só passa quem está logado
export default function RotaProtegida() {
  const { usuario, carregando } = useAuth()

  if (carregando) return <p>Carregando…</p> // ainda perguntando ao Supabase
  if (!usuario) return <Navigate to="/entrar" replace /> // sem login: vai para o login
  return <Outlet /> // logado: mostra a tela de dentro
}