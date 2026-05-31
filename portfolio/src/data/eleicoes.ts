// ─── Types ────────────────────────────────────────────────────────────────────

export interface BL { en: string; pt: string }
export type LikelihoodLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'HIGH–MEDIUM' | 'LOW–MEDIUM'
export type ScandalType = 'CONFIRMED' | 'ALLEGED'
export type PoliticalLeaning = 'left' | 'center' | 'right'
export type CompetenceLevel = 'high' | 'medium' | 'low' | 'na'

export interface Source {
  name: string
  leaning: PoliticalLeaning
}

export interface Proposal {
  area: BL
  position: BL
  likelihood: LikelihoodLevel
  justification: BL
}

export interface Scandal {
  type: ScandalType
  name: BL
  year: string
  summary: BL
  sources: Source[]
  outcome?: BL
}

export interface TimelineEvent {
  year: string
  event: BL
}

export interface Video {
  youtubeId: string
  title: BL
  outlet: string
  description: BL
}

export interface MediaScandal {
  headline: BL
  date: string
  source: Source
  summary: BL
  tag: BL
}

export interface Connection {
  name: string
  role: BL
  controversial?: boolean
  status?: ScandalType
}

export interface MandateIndicator {
  label: BL
  value: BL
}

export interface Mandate {
  label: BL
  period: BL
  achievements: BL[]
  failures: BL[]
  indicators: MandateIndicator[]
  contextNote?: BL
  noMandate?: true
}

export interface Candidate {
  id: 'lula' | 'flavio' | 'renan'
  fullName: string
  shortName: string
  party: string
  partyFull: BL
  candidateColor: string
  currentOffice: BL
  age: number
  born: BL
  candidacyNote?: BL
  timeline: TimelineEvent[]
  mandates: Mandate[]
  proposals: Proposal[]
  scandals: {
    confirmed: Scandal[]
    alleged: Scandal[]
    annulmentNote?: BL
    noneNote?: BL
  }
  connections: {
    allies: Connection[]
    controversial: Connection[]
    media: { favorable: string[]; critical: string[] }
  }
  mediaScandals: MediaScandal[]
  videos: Video[]
}

export interface MandateRow {
  indicator: BL
  lula1: BL
  lula3: BL
  bolsonaro: BL
  renan: BL
  isContext?: boolean
}

export interface IdeologyRow {
  axis: BL
  axisLeft: BL
  axisRight: BL
  lula: { description: BL; score: number }
  flavio: { description: BL; score: number }
  renan: { description: BL; score: number }
}

export interface CompetenceRow {
  dimension: BL
  lula: { assessment: BL; level: CompetenceLevel }
  flavio: { assessment: BL; level: CompetenceLevel }
  renan: { assessment: BL; level: CompetenceLevel }
}

// ─── Polling Snapshot ─────────────────────────────────────────────────────────

export const polling = {
  atlasIntel: {
    label: 'AtlasIntel / Bloomberg',
    date: { en: 'May 19, 2026', pt: '19 de maio de 2026' } as BL,
    method: {
      en: 'Online random digital recruitment (RDR), 5,032 adults, May 13–18, ±1 pp, 95% CI. TSE: BR-06939/2026.',
      pt: 'Recrutamento digital aleatório online (RDR), 5.032 adultos, 13–18 de maio, ±1 pp, IC 95%. TSE: BR-06939/2026.',
    } as BL,
    firstRound: { lula: 47, flavio: 34.3, renan: 6.9 },
  },
  quaest: {
    label: 'Genial / Quaest',
    date: { en: 'May 13, 2026', pt: '13 de maio de 2026' } as BL,
    method: {
      en: 'In-home face-to-face polling.',
      pt: 'Pesquisa presencial domiciliar.',
    } as BL,
    firstRound: { lula: 39, flavio: 33, renan: 2 },
    secondRound: { lula: 42, flavio: 41 },
  },
  datafolha: {
    label: 'Datafolha',
    date: { en: 'May 12–13, 2026', pt: '12–13 de maio de 2026' } as BL,
    method: {
      en: 'In-home face-to-face polling.',
      pt: 'Pesquisa presencial domiciliar.',
    } as BL,
    secondRound: { lula: 45, flavio: 45 },
  },
  caveat: {
    en: 'Pollsters agree on the ranking; they disagree on the margin. AtlasIntel (online, non-probabilistic) tends to show larger leads than in-home face-to-face methods (Datafolha, Quaest). All figures are first-round voting intention unless otherwise noted.',
    pt: 'Os institutos concordam na ordem; divergem na margem. AtlasIntel (online, não probabilístico) tende a mostrar vantagens maiores do que pesquisas domiciliares presenciais (Datafolha, Quaest). Todos os números são intenção de voto no primeiro turno, salvo indicação.',
  } as BL,
}

// ─── Candidates ───────────────────────────────────────────────────────────────

