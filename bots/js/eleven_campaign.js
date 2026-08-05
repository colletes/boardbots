function currentCampaignLang() {
    return localStorage.getItem('boardbots_lang') || 'pt';
}

async function fetchTeamData(teamName) {
    const wiki = currentCampaignLang() === 'en' ? 'en' : 'pt';
    const url = `https://${wiki}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(teamName)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data; // { extract, title, thumbnail }
    } catch (e) {
        console.error("Wikipedia fetch error", e);
        return null;
    }
}

// Same idea as fetchTeamData, but sources the summary from the LEAGUE's own
// Wikipedia page instead of a club page. Used when the user plays with a
// custom/fictional team name, so the campaign's "real facts" grounding falls
// back to real news/history about the league itself.
async function fetchLeagueData(league, division) {
    const wiki = currentCampaignLang() === 'en' ? 'en' : 'pt';
    const titles = (LEAGUE_PAGES[league] || {})[division];
    if (!titles) return null;
    const title = titles[wiki] || titles.en;
    const url = `https://${wiki}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (e) {
        console.error("Wikipedia fetch error", e);
        return null;
    }
}

// Splits a Wikipedia extract into individual sentences, so each chapter of a
// multi-chapter campaign can surface a DIFFERENT real fact about the team
// instead of always repeating the same truncated opening blurb.
function splitSentences(text) {
    if (!text) return [];
    return text
        .replace(/\s+/g, ' ')
        .split(/(?<=[.!?])\s+(?=[A-ZÀ-Ý0-9])/)
        .map(s => s.trim())
        .filter(s => s.length > 12);
}

const CAMPAIGN_UI = {
    pt: {
        alertNoTeam: 'Por favor, escolha ou informe o nome de um time.',
        chapter: 'CAPÍTULO', league: 'Liga', division: 'Divisão',
        goalsTitle: 'OBJETIVOS DA TEMPORADA',
        directive: 'A Diretoria exige que você:', bonus: 'Bônus se você:',
        setupTitle: 'MUDANÇAS DE SETUP', resultTitle: 'RESULTADO DO CENÁRIO',
        resultComplete: 'Se você completou os objetivos exigidos, avance para o próximo capítulo!',
        resultPromote: 'Se terminar em 1º ou 2º, você pode subir para a Divisão',
        resultFail: 'Se falhou, você foi demitido. Recomece o capítulo ou a campanha.',
        continuityNote: 'Continuidade: se esta campanha não for jogada em sequência direta, anote o estado do seu clube (posição na liga, elenco, infraestrutura) ao final de cada capítulo para retomar depois.',
        pdfFilename: 'Eleven_Campanha.pdf'
    },
    en: {
        alertNoTeam: 'Please choose or enter a team name.',
        chapter: 'CHAPTER', league: 'League', division: 'Division',
        goalsTitle: 'SEASON OBJECTIVES',
        directive: 'The Board demands that you:', bonus: 'Bonus if you:',
        setupTitle: 'SETUP CHANGES', resultTitle: 'SCENARIO OUTCOME',
        resultComplete: 'If you completed the required objectives, advance to the next chapter!',
        resultPromote: 'If you finish 1st or 2nd, you may move up to Division',
        resultFail: 'If you failed, you were fired. Restart the chapter or the campaign.',
        continuityNote: 'Continuity: if this campaign isn\'t played back-to-back, jot down your club\'s state (league position, squad, infrastructure) at the end of each chapter so you can pick it back up later.',
        pdfFilename: 'Eleven_Campaign.pdf'
    }
};

