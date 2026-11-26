// Textos adaptados de páginas oficiais do Ministério da Saúde (links em "fonte").
// NÃO acrescente nada que a fonte não diga. Nenhum texto foi revisado pela Enfermagem.
export const DOENCAS = [
  {
    chave: 'hipertensao', nome: 'Hipertensão (pressão alta)',
    oQueE: 'Elevação sustentada dos níveis de pressão arterial. É um dos principais fatores de risco para doenças cardiovasculares e renais.',
    sintomas: ['Dor de cabeça', 'Tontura', 'Palpitações', 'Alteração na visão', 'Geralmente é silenciosa: por isso é importante medir a pressão regularmente.'],
    alerta: [],
    cuidados: [
      'Adotar um estilo de vida saudável.', 'Mudar hábitos alimentares e reduzir o sal.', 'Praticar atividade física.',
      'Abandonar o fumo e moderar o álcool.', 'Evitar alimentos gordurosos e controlar o diabetes.',
      'Na maioria dos casos não tem cura, mas pode ser controlada. O tratamento nem sempre envolve medicamentos.',
      'As Unidades Básicas de Saúde (UBS) têm profissionais para acompanhar a pressão.',
    ],
    fonte: { titulo: 'Ministério da Saúde: Hipertensão Arterial Sistêmica', url: 'https://www.gov.br/saude/pt-br/assuntos/noticias/2022/abril/hipertensao-arterial-sistemica-saude-explica-o-que-e-quais-os-riscos-e-como-prevenir-a-doenca-e-os-agravos' },
  },
  {
    chave: 'diabetes', nome: 'Diabetes',
    oQueE: 'Doença causada pela produção insuficiente ou má absorção de insulina. Taxas altas de glicose no sangue podem causar complicações no coração, nas artérias, nos olhos, nos rins e nos nervos.',
    sintomas: ['Fome e sede excessivas', 'Vontade de urinar várias vezes ao dia', 'Perda de peso, fraqueza e fadiga', 'Formigamento nos pés e mãos', 'Infecções frequentes', 'Feridas que demoram a cicatrizar', 'Visão embaçada'],
    alerta: ['Com qualquer sintoma, procure um serviço de saúde.'],
    cuidados: [
      'Tipo 1: o tratamento exige o uso diário de insulina.',
      'Tipo 2: é essencial manter acompanhamento médico.',
      'Prevenção: atividade física regular, alimentação saudável e evitar álcool, tabaco e outras drogas.',
    ],
    fonte: { titulo: 'Ministério da Saúde: Diabetes', url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/d/diabetes' },
  },
  {
    chave: 'asma', nome: 'Asma',
    oQueE: 'Uma das doenças respiratórias crônicas mais comuns: dificuldade de respirar, chiado e aperto no peito, respiração curta e rápida. Não tem cura, mas com tratamento adequado os sintomas podem melhorar e até desaparecer.',
    sintomas: ['Tosse seca', 'Chiado no peito', 'Dificuldade para respirar', 'Respiração rápida e curta', 'Desconforto no peito', 'Ansiedade'],
    alerta: ['Ao surgirem os primeiros sintomas, procure um médico.', 'Sem tratamento correto, uma crise muito intensa pode levar à morte.'],
    cuidados: [
      'Manter o ambiente limpo, evitar poeira e cheiros fortes.', 'Tomar a vacina da gripe, não fumar e se agasalhar no frio.',
      'Praticar atividade física, ter alimentação saudável, beber água e manter o peso ideal.',
      'Em dias frios ou de muita poluição, evitar atividades ao ar livre.',
      'O SUS oferece o tratamento: procure uma UBS. A base é a "bombinha" (corticoide inalatório), com remédio de alívio.',
      'Medicamentos pelo Programa Farmácia Popular, com CPF e receita médica.',
    ],
    fonte: { titulo: 'Ministério da Saúde: Asma', url: 'https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/asma' },
  },
  {
    chave: 'coracao', nome: 'Doenças do coração',
    oQueE: 'Doenças que afetam o coração e os vasos sanguíneos. São a principal causa de morte no mundo. Um exemplo é a doença arterial coronariana, ligada a dor no peito e infarto.',
    sintomas: ['Muitas vezes não há sintomas no início.'],
    alerta: [
      'Dor ou desconforto no peito, braços, ombro esquerdo, cotovelos, mandíbula ou costas podem indicar ataque cardíaco.',
      'Outros sinais: falta de ar, enjoo ou vômito, tontura ou sensação de desmaio, suor frio e palidez.',
      'Mulheres tendem a ter mais falta de ar, náuseas, vômitos e dores nas costas ou na mandíbula.',
    ],
    cuidados: [
      'Fatores de risco: tabagismo, colesterol em excesso, hipertensão, obesidade, estresse, depressão e diabetes.',
      'É importante mudar hábitos.', 'Nas UBS há acompanhamento de hipertensão e diabetes.',
      'Com diagnóstico de doença cardiovascular, a pessoa é encaminhada à atenção especializada.',
    ],
    fonte: { titulo: 'Ministério da Saúde: Doenças cardiovasculares', url: 'https://www.gov.br/saude/pt-br/assuntos/noticias/2022/setembro/doencas-cardiovasculares-principal-causa-de-morte-no-mundo-pode-ser-prevenida' },
  },
  {
    chave: 'colesterol', nome: 'Colesterol alto',
    oQueE: 'O colesterol é um tipo de gordura presente no organismo: cerca de 70% é produzido pelo fígado e 30% vem da alimentação. O excesso de LDL ("colesterol ruim") pode formar placas nas artérias e aumentar o risco de infarto e AVC.',
    sintomas: [],
    alerta: [],
    cuidados: [
      'Atividade física regular e alimentação equilibrada.', 'Reduzir alimentos ricos em gordura e preferir alimentos in natura e minimamente processados.',
      'Reduzir ou parar de fumar e evitar o excesso de álcool.',
      'Há tratamento com e sem medicamentos. Remédios para colesterol são distribuídos gratuitamente pelo Farmácia Popular.',
    ],
    fonte: { titulo: 'Ministério da Saúde: Dia do combate ao colesterol', url: 'https://www.gov.br/saude/pt-br/assuntos/noticias/2024/agosto/dia-do-combate-ao-colesterol-saude-reforca-cuidados-e-amplia-acesso-a-medicamentos' },
  },
]