export const candidates: Candidate[] = [

  // ── LULA ──────────────────────────────────────────────────────────────────

  {
    id: 'lula',
    fullName: 'Luiz Inácio Lula da Silva',
    shortName: 'Lula',
    party: 'PT',
    partyFull: { en: 'Workers\' Party (Partido dos Trabalhadores)', pt: 'Partido dos Trabalhadores' },
    candidateColor: '#b52b27',
    currentOffice: {
      en: 'President of Brazil (39th president; third term since January 1, 2023)',
      pt: 'Presidente do Brasil (39º presidente; terceiro mandato desde 1º de janeiro de 2023)',
    },
    age: 80,
    born: { en: 'October 27, 1945 — Caetés, Pernambuco', pt: '27 de outubro de 1945 — Caetés, Pernambuco' },
    timeline: [
      { year: '1945', event: { en: 'Born in Caetés, Pernambuco', pt: 'Nasceu em Caetés, Pernambuco' } },
      { year: '1975', event: { en: 'Elected president of the São Bernardo metalworkers\' union', pt: 'Eleito presidente do Sindicato dos Metalúrgicos de São Bernardo' } },
      { year: '1978–80', event: { en: 'Led the ABC strikes against the military dictatorship; jailed ~31 days in 1980', pt: 'Liderou as greves do ABC contra a ditadura militar; preso por ~31 dias em 1980' } },
      { year: '1980', event: { en: 'Co-founded the PT (February 10) and later the CUT (1983)', pt: 'Co-fundou o PT (10 de fevereiro) e, mais tarde, a CUT (1983)' } },
      { year: '1986', event: { en: 'Elected federal deputy (Constituent Assembly)', pt: 'Eleito deputado federal (Assembleia Constituinte)' } },
      { year: '1989–98', event: { en: 'Lost presidential bids in 1989, 1994, and 1998', pt: 'Perdeu as eleições presidenciais de 1989, 1994 e 1998' } },
      { year: '2002', event: { en: 'Elected president on his fourth attempt', pt: 'Eleito presidente na quarta tentativa' } },
      { year: '2003–10', event: { en: 'First and second presidential terms', pt: 'Primeiro e segundo mandatos presidenciais' } },
      { year: '2018', event: { en: 'Convicted by Sergio Moro (Lava Jato); barred from running; imprisoned 580 days', pt: 'Condenado por Sérgio Moro (Lava Jato); declarado inelegível; preso por 580 dias' } },
      { year: '2021', event: { en: 'STF annulled convictions on jurisdictional/bias grounds; political rights restored', pt: 'STF anulou condenações por razões de competência e imparcialidade; direitos políticos restaurados' } },
      { year: '2022', event: { en: 'Elected to a third term (50.9%) over incumbent Jair Bolsonaro; oldest president inaugurated', pt: 'Eleito para o terceiro mandato (50,9%) sobre o presidente Jair Bolsonaro; o mais velho a tomar posse' } },
      { year: '2023–', event: { en: 'Third presidential term (current)', pt: 'Terceiro mandato presidencial (em curso)' } },
    ],
    mandates: [
      {
        label: { en: 'First & Second Terms', pt: 'Primeiro e Segundo Mandatos' },
        period: { en: '2003–2010', pt: '2003–2010' },
        achievements: [
          { en: 'Created and massively expanded Bolsa Família cash-transfer program', pt: 'Criou e expandiu massivamente o Bolsa Família' },
          { en: 'Large real minimum-wage gains (+~46% purchasing power, DIEESE/Unicamp)', pt: 'Grandes ganhos reais do salário mínimo (+~46% no poder de compra, DIEESE/Unicamp)' },
          { en: 'Major poverty and inequality reduction; HDI rose from 0.669 (2000) to 0.726 (2010, UNDP)', pt: 'Grande redução da pobreza e desigualdade; IDH subiu de 0,669 (2000) para 0,726 (2010, PNUD)' },
          { en: 'Average annual GDP growth ~4.05%, above the ~2.73% world average (Unicamp)', pt: 'Crescimento médio anual do PIB de ~4,05%, acima da média mundial de ~2,73% (Unicamp)' },
          { en: 'Investment rose to ~19% of GDP; peak international prestige', pt: 'Investimento chegou a ~19% do PIB; pico de prestígio internacional' },
          { en: 'Left office with ~80% approval rating (CNI-Ibope, Dec 2010)', pt: 'Deixou o cargo com ~80% de aprovação (CNI-Ibope, dez. 2010)' },
        ],
        failures: [
          { en: 'Mensalão scandal (2005): senior PT figures convicted for vote-buying in Congress', pt: 'Escândalo do Mensalão (2005): dirigentes do PT condenados por compra de votos no Congresso' },
          { en: 'Weak security and infrastructure investment', pt: 'Investimento fraco em segurança e infraestrutura' },
          { en: 'Administered-price suppression policies (notably under successor Dilma) deferred inflation', pt: 'Políticas de represamento de preços administrados adiaram inflação (especialmente sob a sucessora Dilma)' },
        ],
        indicators: [
          { label: { en: 'Avg. annual GDP growth', pt: 'Crescimento médio anual do PIB' }, value: { en: '~4.05% (Unicamp)', pt: '~4,05% (Unicamp)' } },
          { label: { en: 'Real GDP total gain', pt: 'Ganho real do PIB no período' }, value: { en: '+~37%', pt: '+~37%' } },
          { label: { en: 'Min. wage purchasing power', pt: 'Poder de compra do salário mínimo' }, value: { en: '+~46% (DIEESE/Unicamp)', pt: '+~46% (DIEESE/Unicamp)' } },
          { label: { en: 'HDI', pt: 'IDH' }, value: { en: '0.669 → 0.726 (UNDP)', pt: '0,669 → 0,726 (PNUD)' } },
          { label: { en: 'Approval at end of term', pt: 'Aprovação ao fim do mandato' }, value: { en: '~80% (CNI-Ibope)', pt: '~80% (CNI-Ibope)' } },
        ],
        contextNote: {
          en: 'These two terms coincided almost exactly with the 2003–2011 global commodity supercycle — an exceptional China-driven boom in iron ore, oil, soy and metals. Brazil was a structural beneficiary. Not every commodity exporter converted the windfall into comparable poverty reduction, so policy choices (Bolsa Família, real minimum-wage policy) also mattered. The honest reading is "both."',
          pt: 'Os dois mandatos coincidiram com o superciclo global das commodities de 2003–2011 — um boom excepcional impulsionado pela China no minério de ferro, petróleo, soja e metais. O Brasil foi um beneficiário estrutural. Nem todo exportador de commodities converteu o bônus em redução comparável da pobreza, portanto as escolhas de política (Bolsa Família, política de salário mínimo real) também importaram. A leitura honesta é "ambos."',
        },
      },
      {
        label: { en: 'Third Term', pt: 'Terceiro Mandato' },
        period: { en: '2023–present', pt: '2023–presente' },
        achievements: [
          { en: 'Restored Bolsa Família, Minha Casa Minha Vida (tier 1), and Mais Médicos', pt: 'Restaurou o Bolsa Família, o Minha Casa Minha Vida (faixa 1) e o Mais Médicos' },
          { en: 'Passed new fiscal framework and landmark consumption-tax reform', pt: 'Aprovação do novo arcabouço fiscal e reforma tributária do consumo' },
          { en: 'GDP +3.4% (2024), +2.3% (2025, IBGE); work income and employed population hit record highs in 2025', pt: 'PIB +3,4% (2024), +2,3% (2025, IBGE); renda do trabalho e população empregada em recordes históricos em 2025' },
          { en: 'Folha found 66 of 99 tracked indicators improved in 2023', pt: 'Folha registrou melhora em 66 de 99 indicadores monitorados em 2023' },
        ],
        failures: [
          { en: 'Worsening fiscal deficit and falling foreign direct investment (Folha)', pt: 'Piora do déficit fiscal e queda no investimento estrangeiro direto (Folha)' },
          { en: 'Late-2024 currency rout requiring Central Bank intervention', pt: 'Derrocada cambial no fim de 2024, exigindo intervenção do Banco Central' },
          { en: 'High real interest rates (Selic ~14%+ in 2025–26) capping growth', pt: 'Juros reais elevados (Selic ~14%+ em 2025–26) limitando o crescimento' },
          { en: 'Record judicial reorganization filings (2,466 companies in 2025, +13%, Serasa Experian)', pt: 'Pedidos de recuperação judicial em recorde (2.466 empresas em 2025, +13%, Serasa Experian)' },
          { en: 'Banco Master / Vorcaro affair (see scandals)', pt: 'Caso Banco Master / Vorcaro (ver escândalos)' },
        ],
        indicators: [
          { label: { en: 'GDP 2024', pt: 'PIB 2024' }, value: { en: '+3.4% (IBGE)', pt: '+3,4% (IBGE)' } },
          { label: { en: 'GDP 2025', pt: 'PIB 2025' }, value: { en: '+2.3% (IBGE)', pt: '+2,3% (IBGE)' } },
          { label: { en: 'Projected GDP 2026', pt: 'PIB projetado 2026' }, value: { en: '+2.3% (Finance Ministry SPE)', pt: '+2,3% (SPE/MF)' } },
          { label: { en: 'Projected IPCA 2026', pt: 'IPCA projetado 2026' }, value: { en: '3.6% (Finance Ministry SPE)', pt: '3,6% (SPE/MF)' } },
          { label: { en: 'Selic rate (2025–26)', pt: 'Taxa Selic (2025–26)' }, value: { en: '~14%+', pt: '~14%+' } },
        ],
      },
    ],
    proposals: [
      {
        area: { en: 'Economy', pt: 'Economia' },
        position: { en: 'Sustain fiscal framework + tax-reform rollout; income/credit programs (~US$20bn debt-renegotiation plan); state-led investment.', pt: 'Manter arcabouço fiscal + implementar reforma tributária; programas de renda/crédito (~plano de renegociação de dívidas de R$20bn); investimento estatal.' },
        likelihood: 'HIGH',
        justification: { en: 'Already-passed laws and live programs; the binding constraint is the deficit and Selic, not political will.', pt: 'Leis já aprovadas e programas em vigor; a restrição vinculante é o déficit e a Selic, não a vontade política.' },
      },
      {
        area: { en: 'Security', pt: 'Segurança Pública' },
        position: { en: 'Federal coordination, anti-faction legislation ("PL Antifacção").', pt: 'Coordenação federal, legislação antifacção ("PL Antifacção").' },
        likelihood: 'MEDIUM',
        justification: { en: 'Security is state-led, Congress is conservative, and it is Lula\'s polling weak spot.', pt: 'Segurança é responsabilidade estadual, o Congresso é conservador e esta é a principal vulnerabilidade de Lula nas pesquisas.' },
      },
      {
        area: { en: 'Education', pt: 'Educação' },
        position: { en: 'Restore federal coordination; revise the "novo ensino médio" (new high school model).', pt: 'Restaurar coordenação federal; revisar o "novo ensino médio".' },
        likelihood: 'MEDIUM',
        justification: { en: 'Budget restored but execution lagged; high-school revision stalled for lack of state buy-in.', pt: 'Orçamento restaurado, mas execução atrasou; revisão do ensino médio estagnou por falta de adesão dos estados.' },
      },
      {
        area: { en: 'Foreign Policy', pt: 'Política Externa' },
        position: { en: 'Active multilateralism, BRICS expansion, South-South cooperation, climate mediation.', pt: 'Multilateralismo ativo, expansão dos BRICS, cooperação Sul-Sul, mediação climática.' },
        likelihood: 'HIGH',
        justification: { en: 'Consistent with lifelong practice and executive control — though contested abroad (Venezuela, Gaza).', pt: 'Consistente com prática de toda a vida e controle executivo — embora contestado externamente (Venezuela, Gaza).' },
      },
      {
        area: { en: 'Social Programs', pt: 'Programas Sociais' },
        position: { en: 'Sustain and expand Bolsa Família, real minimum-wage gains, Minha Casa Minha Vida.', pt: 'Manter e expandir o Bolsa Família, ganhos reais do salário mínimo, Minha Casa Minha Vida.' },
        likelihood: 'HIGH',
        justification: { en: 'Core PT identity, operational; risk is the 2.5% real-spending cap.', pt: 'Identidade central do PT, operacional; o risco é o teto de crescimento real de despesas de 2,5%.' },
      },
      {
        area: { en: 'Environment', pt: 'Meio Ambiente' },
        position: { en: 'Cut Amazon deforestation; lead climate diplomacy as COP30 host.', pt: 'Reduzir desmatamento na Amazônia; liderar diplomacia climática como anfitrião da COP30.' },
        likelihood: 'HIGH–MEDIUM',
        justification: { en: 'Enforcement rebuilt vs. Bolsonaro era, but internal tension over Margem Equatorial oil exploration complicates the "green" claim.', pt: 'Fiscalização reconstruída em relação à era Bolsonaro, mas tensão interna sobre o petróleo da Margem Equatorial complica o discurso "verde".' },
      },
    ],
    scandals: {
      confirmed: [
        {
          type: 'CONFIRMED',
          name: { en: 'Mensalão (AP 470)', pt: 'Mensalão (AP 470)' },
          year: '2003–2005 / STF 2012',
          summary: { en: 'Monthly payments scheme to buy congressional votes. The STF convicted senior PT figures: ex-Chief of Staff José Dirceu (10y10m), Genoíno (~6y11m), Delúbio Soares (~8y11m). Lula was never a defendant and was not convicted.', pt: 'Esquema de mensalidade para compra de votos no Congresso. O STF condenou dirigentes do PT: ex-ministro José Dirceu (10a10m), Genoíno (~6a11m), Delúbio Soares (~8a11m). Lula jamais foi réu e não foi condenado.' },
          sources: [
            { name: 'STF (official record)', leaning: 'center' },
            { name: 'Folha de S.Paulo', leaning: 'center' },
          ],
          outcome: { en: 'Convictions of senior PT members. Lula not convicted. Later delator allegations that he knew are [ALLEGED].', pt: 'Condenações de dirigentes do PT. Lula não foi condenado. Alegações posteriores de delatores de que ele sabia são [ALEGADAS].' },
        },
      ],
      alleged: [
        {
          type: 'ALLEGED',
          name: { en: 'Lava Jato — Triplex & Sítio de Atibaia', pt: 'Lava Jato — Tríplex e Sítio de Atibaia' },
          year: '2017–2021',
          summary: { en: 'Judge Sérgio Moro convicted Lula for corruption and money laundering linked to a seaside apartment (triplex, July 2017, 9y6m) and a farm property (sítio de Atibaia, Feb 2019, 12y11m). Lula served 580 days. In 2021 the STF ruled the Curitiba court lacked jurisdiction (Fachin) and declared Moro biased 7-4 (Gilmar Mendes). Convictions annulled. Re-prosecution attempts in Brasília failed (TRF-1 upheld rejection, July 2025).', pt: 'O juiz Sérgio Moro condenou Lula por corrupção e lavagem de dinheiro ligadas a um apartamento no Guarujá (tríplex, jul. 2017, 9a6m) e a uma propriedade rural (sítio de Atibaia, fev. 2019, 12a11m). Lula ficou preso 580 dias. Em 2021 o STF reconheceu a incompetência do juízo de Curitiba (Fachin) e declarou Moro suspeito por 7 a 4 (Gilmar Mendes). Condenações anuladas. Tentativas de reabertura em Brasília fracassaram (TRF-1 manteve rejeição, jul. 2025).' },
          sources: [
            { name: 'STF (official record)', leaning: 'center' },
            { name: 'Poder360', leaning: 'center' },
            { name: 'Folha de S.Paulo', leaning: 'center' },
          ],
          outcome: { en: 'Annulled on procedural/jurisdictional grounds and judge bias — NOT a merits acquittal. No standing conviction. Lula\'s claim of restored "innocence" is a political characterization, not a court ruling on the facts.', pt: 'Anulado por motivos processuais/de competência e suspeição do juiz — NÃO é absolvição no mérito. Nenhuma condenação vigente. A reivindicação de "inocência" restaurada é uma caracterização política, não uma decisão judicial sobre os fatos.' },
        },
        {
          type: 'ALLEGED',
          name: { en: 'Lava Jato — "13 Cases" (Época / Lava Jato task force)', pt: 'Lava Jato — "13 Casos" (Época / força-tarefa)' },
          year: '2017',
          summary: { en: 'Época (Globo group) reported the Lava Jato task force had assembled ~3,000 pieces of evidence across 13 cases and ~R$82 million in alleged undue benefits, including charges of corruption, money laundering, criminal organization and obstruction. These were prosecution accusations and evidence, not 13 convictions. Courts rejected the charges in several cases (including automaker/Zelotes matter); only the triplex and Atibaia cases produced convictions — both annulled. The task force\'s own conduct was later discredited (Vaza Jato leaks; STF bias ruling against Moro; lead prosecutor Deltan Dallagnol later lost his congressional mandate).', pt: 'A Época (Grupo Globo) noticiou que a força-tarefa da Lava Jato tinha reunido ~3.000 provas em 13 casos e ~R$82 milhões em supostas vantagens indevidas, incluindo acusações de corrupção, lavagem, organização criminosa e obstrução. Eram acusações do Ministério Público, não 13 condenações. Tribunais rejeitaram as denúncias em vários casos (incluindo o caso Zelotes/montadoras); apenas o tríplex e o sítio de Atibaia produziram condenações — ambas anuladas. A própria conduta da força-tarefa foi posteriormente desacreditada (Vaza Jato; decisão de suspeição do STF contra Moro; o líder Deltan Dallagnol perdeu seu mandato de deputado).' },
          sources: [
            { name: 'Época', leaning: 'right' },
            { name: 'Folha de S.Paulo', leaning: 'center' },
            { name: 'Intercept Brasil (Vaza Jato)', leaning: 'left' },
          ],
          outcome: { en: 'Under this dossier\'s labeling rules: [ALLEGED]/annulled — the same standard applied to Flávio\'s rachadinha.', pt: 'Sob os critérios deste dossiê: [ALEGADO]/anulado — o mesmo padrão aplicado à rachadinha de Flávio.' },
        },
        {
          type: 'ALLEGED',
          name: { en: 'Banco Master / Vorcaro Affair', pt: 'Caso Banco Master / Vorcaro' },
          year: '2024–2026',
          summary: { en: 'Per UOL and Poder360, at an off-the-agenda Planalto meeting (Dec 4, 2024), Lula reportedly advised banker Daniel Vorcaro not to sell Banco Master to BTG for R$1. Banco Master was later liquidated by the Central Bank (Nov 2025). Vorcaro was arrested (Operation Compliance Zero) over a gap estimated up to R$50bn tied to bad-credit sales to state bank BRB. Allies Guido Mantega (alleged ~R$1m/month consultancy) and Jaques Wagner are implicated. Per CNN Brasil, Vorcaro\'s draft plea deal reportedly does NOT name any current presidential pre-candidate, including Lula. No indictment of Lula exists.', pt: 'Segundo UOL e Poder360, em reunião não agendada no Planalto (4 de dezembro de 2024), Lula teria aconselhado o banqueiro Daniel Vorcaro a não vender o Banco Master ao BTG por R$1. O Banco Master foi liquidado pelo BC (nov. 2025). Vorcaro foi preso (Operação Compliance Zero) por rombo estimado em até R$50 bi ligado a vendas de créditos podres ao banco estatal BRB. Aliados Guido Mantega (suposta consultoria de ~R$1mi/mês) e Jaques Wagner estão implicados. Segundo a CNN Brasil, a minuta do acordo de Vorcaro não menciona nenhum pré-candidato presidencial, inclusive Lula. Não há indiciamento de Lula.' },
          sources: [
            { name: 'UOL', leaning: 'center' },
            { name: 'Poder360', leaning: 'center' },
            { name: 'CNN Brasil', leaning: 'center' },
            { name: 'Metrópoles', leaning: 'center' },
          ],
          outcome: { en: 'Active investigation as of May 2026. No indictment of Lula. Case is live and bilateral — also implicates figures near Flávio Bolsonaro.', pt: 'Investigação ativa em maio de 2026. Sem indiciamento de Lula. Caso em andamento e bilateral — também implica figuras próximas a Flávio Bolsonaro.' },
        },
      ],
      annulmentNote: {
        en: 'Lula\'s Lava Jato convictions were annulled on procedural/jurisdictional and judge-bias grounds — not a merits acquittal. The STF did not rule that the facts were false.',
        pt: 'As condenações de Lula na Lava Jato foram anuladas por motivos processuais/de competência e suspeição do juiz — não por absolvição no mérito. O STF não declarou que os fatos eram falsos.',
      },
    },
    connections: {
      allies: [
        { name: 'Geraldo Alckmin', role: { en: 'Vice President (PSB)', pt: 'Vice-presidente (PSB)' } },
        { name: 'Fernando Haddad', role: { en: 'Finance Minister — political scientist and former education minister, not an economist; appointment widely questioned', pt: 'Ministro da Fazenda — cientista político e ex-ministro da Educação, não é economista; nomeação amplamente questionada' } },
        { name: 'Gleisi Hoffmann', role: { en: 'Institutional Relations Minister & PT President', pt: 'Ministra das Relações Institucionais e presidente do PT' } },
        { name: 'Gabriel Galípolo', role: { en: 'Central Bank President', pt: 'Presidente do Banco Central' } },
      ],
      controversial: [
        { name: 'Guido Mantega', role: { en: 'Former Finance Minister; alleged ~R$1m/month consultancy to Banco Master', pt: 'Ex-ministro da Fazenda; suposta consultoria de ~R$1mi/mês ao Banco Master' }, controversial: true, status: 'ALLEGED' },
        { name: 'Jaques Wagner', role: { en: 'Senator; implicated in Vorcaro affair', pt: 'Senador; implicado no caso Vorcaro' }, controversial: true, status: 'ALLEGED' },
        { name: 'Márcio Pochmann', role: { en: 'IBGE President since 2023; appointment raised independence-risk concerns from career staff and IBGE union', pt: 'Presidente do IBGE desde 2023; nomeação gerou preocupações de risco à independência por parte de servidores e do sindicato do IBGE' }, controversial: true },
      ],
      media: {
        favorable: ['CartaCapital', 'Brasil de Fato', 'Brasil 247', 'ICL', 'Intercept Brasil (partial)'],
        critical: ['Gazeta do Povo', 'Veja', 'Diário do Poder'],
      },
    },
    mediaScandals: [
      {
        headline: { en: 'Compared Gaza campaign to Holocaust / Hitler', pt: 'Comparou campanha em Gaza ao Holocausto / Hitler' },
        date: 'February 18, 2024',
        source: { name: 'Poder360', leaning: 'center' },
        summary: { en: 'At a speech in Addis Ababa, Lula compared Israel\'s Gaza campaign to Hitler\'s killing of Jews. Israel declared him persona non grata. Allies framed it as criticism of civilian death tolls, not Holocaust denial.', pt: 'Em discurso em Adis Abeba, Lula comparou a campanha israelense em Gaza ao extermínio de judeus por Hitler. Israel o declarou persona non grata. Aliados enquadraram como crítica ao número de mortes civis, não como negacionismo.' },
        tag: { en: 'CONFIRMED statement', pt: 'Declaração CONFIRMADA' },
      },
      {
        headline: { en: 'Called democracy concept "relative" when asked about Venezuela/Maduro', pt: 'Chamou o conceito de democracia de "relativo" ao falar sobre Venezuela/Maduro' },
        date: '2023',
        source: { name: 'CNN Brasil', leaning: 'center' },
        summary: { en: 'Lula downplayed concerns about Venezuelan democracy and said the concept of democracy is "relative." Widely criticized across the political spectrum.', pt: 'Lula minimizou preocupações sobre a democracia venezuelana e disse que o conceito de democracia é "relativo". Amplamente criticado no espectro político.' },
        tag: { en: 'CONFIRMED statement', pt: 'Declaração CONFIRMADA' },
      },
      {
        headline: { en: 'Mais Médicos / Cuba — wage retention, Revalida exemption, US sanctions', pt: 'Mais Médicos / Cuba — retenção salarial, isenção do Revalida, sanções dos EUA' },
        date: '2013–2025',
        source: { name: 'US State Department / Folha de S.Paulo', leaning: 'center' },
        summary: { en: 'Launched under Dilma in 2013, revived by Lula\'s 3rd term. Cuban doctors came via PAHO under a "bolsa-formação" model; Cuba\'s government retained the majority of per-doctor payments. In Aug 2025, the US State Department (Sec. Rubio) revoked visas of Brazilian Health Ministry officials, accusing the program of abetting Cuba\'s "coercive labor export scheme." Some defector doctors have sued PAHO in US courts. The "forced labor" characterization is contested by Cuba and PT defenders, who call the US campaign a political tactic. The program is also credited with delivering doctors to underserved municipalities.', pt: 'Lançado na gestão Dilma em 2013, retomado pelo 3º mandato de Lula. Médicos cubanos vieram via OPAS sob o modelo de "bolsa-formação"; o governo cubano retinha a maior parte dos valores pagos por médico. Em agosto de 2025, o Departamento de Estado dos EUA (Sec. Rubio) revogou vistos de autoridades do Ministério da Saúde, acusando o programa de facilitar o "esquema cubano de exportação coercitiva de trabalho". Médicos desertores processaram a OPAS em tribunais americanos. A caracterização de "trabalho forçado" é contestada por Cuba e pelo PT, que chamam a campanha dos EUA de tática política. O programa também é creditado por levar médicos a municípios sem cobertura.' },
        tag: { en: 'CONFIRMED facts / ALLEGED — "forced labor" characterization contested', pt: 'Fatos CONFIRMADOS / ALEGADO — caracterização de "trabalho forçado" é contestada' },
      },
      {
        headline: { en: '"Batom e calcinha" and other domestic gaffes (~157 counted by Poder360)', pt: '"Batom e calcinha" e outras gafes (~157 contadas pelo Poder360)' },
        date: 'March 2024 (and ongoing)',
        source: { name: 'Poder360', leaning: 'center' },
        summary: { en: 'A sexist quip ("lipstick and underwear"), a domestic-violence/football joke (Jul 2024), and a shared-blame remark on the Ukraine war (Apr 2023) among recurring verbal missteps tracked by Poder360.', pt: 'Comentário sexista ("batom e calcinha"), piada sobre violência doméstica e futebol (jul. 2024) e comentário atribuindo culpa compartilhada pela guerra na Ucrânia (abr. 2023), entre tropeços verbais recorrentes monitorados pelo Poder360.' },
        tag: { en: 'CONFIRMED statements', pt: 'Declarações CONFIRMADAS' },
      },
      {
        headline: { en: 'Expulsion of NYT correspondent Larry Rohter (later reversed)', pt: 'Expulsão do correspondente do NYT Larry Rohter (posteriormente revertida)' },
        date: '2004',
        source: { name: 'Reporters Without Borders', leaning: 'center' },
        summary: { en: 'After a NYT article on Lula\'s alleged drinking, the government moved to revoke the correspondent\'s visa. The decision was later reversed after backlash. Reporters Without Borders called it "unworthy of a democratic regime."', pt: 'Após artigo do NYT sobre alegado problema de alcoolismo de Lula, o governo tentou revogar o visto do correspondente. A decisão foi revertida após repercussão negativa. A RSF chamou o episódio de "indigno de um regime democrático".' },
        tag: { en: 'CONFIRMED', pt: 'CONFIRMADO' },
      },
    ],
    videos: [
      // Add YouTube video IDs here. Example format:
      // { youtubeId: 'dQw4w9WgXcQ', title: { en: 'Interview title', pt: 'Título da entrevista' }, outlet: 'Outlet name', description: { en: '...', pt: '...' } }
    ],
  },

  // ── FLÁVIO BOLSONARO ──────────────────────────────────────────────────────

  {
    id: 'flavio',
    fullName: 'Flávio Nantes Bolsonaro',
    shortName: 'Flávio',
    party: 'PL',
    partyFull: { en: 'Liberal Party (Partido Liberal)', pt: 'Partido Liberal' },
    candidateColor: '#1a3560',
    currentOffice: {
      en: 'Senator for Rio de Janeiro (2019–2027); 3rd Secretary of the Senate board',
      pt: 'Senador pelo Rio de Janeiro (2019–2027); 3º Secretário da Mesa do Senado',
    },
    age: 45,
    born: { en: 'April 30, 1981 — Resende, RJ', pt: '30 de abril de 1981 — Resende, RJ' },
    candidacyNote: {
      en: 'WORKING HYPOTHESIS — Announced as Jair Bolsonaro\'s chosen successor (Dec 5, 2025); pre-candidacy launched at CPAC Dallas (Feb 28, 2026). Runs on Jair\'s legacy because his father is ineligible until 2030 (TSE conviction + STF coup conviction).',
      pt: 'HIPÓTESE DE TRABALHO — Anunciado como o escolhido de Jair Bolsonaro (5 de dezembro de 2025); pré-candidatura lançada no CPAC Dallas (28 de fevereiro de 2026). Candidata-se com base no legado de Jair, pois seu pai está inelegível até 2030 (condenação no TSE + condenação no STF por golpe).',
    },
    timeline: [
      { year: '1981', event: { en: 'Born in Resende, RJ. Eldest son of Jair Bolsonaro.', pt: 'Nasceu em Resende, RJ. Filho mais velho de Jair Bolsonaro.' } },
      { year: '2002', event: { en: 'Elected state deputy (Alerj) at 21 years old', pt: 'Eleito deputado estadual (Alerj) aos 21 anos' } },
      { year: '2003–18', event: { en: 'Four consecutive terms as state deputy at Alerj', pt: 'Quatro mandatos consecutivos como deputado estadual na Alerj' } },
      { year: '2016', event: { en: 'Ran for Rio de Janeiro mayor (PSC); finished 4th with ~14%', pt: 'Candidatou-se a prefeito do Rio de Janeiro (PSC); terminou em 4º lugar com ~14%' } },
      { year: '2018', event: { en: 'Elected Senator with 4,380,418 votes — most votes ever cast for a single candidate in Rio de Janeiro history (PSL)', pt: 'Eleito senador com 4.380.418 votos — o mais votado da história do Rio de Janeiro (PSL)' } },
      { year: '2019', event: { en: 'COAF report flags ~R$1.2m in atypical movements in aide Fabrício Queiroz\'s account (see scandals)', pt: 'Relatório do COAF aponta ~R$1,2 mi em movimentações atípicas na conta do assessor Fabrício Queiroz (ver escândalos)' } },
      { year: '2021', event: { en: 'Rachadinha case annulled by STJ on procedural/jurisdictional grounds', pt: 'Caso da rachadinha anulado pelo STJ por motivos processuais/de competência' } },
      { year: '2025', event: { en: 'Jair Bolsonaro declared ineligible until 2030 by TSE; STF coup conviction adds additional bar', pt: 'Jair Bolsonaro declarado inelegível até 2030 pelo TSE; condenação por golpe no STF adiciona nova barreira' } },
      { year: '2025–26', event: { en: 'Positioned as Jair\'s political heir and successor; announced pre-candidacy at CPAC Dallas (Feb 2026)', pt: 'Posicionado como herdeiro político de Jair; anunciou pré-candidatura no CPAC Dallas (fev. 2026)' } },
    ],
    mandates: [
      {
        label: { en: 'Own Senate Mandate', pt: 'Mandato no Senado' },
        period: { en: '2019–present', pt: '2019–presente' },
        achievements: [
          { en: 'Author/co-author of dozens of security bills and PECs', pt: 'Autor ou coautor de dezenas de projetos de lei e PECs na área de segurança' },
          { en: '2024: Floor rapporteur for the law ending temporary prison leaves', pt: '2024: Relator no plenário da lei que pôs fim às saídas temporárias' },
        ],
        failures: [
          { en: 'Per Folha/Estado de Minas: only two co-authored measures enacted — IPVA exemption for vehicles 20+ years old and a microcredit law', pt: 'Segundo Folha/Estado de Minas: apenas duas medidas coautoras sancionadas — isenção de IPVA para veículos com mais de 20 anos e uma lei de microcrédito' },
          { en: 'High electoral strength, thin legislative conversion rate', pt: 'Grande força eleitoral, baixa taxa de conversão legislativa' },
        ],
        indicators: [
          { label: { en: 'Bills enacted', pt: 'Projetos sancionados' }, value: { en: '2 co-authored measures (Folha/Estado de Minas)', pt: '2 medidas coautoras (Folha/Estado de Minas)' } },
          { label: { en: 'First-round votes (2018)', pt: 'Votos no 1º turno (2018)' }, value: { en: '4,380,418 — most-voted in Rio de Janeiro history', pt: '4.380.418 — o mais votado da história do Rio de Janeiro' } },
        ],
      },
      {
        label: { en: 'Father\'s Presidency — The Legacy He Runs On', pt: 'Presidência do Pai — O Legado que Defende' },
        period: { en: '2019–2022', pt: '2019–2022' },
        achievements: [
          { en: '2019 pension reform (widely credited, contested by labor unions)', pt: 'Reforma da Previdência de 2019 (amplamente elogiada, contestada por sindicatos)' },
          { en: 'Central Bank autonomy; sanitation and railway legal frameworks; privatizations and concessions', pt: 'Autonomia do Banco Central; marcos legais do saneamento e das ferrovias; privatizações e concessões' },
          { en: 'COVID Auxílio Emergencial widely credited as effective income cushioning', pt: 'Auxílio Emergencial da COVID amplamente reconhecido como eficaz amortecedor de renda' },
          { en: 'Unemployment fell from pandemic peak to ~8.9% by mid-2022 (IBGE)', pt: 'Desemprego caiu do pico pandêmico para ~8,9% em meados de 2022 (IBGE)' },
        ],
        failures: [
          { en: 'One of the world\'s worst COVID death tolls (660,000+)', pt: 'Um dos piores saldos de mortes por COVID do mundo (660.000+)' },
          { en: 'Persistent conflicts with the Judiciary, Congress, and state governors', pt: 'Conflitos persistentes com o Judiciário, o Congresso e governadores estaduais' },
          { en: 'Record Amazon deforestation during 2019–2022', pt: 'Desmatamento recorde da Amazônia entre 2019 e 2022' },
          { en: 'Double-digit inflation in 2021; minimum-wage purchasing power −~26% (DIEESE/Unicamp)', pt: 'Inflação de dois dígitos em 2021; poder de compra do salário mínimo −~26% (DIEESE/Unicamp)' },
          { en: 'Poverty and inequality hit series-worst levels in 2021 (IBGE PNAD)', pt: 'Pobreza e desigualdade atingiram os piores níveis históricos da série em 2021 (IBGE PNAD)' },
        ],
        indicators: [
          { label: { en: 'Avg. annual GDP growth', pt: 'Crescimento médio anual do PIB' }, value: { en: '~1.12% (Unicamp); 2020: ~−3.3%, 2021: ~+4.8%, 2022: ~+3.0% (World Bank)', pt: '~1,12% (Unicamp); 2020: ~−3,3%, 2021: ~+4,8%, 2022: ~+3,0% (Banco Mundial)' } },
          { label: { en: 'Unemployment peak', pt: 'Pico do desemprego' }, value: { en: '14.9% (early 2021, COVID — IBGE)', pt: '14,9% (início de 2021, COVID — IBGE)' } },
          { label: { en: 'Unemployment end of term', pt: 'Desemprego ao fim do mandato' }, value: { en: '~8.9% (mid-2022, IBGE)', pt: '~8,9% (meados de 2022, IBGE)' } },
          { label: { en: 'Min. wage purchasing power', pt: 'Poder de compra do salário mínimo' }, value: { en: '−~26% (DIEESE/Unicamp)', pt: '−~26% (DIEESE/Unicamp)' } },
          { label: { en: 'Inflation 2021 / 2022', pt: 'Inflação 2021 / 2022' }, value: { en: 'Double-digit 2021 → ~6% 2022 (after fuel-tax cuts)', pt: 'Dois dígitos em 2021 → ~6% em 2022 (após cortes do IPI sobre combustíveis)' } },
        ],
        contextNote: {
          en: 'Three of the four years (2019–2022) were dominated by the COVID-19 pandemic, which is inseparable from the economic record. The 2020 GDP contraction (~−3.3%) and 14.9% unemployment peak were primarily pandemic-driven — the mirror image of Lula\'s favorable commodity-cycle caveat. Any fair read of Bolsonaro\'s numbers must hold COVID constant.',
          pt: 'Três dos quatro anos (2019–2022) foram dominados pela pandemia de COVID-19, inseparável do desempenho econômico. A contração do PIB de 2020 (~−3,3%) e o pico de 14,9% de desemprego foram primordialmente causados pela pandemia — o espelho da ressalva do ciclo favorável de commodities de Lula. Qualquer leitura justa dos números de Bolsonaro precisa isolar o efeito COVID.',
        },
      },
    ],
    proposals: [
      {
        area: { en: 'Economy', pt: 'Economia' },
        position: { en: 'Pro-market Bolsonaro/Guedes-style continuity; tax-rate review; preserve "strategic" state firms from full privatization.', pt: 'Continuidade do modelo Bolsonaro/Guedes pró-mercado; revisão de alíquotas; preservação de empresas estatais "estratégicas" da privatização total.' },
        likelihood: 'MEDIUM',
        justification: { en: 'Directionally feasible with a right-leaning Congress but early-stage platform and weak own-bill record.', pt: 'Viável em termos de direção com o Congresso conservador, mas plataforma incipiente e histórico legislativo próprio fraco.' },
      },
      {
        area: { en: 'Security', pt: 'Segurança Pública' },
        position: { en: 'Harsher penalties, end temporary prison leaves, retake faction-controlled territory, Bukele-inspired approach, lower age of criminal responsibility to 16.', pt: 'Penas mais duras, fim das saídas temporárias, retomada de territórios controlados por facções, abordagem inspirada em Bukele, redução da maioridade penal para 16 anos.' },
        likelihood: 'MEDIUM',
        justification: { en: 'Core brand and Congress-friendly theme, but ideological security bills historically stall; PECs require supermajorities.', pt: 'Bandeira central e temática bem recebida pelo Congresso, mas projetos ideológicos de segurança historicamente empacam; PECs exigem maioria qualificada.' },
      },
      {
        area: { en: 'Education', pt: 'Educação' },
        position: { en: 'Limited platform; conservative "anti-ideology" framing in schools.', pt: 'Plataforma limitada; enquadramento conservador "anti-ideológico" nas escolas.' },
        likelihood: 'LOW',
        justification: { en: 'No substantive record or detailed proposals identified in public record as of May 2026.', pt: 'Nenhum histórico substantivo ou proposta detalhada identificada no registro público até maio de 2026.' },
      },
      {
        area: { en: 'Foreign Policy', pt: 'Política Externa' },
        position: { en: 'Tight US/conservative-international alignment (CPAC); rare-earths partnership; against "radical" climate agendas. Called for international monitoring of Brazilian election.', pt: 'Alinhamento estreito com EUA e conservadores internacionais (CPAC); parceria em terras raras; contra agendas climáticas "radicais". Pediu monitoramento internacional das eleições brasileiras.' },
        likelihood: 'MEDIUM',
        justification: { en: 'Clear commitment, but the call for "international monitoring" of Brazil\'s own election is constitutionally and diplomatically fraught.', pt: 'Compromisso claro, mas o pedido de "monitoramento internacional" das eleições brasileiras é constitucional e diplomaticamente problemático.' },
      },
      {
        area: { en: 'Social Programs', pt: 'Programas Sociais' },
        position: { en: 'Continuity of Auxílio-type cash transfers.', pt: 'Continuidade dos transferências do tipo Auxílio.' },
        likelihood: 'MEDIUM',
        justification: { en: 'Precedented (Auxílio Brasil/Emergencial) and necessary, but subordinate to security and economic messaging.', pt: 'Precedentado (Auxílio Brasil/Emergencial) e necessário, mas subordinado ao discurso de segurança e economia.' },
      },
      {
        area: { en: 'Environment', pt: 'Meio Ambiente' },
        position: { en: 'Pro-extraction; Margem Equatorial offshore oil; criticize "ideological" environmental licensing.', pt: 'Pró-extrativismo; petróleo na Margem Equatorial; crítica ao licenciamento ambiental "ideológico".' },
        likelihood: 'HIGH–MEDIUM',
        justification: { en: 'Aligns with base and a permissive Congress; faces judicial and Ibama resistance.', pt: 'Alinha-se com sua base e um Congresso permissivo; enfrenta resistência judicial e do Ibama.' },
      },
      {
        area: { en: 'Amnesty / Rule of Law', pt: 'Anistia / Estado de Direito' },
        position: { en: '"Ampla, geral e irrestrita" amnesty for Jair Bolsonaro and January 8 defendants.', pt: 'Anistia "ampla, geral e irrestrita" para Jair Bolsonaro e os réus do 8 de Janeiro.' },
        likelihood: 'LOW–MEDIUM',
        justification: { en: 'Needs a sufficiently friendly Congress and must survive STF scrutiny; broad amnesty for a coup conviction is constitutionally contested.', pt: 'Precisa de um Congresso suficientemente favorável e deve sobreviver ao escrutínio do STF; anistia ampla por condenação de golpe é constitucionalmente contestada.' },
      },
    ],
    scandals: {
      confirmed: [],
      alleged: [
        {
          type: 'ALLEGED',
          name: { en: '"Rachadinha" — Alerj salary-skimming scheme', pt: '"Rachadinha" — esquema de desvio de salários na Alerj' },
          year: '2018–2022',
          summary: { en: 'A 2018 COAF report flagged ~R$1.2m in atypical movements in the account of aide Fabrício Queiroz. The MP-RJ alleged a scheme of R$6m+, partly laundered via a Kopenhagen franchise. Charges filed in 2020. In November 2021 the STJ 5th Panel (4–1) ruled the judge incompetent (foro privilegiado/"mandatos cruzados") and annulled his decisions and the evidence; the STF also voided four of five COAF reports as an "investigação disfarçada." The TJ-RJ then rejected the charge (May 2022). An MP-RJ appeal was kept archived by Justice Gilmar Mendes as of February 2026.', pt: 'Um relatório do COAF de 2018 apontou ~R$1,2 mi em movimentações atípicas na conta do assessor Fabrício Queiroz. O MP-RJ alegou um esquema de R$6 mi+, parcialmente lavado via franquia Kopenhagen. Denúncia em 2020. Em novembro de 2021 a 5ª Turma do STJ (4 a 1) reconheceu a incompetência do juiz (foro privilegiado/"mandatos cruzados") e anulou as decisões e as provas; o STF anulou quatro dos cinco relatórios do COAF como "investigação disfarçada". O TJ-RJ rejeitou a denúncia (maio de 2022). Um recurso do MP-RJ foi mantido arquivado pelo ministro Gilmar Mendes em fevereiro de 2026.' },
          sources: [
            { name: 'Estadão', leaning: 'right' },
            { name: 'Folha de S.Paulo', leaning: 'center' },
            { name: 'ND Mais', leaning: 'center' },
          ],
          outcome: { en: 'Procedural/evidentiary nullification — NOT a merits acquittal. No standing prosecution.', pt: 'Nulidade processual/probatória — NÃO é absolvição no mérito. Sem ação penal vigente.' },
        },
        {
          type: 'ALLEGED',
          name: { en: 'Vorcaro / Banco Master — "Dark Horse" film financing (R$134m)', pt: 'Vorcaro / Banco Master — Financiamento do filme "Dark Horse" (R$134 mi)' },
          year: '2025–2026',
          summary: { en: 'On May 13, 2026, Intercept Brasil published audio and documents showing Flávio negotiated US$24m (~R$134m) with Daniel Vorcaro to finance a Jair Bolsonaro biopic; ~US$10.6m (~R$61m) allegedly paid Feb–May 2025 via six transfers, partly through a Texas fund (Havengate) tied to Eduardo Bolsonaro\'s allies. Flávio first denied the audio existed, then confirmed it but called it lawful private sponsorship ("zero dinheiro público"), said he had only met Vorcaro in December 2024, and demanded a "CPI do Master." The conversation is confirmed; whether it constitutes a crime is unproven and uncharged. Per CNN Brasil, Vorcaro\'s draft plea does not name Flávio. The leak measurably hurt his polling (AtlasIntel first-round share −~5–6 points after May 13).', pt: 'Em 13 de maio de 2026, o Intercept Brasil publicou áudios e documentos mostrando que Flávio negociou US$24 mi (~R$134 mi) com Daniel Vorcaro para financiar um filme sobre Jair Bolsonaro; ~US$10,6 mi (~R$61 mi) alegadamente pagos entre fevereiro e maio de 2025 por seis transferências, parte via fundo no Texas (Havengate) ligado a aliados de Eduardo Bolsonaro. Flávio primeiro negou a existência do áudio, depois confirmou, mas chamou de patrocínio privado lícito ("zero dinheiro público"), disse ter encontrado Vorcaro apenas em dezembro de 2024 e exigiu uma "CPI do Master". A conversa é confirmada; se configura crime é questão não provada e sem indiciamento. Segundo a CNN Brasil, a minuta do acordo de Vorcaro não menciona Flávio. O vazamento afetou sensivelmente sua pesquisa (queda de ~5–6 pontos no 1º turno do AtlasIntel após 13 de maio).' },
          sources: [
            { name: 'Intercept Brasil', leaning: 'left' },
            { name: 'CNN Brasil', leaning: 'center' },
            { name: 'Correio Braziliense', leaning: 'center' },
            { name: 'Estado de Minas', leaning: 'center' },
          ],
          outcome: { en: 'Active. No indictment as of May 2026. Flávio confirmed the conversation; criminal characterization unproven.', pt: 'Ativo. Sem indiciamento até maio de 2026. Flávio confirmou a conversa; caracterização criminal não comprovada.' },
        },
      ],
      annulmentNote: {
        en: 'Flávio\'s rachadinha prosecution was annulled on procedural/jurisdictional grounds — not a merits acquittal. The same standard applied to Lula\'s Lava Jato convictions.',
        pt: 'A investigação da rachadinha de Flávio foi anulada por motivos processuais/de competência — não por absolvição no mérito. O mesmo padrão aplicado às condenações de Lula na Lava Jato.',
      },
      noneNote: {
        en: 'No criminal convictions or formal indictments as of May 2026.',
        pt: 'Nenhuma condenação criminal ou indiciamento formal até maio de 2026.',
      },
    },
    connections: {
      allies: [
        { name: 'Jair Bolsonaro', role: { en: 'Ineligible patron and political father; declared Flávio his chosen successor', pt: 'Patrono inelegível e pai político; declarou Flávio seu sucessor escolhido' } },
        { name: 'Eduardo Bolsonaro', role: { en: 'Brother; ex-federal deputy, based in the US; manages international conservative network', pt: 'Irmão; ex-deputado federal, radicado nos EUA; gerencia rede conservadora internacional' } },
        { name: 'Valdemar Costa Neto', role: { en: 'PL party president and key political fixer', pt: 'Presidente do PL e principal articulador político' } },
        { name: 'Michelle Bolsonaro', role: { en: 'Sister-in-law; alternative PL candidate in some scenarios', pt: 'Cunhada; candidata alternativa do PL em alguns cenários' } },
      ],
      controversial: [
        { name: 'Fabrício Queiroz', role: { en: 'Former aide; central figure in rachadinha allegation', pt: 'Ex-assessor; figura central na alegação de rachadinha' }, controversial: true, status: 'ALLEGED' },
        { name: 'Daniel Vorcaro', role: { en: 'Banker; arrested in Operation Compliance Zero; alleged film financier', pt: 'Banqueiro; preso na Operação Compliance Zero; suposto financiador do filme' }, controversial: true, status: 'ALLEGED' },
        { name: 'Havengate Fund (Texas)', role: { en: 'Fund allegedly used to route film financing payments; tied to Eduardo Bolsonaro\'s allies', pt: 'Fundo alegadamente usado para transferências do financiamento do filme; ligado a aliados de Eduardo Bolsonaro' }, controversial: true, status: 'ALLEGED' },
      ],
      media: {
        favorable: ['Gazeta do Povo', 'Veja', 'Brasil Paralelo'],
        critical: ['CartaCapital', 'Intercept Brasil', 'Brasil de Fato'],
      },
    },
    mediaScandals: [
      {
        headline: { en: 'Homophobic statements as state deputy', pt: 'Declarações homofóbicas como deputado estadual' },
        date: 'During Alerj tenure (2003–2018)',
        source: { name: 'ND Mais', leaning: 'center' },
        summary: { en: 'Stated "o normal é ser heterossexual" and made a remark doubting that parents could be proud of a gay child. Widely condemned across the spectrum.', pt: 'Afirmou que "o normal é ser heterossexual" e fez comentário duvidando que pais pudessem ter orgulho de um filho gay. Amplamente condenado.' },
        tag: { en: 'CONFIRMED statements', pt: 'Declarações CONFIRMADAS' },
      },
      {
        headline: { en: 'Minimized the "joias sauditas" jewelry smuggling case', pt: 'Minimizou o caso das "joias sauditas"' },
        date: '2023',
        source: { name: 'Poder360', leaning: 'center' },
        summary: { en: 'Called the alleged smuggling of jewelry valued ~R$16.5m by his father\'s government "coisa tão pequena" (such a small thing).', pt: 'Chamou o alegado contrabando de joias avaliadas em ~R$16,5 mi pelo governo de seu pai de "coisa tão pequena".' },
        tag: { en: 'CONFIRMED statement', pt: 'Declaração CONFIRMADA' },
      },
      {
        headline: { en: 'Armed shootout during mayoral campaign (2016)', pt: 'Tiroteio durante campanha para prefeito (2016)' },
        date: '2016',
        source: { name: 'Folha de S.Paulo', leaning: 'center' },
        summary: { en: 'He and a PM (military police) bodyguard exchanged fire with robbers in Rio\'s West Zone during his mayoral campaign. No criminal charges filed against Flávio.', pt: 'Ele e um segurança da PM trocaram tiros com assaltantes na Zona Oeste do Rio durante sua campanha para prefeito. Nenhuma acusação criminal contra Flávio.' },
        tag: { en: 'Reported', pt: 'Reportado' },
      },
      {
        headline: { en: 'Voted to confirm Domingos Brazão to RJ audit court (2009)', pt: 'Votou pela indicação de Domingos Brazão para o TCE-RJ (2009)' },
        date: '2009',
        source: { name: 'Folha de S.Paulo', leaning: 'center' },
        summary: { en: 'As a state deputy, voted to confirm Brazão — later accused of masterminding Marielle Franco\'s murder — to the Rio de Janeiro Court of Accounts. No allegation of wrongdoing by Flávio; noted for context.', pt: 'Como deputado estadual, votou pela indicação de Brazão — posteriormente acusado de ser o mandante do assassinato de Marielle Franco — para o TCE-RJ. Sem alegação de irregularidade de Flávio; registrado como contexto.' },
        tag: { en: 'Reported (context only)', pt: 'Reportado (apenas contexto)' },
      },
    ],
    videos: [
      // Add YouTube video IDs here.
    ],
  },

  // ── RENAN SANTOS ──────────────────────────────────────────────────────────

  {
    id: 'renan',
    fullName: 'Renan Antônio Ferreira dos Santos',
    shortName: 'Renan',
    party: 'Missão',
    partyFull: { en: 'Missão Party (founded by MBL, TSE-registered November 2025)', pt: 'Partido Missão (fundado pelo MBL, homologado pelo TSE em novembro de 2025)' },
    candidateColor: '#c97a1a',
    currentOffice: {
      en: 'President of Missão party and MBL. No elected public office — ever.',
      pt: 'Presidente do Partido Missão e do MBL. Nunca ocupou cargo público eletivo.',
    },
    age: 42,
    born: { en: 'February 14, 1984 — São Paulo, SP', pt: '14 de fevereiro de 1984 — São Paulo, SP' },
    candidacyNote: {
      en: 'FIRST-TIME CANDIDATE — has never held elected office. 2026 is his first candidacy. Governing capacity is entirely untested.',
      pt: 'CANDIDATO DE PRIMEIRA VEZ — nunca ocupou cargo eletivo. 2026 é sua primeira candidatura. Capacidade de governo completamente não testada.',
    },
    timeline: [
      { year: '1984', event: { en: 'Born in São Paulo, SP', pt: 'Nasceu em São Paulo, SP' } },
      { year: '2010–15', event: { en: 'PSDB member; later left to co-found MBL', pt: 'Membro do PSDB; depois saiu para co-fundar o MBL' } },
      { year: '2014', event: { en: 'Co-founded the MBL (Movimento Brasil Livre) with Kim Kataguiri, Fernando Holiday, and Rubens Nunes amid anti-Dilma protests', pt: 'Co-fundou o MBL (Movimento Brasil Livre) com Kim Kataguiri, Fernando Holiday e Rubens Nunes durante os protestos anti-Dilma' } },
      { year: '2015–16', event: { en: 'Key organizer of mass protests and the impeachment campaign against Dilma Rousseff', pt: 'Organizador-chave dos protestos em massa e da campanha pelo impeachment de Dilma Rousseff' } },
      { year: '2024', event: { en: 'Missão wins mayoral races in Salvador and Natal using the public electoral fund (which MBL had originally opposed)', pt: 'Missão vence eleições municipais em Salvador e Natal com fundo partidário público (ao qual o MBL originalmente se opunha)' } },
      { year: 'Nov 2025', event: { en: 'Missão party formally homologated by TSE', pt: 'Partido Missão homologado pelo TSE' } },
      { year: 'Late 2025', event: { en: 'Announced presidential pre-candidacy; described platform as "Milei na forma, Bukele no conteúdo"', pt: 'Anunciou pré-candidatura presidencial; descreveu a plataforma como "Milei na forma, Bukele no conteúdo"' } },
      { year: 'May 2026', event: { en: 'AtlasIntel polling at 6.9% first round — clear third place, ahead of established ex-governors Zema and Caiado', pt: 'AtlasIntel o aponta com 6,9% no 1º turno — terceiro lugar definido, à frente dos ex-governadores Zema e Caiado' } },
    ],
    mandates: [
      {
        label: { en: 'No Mandate', pt: 'Sem Mandato' },
        period: { en: '—', pt: '—' },
        achievements: [],
        failures: [],
        indicators: [],
        noMandate: true,
        contextNote: {
          en: 'Renan Santos has never held elected office. There is no executive or legislative record to assess. Economic indicators are not applicable. The public record is genuinely thin and relies on profile journalism rather than a governing track record.',
          pt: 'Renan Santos nunca ocupou cargo eletivo. Não há histórico executivo ou legislativo a avaliar. Indicadores econômicos não se aplicam. O registro público é genuinamente escasso e se baseia em jornalismo de perfil, não em histórico de governo.',
        },
      },
    ],
    proposals: [
      {
        area: { en: 'Economy', pt: 'Economia' },
        position: { en: 'Liberal-developmentalist hybrid: shrink/revise the State, total budget de-earmarking, cut "supersalários" (~R$15bn), Nordeste industrialization, Bitcoin reserves, merge deficit municipalities, results-tied transfers to subnational governments.', pt: 'Híbrido liberal-desenvolvimentista: reduzir/revisar o Estado, desvinculação orçamentária total, cortar "supersalários" (~R$15 bi), industrialização do Nordeste, reservas em Bitcoin, fusão de municípios deficitários, transferências vinculadas a resultados.' },
        likelihood: 'LOW–MEDIUM',
        justification: { en: 'Milei\'s Argentina shows shock-liberal reform can deliver results — but only with a built congressional majority. Renan has essentially no bench, capping execution. Raised from LOW to LOW–MEDIUM based on the Milei precedent.', pt: 'A Argentina de Milei mostra que a reforma liberal de choque pode entregar resultados — mas apenas com maioria parlamentar construída. Renan não tem praticamente nenhuma bancada, o que limita a execução. Elevado de BAIXA para BAIXA–MÉDIA com base no precedente Milei.' },
      },
      {
        area: { en: 'Security', pt: 'Segurança Pública' },
        position: { en: 'Decree "Estado de Defesa" in crime-dominated territories as first act (Jan 5, 2027); "direito penal do inimigo" — treat faction members as public enemies; "prender ou matar" leaderships; financial asphyxiation (COAF/Receita/PF integration); Bukele model. Co-founder Kim Kataguiri advocates death penalty and life imprisonment via new Constituent Assembly.', pt: 'Decretar "Estado de Defesa" em territórios dominados pelo crime como primeiro ato (5 jan. 2027); "direito penal do inimigo" — tratar membros de facções como inimigos públicos; "prender ou matar" lideranças; asfixia financeira (integração COAF/Receita/PF); modelo Bukele. O co-fundador Kim Kataguiri defende pena de morte e prisão perpétua via nova Assembleia Constituinte.' },
        likelihood: 'MEDIUM',
        justification: { en: 'Signature theme with proof-of-concept (Bukele cut El Salvador\'s homicide rate from ~53 to ~1.9/100k by 2024). The Estado de Defesa is a real constitutional tool (Art. 136) — but it is time-limited, needs Congressional ratification, and is judicially reviewable. Death-penalty/life-term add-ons collide with likely cláusulas pétreas. Raised from LOW based on Bukele precedent.', pt: 'Bandeira central com precedente real (Bukele reduziu a taxa de homicídios de El Salvador de ~53 para ~1,9/100 mil até 2024). O Estado de Defesa é um instrumento constitucional real (Art. 136) — mas é temporário, precisa de ratificação do Congresso e é sujeito a revisão judicial. Pena de morte e prisão perpétua colidem com possíveis cláusulas pétreas. Elevado de BAIXA com base no precedente Bukele.' },
      },
      {
        area: { en: 'Education', pt: 'Educação' },
        position: { en: 'Tie education funding to objective outcomes (IDH, literacy rates); stated top priority alongside health.', pt: 'Vincular financiamento da educação a resultados objetivos (IDH, taxas de alfabetização); declarada prioridade máxima junto à saúde.' },
        likelihood: 'LOW',
        justification: { en: 'Conceptual, untested, no implementation pathway or legislative bench.', pt: 'Conceitual, não testado, sem caminho de implementação ou bancada legislativa.' },
      },
      {
        area: { en: 'Foreign Policy', pt: 'Política Externa' },
        position: { en: 'Nationalism; Brazil as great power; nuclear deterrence via the protocoled "PEC Bomba Nuclear" (includes NPT withdrawal). Eco-nationalist clean-energy self-sufficiency.', pt: 'Nacionalismo; Brasil como grande potência; dissuasão nuclear via "PEC Bomba Nuclear" protocolada (inclui saída do TNP). Autossuficiência energética limpa eco-nacionalista.' },
        likelihood: 'LOW',
        justification: { en: 'The nuclear PEC (filed by Kataguiri, Oct 8, 2025) is expected to die in the CCJ. NPT withdrawal carries severe diplomatic and economic costs and lacks institutional support.', pt: 'A PEC nuclear (protocolada por Kataguiri em 8 out. 2025) deve ser arquivada na CCJ. A saída do TNP acarretaria graves custos diplomáticos e econômicos e não tem respaldo institucional.' },
      },
      {
        area: { en: 'Social Programs', pt: 'Programas Sociais' },
        position: { en: 'Skeptical of traditional welfare dependency; signature proposal of "desfavelização" (ending favelas, inspired by Singapore/Lee Kuan Yew model).', pt: 'Cético quanto à dependência do assistencialismo tradicional; proposta-bandeira de "desfavelização" (fim das favelas, inspirado no modelo de Cingapura/Lee Kuan Yew).' },
        likelihood: 'LOW',
        justification: { en: 'Underspecified; runs against entrenched programs and Brazil\'s housing realities; no implementation detail or budget pathway.', pt: 'Pouco detalhado; contraria programas consolidados e as realidades habitacionais do Brasil; sem detalhamento de implementação ou caminho orçamentário.' },
      },
      {
        area: { en: 'Rare Earths / Strategic Industry', pt: 'Terras Raras / Indústria Estratégica' },
        position: { en: 'Industrialize Brazilian rare earth processing domestically rather than exporting raw minerals. Use rare earths as a strategic national asset for energy transition, defense, and technological sovereignty — processing value chain kept in Brazil.', pt: 'Industrializar o processamento de terras raras no Brasil em vez de exportar minérios brutos. Usar as terras raras como ativo estratégico nacional para transição energética, defesa e soberania tecnológica — manter a cadeia de valor do processamento no Brasil.' },
        likelihood: 'HIGH',
        justification: { en: 'Rare earth industrialization enjoys broad cross-partisan consensus in Brazil, does not require constitutional changes or a congressional supermajority, and aligns directly with both his "econacionalismo" and developmentalist strands — the highest-feasibility item in his platform.', pt: 'A industrialização de terras raras tem amplo consenso transpartidário no Brasil, não exige mudanças constitucionais nem maioria qualificada no Congresso, e alinha-se diretamente ao "econacionalismo" e ao desenvolvimentismo — o item de maior viabilidade em sua plataforma.' },
      },
      {
        area: { en: 'Environment', pt: 'Meio Ambiente' },
        position: { en: '"Econacionalismo": clean-energy self-sufficiency and sustainability, subordinate to growth and sovereignty priorities.', pt: '"Econacionalismo": autossuficiência em energia limpa e sustentabilidade, subordinadas a prioridades de crescimento e soberania.' },
        likelihood: 'LOW',
        justification: { en: 'Stated as a principle but no detailed agenda or record. The "econacionalismo" label is new and unverified in practice.', pt: 'Declarado como princípio, mas sem agenda detalhada ou histórico. O rótulo "econacionalismo" é novo e não verificado na prática.' },
      },
    ],
    scandals: {
      confirmed: [],
      alleged: [],
      noneNote: {
        en: 'No corruption convictions, indictments, or official findings. Renan has held no public office, so there is no institutional record to investigate.',
        pt: 'Nenhuma condenação, indiciamento ou apuração oficial por corrupção. Renan nunca ocupou cargo público, portanto não há histórico institucional a investigar.'
      },
    },
    connections: {
      allies: [
        { name: 'Kim Kataguiri', role: { en: 'MBL co-founder; Missão\'s most prominent officeholder (federal deputy); author of the "PEC Bomba Nuclear" and Constituent-Assembly death-penalty proposals', pt: 'Co-fundador do MBL; principal detentor de cargo do Missão (deputado federal); autor da "PEC Bomba Nuclear" e das propostas de pena de morte por Constituinte' } },
        { name: 'Guto Zacarias', role: { en: 'São Paulo state deputy (Missão cadre)', pt: 'Deputado estadual de São Paulo (quadro do Missão)' } },
        { name: 'Amanda Vettorazzo', role: { en: 'Councilwoman (Missão cadre)', pt: 'Vereadora (quadro do Missão)' } },
      ],
      controversial: [
        { name: 'Arthur do Val ("Mamãe Falei")', role: { en: 'Ex-state deputy; estranged former MBL figure who resigned after sexist remarks about Ukrainian women (2022)', pt: 'Ex-deputado estadual; ex-figura do MBL afastado após comentários sexistas sobre mulheres ucranianas (2022)' }, controversial: true },
        { name: 'Fernando Holiday', role: { en: 'MBL co-founder; since estranged from the group', pt: 'Co-fundador do MBL; desde então afastado do grupo' }, controversial: false },
      ],
      media: {
        favorable: ['Gazeta do Povo (partial)', 'Brasil Paralelo (partial)', 'Crusoé'],
        critical: ['Brasil de Fato', 'CartaCapital'],
      },
    },
    mediaScandals: [
      {
        headline: { en: 'Disputed civil tax / social-security debts (~R$1.1m or ~R$41k)', pt: 'Dívidas civis tributárias/previdenciárias contestadas (~R$1,1 mi ou ~R$41 mil)' },
        date: '2026 (reported)',
        source: { name: 'Brasil de Fato / Poder360', leaning: 'left' },
        summary: { en: 'Brasil de Fato (left) reported Renan owes ~R$1.1m in União\'s Dívida Ativa (mostly FGTS across two companies). Poder360/Veja (center-right) cite only ~R$41,100 over alleged irregular dissolution of "Martin Artefatos de Metais." Renan disputes responsibility, saying the triggering facts predate his involvement. This is a civil/fiscal matter — not a criminal corruption case.', pt: 'Brasil de Fato (esquerda) reportou que Renan deve ~R$1,1 mi na Dívida Ativa da União (principalmente FGTS em duas empresas). Poder360/Veja (centro-direita) apontam apenas ~R$41.100 por suposta dissolução irregular da "Martin Artefatos de Metais". Renan contesta a responsabilidade, alegando que os fatos que geraram a dívida antecedem seu ingresso na empresa. Trata-se de matéria civil/fiscal — não é um caso de corrupção criminal.' },
        tag: { en: 'Reported', pt: 'Reportado' },
      },
      {
        headline: { en: '"Flávio Bolsonaro has to die" (December 2025 / viral January 2026)', pt: '"Flávio Bolsonaro tem que morrer" (dezembro de 2025 / viral em janeiro de 2026)' },
        date: 'December 2025',
        source: { name: 'Metrópoles', leaning: 'center' },
        summary: { en: 'Said the "traitor has to die, and the traitor is Flávio Bolsonaro." After backlash he reframed it as "political death." Reported across center and right outlets. Outlets vary on the exact venue (live/livestream/podcast).', pt: 'Disse que "o traidor tem que morrer, e o traidor é o Flávio Bolsonaro". Após repercussão negativa, recontextualizou como "morte política". Relatado por veículos de centro e direita. Veículos divergem sobre o local exato (ao vivo/livestream/podcast).' },
        tag: { en: 'CONFIRMED statement', pt: 'Declaração CONFIRMADA' },
      },
      {
        headline: { en: 'Advocated for nuclear weapons for Brazil (January 2026, Recife)', pt: 'Defendeu armas nucleares para o Brasil (janeiro de 2026, Recife)' },
        date: 'January 11, 2026',
        source: { name: 'NE10 / Jamildo', leaning: 'center' },
        summary: { en: 'Argued Brazil needs nuclear deterrence to "dissuade any kind of invasion." Kim Kataguiri\'s nuclear PEC was formally filed in October 2025. Expected to die in the CCJ.', pt: 'Argumentou que o Brasil precisa de dissuasão nuclear para "dissuadir qualquer tipo de invasão". A PEC nuclear de Kim Kataguiri foi protocolada formalmente em outubro de 2025. Deve ser arquivada na CCJ.' },
        tag: { en: 'CONFIRMED statement', pt: 'Declaração CONFIRMADA' },
      },
      {
        headline: { en: '"Prendeu, matou" — Bukele-model security slogan draws human rights alerts', pt: '"Prendeu, matou" — slogan de segurança do modelo Bukele gera alertas de direitos humanos' },
        date: '2025–2026',
        source: { name: 'Gazeta do Povo', leaning: 'right' },
        summary: { en: 'The confirmed Missão campaign slogan, modeled on El Salvador\'s security crackdown. Drew human-rights alerts from the IACHR (Aug 2025) and Amnesty International (Nov 2024) regarding the Bukele model\'s mass incarceration and custody deaths.', pt: 'Slogan oficial de campanha do Missão, inspirado no combate ao crime em El Salvador. Gerou alertas de direitos humanos da CIDH (ago. 2025) e da Anistia Internacional (nov. 2024) sobre o encarceramento em massa e mortes sob custódia do modelo Bukele.' },
        tag: { en: 'CONFIRMED (stated platform)', pt: 'CONFIRMADO (plataforma declarada)' },
      },
      {
        headline: { en: '"Tática do barulho" — deliberate provocation strategy for media reach', pt: '"Tática do barulho" — estratégia deliberada de provocação para alcance midiático' },
        date: '2025–2026',
        source: { name: 'PlatôBR', leaning: 'center' },
        summary: { en: 'Analysts describe a deliberate strategy of attacking high-visibility rivals (notably calling Flávio Bolsonaro a "traitor") to gain media reach for a party with little broadcast airtime. Strong organic social-media engagement (~5.11% Instagram engagement rate vs. Flávio\'s ~1.41%, per Blade/Investidor10).', pt: 'Analistas descrevem uma estratégia deliberada de atacar rivais de alta visibilidade (notavelmente chamando Flávio Bolsonaro de "traidor") para ganhar alcance midiático para um partido com pouco tempo de TV. Forte engajamento orgânico nas redes sociais (~5,11% de taxa de engajamento no Instagram vs. ~1,41% de Flávio, segundo Blade/Investidor10).' },
        tag: { en: 'Reported (analyst assessment)', pt: 'Reportado (avaliação de analistas)' },
      },
    ],
    videos: [
      // Add YouTube video IDs here. Renan should have more slots than the others
      // to balance his lower name recognition (per the editorial brief).
    ],
  },
]

