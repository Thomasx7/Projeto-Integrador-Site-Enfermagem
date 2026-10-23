// Calcula a idade em anos completos a partir de "AAAA-MM-DD" (formato do campo de data)
export function calcularIdade(dataISO, hoje = new Date()) {
  const [ano, mes, dia] = String(dataISO).split('-').map(Number)
  if (!ano || !mes || !dia) return null

  let idade = hoje.getFullYear() - ano
  const mesAtual = hoje.getMonth() + 1 // getMonth() começa em 0 (janeiro)
  const aindaNaoFezAniversario = mesAtual < mes || (mesAtual === mes && hoje.getDate() < dia)
  if (aindaNaoFezAniversario) idade -= 1

  return idade
}