// ---- Team selection ----------------------------------------------------
// Curated real-club lists per league & division, so the user can pick a real
// team from a dropdown instead of typing a name (which risked typos that
// would silently break the Wikipedia lookup). A "custom team" option is
// always appended, which reveals a free-text input for fictional/renamed
// clubs — those fall back to league-level Wikipedia grounding instead of a
// club summary (see fetchLeagueData / generateCampaign).
const TEAM_DATA = {
    england: {
        1: ['Manchester City', 'Arsenal F.C.', 'Liverpool F.C.', 'Chelsea F.C.', 'Manchester United F.C.', 'Tottenham Hotspur F.C.', 'Newcastle United F.C.', 'Aston Villa F.C.', 'Brighton & Hove Albion F.C.', 'West Ham United F.C.', 'Everton F.C.', 'Wolverhampton Wanderers F.C.'],
        2: ['Leeds United F.C.', 'Sunderland A.F.C.', 'Norwich City F.C.', 'West Bromwich Albion F.C.', 'Middlesbrough F.C.', 'Sheffield United F.C.', 'Watford F.C.', 'Coventry City F.C.', 'Preston North End F.C.', 'Hull City A.F.C.'],
        3: ['Bolton Wanderers F.C.', 'Portsmouth F.C.', 'Barnsley F.C.', 'Peterborough United F.C.', 'Wycombe Wanderers F.C.', 'Blackpool F.C.', 'Charlton Athletic F.C.', 'Exeter City F.C.', 'Oxford United F.C.', 'Reading F.C.']
    },
    spain: {
        1: ['Real Madrid CF', 'FC Barcelona', 'Atlético Madrid', 'Sevilla FC', 'Valencia CF', 'Real Sociedad', 'Athletic Bilbao', 'Villarreal CF', 'Real Betis', 'Girona FC'],
        2: ['Racing de Santander', 'Real Sporting de Gijón', 'Real Zaragoza', 'SD Eibar', 'Levante UD', 'UD Almería', 'Málaga CF', 'Deportivo de La Coruña'],
        3: ['CD Tenerife', 'Real Murcia', 'UD Ibiza', 'FC Barcelona Atlètic', 'Real Madrid Castilla', 'Sevilla Atlético']
    },
    france: {
        1: ['Paris Saint-Germain F.C.', 'Olympique de Marseille', 'Olympique Lyonnais', 'AS Monaco FC', 'LOSC Lille', 'OGC Nice', 'Stade Rennais F.C.', 'RC Lens', 'Stade de Reims', 'RC Strasbourg Alsace'],
        2: ['FC Girondins de Bordeaux', 'AS Saint-Étienne', 'Amiens SC', 'EA Guingamp', 'FC Metz', 'AC Ajaccio', 'Grenoble Foot 38', 'Rodez AF'],
        3: ['Le Mans FC', 'US Boulogne', 'SC Bastia', 'FC Villefranche Beaujolais', 'FC Martigues']
    },
    brazil: {
        1: ['Flamengo', 'Palmeiras', 'Sport Club Corinthians Paulista', 'São Paulo FC', 'Grêmio', 'Internacional', 'Santos FC', 'Atlético Mineiro', 'Cruzeiro', 'Fluminense', 'Botafogo', 'Vasco da Gama'],
        2: ['Sport Club do Recife', 'Vila Nova FC', 'Ceará SC', 'Guarani FC', 'Coritiba FC', 'Ituano FC', 'Novorizontino', 'Avaí FC'],
        3: ['ABC FC', 'Confiança', 'Botafogo-PB', 'Ferroviária', 'São Bernardo FC', 'Volta Redonda FC']
    }
};

// League-level Wikipedia page titles (per language) used as the fallback
// "real facts" source when the user plays with a custom/fictional team.
const LEAGUE_PAGES = {
    england: {
        1: { pt: 'Premier League', en: 'Premier League' },
        2: { pt: 'EFL Championship', en: 'EFL Championship' },
        3: { pt: 'EFL League One', en: 'EFL League One' }
    },
    spain: {
        1: { pt: 'La Liga', en: 'La Liga' },
        2: { pt: 'Segunda División', en: 'Segunda División' },
        3: { pt: 'Primera Federación', en: 'Primera Federación' }
    },
    france: {
        1: { pt: 'Ligue 1', en: 'Ligue 1' },
        2: { pt: 'Ligue 2', en: 'Ligue 2' },
        3: { pt: 'Championnat National', en: 'Championnat National' }
    },
    brazil: {
        1: { pt: 'Campeonato Brasileiro de Futebol – Série A', en: 'Campeonato Brasileiro Série A' },
        2: { pt: 'Campeonato Brasileiro de Futebol – Série B', en: 'Campeonato Brasileiro Série B' },
        3: { pt: 'Campeonato Brasileiro de Futebol – Série C', en: 'Campeonato Brasileiro Série C' }
    }
};

const CUSTOM_TEAM_VALUE = '__custom__';

// Rebuilds the #camp-team-select <option> list from TEAM_DATA for the
// currently chosen league/division, appending the localized "Custom team..."
// option. When `preserveSelection` is true (e.g. on a language switch), it
// tries to keep whichever option was already selected.
function populateTeamSelect(preserveSelection) {
    const select = document.getElementById('camp-team-select');
    if (!select) return;
    const lang = currentCampaignLang();
    const leagueEl = document.getElementById('camp-league');
    const divisionEl = document.getElementById('camp-division');
    const league = leagueEl ? leagueEl.value : 'england';
    const division = divisionEl ? divisionEl.value : '1';
    const previous = preserveSelection ? select.value : null;

    const teams = (TEAM_DATA[league] || {})[division] || [];
    const customLabel = (typeof I18N !== 'undefined' && I18N[lang] && I18N[lang].optCustomTeam)
        ? I18N[lang].optCustomTeam
        : (lang === 'en' ? 'Custom team...' : 'Time personalizado...');
    select.innerHTML = teams.map(name => `<option value="${name}">${name}</option>`).join('')
        + `<option value="${CUSTOM_TEAM_VALUE}">${customLabel}</option>`;

    if (previous && (teams.includes(previous) || previous === CUSTOM_TEAM_VALUE)) {
        select.value = previous;
    } else {
        select.value = teams[0] || CUSTOM_TEAM_VALUE;
    }
    onTeamSelectChange();
}

