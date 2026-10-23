import { useContext } from 'react'
import { AuthContexto } from './contexto'

export function useAuth() {
  const valor = useContext(AuthContexto)
  if (!valor) throw new Error('useAuth precisa estar dentro do AuthProvider')
  return valor
}