// ─── Comparison Tables ────────────────────────────────────────────────────────

export const mandateTable: MandateRow[] = [
  {
    indicator: { en: 'External context', pt: 'Contexto externo' },
    lula1: { en: '▲ Commodity supercycle tailwind (2003–2011)', pt: '▲ Vento favorável do superciclo das commodities (2003–2011)' },
    lula3: { en: '▼ High Selic (~14%+) headwind', pt: '▼ Vento contrário da Selic alta (~14%+)' },
    bolsonaro: { en: '▼ COVID-19 pandemic (3 of 4 years)', pt: '▼ Pandemia de COVID-19 (3 dos 4 anos)' },
    renan: { en: 'N/A — no mandate', pt: 'N/D — sem mandato' },
    isContext: true,
  },
  {
    indicator: { en: 'Avg. annual GDP growth', pt: 'Crescimento médio anual do PIB' },
    lula1: { en: '~4.05% (Unicamp)', pt: '~4,05% (Unicamp)' },
    lula3: { en: '+3.4% (2024), +2.3% (2025) — IBGE', pt: '+3,4% (2024), +2,3% (2025) — IBGE' },
    bolsonaro: { en: '~1.12% avg (Unicamp): −3.3% (2020), +4.8% (2021), +3.0% (2022)', pt: '~1,12% médio (Unicamp): −3,3% (2020), +4,8% (2021), +3,0% (2022)' },
    renan: { en: 'N/A — no mandate', pt: 'N/D — sem mandato' },
  },
  {
    indicator: { en: 'Unemployment', pt: 'Desemprego' },
    lula1: { en: 'Fell substantially over period (IBGE)', pt: 'Queda expressiva ao longo do período (IBGE)' },
    lula3: { en: 'Multi-year lows; record-high employment in 2025 (IBGE PNAD)', pt: 'Mínimas históricas; recorde de pessoas empregadas em 2025 (IBGE PNAD)' },
    bolsonaro: { en: 'Peak 14.9% (early 2021, COVID) → ~8.9% (mid-2022)', pt: 'Pico de 14,9% (início de 2021, COVID) → ~8,9% (meados de 2022)' },
    renan: { en: 'N/A — no mandate', pt: 'N/D — sem mandato' },
  },
  {
    indicator: { en: 'Inflation (IPCA)', pt: 'Inflação (IPCA)' },
    lula1: { en: 'Mostly within target (~4% in good years)', pt: 'Majoritariamente dentro da meta (~4% nos bons anos)' },
    lula3: { en: 'Disinflation underway; ~3.6% projected 2026 (SPE)', pt: 'Desinflação em curso; ~3,6% projetado para 2026 (SPE/MF)' },
    bolsonaro: { en: 'Double-digit 2021 → ~6% 2022 (after fuel-tax cuts)', pt: 'Dois dígitos em 2021 → ~6% em 2022 (após cortes do IPI sobre combustíveis)' },
    renan: { en: 'N/A — no mandate', pt: 'N/D — sem mandato' },
  },
  {
    indicator: { en: 'Human Development Index', pt: 'Índice de Desenvolvimento Humano (IDH)' },
    lula1: { en: '0.669 (2000) → 0.726 (2010, UNDP)', pt: '0,669 (2000) → 0,726 (2010, PNUD)' },
    lula3: { en: '~0.76, plateaued (UNDP)', pt: '~0,76, estagnado (PNUD)' },
    bolsonaro: { en: '~0.76, flat during term (UNDP)', pt: '~0,76, estagnado no mandato (PNUD)' },
    renan: { en: 'N/A — no mandate', pt: 'N/D — sem mandato' },
  },
  {
    indicator: { en: 'Min. wage purchasing power', pt: 'Poder de compra do salário mínimo' },
    lula1: { en: '+~46% (DIEESE/Unicamp)', pt: '+~46% (DIEESE/Unicamp)' },
    lula3: { en: 'Real-gain policy resumed (ongoing)', pt: 'Política de ganho real retomada (em curso)' },
    bolsonaro: { en: '−~26% (DIEESE/Unicamp)', pt: '−~26% (DIEESE/Unicamp)' },
    renan: { en: 'N/A — no mandate', pt: 'N/D — sem mandato' },
  },
  {
    indicator: { en: 'Corporate distress (Serasa Experian)', pt: 'Estresse empresarial (Serasa Experian)' },
    lula1: { en: 'Pre-2005 law; early series', pt: 'Anterior à lei de 2005; série inicial' },
    lula3: { en: 'Record judicial reorganizations: 2,466 in 2025 (+13%); bankruptcies fell to 698 (−19%)', pt: 'Recuperações judiciais em recorde: 2.466 em 2025 (+13%); falências caíram para 698 (−19%)' },
    bolsonaro: { en: 'Bankruptcies fell for 3 consecutive years (2020–22) — pandemic credit support', pt: 'Falências caíram por 3 anos consecutivos (2020–22) — apoio de crédito pandêmico' },
    renan: { en: 'N/A — no mandate', pt: 'N/D — sem mandato' },
  },
]