function onLeagueOrDivisionChange() {
    populateTeamSelect(false);
}

function onTeamSelectChange() {
    const select = document.getElementById('camp-team-select');
    const customInput = document.getElementById('camp-team');
    const hint = document.getElementById('camp-custom-hint');
    if (!select || !customInput) return;
    const isCustom = select.value === CUSTOM_TEAM_VALUE;
    customInput.classList.toggle('hidden', !isCustom);
    if (hint) hint.classList.toggle('hidden', !isCustom);
    if (isCustom) customInput.focus();
}

function isCustomTeamSelected() {
    const select = document.getElementById('camp-team-select');
    return !select || select.value === CUSTOM_TEAM_VALUE;
}

function getSelectedTeamName() {
    if (isCustomTeamSelected()) {
        return document.getElementById('camp-team').value.trim();
    }
    return document.getElementById('camp-team-select').value;
}

// Picks a numeric threshold that scales with the chosen difficulty.
function pickNum(difficulty, easy, medium, hard) {
    return ({ easy, medium, hard })[difficulty] ?? medium;
}

// ---- Story Arcs ------------------------------------------------------
// Each arc is now a single continuous throughline (a `stages` array of 3
// beginning/middle/end beats) told across the WHOLE campaign, instead of a
// flat one-shot intro that got independently re-rolled every chapter. That
// re-rolling was the root cause of narrative incoherence (e.g. chapter 1
// implying the manager is about to retire, chapter 2 implying they've just
// arrived) — now exactly ONE arc is chosen per campaign (see
// generateCampaign), and each chapter narrates the next stage of that same
// arc, so the story always progresses coherently from start to finish.
const STORY_ARCS = [
    {
        id: 'homecoming',
        pt: {
            title: 'Primeiro Amor',
            stages: [
                { label: 'A Volta', text: 'Você voltou para casa. {team} é o clube da sua infância, e a torcida ainda lembra do seu nome. {fact} Agora começa sua primeira temporada no comando — mostre que valeu a pena te trazer de volta.' },
                { label: 'Ganhando Confiança', text: 'Uma temporada já se passou desde que você assumiu o {team}, e aos poucos a torcida começa a confiar no seu trabalho. {fact} É hora de consolidar as mudanças que você começou e provar que não foi sorte.' },
                { label: 'Legado', text: 'Chegou a temporada decisiva da sua passagem pelo {team} nesta história. {fact} É hora de decidir que tipo de legado você deixará para o clube que te viu crescer.' }
            ]
        },
        en: {
            title: 'First Love',
            stages: [
                { label: 'The Return', text: 'You have come home. {team} is the club of your childhood, and the fans still remember your name. {fact} Now begins your first season in charge — show that bringing you back was worth it.' },
                { label: 'Earning Trust', text: 'A season has passed since you took charge of {team}, and the fans are slowly starting to trust your work. {fact} It is time to consolidate the changes you started and prove it wasn\'t just luck.' },
                { label: 'Legacy', text: 'This is the decisive season of your time at {team} in this story. {fact} It is time to decide what kind of legacy you will leave for the club that saw you grow up.' }
            ]
        }
    },
    {
        id: 'crisis',
        pt: {
            title: 'Tempos de Crise',
            stages: [
                { label: 'O Colapso', text: '{team} acaba de perder seu principal patrocinador, e as contas simplesmente não fecham. {fact} Você assume o comando em meio ao caos, com a missão de estancar a sangria financeira.' },
                { label: 'Reconstrução', text: 'Depois de uma temporada de cortes e sacrifícios, o {team} começa a enxergar luz no fim do túnel. {fact} Mas a diretoria ainda cobra resultados rápidos para justificar a paciência que teve com você.' },
                { label: 'Superação', text: 'É a temporada que vai definir se a crise no {team} ficou para trás de vez. {fact} Prove que o clube saiu mais forte da tempestade que você ajudou a atravessar.' }
            ]
        },
        en: {
            title: 'Times of Crisis',
            stages: [
                { label: 'The Collapse', text: '{team} has just lost its main sponsor, and the books simply don\'t balance. {fact} You take charge amid the chaos, tasked with stopping the financial bleeding.' },
                { label: 'Rebuilding', text: 'After a season of cuts and sacrifices, {team} starts to see light at the end of the tunnel. {fact} But the board still demands quick results to justify the patience it has shown you.' },
                { label: 'Turnaround', text: 'This is the season that will decide whether the crisis at {team} is truly behind it. {fact} Prove the club came out stronger from the storm you helped it weather.' }
            ]
        }
    },
    {
        id: 'glory',
        pt: {
            title: 'A Caminho da Glória',
            stages: [
                { label: 'O Investimento', text: 'Os torcedores do {team} estão empolgados como há anos não se via, e a diretoria acabou de liberar fundos para investir pesado. {fact} Só que o dinheiro vem acompanhado de uma cobrança implacável por resultados imediatos.' },
                { label: 'Subindo de Patamar', text: 'O projeto vencedor do {team} está em andamento, e as expectativas só aumentaram desde a temporada passada. {fact} Chegou a hora de transformar o investimento em títulos de verdade.' },
                { label: 'O Ápice', text: 'Esta é a temporada que pode coroar todo o trabalho feito no {team} desde que o projeto começou. {fact} A torcida sonha com a glória máxima — não a decepcione agora.' }
            ]
        },
        en: {
            title: 'On the Road to Glory',
            stages: [
                { label: 'The Investment', text: 'Fans of {team} haven\'t been this excited in years, and the board has just released funds to invest heavily. {fact} But the money comes with a relentless demand for immediate results.' },
                { label: 'Stepping Up', text: 'The winning project at {team} is underway, and expectations have only grown since last season. {fact} It\'s time to turn that investment into real silverware.' },
                { label: 'The Peak', text: 'This is the season that can crown all the work done at {team} since the project began. {fact} The fans dream of ultimate glory — don\'t disappoint them now.' }
            ]
        }
    },
    {
        id: 'boardroom',
        pt: {
            title: 'Novos Donos, Novas Regras',
            stages: [
                { label: 'A Chegada', text: 'Um novo grupo investidor acabou de assumir o comando do {team}. {fact} Eles falam em "projeto vencedor" e não têm paciência para desculpas — e você é a primeira contratação dessa nova era.' },
                { label: 'Sob Pressão', text: 'Os novos donos do {team} já perceberam que reconstruir um clube leva tempo, mas a paciência deles está se esgotando. {fact} Esta temporada precisa mostrar progresso real, ou seu contrato pode não ser renovado.' },
                { label: 'Resultados ou Saída', text: 'Chegou a temporada da verdade para você e para os novos donos do {team}. {fact} Prove que a visão deles sobre o clube — e a confiança que depositaram em você — foi a escolha certa.' }
            ]
        },
        en: {
            title: 'New Owners, New Rules',
            stages: [
                { label: 'The Takeover', text: 'A new ownership group has just taken over {team}. {fact} They talk of a "winning project" and have no patience for excuses — and you are the first hire of this new era.' },
                { label: 'Under Pressure', text: 'The new owners at {team} have already realized rebuilding a club takes time, but their patience is running out. {fact} This season needs to show real progress, or your contract may not be renewed.' },
                { label: 'Results or the Door', text: 'The season of truth has arrived for you and {team}\'s new owners. {fact} Prove that their vision for the club — and the trust they placed in you — was the right choice.' }
            ]
        }
    },
    {
        id: 'academy',
        pt: {
            title: 'A Base do Futuro',
            stages: [
                { label: 'Plantando Sementes', text: 'A diretoria do {team} decidiu apostar nas categorias de base para reduzir gastos e criar uma identidade própria. {fact} Cabe a você começar a transformar Youngsters promissores em peças do time principal.' },
                { label: 'Colhendo Frutos', text: 'Os primeiros Youngsters promovidos no {team} já começam a mostrar serviço no time principal. {fact} É hora de aprofundar a aposta na base e provar que o projeto de formação é sustentável.' },
                { label: 'A Nova Geração', text: 'Chegou a temporada em que a nova geração do {team}, formada nas categorias de base, precisa assumir de vez o protagonismo. {fact} Mostre que apostar nos próprios jogadores foi a decisão certa.' }
            ]
        },
        en: {
            title: 'The Future Starts Here',
            stages: [
                { label: 'Planting Seeds', text: 'The board at {team} has decided to invest in the youth academy to cut costs and build its own identity. {fact} It\'s up to you to start turning promising Youngsters into first-team players.' },
                { label: 'Reaping Rewards', text: 'The first Youngsters promoted at {team} are already starting to show up in the first team. {fact} It\'s time to deepen the investment in the academy and prove the project is sustainable.' },
                { label: 'The New Generation', text: 'This is the season when {team}\'s new generation, forged in the academy, must finally take center stage. {fact} Show that betting on your own players was the right call.' }
            ]
        }
    },
    {
        id: 'departure',
        pt: {
            title: 'O Fim de uma Era',
            stages: [
                { label: 'O Vazio', text: 'O maior ídolo recente do {team} acabou de ser vendido para um clube maior, e o vestiário sente o baque. {fact} Reconstruir o time sem sua estrela será o desafio da sua primeira temporada no comando.' },
                { label: 'Novos Líderes', text: 'Sem o antigo ídolo, o {team} começa a encontrar novas referências dentro de campo. {fact} É hora de consolidar esses novos líderes e provar que o time é maior do que qualquer jogador individual.' },
                { label: 'Virando a Página', text: 'Chegou a temporada em que o {team} finalmente vira a página da antiga era. {fact} Mostre à torcida que o futuro do clube pode ser tão brilhante quanto o passado.' }
            ]
        },
        en: {
            title: 'End of an Era',
            stages: [
                { label: 'The Void', text: '{team}\'s biggest recent star has just been sold to a bigger club, and the dressing room feels the blow. {fact} Rebuilding the squad without your star man will be the challenge of your first season in charge.' },
                { label: 'New Leaders', text: 'Without the old idol, {team} starts finding new leaders on the pitch. {fact} It\'s time to build up those new leaders and prove the team is bigger than any single player.' },
                { label: 'Turning the Page', text: 'This is the season when {team} finally turns the page on its old era. {fact} Show the fans that the club\'s future can be just as bright as its past.' }
            ]
        }
    },
    {
        id: 'derby',
        pt: {
            title: 'Rivalidade Local',
            stages: [
                { label: 'A Provocação', text: 'O clássico contra o maior rival está mais próximo do que nunca, e o {team} não vence esse confronto há tempos. {fact} A cidade inteira espera um resultado digno de orgulho já na sua primeira temporada.' },
                { label: 'Reviravolta', text: 'Depois de uma temporada de trabalho, o {team} finalmente sente que pode competir de igual para igual com o rival local. {fact} É hora de transformar essa confiança recém-conquistada em resultados dentro de campo.' },
                { label: 'Supremacia Local', text: 'Chegou a temporada decisiva na briga do {team} pela supremacia da cidade. {fact} Vença o respeito do rival de uma vez por todas.' }
            ]
        },
        en: {
            title: 'Local Rivalry',
            stages: [
                { label: 'The Taunt', text: 'The derby against the biggest rival is closer than ever, and {team} hasn\'t won that fixture in a long while. {fact} The whole city is hoping for a result worth celebrating already in your first season.' },
                { label: 'Turning the Tide', text: 'After a season of work, {team} finally feels it can compete on equal footing with the local rival. {fact} It\'s time to turn that newfound confidence into results on the pitch.' },
                { label: 'Local Supremacy', text: 'This is the decisive season in {team}\'s fight for supremacy of the city. {fact} Earn the rival\'s respect once and for all.' }
            ]
        }
    },
    {
        id: 'lastdance',
        pt: {
            title: 'Última Dança',
            stages: [
                { label: 'A Despedida Anunciada', text: 'Esta é a primeira de suas últimas temporadas no comando do {team} antes da aposentadoria. {fact} Você quer ser lembrado não só pelas conquistas, mas por ter deixado o clube em boas mãos.' },
                { label: 'Contando os Dias', text: 'O relógio da sua carreira no {team} continua correndo, e cada decisão pesa mais no legado que você vai deixar. {fact} Aproveite o tempo que resta para preparar o clube para o dia em que você não estiver mais lá.' },
                { label: 'O Último Capítulo', text: 'Esta é, finalmente, sua última temporada no comando do {team}. {fact} Dê tudo de si nesta despedida — é sua última chance de escrever o final da sua própria história no clube.' }
            ]
        },
        en: {
            title: 'One Last Dance',
            stages: [
                { label: 'The Announced Farewell', text: 'This is the first of your final seasons in charge of {team} before retirement. {fact} You want to be remembered not only for the trophies, but for leaving the club in good hands.' },
                { label: 'Counting Down', text: 'The clock on your career at {team} keeps ticking, and every decision weighs more heavily on the legacy you\'ll leave behind. {fact} Use the time you have left to prepare the club for the day you\'re no longer there.' },
                { label: 'The Final Chapter', text: 'This is, at last, your final season in charge of {team}. {fact} Give it everything in this farewell — it\'s your last chance to write the ending of your own story at the club.' }
            ]
        }
    }
];

