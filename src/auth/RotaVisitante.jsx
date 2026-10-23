import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './useAuth'

// O contrário: login e cadastro são só para quem NÃO está logado
export default function RotaVisitante() {
  const { usuario, carregando } = useAuth()

  if (carregando) return <p>Carregando…</p>
  if (usuario) return <Navigate to="/" replace /> // já logado: vai para o início
  return <Outlet />
}