export const ideologyTable: IdeologyRow[] = [
  {
    axis: { en: 'Foreign Policy', pt: 'Política Externa' },
    axisLeft: { en: 'Multilateral', pt: 'Multilateral' },
    axisRight: { en: 'Nationalist', pt: 'Nacionalista' },
    lula: { description: { en: 'Strongly multilateral (BRICS, South-South, climate mediation)', pt: 'Fortemente multilateral (BRICS, Sul-Sul, mediação climática)' }, score: -1.8 },
    flavio: { description: { en: 'Nationalist, US/conservative-international aligned (CPAC)', pt: 'Nacionalista, alinhado com EUA e conservadores internacionais (CPAC)' }, score: 1.5 },
    renan: { description: { en: 'Sovereigntist / great-power nationalist (nuclear deterrence)', pt: 'Soberanista / nacionalista de grande potência (dissuasão nuclear)' }, score: 1.6 },
  },
  {
    axis: { en: 'Rule of Law', pt: 'Estado de Direito' },
    axisLeft: { en: 'Institutionalist', pt: 'Institucionalista' },
    axisRight: { en: 'Authoritarian tendencies', pt: 'Tendências autoritárias' },
    lula: { description: { en: 'Institutionalist in rhetoric; critics cite court-friendly alliances and IBGE independence concern', pt: 'Institucionalista no discurso; críticos apontam alianças com o Judiciário e preocupação com a independência do IBGE' }, score: -0.5 },
    flavio: { description: { en: 'Authoritarian-leaning signals: election "monitoring" call, coup amnesty pledge, father\'s anti-democratic record', pt: 'Sinais de tendência autoritária: pedido de "monitoramento" eleitoral, promessa de anistia por golpe, histórico antidemocrático do pai' }, score: 1.5 },
    renan: { description: { en: 'Anti-system/hardline: "arrest or kill" faction leaders, mass incarceration model, constitution modification proposals', pt: 'Antissistema/radical: "prender ou matar" lideranças de facções, modelo de encarceramento em massa, propostas de modificação constitucional' }, score: 1.8 },
  },
  {
    axis: { en: 'Environment', pt: 'Meio Ambiente' },
    axisLeft: { en: 'Green', pt: 'Verde' },
    axisRight: { en: 'Extractivist', pt: 'Extrativista' },
    lula: { description: { en: 'Green-leaning (Amazon enforcement, COP30 host) with oil tension (Margem Equatorial)', pt: 'Tendência verde (fiscalização da Amazônia, anfitrião da COP30) com tensão sobre petróleo (Margem Equatorial)' }, score: -1.0 },
    flavio: { description: { en: 'Extractivist (Margem Equatorial oil; criticizes "ideological" environmental licensing)', pt: 'Extrativista (petróleo na Margem Equatorial; critica licenciamento ambiental "ideológico")' }, score: 1.5 },
    renan: { description: { en: '"Econacionalismo" — growth-first with clean-energy self-sufficiency framing; extractivist in practice', pt: '"Econacionalismo" — crescimento em primeiro lugar com enquadramento de autossuficiência em energia limpa; extrativista na prática' }, score: 1.3 },
  },
]

