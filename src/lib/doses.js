import { supabase } from './supabase'

export async function listarDoses(pessoaId) {
  const { data, error } = await supabase.from('doses').select('*').eq('pessoa_id', pessoaId)
  if (error) throw error
  return data
}

export async function marcarDose({ pessoa_id, vacina, dose, data_aplicacao }) {
  const { error } = await supabase
    .from('doses')
    .insert({ pessoa_id, vacina, dose, data_aplicacao: data_aplicacao || null })
  if (error) throw error
}

export async function desmarcarDose(id) {
  const { error } = await supabase.from('doses').delete().eq('id', id)
  if (error) throw error
}