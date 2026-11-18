import { calcularIdade } from './idade'

// ÚNICO lugar com as faixas de idade (Ministério da Saúde).
// "ate" é a idade máxima da faixa (inclusive).
export const AREAS = [
  { chave: 'crianca',     nome: 'Criança',             ate: 9 },
  { chave: 'adolescente', nome: 'Adolescente e jovem', ate: 24 },
  { chave: 'adulto',      nome: 'Adulto',              ate: 59 },
  { chave: 'idoso',       nome: 'Idoso',               ate: Infinity },
]

// Recebe "AAAA-MM-DD" e devolve o objeto da área da pessoa
export function areaPorNascimento(dataNascimento) {
  const idade = calcularIdade(dataNascimento)
  // find devolve a primeira faixa cuja idade máxima ainda cobre a pessoa
  return AREAS.find((area) => idade <= area.ate)
}