export const competenceTable: CompetenceRow[] = [
  {
    dimension: { en: 'Executive experience', pt: 'Experiência executiva' },
    lula: { assessment: { en: 'Very high — 3 presidential terms, 80 years old', pt: 'Muito alta — 3 mandatos presidenciais, 80 anos' }, level: 'high' },
    flavio: { assessment: { en: 'None — legislative only; would rely on father\'s network', pt: 'Nenhuma — apenas legislativa; dependeria da rede do pai' }, level: 'na' },
    renan: { assessment: { en: 'None — never held elected office', pt: 'Nenhuma — nunca ocupou cargo eletivo' }, level: 'na' },
  },
  {
    dimension: { en: 'Crisis management', pt: 'Gestão de crises' },
    lula: { assessment: { en: 'Poor — fumbled the 2008 global financial crisis (slower response than peers; subsequent credit expansion built structural vulnerabilities); 3rd-term fiscal/FX crisis management widely criticized', pt: 'Fraca — mal administrou a crise financeira global de 2008 (resposta mais lenta que outros países; a expansão de crédito subsequente criou vulnerabilidades estruturais); gestão das crises fiscal e cambial no 3º mandato amplamente criticada' }, level: 'low' },
    flavio: { assessment: { en: 'Untested as executive; father\'s COVID crisis management was criticized', pt: 'Não testada como executivo; gestão da crise do COVID pelo pai foi criticada' }, level: 'na' },
    renan: { assessment: { en: 'Untested — no governing record of any kind', pt: 'Não testada — sem histórico de governo de qualquer tipo' }, level: 'na' },
  },
  {
    dimension: { en: 'Legislative effectiveness', pt: 'Eficácia legislativa' },
    lula: { assessment: { en: 'High historically — built broad coalition governments; tax and fiscal reform in 3rd term', pt: 'Alta historicamente — construiu governos de coalizão ampla; reforma fiscal e tributária no 3º mandato' }, level: 'high' },
    flavio: { assessment: { en: 'Low — only 2 co-authored measures enacted as senator (Folha/Estado de Minas)', pt: 'Baixa — apenas 2 medidas coautoras sancionadas como senador (Folha/Estado de Minas)' }, level: 'low' },
    renan: { assessment: { en: 'N/A — no legislative seat; Missão has 1 federal deputy', pt: 'N/D — sem mandato legislativo; o Missão tem 1 deputado federal' }, level: 'na' },
  },
  {
    dimension: { en: 'Team quality', pt: 'Qualidade da equipe' },
    lula: { assessment: { en: 'Poor — Haddad appointed Finance Minister despite not being an economist (background in political science/education policy); Pochmann at IBGE raised institutional independence concerns; Master affair tainted key allies (Mantega, Wagner)', pt: 'Fraca — Haddad nomeado ministro da Fazenda apesar de não ser economista (formação em ciências políticas/política educacional); Pochmann no IBGE levantou preocupações de independência institucional; caso Master manchou aliados-chave (Mantega, Wagner)' }, level: 'low' },
    flavio: { assessment: { en: 'Thin; promises a "technical" team; heavily family-centric (Eduardo, Carlos, Michelle)', pt: 'Pouco estruturada; promete equipe "técnica"; fortemente centrada na família (Eduardo, Carlos, Michelle)' }, level: 'low' },
    renan: { assessment: { en: 'Small MBL cadre; no governing bench or proven technocrats', pt: 'Pequeno quadro do MBL; sem bancada de governo ou tecnocratas comprovados' }, level: 'low' },
  },
  {
    dimension: { en: 'Communication & public trust', pt: 'Comunicação e confiança pública' },
    lula: { assessment: { en: 'Strong communicator and coalition builder; ~53% rejection rate (Quaest)', pt: 'Forte comunicador e articulador de coalizões; ~53% de rejeição (Quaest)' }, level: 'medium' },
    flavio: { assessment: { en: 'Strong with his base; ~54% rejection rate (Quaest)', pt: 'Forte com sua base; ~54% de rejeição (Quaest)' }, level: 'medium' },
    renan: { assessment: { en: 'Strong organic social media (~5.11% Instagram engagement, Blade/Investidor10); dominant with youth — ~24% first-round support among 16–24-year-olds (AtlasIntel/Crusoé); ~74% didn\'t know him; only ~19% rejection (Quaest)', pt: 'Forte engajamento orgânico em redes sociais (~5,11% no Instagram, Blade/Investidor10); dominante entre jovens — ~24% de intenção de voto no 1º turno entre 16–24 anos (AtlasIntel/Crusoé); ~74% não o conheciam; apenas ~19% de rejeição (Quaest)' }, level: 'medium' },
  },
]

