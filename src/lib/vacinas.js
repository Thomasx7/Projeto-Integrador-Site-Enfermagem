// ÚNICO lugar com as regras de vacinação (Calendário Nacional de Vacinação 2026, Ministério da Saúde).
//
// Campos de cada vacina:
//   chave       -> nome interno (é o que vai para o banco, não mude depois)
//   areas       -> em quais áreas aparece (crianca, adolescente, adulto, idoso)
//   tipo        -> 'doses' (esquema fixo) ou 'periodica' (repete a cada "cadaMeses")
//   doses       -> lista de doses; "meses" = idade recomendada (null = "conforme histórico")
//   desdeMeses  -> (opcional) só vale a partir desta idade
//   ateMeses    -> (opcional) deixa de valer depois desta idade (limite para quem atrasou)
//   quantas(i)  -> (opcional) nº de doses exigidas conforme a idade em anos
//   duvida      -> (opcional) aviso mostrado na tela quando a regra precisa de confirmação
//   conferida   -> false = ainda não revisada pela Enfermagem (a tela avisa)

const d = (id, rotulo, meses = null) => ({ id, rotulo, meses }) // monta uma dose
const anos = (n) => n * 12 // converte anos em meses

export const VACINAS = [
  // ================= CRIANÇA (0 a 9 anos) =================
  {
    chave: 'hepatite_b_nascer', nome: 'Hepatite B (ao nascer)', areas: ['crianca'],
    tipo: 'doses', doses: [d('1', '1 dose', 0)], conferida: false,
  },
  {
    chave: 'bcg', nome: 'BCG', areas: ['crianca'],
    tipo: 'doses', doses: [d('u', 'Dose única', 0)],
    obs: 'Protege contra as formas graves da tuberculose.', conferida: false,
  },
  {
    chave: 'penta', nome: 'Penta (DTP + Hib + hepatite B)', areas: ['crianca'],
    tipo: 'doses', doses: [d('1', '1ª dose', 2), d('2', '2ª dose', 4), d('3', '3ª dose', 6)],
    conferida: false,
  },
  {
    chave: 'vip', nome: 'Poliomielite inativada (VIP)', areas: ['crianca'],
    tipo: 'doses',
    doses: [
      d('1', '1ª dose', 2), d('2', '2ª dose', 4), d('3', '3ª dose', 6),
      d('r1', '1º reforço', 15), d('r2', '2º reforço', anos(4)),
    ],
    conferida: false,
  },
  {
    chave: 'rotavirus', nome: 'Rotavírus humano', areas: ['crianca'],
    tipo: 'doses', doses: [d('1', '1ª dose', 2), d('2', '2ª dose', 4)], ateMeses: 23,
    obs: '1ª dose entre 1 mês e 15 dias e 11 meses e 29 dias; 2ª dose entre 3 meses e 15 dias e 23 meses e 29 dias, com 60 dias de intervalo. Passou o prazo, perde-se a oportunidade.',
    conferida: false,
  },
  {
    chave: 'pneumo_crianca', nome: 'Pneumocócica conjugada', areas: ['crianca'],
    tipo: 'doses',
    doses: [d('1', '1ª dose (20-valente)', 2), d('2', '2ª dose (10-valente)', 4), d('r', 'Reforço (20-valente)', 12)],
    duvida: 'O calendário lista a 20-valente aos 2 meses e a 10-valente aos 4 meses. Confirme com a unidade de saúde.',
    conferida: false,
  },
  {
    chave: 'meningo_c', nome: 'Meningocócica C', areas: ['crianca'],
    tipo: 'doses', doses: [d('1', '1ª dose', 3), d('2', '2ª dose', 5)], conferida: false,
  },
  {
    chave: 'influenza_crianca', nome: 'Influenza trivalente (gripe)', areas: ['crianca'],
    tipo: 'periodica', cadaMeses: 12, desdeMeses: 6, ateMeses: 71,
    obs: 'Todo ano, dos 6 meses até 5 anos, 11 meses e 29 dias. Na primeira vez, são 2 doses com 30 dias de intervalo.',
    conferida: false,
  },
  {
    chave: 'covid_crianca', nome: 'Covid-19', areas: ['crianca'],
    tipo: 'doses', doses: [d('1', '1ª dose', 6), d('2', '2ª dose', 7), d('3', '3ª dose', 9)], ateMeses: 59,
    obs: 'Em atraso, vacinar até 4 anos, 11 meses e 29 dias (4 semanas entre a 1ª e a 2ª dose; 8 semanas entre a 2ª e a 3ª).',
    conferida: false,
  },
  {
    chave: 'febre_amarela_reforco', nome: 'Febre amarela: reforço', areas: ['crianca'],
    tipo: 'doses', doses: [d('r', '1 dose de reforço', anos(4))], conferida: false,
  },
  {
    chave: 'meningo_acwy_crianca', nome: 'Meningocócica ACWY (12 meses)', areas: ['crianca'],
    tipo: 'doses', doses: [d('1', '1 dose', 12)], conferida: false,
  },
  {
    chave: 'dtp', nome: 'DTP (reforços)', areas: ['crianca'],
    tipo: 'doses', doses: [d('r1', '1º reforço', 15), d('r2', '2º reforço', anos(4))], conferida: false,
  },
  {
    chave: 'varicela_crianca', nome: 'Varicela (catapora)', areas: ['crianca'],
    tipo: 'doses', doses: [d('1', '1ª dose', 15), d('2', '2ª dose', anos(4))], conferida: false,
  },
  {
    chave: 'hepatite_a', nome: 'Hepatite A', areas: ['crianca'],
    tipo: 'doses', doses: [d('1', '1 dose', 15)], conferida: false,
  },

  // ======== CRIANÇA, ADOLESCENTE E ADULTO (mesmo esquema) ========
  {
    chave: 'febre_amarela', nome: 'Febre amarela', areas: ['crianca', 'adolescente', 'adulto'],
    tipo: 'doses', doses: [d('1', '1 dose', 9)],
    obs: 'Manter atualizada, principalmente para quem vive ou vai viajar para área com circulação viral. Vacinar pelo menos 10 dias antes da viagem.',
    conferida: false,
  },
  {
    chave: 'triplice_viral', nome: 'Tríplice viral (sarampo, caxumba, rubéola)', areas: ['crianca', 'adolescente', 'adulto'],
    tipo: 'doses', doses: [d('1', '1ª dose', 12), d('2', '2ª dose', 15)],
    quantas: (idade) => (idade <= 29 ? 2 : 1), // até 29 anos: 2 doses; de 30 a 59: 1 dose
    obs: 'Até 29 anos: 2 doses. De 30 a 59 anos: 1 dose.', conferida: false,
  },
  {
    chave: 'hpv', nome: 'HPV', areas: ['crianca', 'adolescente'],
    tipo: 'doses', doses: [d('1', '1 dose', anos(9))], ateMeses: 179,
    obs: 'Em caso de atraso, vacinar até 14 anos, 11 meses e 29 dias.', conferida: false,
  },

  // ================= ADOLESCENTE E JOVEM (10 a 24 anos) =================
  {
    chave: 'dengue', nome: 'Dengue (DNG4)', areas: ['adolescente'],
    tipo: 'doses', doses: [d('1', '1ª dose', anos(10)), d('2', '2ª dose', anos(10))], ateMeses: 179,
    obs: 'Em atraso, vacinar até 14 anos, 11 meses e 29 dias. Use vacinas de um só laboratório no esquema.',
    conferida: false,
  },
  {
    chave: 'meningo_acwy_adolescente', nome: 'Meningocócica ACWY (11 anos)', areas: ['adolescente'],
    tipo: 'doses', doses: [d('1', '1 dose', anos(11))], ateMeses: 179,
    obs: 'Em atraso, vacinar até 14 anos, 11 meses e 29 dias.', conferida: false,
  },
  {
    chave: 'dt_adolescente', nome: 'dT (reforços)', areas: ['adolescente'],
    tipo: 'doses', doses: [d('3', '3ª dose (reforço)', anos(14)), d('4', '4ª dose (reforço)', anos(24))],
    conferida: false,
  },

  // ======== ADOLESCENTE, ADULTO E IDOSO ========
  {
    chave: 'hepatite_b', nome: 'Hepatite B', areas: ['adolescente', 'adulto', 'idoso'],
    tipo: 'doses', doses: [d('1', '1ª dose'), d('2', '2ª dose'), d('3', '3ª dose')],
    obs: 'Conforme o histórico vacinal.', conferida: false,
  },

  // ================= ADULTO (25 a 59) E IDOSO (60+) =================
  {
    chave: 'dt', nome: 'dT (difteria e tétano)', areas: ['adulto', 'idoso'],
    tipo: 'doses', doses: [d('1', '1ª dose'), d('2', '2ª dose'), d('3', '3ª dose')],
    obs: 'Esquema de 3 doses, mais reforços periódicos.', conferida: false,
  },
  {
    chave: 'dt_reforco', nome: 'dT: reforço', areas: ['adulto', 'idoso'],
    tipo: 'periodica', cadaMeses: 120,
    obs: 'Reforço a cada 10 anos (aos 34 anos para o adulto com esquema em dia). Em caso de risco de difteria ou tétano, a cada 5 anos.',
    conferida: false,
  },

  // ================= IDOSO (60+) =================
  {
    chave: 'influenza', nome: 'Influenza trivalente (gripe)', areas: ['idoso'],
    tipo: 'periodica', cadaMeses: 12, obs: '1 dose por ano, a cada temporada.', conferida: false,
  },
  {
    chave: 'covid', nome: 'Covid-19', areas: ['idoso'],
    tipo: 'periodica', cadaMeses: 6, obs: '1 dose a cada 6 meses.', conferida: false,
  },
  {
    chave: 'pneumo_idoso', nome: 'Pneumocócica 20-valente', areas: ['idoso'],
    tipo: 'doses', doses: [d('1', '1 dose')], desdeMeses: anos(85),
    obs: 'Para todos os idosos a partir de 85 anos.', conferida: false,
  },
]

