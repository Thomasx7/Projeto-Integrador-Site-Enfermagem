import { supabase } from './supabase'

const ok = ({ data, error }) => { if (error) throw error; return data }

export const listarCondicoes = (pessoaId) => supabase.from('condicoes').select('*').eq('pessoa_id', pessoaId).then(ok)
export const marcarCondicao = (c) => supabase.from('condicoes').insert(c).then(ok)
export const removerCondicao = (id) => supabase.from('condicoes').delete().eq('id', id).then(ok)

export const listarMedicamentos = (pessoaId) =>
  supabase.from('medicamentos').select('*').eq('pessoa_id', pessoaId).order('criado_em').then(ok)
// todos da conta, com o nome da pessoa (usado pelo alarme)
export const listarTodosMedicamentos = () => supabase.from('medicamentos').select('*, pessoas(nome)').then(ok)
export const adicionarMedicamento = (m) => supabase.from('medicamentos').insert(m).then(ok)
export const removerMedicamento = (id) => supabase.from('medicamentos').delete().eq('id', id).then(ok)