// ─── Methodology ─────────────────────────────────────────────────────────────

export const methodology = {
  en: `Proposal-likelihood ratings (HIGH / MEDIUM / LOW) were assigned by triangulating four criteria: (1) track record — has the candidate or movement delivered similar policy before; (2) stated commitment and specificity — vague or early-stage proposals are rated lower; (3) political feasibility — control of the relevant lever (executive vs. state-led security vs. constitutional supermajorities) and the composition of a conservative Congress; and (4) comparative real-world precedent — where an analogous program has been implemented abroad (Bukele on security, Milei on macro-stabilization), the plausibility of pursuit and partial delivery is raised, but only to the extent the enabling conditions (above all a legislative majority) are reproducible in Brazil. Because Missão has essentially no congressional bench, the precedent raises Renan's security and economy ratings modestly rather than to HIGH. These ratings are interpretive judgments, not forecasts.

Competence and positioning were assessed against the documented record only: executive experience by time in office; legislative effectiveness by enacted-law conversion; crisis management by observed performance; team quality by known advisor and minister profiles; and public trust by cross-pollster rejection rates (Quaest). Renan Santos is marked N/A where no governing record exists — a deliberate refusal to manufacture an assessment from absence of data.

Sources and limitations: Economic figures draw on IBGE, World Bank, IMF, UNDP, Banco Central, Ipea, the Finance Ministry's SPE, and Serasa Experian, supplemented by academic analysis from Unicamp's Institute of Economics (left-of-center, noted). Legal facts rely on STF, STJ, Senado archives and legal press. Polling uses multiple pollsters cross-checked for method (online vs. in-home). All contested claims are labeled [CONFIRMED] (court ruling or official finding) or [ALLEGED] (credibly reported, not court-confirmed). Outlet political leanings are disclosed on contested claims. Two structural limitations apply: Flávio's candidacy and platform are not yet finalized; and Renan Santos's public record is thin and partly drawn from profile journalism. This page was last updated May 30, 2026.`,

  pt: `As classificações de probabilidade de implementação das propostas (ALTA / MÉDIA / BAIXA) foram atribuídas pela triangulação de quatro critérios: (1) histórico — o candidato ou movimento já entregou política semelhante antes; (2) comprometimento declarado e especificidade — propostas vagas ou em estágio inicial recebem classificação mais baixa; (3) viabilidade política — controle do instrumento relevante (executivo vs. segurança de responsabilidade estadual vs. maioria qualificada constitucional) e a composição de um Congresso conservador; e (4) precedente comparativo real — onde programa análogo foi implementado no exterior (Bukele em segurança, Milei em estabilização macro), a plausibilidade de perseguir e entregar parcialmente é elevada, mas apenas na medida em que as condições habilitadoras (sobretudo maioria parlamentar) sejam reproduzíveis no Brasil. Como o Missão praticamente não tem bancada no Congresso, o precedente eleva as classificações de Renan em segurança e economia modestamente, não para ALTA. Essas classificações são julgamentos interpretativos, não previsões.

Competência e posicionamento foram avaliados exclusivamente com base no registro documentado: experiência executiva por tempo no cargo; eficácia legislativa pela taxa de conversão em leis; gestão de crises pelo desempenho observado; qualidade da equipe pelo perfil de assessores e ministros conhecidos; e confiança pública pelas taxas de rejeição em múltiplos institutos (Quaest). Renan Santos recebe N/D onde não há histórico de governo — recusa deliberada de fabricar uma avaliação a partir da ausência de dados.

Fontes e limitações: os dados econômicos provêm de IBGE, Banco Mundial, FMI, PNUD, Banco Central, Ipea, SPE do Ministério da Fazenda e Serasa Experian, complementados por análises acadêmicas do Instituto de Economia da Unicamp (centro-esquerda, anotado). Os fatos jurídicos baseiam-se nos arquivos do STF, STJ, Senado e na imprensa especializada. As pesquisas utilizaram múltiplos institutos comparados por metodologia (online vs. domiciliar). Todas as afirmações contestadas são rotuladas como [CONFIRMADO] (decisão judicial ou apuração oficial) ou [ALEGADO] (relatado com credibilidade, não confirmado judicialmente). O posicionamento político dos veículos é divulgado nas afirmações contestadas. Duas limitações estruturais se aplicam: a candidatura e a plataforma de Flávio ainda não estão finalizadas; e o registro público de Renan Santos é escasso e parcialmente baseado em jornalismo de perfil. Esta página foi atualizada em 30 de maio de 2026.`,
} as BL