// Casos especiais: aparecem só como informação, NUNCA como "em atraso"
const CRIE = 'Condições clínicas especiais: procure o CRIE ou uma sala de vacina da Rede de Imunobiológicos Especiais (RIE).'

export const INFORMATIVAS = {
  crianca: [
    'Febre amarela aos 6 a 8 meses: só em casos excepcionais, após avaliação do serviço de saúde.',
    'Pneumocócica 20-valente aos 5 anos: somente para povos indígenas sem histórico de vacina pneumocócica conjugada.',
    CRIE,
  ],
  adolescente: [
    'HPV: quem tem 15 anos ou mais e não foi vacinado deve ver a estratégia do seu estado.',
    'Varicela: somente para trabalhadores da saúde e povos indígenas.',
    'Pneumocócica 20-valente: somente para povos indígenas.',
    'Profissionais de saúde que atendem recém-nascidos: recomenda-se a dTpa no lugar da dT.',
    CRIE,
  ],
  adulto: [
    'Tríplice viral: trabalhador de saúde, em qualquer idade, toma 2 doses.',
    'Varicela (2 doses): somente para trabalhadores da saúde e povos indígenas.',
    'Pneumocócica 20-valente: somente para povos indígenas.',
    'Profissionais de saúde que atendem recém-nascidos: recomenda-se a dTpa.',
    CRIE,
  ],
  idoso: [
    'Pneumocócica 20-valente: de 60 a 84 anos, só para quem é acamado ou institucionalizado e para povos indígenas.',
    'Febre amarela: só em casos excepcionais, para não vacinados que vivem ou vão viajar para área com circulação viral, após avaliação.',
    'Tríplice viral: somente para trabalhador de saúde.',
    'Varicela: somente para trabalhadores da saúde e povos indígenas.',
    CRIE,
  ],
}

// Vacinas que valem para uma área
export function vacinasDaArea(chaveArea) {
  return VACINAS.filter((v) => v.areas.includes(chaveArea))
}