// Maps chapter index `i` (1-indexed, out of `total` chapters) onto one of an
// arc's `stages`, spreading them evenly across the campaign so a 1-, 2-, or
// 3-chapter campaign all get a sensible beginning->middle->end progression
// from the very same arc (never picking a fresh random arc per chapter).
function pickStage(stages, i, total) {
    if (total <= 1) return stages[0];
    const idx = Math.round((i - 1) * (stages.length - 1) / (total - 1));
    return stages[Math.max(0, Math.min(stages.length - 1, idx))];
}

// ---- Objective & setup pools ------------------------------------------
// Phrased after the real terminology used in the rulebook (League Table,
// Office track, Stadium Infrastructure, Fan Base, Youngsters, Sponsors) and
// after the structure of the "Reaching the Heights" fan-made campaign
// (main + secondary objectives, setup changes per chapter).
const MAIN_OBJECTIVES = [
    {
        appliesDiv: () => true,
        pt: d => `Tenha uma pontuação final de pelo menos ${pickNum(d, 10, 14, 18)} na Tabela da Liga.`,
        en: d => `Have a final score of at least ${pickNum(d, 10, 14, 18)} on the League Table.`
    },
    {
        appliesDiv: () => true,
        pt: () => `Evite o rebaixamento — termine fora das 2 últimas posições da Tabela da Liga.`,
        en: () => `Avoid relegation — finish outside the bottom 2 places of the League Table.`
    },
    {
        appliesDiv: div => div > 1,
        pt: () => `Consiga o acesso — termine em 1º ou 2º lugar na Tabela da Liga.`,
        en: () => `Achieve promotion — finish 1st or 2nd on the League Table.`
    },
    {
        appliesDiv: () => true,
        pt: () => `Termine em 1º lugar na Tabela da Liga e seja campeão da temporada.`,
        en: () => `Finish 1st on the League Table and become champion for the season.`
    },
    {
        appliesDiv: () => true,
        pt: d => `Avance pelo menos ${pickNum(d, 2, 3, 4)} posições na trilha do Escritório (Office).`,
        en: d => `Advance at least ${pickNum(d, 2, 3, 4)} spaces on the Office track.`
    },
    {
        appliesDiv: () => true,
        pt: d => `Construa pelo menos ${pickNum(d, 2, 3, 4)} peças de Infraestrutura do Estádio (Arquibancadas, Escritório, Placas, Iluminação, Loja ou Centro de Treinamento).`,
        en: d => `Build at least ${pickNum(d, 2, 3, 4)} Stadium Infrastructure tokens (Stands, Office, Adboard, Lighting, Merchandise Store, or Training Ground).`
    },
    {
        appliesDiv: () => true,
        pt: d => `Promova pelo menos ${pickNum(d, 2, 3, 4)} Youngsters ao time principal durante a temporada.`,
        en: d => `Promote at least ${pickNum(d, 2, 3, 4)} Youngsters to the first team during the season.`
    },
    {
        appliesDiv: () => true,
        pt: () => `Tenha pelo menos uma carta de Staff de cada categoria contratada até o fim da temporada.`,
        en: () => `Have at least one Staff card from each category hired by the end of the season.`
    },
    {
        appliesDiv: () => true,
        pt: d => `Termine a temporada com pelo menos ${pickNum(d, 0, 3, 6)} de Dinheiro em caixa, sem dívidas.`,
        en: d => `End the season with at least ${pickNum(d, 0, 3, 6)} Money in the bank, with no debts.`
    },
    {
        appliesDiv: () => true,
        pt: d => `Faça o marcador de Torcida (Fan Base) alcançar o nível ${pickNum(d, 3, 5, 7)} até o fim da temporada.`,
        en: d => `Get the Fan Base marker to reach level ${pickNum(d, 3, 5, 7)} by the end of the season.`
    }
];