// ── Credit default series (BCB SGS 21082) ────────────────────────────────────

export interface DefaultDataPoint {
  date: string  // "YYYY-MM"
  value: number
}

export const creditDefaultSeries: DefaultDataPoint[] = [
  { date: '2011-03', value: 3.17 },
  { date: '2011-04', value: 3.24 },
  { date: '2011-05', value: 3.37 },
  { date: '2011-06', value: 3.32 },
  { date: '2011-07', value: 3.42 },
  { date: '2011-08', value: 3.45 },
  { date: '2011-09', value: 3.46 },
  { date: '2011-10', value: 3.58 },
  { date: '2011-11', value: 3.58 },
  { date: '2011-12', value: 3.54 },
  { date: '2012-01', value: 3.66 },
  { date: '2012-02', value: 3.71 },
  { date: '2012-03', value: 3.67 },
  { date: '2012-04', value: 3.76 },
  { date: '2012-05', value: 3.76 },
  { date: '2012-06', value: 3.71 },
  { date: '2012-07', value: 3.72 },
  { date: '2012-08', value: 3.75 },
  { date: '2012-09', value: 3.72 },
  { date: '2012-10', value: 3.76 },
  { date: '2012-11', value: 3.67 },
  { date: '2012-12', value: 3.55 },
  { date: '2013-01', value: 3.54 },
  { date: '2013-02', value: 3.51 },
  { date: '2013-03', value: 3.45 },
  { date: '2013-04', value: 3.47 },
  { date: '2013-05', value: 3.47 },
  { date: '2013-06', value: 3.25 },
  { date: '2013-07', value: 3.21 },
  { date: '2013-08', value: 3.13 },
  { date: '2013-09', value: 3.14 },
  { date: '2013-10', value: 3.06 },
  { date: '2013-11', value: 2.97 },
  { date: '2013-12', value: 2.86 },
  { date: '2014-01', value: 2.84 },
  { date: '2014-02', value: 2.86 },
  { date: '2014-03', value: 2.88 },
  { date: '2014-04', value: 2.92 },
  { date: '2014-05', value: 3.0 },
  { date: '2014-06', value: 2.9 },
  { date: '2014-07', value: 2.96 },
  { date: '2014-08', value: 2.98 },
  { date: '2014-09', value: 2.91 },
  { date: '2014-10', value: 2.96 },
  { date: '2014-11', value: 2.85 },
  { date: '2014-12', value: 2.73 },
  { date: '2015-01', value: 2.82 },
  { date: '2015-02', value: 2.85 },
  { date: '2015-03', value: 2.82 },
  { date: '2015-04', value: 2.96 },
  { date: '2015-05', value: 3.02 },
  { date: '2015-06', value: 2.92 },
  { date: '2015-07', value: 3.03 },
  { date: '2015-08', value: 3.12 },
  { date: '2015-09', value: 3.12 },
  { date: '2015-10', value: 3.24 },
  { date: '2015-11', value: 3.38 },
  { date: '2015-12', value: 3.37 },
  { date: '2016-01', value: 3.47 },
  { date: '2016-02', value: 3.5 },
  { date: '2016-03', value: 3.53 },
  { date: '2016-04', value: 3.65 },
  { date: '2016-05', value: 3.73 },
  { date: '2016-06', value: 3.51 },
  { date: '2016-07', value: 3.56 },
  { date: '2016-08', value: 3.64 },
  { date: '2016-09', value: 3.68 },
  { date: '2016-10', value: 3.84 },
  { date: '2016-11', value: 3.8 },
  { date: '2016-12', value: 3.7 },
  { date: '2017-01', value: 3.73 },
  { date: '2017-02', value: 3.75 },
  { date: '2017-03', value: 3.85 },
  { date: '2017-04', value: 3.93 },
  { date: '2017-05', value: 4.04 },
  { date: '2017-06', value: 3.73 },
  { date: '2017-07', value: 3.69 },
  { date: '2017-08', value: 3.7 },
  { date: '2017-09', value: 3.6 },
  { date: '2017-10', value: 3.63 },
  { date: '2017-11', value: 3.54 },
  { date: '2017-12', value: 3.24 },
  { date: '2018-01', value: 3.42 },
  { date: '2018-02', value: 3.43 },
  { date: '2018-03', value: 3.29 },
  { date: '2018-04', value: 3.32 },
  { date: '2018-05', value: 3.3 },
  { date: '2018-06', value: 3.04 },
  { date: '2018-07', value: 3.02 },
  { date: '2018-08', value: 3.04 },
  { date: '2018-09', value: 3.04 },
  { date: '2018-10', value: 3.05 },
  { date: '2018-11', value: 2.96 },
  { date: '2018-12', value: 2.87 },
  { date: '2019-01', value: 2.95 },
  { date: '2019-02', value: 2.91 },
  { date: '2019-03', value: 2.99 },
  { date: '2019-04', value: 3.02 },
  { date: '2019-05', value: 3.05 },
  { date: '2019-06', value: 2.95 },
  { date: '2019-07', value: 3.06 },
  { date: '2019-08', value: 3.04 },
  { date: '2019-09', value: 3.06 },
  { date: '2019-10', value: 3.03 },
  { date: '2019-11', value: 3.0 },
  { date: '2019-12', value: 2.94 },
  { date: '2020-01', value: 3.0 },
  { date: '2020-02', value: 3.04 },
  { date: '2020-03', value: 3.18 },
  { date: '2020-04', value: 3.29 },
  { date: '2020-05', value: 3.24 },
  { date: '2020-06', value: 2.89 },
  { date: '2020-07', value: 2.76 },
  { date: '2020-08', value: 2.65 },
  { date: '2020-09', value: 2.43 },
  { date: '2020-10', value: 2.35 },
  { date: '2020-11', value: 2.23 },
  { date: '2020-12', value: 2.11 },
  { date: '2021-01', value: 2.14 },
  { date: '2021-02', value: 2.23 },
  { date: '2021-03', value: 2.13 },
  { date: '2021-04', value: 2.19 },
  { date: '2021-05', value: 2.33 },
  { date: '2021-06', value: 2.27 },
  { date: '2021-07', value: 2.31 },
  { date: '2021-08', value: 2.31 },
  { date: '2021-09', value: 2.28 },
  { date: '2021-10', value: 2.28 },
  { date: '2021-11', value: 2.31 },
  { date: '2021-12', value: 2.3 },
  { date: '2022-01', value: 2.45 },
  { date: '2022-02', value: 2.51 },
  { date: '2022-03', value: 2.59 },
  { date: '2022-04', value: 2.66 },
  { date: '2022-05', value: 2.72 },
  { date: '2022-06', value: 2.66 },
  { date: '2022-07', value: 2.77 },
  { date: '2022-08', value: 2.83 },
  { date: '2022-09', value: 2.85 },
  { date: '2022-10', value: 2.96 },
  { date: '2022-11', value: 2.99 },
  { date: '2022-12', value: 2.99 },
  { date: '2023-01', value: 3.15 },
  { date: '2023-02', value: 3.27 },
  { date: '2023-03', value: 3.26 },
  { date: '2023-04', value: 3.45 },
  { date: '2023-05', value: 3.55 },
  { date: '2023-06', value: 3.51 },
  { date: '2023-07', value: 3.54 },
  { date: '2023-08', value: 3.51 },
  { date: '2023-09', value: 3.44 },
  { date: '2023-10', value: 3.46 },
  { date: '2023-11', value: 3.43 },
  { date: '2023-12', value: 3.18 },
  { date: '2024-01', value: 3.26 },
  { date: '2024-02', value: 3.26 },
  { date: '2024-03', value: 3.2 },
  { date: '2024-04', value: 3.24 },
  { date: '2024-05', value: 3.26 },
  { date: '2024-06', value: 3.17 },
  { date: '2024-07', value: 3.17 },
  { date: '2024-08', value: 3.21 },
  { date: '2024-09', value: 3.22 },
  { date: '2024-10', value: 3.17 },
  { date: '2024-11', value: 3.14 },
  { date: '2024-12', value: 2.95 },
  { date: '2025-01', value: 3.19 },
  { date: '2025-02', value: 3.26 },
  { date: '2025-03', value: 3.28 },
  { date: '2025-04', value: 3.5 },
  { date: '2025-05', value: 3.54 },
  { date: '2025-06', value: 3.57 },
  { date: '2025-07', value: 3.77 },
  { date: '2025-08', value: 3.95 },
  { date: '2025-09', value: 3.91 },
  { date: '2025-10', value: 4.0 },
  { date: '2025-11', value: 4.05 },
  { date: '2025-12', value: 4.02 },
  { date: '2026-01', value: 4.26 },
  { date: '2026-02', value: 4.44 },
  { date: '2026-03', value: 4.33 },
  { date: '2026-04', value: 4.44 }
]

export interface GovPeriod {
  id: string
  label: BL
  start: string  // "YYYY-MM"
  end: string
  color: string
}

export const govPeriods: GovPeriod[] = [
  {
    id: 'dilma',
    label: { en: 'Dilma (PT)', pt: 'Dilma (PT)' },
    start: '2011-03', end: '2016-08',
    color: 'rgba(181,43,39,0.09)',
  },
  {
    id: 'temer',
    label: { en: 'Temer (MDB)', pt: 'Temer (MDB)' },
    start: '2016-09', end: '2018-12',
    color: 'rgba(90,90,90,0.07)',
  },
  {
    id: 'bolsonaro',
    label: { en: 'Bolsonaro (PL)', pt: 'Bolsonaro (PL)' },
    start: '2019-01', end: '2022-12',
    color: 'rgba(26,53,96,0.09)',
  },
  {
    id: 'lula3',
    label: { en: 'Lula 3 (PT)', pt: 'Lula 3 (PT)' },
    start: '2023-01', end: '2026-04',
    color: 'rgba(181,43,39,0.07)',
  },
]
