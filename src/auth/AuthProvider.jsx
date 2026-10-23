import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContexto } from './contexto'

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session)
      setCarregando(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSessao(novaSessao)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  async function entrar(email, senha) {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
    if (error) throw error
  }

    async function cadastrar({ nome, nascimento, email, senha }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          nome,
          data_nascimento: nascimento,
          consentimento_em: new Date().toISOString(), // quando a pessoa aceitou
        },
      },
    })
    if (error) throw new Error('Não foi possível criar a conta. Confira os dados e tente de novo.')

    // Com a confirmação de e-mail ligada, o Supabase não dá erro para e-mail repetido
    // (para não revelar quem tem conta), mas devolve "identities" vazio
    if (data.user && data.user.identities?.length === 0) {
      throw new Error('Já existe uma conta com esse e-mail. Use a opção Entrar.')
    }

    return { precisaConfirmar: !data.session } // sem sessão = falta confirmar o e-mail
  }

  async function sair() {
    await supabase.auth.signOut()
  }

  const valor = { sessao, usuario: sessao?.user ?? null, carregando, entrar, cadastrar, sair }
  return <AuthContexto.Provider value={valor}>{children}</AuthContexto.Provider>
}