const SECONDARY_OBJECTIVES = [
    {
        pt: d => `Complete pelo menos ${pickNum(d, 2, 3, 4)} cartas de Objetivo perfeitamente.`,
        en: d => `Complete at least ${pickNum(d, 2, 3, 4)} Objective cards perfectly.`
    },
    {
        pt: () => `Termine em 2º lugar ou superior na Tabela da Liga.`,
        en: () => `Finish 2nd place or higher on the League Table.`
    },
    {
        pt: d => `Contrate pelo menos ${pickNum(d, 1, 2, 3)} Patrocinadores durante a temporada.`,
        en: d => `Sign at least ${pickNum(d, 1, 2, 3)} Sponsors during the season.`
    },
    {
        pt: d => `Contrate pelo menos ${pickNum(d, 2, 3, 4)} Youngsters, promovidos ou não.`,
        en: d => `Sign at least ${pickNum(d, 2, 3, 4)} Youngsters, promoted or not.`
    },
    {
        pt: () => `Mantenha o elenco titular livre de lesões durante toda a temporada.`,
        en: () => `Keep your starting squad injury-free for the entire season.`
    },
    {
        pt: d => `Venda pelo menos ${pickNum(d, 1, 1, 2)} Jogador(es) com lucro sobre o custo de contratação.`,
        en: d => `Sell at least ${pickNum(d, 1, 1, 2)} Player(s) for a profit over their hiring cost.`
    },
    {
        pt: d => `Tenha pelo menos ${pickNum(d, 2, 3, 4)} Patrocinadores ativos ao mesmo tempo em algum momento da temporada.`,
        en: d => `Have at least ${pickNum(d, 2, 3, 4)} Sponsors active at the same time at some point in the season.`
    },
    {
        pt: d => `Construa pelo menos ${pickNum(d, 1, 2, 3)} Arquibancada(s) no seu estádio.`,
        en: d => `Build at least ${pickNum(d, 1, 2, 3)} Stand(s) at your stadium.`
    },
    {
        pt: d => `Contrate pelo menos ${pickNum(d, 2, 3, 4)} cartas de Staff durante a temporada.`,
        en: d => `Hire at least ${pickNum(d, 2, 3, 4)} Staff cards during the season.`
    },
    {
        pt: d => `Termine a temporada com o valor de Luvas do seu goleiro em ${pickNum(d, 1, 2, 3)} ou mais.`,
        en: d => `End the season with your goalkeeper's Gloves value at ${pickNum(d, 1, 2, 3)} or higher.`
    }
];

