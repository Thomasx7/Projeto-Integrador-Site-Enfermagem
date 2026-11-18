import { supabase } from './supabase' // se o seu é "export default", use: import supabase from './supabase'

// Lista as pessoas da conta (o RLS já filtra pelo dono)
export async function listarPessoas() {
  const { data, error } = await supabase
    .from('pessoas')
    .select('*')
    .order('criado_em')
  if (error) throw error
  return data
}

// Cria uma pessoa; o responsavel_id é preenchido sozinho pelo banco
export async function adicionarPessoa({ nome, data_nascimento, parentesco }) {
  const { data, error } = await supabase
    .from('pessoas')
    .insert({ nome, data_nascimento, parentesco })
    .select()
    .single() // devolve a linha criada
  if (error) throw error
  return data
}

export async function removerPessoa(id) {
  const { error } = await supabase.from('pessoas').delete().eq('id', id)
  if (error) throw error
}