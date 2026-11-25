import { vacinasDaArea } from './vacinas'

// "A tomar" = até este prazo (em meses) depois da idade recomendada; depois disso, "atrasada"
const JANELA_MESES = 1

function idadeEmMeses(nasc, hoje) {
  const [a, m, d] = nasc.split('-').map(Number)
  let meses = (hoje.getFullYear() - a) * 12 + (hoje.getMonth() + 1 - m)
  if (hoje.getDate() < d) meses -= 1
  return meses
}

function somarMeses(iso, n) {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1 + n, d)
}

// Vacinas de esquema fixo: decide cada dose (tomada, a tomar, atrasada ou futura)
function itensDeDoses(v, meses, tomadas) {
  const anos = Math.floor(meses / 12)
  const lista = v.quantas ? v.doses.slice(0, v.quantas(anos)) : v.doses
  return lista.map((dose) => {
    const feita = tomadas.find((t) => t.dose === dose.id)
    const base = { id: dose.id, rotulo: dose.rotulo }
    if (feita) return { ...base, situacao: 'tomada', data: feita.data_aplicacao, registroId: feita.id }
    if (dose.meses === null) return { ...base, situacao: 'a_tomar' } // "conforme histórico"
    if (meses < dose.meses) return { ...base, situacao: 'futura' }
    if (meses < dose.meses + JANELA_MESES) return { ...base, situacao: 'a_tomar' }
    return { ...base, situacao: 'atrasada' }
  })
}

// Vacinas que repetem: olha a data da última dose
function itensPeriodica(v, tomadas, hoje) {
  const datas = tomadas.map((t) => t.data_aplicacao).filter(Boolean).sort()
  const ultima = datas[datas.length - 1]
  if (!ultima) return [{ id: 'nova', rotulo: 'Nenhuma dose registrada', situacao: 'a_tomar' }]
  const proxima = somarMeses(ultima, v.cadaMeses)
  return [{ id: 'periodica', rotulo: 'Última dose', data: ultima, proxima, situacao: proxima < hoje ? 'atrasada' : 'tomada' }]
}

// Devolve, para cada vacina da pessoa: { vacina, itens, resumo }
export function situacaoDaPessoa(nascimento, areaChave, doses, hoje = new Date()) {
  const meses = idadeEmMeses(nascimento, hoje)
  return vacinasDaArea(areaChave)
    .filter((v) => (v.desdeMeses == null || meses >= v.desdeMeses) && (v.ateMeses == null || meses <= v.ateMeses))
    .map((v) => {
      const tomadas = doses.filter((t) => t.vacina === v.chave)
      const itens = v.tipo === 'periodica' ? itensPeriodica(v, tomadas, hoje) : itensDeDoses(v, meses, tomadas)
      const resumo = itens.some((i) => i.situacao === 'atrasada') ? 'atrasada'
        : itens.some((i) => i.situacao === 'a_tomar') ? 'a_tomar' : 'em_dia'
      return { vacina: v, itens, resumo }
    })
}