const SETUP_CHANGES = [
    {
        pt: d => `Comece a temporada com +${pickNum(d, 3, 2, 1)} de Dinheiro.`,
        en: d => `Start the season with +${pickNum(d, 3, 2, 1)} Money.`
    },
    {
        pt: d => `Comece a temporada com -${pickNum(d, 1, 2, 3)} de Dinheiro.`,
        en: d => `Start the season with -${pickNum(d, 1, 2, 3)} Money.`
    },
    {
        pt: () => `Não sorteie uma carta de Youngster no setup geral. Compre as 5 primeiras cartas do baralho de Jogadores, escolha uma e pague seu custo normalmente, descartando as demais. Repita o processo mais uma vez.`,
        en: () => `Do not draw a Youngster card during general setup. Draw the first 5 cards from the regular Player deck, choose one and pay its cost normally, discarding the rest. Repeat the process once more.`
    },
    {
        pt: () => `Depois de escolher suas 3 cartas de Manager e aplicar seus bônus, escolha uma delas novamente e aplique seus bônus mais uma vez.`,
        en: () => `After selecting your 3 Manager cards and applying their bonuses, choose one of them again and apply its bonuses a second time.`
    },
    {
        pt: () => `Você começa com a 3ª Arquibancada já construída no seu estádio.`,
        en: () => `You start with the 3rd Stand already built at your stadium.`
    },
    {
        pt: () => `Seus jogadores Veteranos custam +1 na primeira Semana da temporada.`,
        en: () => `Your Veteran Players cost +1 during the first Week of the season.`
    },
    {
        pt: () => `Escolha uma carta de Manager para manter, descarte as demais e receba um Head Coach normalmente.`,
        en: () => `Choose one Manager card to keep, discard the rest, then receive a Head Coach card as usual.`
    },
    {
        pt: () => `O seu primeiro Jogador Veterano contratado na temporada custa -1.`,
        en: () => `Your first Veteran Player hired this season costs -1.`
    },
    {
        pt: () => `Coloque um marcador de Camisa não utilizado no espaço 0 da trilha de Poupança.`,
        en: () => `Place an unused Jersey marker on space 0 of the Savings track.`
    },
    {
        pt: () => `Você não recebe nenhum Patrocinador no setup inicial da temporada.`,
        en: () => `You don't receive any starting Sponsors during initial setup this season.`
    }
];

// Draws `count` distinct (not-yet-`used`) items from `pool`, optionally
// filtered by `filterFn`. Falls back to allowing repeats only if the pool
// (after filtering) genuinely runs out — should not normally happen for the
// max 3-chapter campaigns this tool generates against a pool of 10 items.
function pickUnique(pool, count, filterFn, used) {
    const candidates = pool.filter((item, idx) => (!filterFn || filterFn(item)) && !used.has(idx));
    const picks = [];
    while (picks.length < count && candidates.length > 0) {
        const i = Math.floor(Math.random() * candidates.length);
        const item = candidates.splice(i, 1)[0];
        used.add(pool.indexOf(item));
        picks.push(item);
    }
    while (picks.length < count && pool.length > 0) {
        picks.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    return picks;
}

async function generateCampaign() {
    const lang = currentCampaignLang();
    const ui = CAMPAIGN_UI[lang] || CAMPAIGN_UI.pt;
    const team = getSelectedTeamName();
    const league = document.getElementById('camp-league').value;
    const division = document.getElementById('camp-division').value;
    const diff = document.getElementById('camp-difficulty').value;
    const chapters = parseInt(document.getElementById('camp-chapters').value);
    const canPromote = document.getElementById('camp-promotion').checked;
    const customTeam = isCustomTeamSelected();

    const loader = document.getElementById('campaign-loader');
    const output = document.getElementById('campaign-output');
    const container = document.getElementById('pdf-container');

    if (!team) {
        alert(ui.alertNoTeam);
        return;
    }

    loader.style.display = 'block';
    output.style.display = 'none';
    container.innerHTML = '';

    // Fetch real-world grounding data — a club summary for a curated real
    // team, or a league summary (real facts about the league itself) for a
    // custom/fictional team name. Either way, every chapter's story text
    // surfaces a DIFFERENT real fact, not just a single truncated blurb.
    const factData = customTeam ? await fetchLeagueData(league, division) : await fetchTeamData(team);
    const sentences = factData && factData.extract ? splitSentences(factData.extract) : [];
    const bgImage = factData && factData.thumbnail ? factData.thumbnail.source : '';

    // Pick exactly ONE story arc for the whole campaign so the narrative
    // stays coherent chapter to chapter (see STORY_ARCS comment above).
    const arc = STORY_ARCS[Math.floor(Math.random() * STORY_ARCS.length)];
    const arcText = arc[lang] || arc.pt;

    let html = '';
    let currentDiv = parseInt(division);
    const usedMain = new Set();
    const usedSecondary = new Set();
    const usedSetup = new Set();

    for (let i = 1; i <= chapters; i++) {
        const stage = pickStage(arcText.stages, i, chapters);

        const fact = sentences.length ? sentences[(i - 1) % sentences.length] : '';
        const introText = stage.text.replace('{team}', team).replace('{fact}', fact).replace(/\s{2,}/g, ' ').trim();

        const mainPicks = pickUnique(MAIN_OBJECTIVES, 2, o => o.appliesDiv(currentDiv), usedMain);
        const secondaryPicks = pickUnique(SECONDARY_OBJECTIVES, 2, null, usedSecondary);
        const setupPicks = pickUnique(SETUP_CHANGES, 2, null, usedSetup);

        const goals = mainPicks.map(o => o[lang](diff));
        const extraGoals = secondaryPicks.map(o => o[lang](diff));
        const setup = setupPicks.map(o => o[lang](diff));

        let chapterHtml = `
            <div class="pdf-preview" id="chapter-${i}">
                <div class="pdf-header">
                    <div class="title-block">
                        <h1>${team.toUpperCase()}</h1>
                        <div class="subtitle-arc">${arcText.title} — ${stage.label}</div>
                    </div>
                    <div class="meta-block">
                        ${bgImage ? `<img src="${bgImage}" class="team-crest">` : ''}
                        <div class="chapter-badge">${ui.chapter} ${i}/${chapters}</div>
                        <div class="meta-line">${ui.league}: ${league.toUpperCase()}</div>
                        <div class="meta-line">${ui.division}: ${currentDiv}</div>
                    </div>
                </div>

                <div class="pdf-narrative">${introText}</div>

                <div class="ribbon-row">
                    <div class="ribbon-box goals">
                        <div class="ribbon-title">${ui.goalsTitle}<span class="ribbon-stars">★ ★ ★</span></div>
                        <div class="ribbon-body">
                            <h4>${ui.directive}</h4>
                            <ul>${goals.map(g => `<li>${g}</li>`).join('')}</ul>
                            <h4>${ui.bonus}</h4>
                            <ul>${extraGoals.map(g => `<li>${g}</li>`).join('')}</ul>
                        </div>
                    </div>
                    <div class="ribbon-box setup">
                        <div class="ribbon-title">${ui.setupTitle}<span class="ribbon-stars">★ ★ ★</span></div>
                        <div class="ribbon-body">
                            <ul>${setup.map(g => `<li>${g}</li>`).join('')}</ul>
                        </div>
                    </div>
                </div>

                <div class="pdf-result">
                    <span class="result-tab">${ui.resultTitle}</span>
                    <p>${ui.resultComplete} ${canPromote && i < chapters ? ui.resultPromote + ' ' + (currentDiv - 1) + '.' : ''}</p>
                    <p>${ui.resultFail}</p>
                </div>

                <div class="pdf-continuity">${ui.continuityNote}</div>
            </div>
        `;
        html += chapterHtml;

        if (canPromote && currentDiv > 1) {
            currentDiv--;
        }
    }

    loader.style.display = 'none';
    output.style.display = 'block';
    container.innerHTML = html;
}

function exportPDF() {
    const ui = CAMPAIGN_UI[currentCampaignLang()] || CAMPAIGN_UI.pt;
    const element = document.getElementById('pdf-container');
    const opt = {
      margin:       0.5,
      filename:     ui.pdfFilename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

// Populate the team dropdown on initial load (applyI18n() in
// eleven_bot_v1.html calls populateTeamSelect(true) again on every language
// switch, to refresh translated labels while preserving the selection).
document.addEventListener('DOMContentLoaded', () => populateTeamSelect(false));

