function currentCampaignLang() {
    return localStorage.getItem('boardbots_lang') || 'pt';
}

async function fetchTeamData(teamName, lang) {
    const wiki = (lang || currentCampaignLang()) === 'en' ? 'en' : 'pt';
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
        resultFail: 'Se falhou neste capítulo decisivo, você foi demitido. Recomece o capítulo ou a campanha.',
        resultFailSoft: 'Se falhou, você continua no cargo — mas a diretoria perdeu a paciência. O próximo capítulo será ainda mais exigente.',
        difficultyLabel: 'Dificuldade do Capítulo', criticalChapterNote: 'Capítulo decisivo: falhar aqui resulta em demissão.',
        continuityNote: 'Continuidade: se esta campanha não for jogada em sequência direta, anote o estado do seu clube (posição na liga, elenco, infraestrutura) ao final de cada capítulo para retomar depois.',
        pdfFilename: 'Eleven_Campanha.pdf',
        failPenaltyLabel: 'Penalidade se falhar'
    },
    en: {
        alertNoTeam: 'Please choose or enter a team name.',
        chapter: 'CHAPTER', league: 'League', division: 'Division',
        goalsTitle: 'SEASON OBJECTIVES',
        directive: 'The Board demands that you:', bonus: 'Bonus if you:',
        setupTitle: 'SETUP CHANGES', resultTitle: 'SCENARIO OUTCOME',
        resultComplete: 'If you completed the required objectives, advance to the next chapter!',
        resultPromote: 'If you finish 1st or 2nd, you may move up to Division',
        resultFail: 'If you failed this decisive chapter, you were fired. Restart the chapter or the campaign.',
        resultFailSoft: 'If you failed, you keep your job — but the board\'s patience is wearing thin. The next chapter will demand even more.',
        difficultyLabel: 'Chapter Difficulty', criticalChapterNote: 'Decisive chapter: failing here results in getting fired.',
        continuityNote: 'Continuity: if this campaign isn\'t played back-to-back, jot down your club\'s state (league position, squad, infrastructure) at the end of each chapter so you can pick it back up later.',
        pdfFilename: 'Eleven_Campaign.pdf',
        failPenaltyLabel: 'Penalty if you fail'
    }
};

// ---- Team selection ----------------------------------------------------
// Curated real-club lists per league & division, so the user can pick a real
// team from a dropdown instead of typing a name (which risked typos that
// would silently break the Wikipedia lookup). A "custom team" option is
// always appended, which reveals a free-text input for fictional/renamed
// clubs — those skip the Wikipedia lookup entirely and instead get generic,
// division/difficulty-based scenarios (see GENERIC_DIVISION_FACTS / generateCampaign).
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
        1: ['Clube de Regatas do Flamengo', 'Palmeiras', 'Sport Club Corinthians Paulista', 'São Paulo FC', 'Grêmio Foot-Ball Porto Alegrense', 'Sport Club Internacional', 'Santos FC', 'Atlético Mineiro', 'Cruzeiro Esporte Clube', 'Fluminense Football Club', 'Botafogo de Futebol e Regatas', 'Vasco da Gama'],
        2: ['Sport Club do Recife', 'Vila Nova FC', 'Ceará SC', 'Guarani FC', 'Coritiba FC', 'Ituano FC', 'Novorizontino', 'Avaí FC'],
        3: ['ABC FC', 'Associação Desportiva Confiança', 'Botafogo-PB', 'Associação Ferroviária de Esportes', 'São Bernardo FC', 'Volta Redonda FC']
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

// Picks a numeric threshold that scales with the chosen difficulty, then
// optionally escalates it further by `chapterFactor` (0 for chapter 1,
// increasing for later chapters in the same campaign) so later chapters
// demand tougher numeric targets. Only threaded through objectives whose
// number is an "at least N"-style threshold — never through ordinal/fixed
// rule numbers (e.g. "1st place", "bottom 2 places") or SETUP_CHANGES
// (some of which have reversed easy/hard semantics, e.g. a bigger bonus is
// easier, not harder).
function pickNum(difficulty, easy, medium, hard, chapterFactor) {
    const base = ({ easy, medium, hard })[difficulty] ?? medium;
    if (!chapterFactor) return base;
    return Math.max(base, Math.round(base * (1 + chapterFactor)));
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
                { label: 'Os Primeiros Passos', text: 'Os primeiros resultados no comando do {team} começam a aparecer, ainda que de forma modesta. {fact} A torcida observa com cautela, mas já dá sinais de que está disposta a acreditar em você.' },
                { label: 'Ganhando Confiança', text: 'Uma temporada já se passou desde que você assumiu o {team}, e aos poucos a torcida começa a confiar no seu trabalho. {fact} É hora de consolidar as mudanças que você começou e provar que não foi sorte.' },
                { label: 'Provado pelo Fogo', text: 'Uma sequência difícil de resultados coloca à prova a confiança que o {team} depositou em você. {fact} É hora de mostrar que a volta para casa não foi só sentimentalismo.' },
                { label: 'Legado', text: 'Chegou a temporada decisiva da sua passagem pelo {team} nesta história. {fact} É hora de decidir que tipo de legado você deixará para o clube que te viu crescer.' }
            ]
        },
        en: {
            title: 'First Love',
            stages: [
                { label: 'The Return', text: 'You have come home. {team} is the club of your childhood, and the fans still remember your name. {fact} Now begins your first season in charge — show that bringing you back was worth it.' },
                { label: 'First Steps', text: 'The first results in charge of {team} are starting to show, however modest. {fact} The fans are watching cautiously, but already showing signs they are willing to believe in you.' },
                { label: 'Earning Trust', text: 'A season has passed since you took charge of {team}, and the fans are slowly starting to trust your work. {fact} It is time to consolidate the changes you started and prove it wasn\'t just luck.' },
                { label: 'Trial by Fire', text: 'A difficult run of results puts the trust {team} placed in you to the test. {fact} It is time to show that coming home wasn\'t just sentimentality.' },
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
                { label: 'Cortes Difíceis', text: 'Decisões impopulares de corte de gastos precisam ser tomadas no {team}, e nem todos concordam com o caminho escolhido. {fact} Ainda é cedo para colher resultados, mas os primeiros passos da reconstrução já foram dados.' },
                { label: 'Reconstrução', text: 'Depois de uma temporada de cortes e sacrifícios, o {team} começa a enxergar luz no fim do túnel. {fact} Mas a diretoria ainda cobra resultados rápidos para justificar a paciência que teve com você.' },
                { label: 'Sinais de Vida', text: 'Depois de tanto sacrifício, o {team} finalmente mostra sinais de vida dentro de campo. {fact} A diretoria observa com cautela, mas o otimismo começa a voltar ao clube.' },
                { label: 'Superação', text: 'É a temporada que vai definir se a crise no {team} ficou para trás de vez. {fact} Prove que o clube saiu mais forte da tempestade que você ajudou a atravessar.' }
            ]
        },
        en: {
            title: 'Times of Crisis',
            stages: [
                { label: 'The Collapse', text: '{team} has just lost its main sponsor, and the books simply don\'t balance. {fact} You take charge amid the chaos, tasked with stopping the financial bleeding.' },
                { label: 'Hard Cuts', text: 'Unpopular cost-cutting decisions must be made at {team}, and not everyone agrees with the chosen path. {fact} It is still early to see results, but the first steps of the rebuild have been taken.' },
                { label: 'Rebuilding', text: 'After a season of cuts and sacrifices, {team} starts to see light at the end of the tunnel. {fact} But the board still demands quick results to justify the patience it has shown you.' },
                { label: 'Signs of Life', text: 'After so much sacrifice, {team} is finally showing signs of life on the pitch. {fact} The board is watching cautiously, but optimism is starting to return to the club.' },
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
                { label: 'Primeiras Contratações', text: 'As primeiras grandes contratações chegam ao {team}, e a expectativa da torcida dispara. {fact} Agora é preciso transformar o time no papel em resultados dentro de campo.' },
                { label: 'Subindo de Patamar', text: 'O projeto vencedor do {team} está em andamento, e as expectativas só aumentaram desde a temporada passada. {fact} Chegou a hora de transformar o investimento em títulos de verdade.' },
                { label: 'A Reta Final', text: 'A briga pelo título entra na reta final, e cada ponto do {team} pesa mais do que nunca. {fact} Um deslize agora pode custar tudo o que foi construído até aqui.' },
                { label: 'O Ápice', text: 'Esta é a temporada que pode coroar todo o trabalho feito no {team} desde que o projeto começou. {fact} A torcida sonha com a glória máxima — não a decepcione agora.' }
            ]
        },
        en: {
            title: 'On the Road to Glory',
            stages: [
                { label: 'The Investment', text: 'Fans of {team} haven\'t been this excited in years, and the board has just released funds to invest heavily. {fact} But the money comes with a relentless demand for immediate results.' },
                { label: 'First Signings', text: 'The first big-name signings arrive at {team}, and fan expectations skyrocket. {fact} Now the team on paper needs to become results on the pitch.' },
                { label: 'Stepping Up', text: 'The winning project at {team} is underway, and expectations have only grown since last season. {fact} It\'s time to turn that investment into real silverware.' },
                { label: 'The Home Stretch', text: 'The title race enters its final stretch, and every point {team} drops matters more than ever. {fact} One slip now could cost everything built so far.' },
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
                { label: 'Primeiras Exigências', text: 'Os novos donos do {team} apresentam suas primeiras exigências concretas de resultado. {fact} É hora de mostrar que você entendeu o recado.' },
                { label: 'Sob Pressão', text: 'Os novos donos do {team} já perceberam que reconstruir um clube leva tempo, mas a paciência deles está se esgotando. {fact} Esta temporada precisa mostrar progresso real, ou seu contrato pode não ser renovado.' },
                { label: 'A Corda Bamba', text: 'O {team} caminha na corda bamba: um novo tropeço pode esgotar de vez a paciência dos novos donos. {fact} Cada decisão agora tem peso redobrado.' },
                { label: 'Resultados ou Saída', text: 'Chegou a temporada da verdade para você e para os novos donos do {team}. {fact} Prove que a visão deles sobre o clube — e a confiança que depositaram em você — foi a escolha certa.' }
            ]
        },
        en: {
            title: 'New Owners, New Rules',
            stages: [
                { label: 'The Takeover', text: 'A new ownership group has just taken over {team}. {fact} They talk of a "winning project" and have no patience for excuses — and you are the first hire of this new era.' },
                { label: 'First Demands', text: 'The new owners at {team} present their first concrete performance demands. {fact} It is time to show that you got the message.' },
                { label: 'Under Pressure', text: 'The new owners at {team} have already realized rebuilding a club takes time, but their patience is running out. {fact} This season needs to show real progress, or your contract may not be renewed.' },
                { label: 'Walking the Tightrope', text: '{team} is walking a tightrope: one more stumble could finally exhaust the new owners\' patience. {fact} Every decision now carries double the weight.' },
                { label: 'Results or the Door', text: 'The season of truth has arrived for you and {team}\'s new owners. {fact} Prove that their vision for the club — and the trust they placed in you — was the right choice.' }
            ]
        }
    },
    {
        id: 'academy',
        pt: {
            title: 'A Base do Futuro',
            stages: [
                { label: 'Plantando Sementes', text: 'A diretoria do {team} decidiu apostar nas categorias de base para reduzir gastos e criar uma identidade própria. {fact} Cabe a você começar a transformar Novatos promissores em peças do time principal.' },
                { label: 'Crescendo Dentro de Campo', text: 'Os primeiros Novatos treinados no {team} ainda cometem erros de inexperiência, mas mostram lampejos de talento. {fact} É hora de ter paciência com o processo que você mesmo escolheu seguir.' },
                { label: 'Colhendo Frutos', text: 'Os primeiros Novatos treinados no {team} já começam a mostrar serviço no time principal. {fact} É hora de aprofundar a aposta na base e provar que o projeto de formação é sustentável.' },
                { label: 'Consolidando o Projeto', text: 'O projeto de base do {team} começa a se consolidar como a verdadeira identidade do clube. {fact} Falta pouco para a nova geração assumir de vez o protagonismo.' },
                { label: 'A Nova Geração', text: 'Chegou a temporada em que a nova geração do {team}, formada nas categorias de base, precisa assumir de vez o protagonismo. {fact} Mostre que apostar nos próprios jogadores foi a decisão certa.' }
            ]
        },
        en: {
            title: 'The Future Starts Here',
            stages: [
                { label: 'Planting Seeds', text: 'The board at {team} has decided to invest in the youth academy to cut costs and build its own identity. {fact} It\'s up to you to start turning promising Youngsters into first-team players.' },
                { label: 'Growing Pains', text: 'The first Youngsters promoted at {team} still make rookie mistakes, but show flashes of real talent. {fact} It is time to be patient with the process you chose to follow.' },
                { label: 'Reaping Rewards', text: 'The first Youngsters promoted at {team} are already starting to show up in the first team. {fact} It\'s time to deepen the investment in the academy and prove the project is sustainable.' },
                { label: 'Consolidating the Project', text: 'The academy project at {team} is starting to become the club\'s true identity. {fact} The new generation is close to finally taking center stage.' },
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
                { label: 'Buscando Substitutos', text: 'O {team} ainda sente falta do ídolo que partiu, e as tentativas de substituí-lo nem sempre dão certo. {fact} É preciso paciência para encontrar as peças certas.' },
                { label: 'Novos Líderes', text: 'Sem o antigo ídolo, o {team} começa a encontrar novas referências dentro de campo. {fact} É hora de consolidar esses novos líderes e provar que o time é maior do que qualquer jogador individual.' },
                { label: 'Uma Nova Identidade', text: 'Aos poucos, o {team} começa a construir uma identidade própria, diferente da era do antigo ídolo. {fact} Está quase na hora de virar a página de vez.' },
                { label: 'Virando a Página', text: 'Chegou a temporada em que o {team} finalmente vira a página da antiga era. {fact} Mostre à torcida que o futuro do clube pode ser tão brilhante quanto o passado.' }
            ]
        },
        en: {
            title: 'End of an Era',
            stages: [
                { label: 'The Void', text: '{team}\'s biggest recent star has just been sold to a bigger club, and the dressing room feels the blow. {fact} Rebuilding the squad without your star man will be the challenge of your first season in charge.' },
                { label: 'Searching for Replacements', text: '{team} still feels the absence of the idol who left, and attempts to replace him don\'t always work out. {fact} Patience is needed to find the right pieces.' },
                { label: 'New Leaders', text: 'Without the old idol, {team} starts finding new leaders on the pitch. {fact} It\'s time to build up those new leaders and prove the team is bigger than any single player.' },
                { label: 'A New Identity', text: 'Little by little, {team} is building an identity of its own, different from the old idol\'s era. {fact} It is almost time to finally turn the page.' },
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
                { label: 'Aquecendo os Ânimos', text: 'As provocações entre torcidas do {team} e do rival local aumentam a cada rodada que se aproxima do próximo clássico. {fact} A tensão na cidade já é perceptível nas ruas.' },
                { label: 'Reviravolta', text: 'Depois de uma temporada de trabalho, o {team} finalmente sente que pode competir de igual para igual com o rival local. {fact} É hora de transformar essa confiança recém-conquistada em resultados dentro de campo.' },
                { label: 'A Véspera da Decisão', text: 'Falta apenas um clássico para decidir, de vez, quem manda na cidade — e o {team} não pode desperdiçar essa chance. {fact} A torcida já conta os dias.' },
                { label: 'Supremacia Local', text: 'Chegou a temporada decisiva na briga do {team} pela supremacia da cidade. {fact} Vença o respeito do rival de uma vez por todas.' }
            ]
        },
        en: {
            title: 'Local Rivalry',
            stages: [
                { label: 'The Taunt', text: 'The derby against the biggest rival is closer than ever, and {team} hasn\'t won that fixture in a long while. {fact} The whole city is hoping for a result worth celebrating already in your first season.' },
                { label: 'Turning Up the Heat', text: 'Taunts between {team}\'s fans and the local rival\'s grow with every matchday closer to the next derby. {fact} Tension in the city is already noticeable on the streets.' },
                { label: 'Turning the Tide', text: 'After a season of work, {team} finally feels it can compete on equal footing with the local rival. {fact} It\'s time to turn that newfound confidence into results on the pitch.' },
                { label: 'The Eve of the Decider', text: 'Only one more derby stands between {team} and settling once and for all who runs the city. {fact} The fans are already counting down the days.' },
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
                { label: 'Ainda Há Tempo', text: 'Mesmo sabendo que o tempo é curto, você decide aproveitar cada temporada que resta no {team} da melhor forma possível. {fact} Ainda há tempo de deixar sua marca.' },
                { label: 'Contando os Dias', text: 'O relógio da sua carreira no {team} continua correndo, e cada decisão pesa mais no legado que você vai deixar. {fact} Aproveite o tempo que resta para preparar o clube para o dia em que você não estiver mais lá.' },
                { label: 'As Últimas Peças', text: 'Faltam poucos capítulos para o fim da sua história no {team}, e cada decisão agora ajuda a montar as últimas peças do seu legado. {fact} Não há mais tempo a perder.' },
                { label: 'O Último Capítulo', text: 'Esta é, finalmente, sua última temporada no comando do {team}. {fact} Dê tudo de si nesta despedida — é sua última chance de escrever o final da sua própria história no clube.' }
            ]
        },
        en: {
            title: 'One Last Dance',
            stages: [
                { label: 'The Announced Farewell', text: 'This is the first of your final seasons in charge of {team} before retirement. {fact} You want to be remembered not only for the trophies, but for leaving the club in good hands.' },
                { label: 'There\'s Still Time', text: 'Even knowing time is short, you decide to make the most of every remaining season at {team}. {fact} There is still time to leave your mark.' },
                { label: 'Counting Down', text: 'The clock on your career at {team} keeps ticking, and every decision weighs more heavily on the legacy you\'ll leave behind. {fact} Use the time you have left to prepare the club for the day you\'re no longer there.' },
                { label: 'The Final Pieces', text: 'Only a few chapters remain in your story at {team}, and every decision now helps put the last pieces of your legacy in place. {fact} There is no more time to lose.' },
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

// Generic, division/difficulty-aware flavor sentences used as the "real
// facts" substitute for custom/fictional teams — no Wikipedia lookup, just
// context about the level of competition the club plays at.
const GENERIC_DIVISION_FACTS = {
    pt: [
        (div) => `A Divisão ${div} é conhecida por partidas equilibradas, onde qualquer detalhe pode decidir a temporada.`,
        (div) => `Nesta divisão, encontrar Patrocinadores dispostos a investir costuma ser um desafio à parte.`,
        (div) => `Clubes da Divisão ${div} normalmente dependem de boas contratações de Novatos para se manter competitivos.`,
        (div) => `A rivalidade entre os clubes da Divisão ${div} costuma deixar a Tabela da Liga imprevisível até a última rodada.`,
        (div) => `Investir em Infraestrutura do Estádio é visto como prioridade para quem sonha em deixar a Divisão ${div}.`,
        (div, diff) => diff === 'hard' ? `No nível de dificuldade escolhido, a concorrência pela Divisão ${div} está mais acirrada do que nunca.` : (diff === 'easy' ? `No nível de dificuldade escolhido, um planejamento cuidadoso já é suficiente para se destacar na Divisão ${div}.` : `No nível de dificuldade escolhido, times bem equilibrados costumam se dar bem na Divisão ${div}.`),
        (div) => `A torcida local acompanha de perto cada resultado, ciente de como a Divisão ${div} pode ser exigente.`,
        (div) => `Poucos detalhes separam o sucesso do fracasso entre os clubes da Divisão ${div} nesta temporada.`
    ],
    en: [
        (div) => `Division ${div} is known for tight matches, where any small detail can decide the season.`,
        (div) => `At this level, finding Sponsors willing to invest tends to be a challenge of its own.`,
        (div) => `Clubs in Division ${div} usually rely on good Youngster signings to stay competitive.`,
        (div) => `Rivalries between Division ${div} clubs tend to keep the League Table unpredictable until the last matchday.`,
        (div) => `Investing in Stadium Infrastructure is seen as a priority for clubs dreaming of leaving Division ${div}.`,
        (div, diff) => diff === 'hard' ? `At the chosen difficulty level, competition for Division ${div} is fiercer than ever.` : (diff === 'easy' ? `At the chosen difficulty level, careful planning alone is enough to stand out in Division ${div}.` : `At the chosen difficulty level, well-balanced sides tend to do well in Division ${div}.`),
        (div) => `Local fans follow every result closely, well aware of how demanding Division ${div} can be.`,
        (div) => `Very little separates success from failure among Division ${div} clubs this season.`
    ]
};

function genericFactSentences(lang, division, diff) {
    const pool = GENERIC_DIVISION_FACTS[lang] || GENERIC_DIVISION_FACTS.pt;
    return pool.map(fn => fn(division, diff));
}

// Short, independent flavor beats layered on top of the chosen story arc —
// picking one per chapter (avoiding recent repeats via pickAvoidingRecent)
// gives each chapter its own procedural "sub-plot", so even campaigns that
// reuse the same arc still read as fresh for a long time.
const CHAPTER_TWISTS = {
    pt: [
        `Um clube rival acaba de contratar seu principal Olheiro (Scout).`,
        `Um jovem talento da região está atraindo o interesse de clubes maiores, mas ficaria feliz com uma chance real no {team}.`,
        `Comentaristas locais já especulam quem poderia assumir seu lugar caso os resultados não venham.`,
        `A lesão de um Veterano importante força um replanejamento financeiro logo na janela de contratações.`,
        `Uma proposta inesperada de parceria comercial surge, condicionada a bons resultados no início da temporada.`,
        `Um ex-jogador do {team}, hoje comentarista, questiona publicamente seus métodos.`,
        `A tabela de jogos apertada por conta do calendário força rotações difíceis logo de início.`,
        `A renegociação de um contrato de transmissão libera uma verba extra em algum momento da temporada.`,
        `Um Novato da base chama atenção nos treinos e força decisões difíceis de escalação.`,
        `Uma derrota em amistoso de pré-temporada já coloca a diretoria em alerta.`,
        `Um patrocinador local ameaça deixar o clube caso o público no estádio não melhore.`,
        `Rumores de mercado ligam um dos seus melhores Jogadores a uma saída na próxima janela.`,
        `A nova política de preços dos ingressos gera debate entre a torcida logo no início da temporada.`,
        `Um comentarista aposta no {team} como a "zebra" da temporada, elevando as expectativas da noite para o dia.`
    ],
    en: [
        `A rival club has just poached your top Scout.`,
        `A local youth talent is drawing interest from bigger clubs, but would be happy with a real chance at {team}.`,
        `Local pundits are already speculating who could replace you if results don't come.`,
        `An injury to a key Veteran forces a financial rethink right in the transfer window.`,
        `An unexpected commercial partnership offer appears, conditioned on good early-season results.`,
        `A former {team} player, now a pundit, publicly questions your methods.`,
        `A congested fixture schedule forces tough rotations right from the start.`,
        `A broadcast deal renegotiation frees up extra spending money at some point in the season.`,
        `An academy Youngster is turning heads in training, forcing tough squad decisions.`,
        `A pre-season friendly defeat already puts the board on alert.`,
        `A local sponsor threatens to walk away unless attendance figures improve.`,
        `Transfer rumors link one of your best Players with a move away next window.`,
        `New ticket pricing sparks debate among fans right as the season begins.`,
        `A pundit picks {team} as this season's "surprise package", raising expectations overnight.`
    ]
};

// Picks a pool index while avoiding the most recently used ones (persisted in
// localStorage), so repeated campaign generations don't immediately resurface
// the same arc/twist — content stays fresh across many plays, not just one.
function pickAvoidingRecent(poolLength, historyKey, historyLimit) {
    let recent = [];
    try { recent = JSON.parse(localStorage.getItem(historyKey) || '[]'); } catch (e) { recent = []; }
    const candidates = [];
    for (let idx = 0; idx < poolLength; idx++) {
        if (!recent.includes(idx)) candidates.push(idx);
    }
    const pick = candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : Math.floor(Math.random() * poolLength);
    recent.push(pick);
    if (recent.length > historyLimit) recent = recent.slice(recent.length - historyLimit);
    try { localStorage.setItem(historyKey, JSON.stringify(recent)); } catch (e) { /* ignore */ }
    return pick;
}

// ---- Objective & setup pools ------------------------------------------
// Phrased after the real terminology used in the rulebook (League Table,
// Office track, Stadium Infrastructure, Fan Base, Youngsters, Sponsors) and
// after the structure of the "Reaching the Heights" fan-made campaign
// (main + secondary objectives, setup changes per chapter).
const MAIN_OBJECTIVES = [
    {
        appliesDiv: () => true,
        pt: (d, esc) => `Tenha uma pontuação final de pelo menos ${pickNum(d, 10, 14, 18, esc)} na Tabela da Liga.`,
        en: (d, esc) => `Have a final score of at least ${pickNum(d, 10, 14, 18, esc)} on the League Table.`
    },
    {
        appliesDiv: () => true,
        critical: true,
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
        pt: (d, esc) => `Avance pelo menos ${pickNum(d, 2, 3, 4, esc)} posições na trilha do Escritório (Office).`,
        en: (d, esc) => `Advance at least ${pickNum(d, 2, 3, 4, esc)} spaces on the Office track.`
    },
    {
        appliesDiv: () => true,
        pt: (d, esc) => `Construa pelo menos ${pickNum(d, 2, 3, 4, esc)} peças de Infraestrutura do Estádio (Arquibancadas, Escritório, Outdoor, Iluminação, Loja ou Concentração).`,
        en: (d, esc) => `Build at least ${pickNum(d, 2, 3, 4, esc)} Stadium Infrastructure tokens (Stands, Office, Adboard, Lighting, Merchandise Store, or Training Ground).`
    },
    {
        appliesDiv: () => true,
        pt: (d, esc) => `Passe pelo menos ${pickNum(d, 2, 3, 4, esc)} Novatos para o Time Principal durante a temporada.`,
        en: (d, esc) => `Promote at least ${pickNum(d, 2, 3, 4, esc)} Youngsters to the first team during the season.`
    },
    {
        appliesDiv: () => true,
        pt: () => `Tenha pelo menos uma carta de Staff de cada categoria contratada até o fim da temporada.`,
        en: () => `Have at least one Staff card from each category hired by the end of the season.`
    },
    {
        appliesDiv: () => true,
        pt: (d, esc) => `Termine a temporada com pelo menos ${pickNum(d, 0, 3, 6, esc)} de Dinheiro em caixa, sem dívidas.`,
        en: (d, esc) => `End the season with at least ${pickNum(d, 0, 3, 6, esc)} Money in the bank, with no debts.`
    },
    {
        appliesDiv: () => true,
        pt: (d, esc) => `Faça o marcador de Torcida (Fan Base) alcançar o nível ${pickNum(d, 3, 5, 7, esc)} até o fim da temporada.`,
        en: (d, esc) => `Get the Fan Base marker to reach level ${pickNum(d, 3, 5, 7, esc)} by the end of the season.`
    }
];

const SECONDARY_OBJECTIVES = [
    {
        pt: (d, esc) => `Complete pelo menos ${pickNum(d, 2, 3, 4, esc)} cartas de Objetivo perfeitamente.`,
        en: (d, esc) => `Complete at least ${pickNum(d, 2, 3, 4, esc)} Objective cards perfectly.`
    },
    {
        pt: () => `Termine em 2º lugar ou superior na Tabela da Liga.`,
        en: () => `Finish 2nd place or higher on the League Table.`
    },
    {
        pt: (d, esc) => `Contrate pelo menos ${pickNum(d, 1, 2, 3, esc)} Patrocinadores durante a temporada.`,
        en: (d, esc) => `Sign at least ${pickNum(d, 1, 2, 3, esc)} Sponsors during the season.`
    },
    {
        pt: (d, esc) => `Contrate pelo menos ${pickNum(d, 2, 3, 4, esc)} Novatos, treinados ou não.`,
        en: (d, esc) => `Sign at least ${pickNum(d, 2, 3, 4, esc)} Youngsters, promoted or not.`
    },
    {
        pt: () => `Mantenha o elenco titular livre de lesões durante toda a temporada.`,
        en: () => `Keep your starting squad injury-free for the entire season.`
    },
    {
        pt: (d, esc) => `Venda pelo menos ${pickNum(d, 1, 1, 2, esc)} Jogador(es) com lucro sobre o custo de contratação.`,
        en: (d, esc) => `Sell at least ${pickNum(d, 1, 1, 2, esc)} Player(s) for a profit over their hiring cost.`
    },
    {
        pt: (d, esc) => `Tenha pelo menos ${pickNum(d, 2, 3, 4, esc)} Patrocinadores ativos ao mesmo tempo em algum momento da temporada.`,
        en: (d, esc) => `Have at least ${pickNum(d, 2, 3, 4, esc)} Sponsors active at the same time at some point in the season.`
    },
    {
        pt: (d, esc) => `Construa pelo menos ${pickNum(d, 1, 2, 3, esc)} Arquibancada(s) no seu estádio.`,
        en: (d, esc) => `Build at least ${pickNum(d, 1, 2, 3, esc)} Stand(s) at your stadium.`
    },
    {
        pt: (d, esc) => `Contrate pelo menos ${pickNum(d, 2, 3, 4, esc)} cartas de Staff durante a temporada.`,
        en: (d, esc) => `Hire at least ${pickNum(d, 2, 3, 4, esc)} Staff cards during the season.`
    },
    {
        pt: (d, esc) => `Termine a temporada com o valor de Luvas do seu goleiro em ${pickNum(d, 1, 2, 3, esc)} ou mais.`,
        en: (d, esc) => `End the season with your goalkeeper's Gloves value at ${pickNum(d, 1, 2, 3, esc)} or higher.`
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
        pt: () => `Não sorteie uma carta de Novato no setup geral. Compre as 5 primeiras cartas do baralho de Jogadores, escolha uma e pague seu custo normalmente, descartando as demais. Repita o processo mais uma vez.`,
        en: () => `Do not draw a Youngster card during general setup. Draw the first 5 cards from the regular Player deck, choose one and pay its cost normally, discarding the rest. Repeat the process once more.`
    },
    {
        pt: () => `Depois de escolher suas 3 cartas de Diretor (Director) e aplicar seus bônus, escolha uma delas novamente e aplique seus bônus mais uma vez.`,
        en: () => `After drafting your 3 Director cards and applying their bonuses, choose one of them again and apply its bonuses a second time.`
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
        pt: () => `Ao invés de escolher 3 cartas de Diretor (Director) no draft, escolha e mantenha apenas 1, descartando as demais fases do draft. Coloque seu Treinador Principal (First Trainer) normalmente.`,
        en: () => `Instead of drafting 3 Director cards, choose and keep only 1, skipping the remaining draft rounds. Place your First Trainer card as usual.`
    },
    {
        pt: () => `O seu primeiro Jogador Veterano contratado na temporada custa -1.`,
        en: () => `Your first Veteran Player hired this season costs -1.`
    },
    {
        pt: () => `Um dos seus 3 marcadores de Camisa não utilizados começa a temporada diretamente no campo (Pitch), em qualquer Zona vazia, ao invés de começar na Área de Banco.`,
        en: () => `One of your 3 unused Jersey markers starts the season directly on the Pitch, in any empty Zone, instead of starting in the Bench Area.`
    },
    {
        pt: () => `Você não recebe nenhum Patrocinador no setup inicial da temporada.`,
        en: () => `You don't receive any starting Sponsors during initial setup this season.`
    }
];

// Concrete, printable consequences for failing a NON-decisive chapter —
// applied by the player to the START of the NEXT chapter (this is a
// print-and-play tool with no turn-by-turn state tracking, so the penalty
// is picked once at generation time and printed as a plain setup
// instruction, exactly like SETUP_CHANGES above, rather than something the
// app tracks/enforces itself).
const FAIL_PENALTIES = [
    {
        pt: d => `Comece o próximo capítulo com -${pickNum(d, 1, 2, 3)} de Dinheiro.`,
        en: d => `Start the next chapter with -${pickNum(d, 1, 2, 3)} Money.`
    },
    {
        pt: () => `Descarte 2 Jogadores titulares à sua escolha e substitua-os por 2 novos Novatos comprados no início do próximo capítulo.`,
        en: () => `Discard 2 starting Players of your choice and replace them with 2 new Youngsters drawn at the start of the next chapter.`
    },
    {
        pt: d => `Reduza o marcador de Torcida (Fan Base) em ${pickNum(d, 1, 1, 2)} nível(is) (mínimo 0) no início do próximo capítulo.`,
        en: d => `Reduce the Fan Base marker by ${pickNum(d, 1, 1, 2)} level(s) (minimum 0) at the start of the next chapter.`
    },
    {
        pt: () => `Remova 1 peça de Infraestrutura do Estádio já construída, à sua escolha.`,
        en: () => `Remove 1 already-built Stadium Infrastructure token of your choice.`
    },
    {
        pt: () => `Cancele 1 contrato de Patrocinador ativo, à sua escolha.`,
        en: () => `Cancel 1 active Sponsor contract of your choice.`
    },
    {
        pt: d => `Comece o próximo capítulo com -${pickNum(d, 1, 1, 2)} posição(ões) na trilha do Escritório (Office).`,
        en: d => `Start the next chapter with -${pickNum(d, 1, 1, 2)} space(s) on the Office track.`
    },
    {
        pt: () => `Um Jogador titular à sua escolha se lesiona e fica indisponível durante toda a primeira Semana do próximo capítulo.`,
        en: () => `One starting Player of your choice gets injured and is unavailable for the entire first Week of the next chapter.`
    },
    {
        pt: () => `Descarte 1 carta de Staff contratada, à sua escolha.`,
        en: () => `Discard 1 hired Staff card of your choice.`
    }
];

// Draws `count` distinct (not-yet-`used`) items from `pool`, optionally
// filtered by `filterFn`. Falls back to allowing repeats only if the pool
// (after filtering) genuinely runs out — should not normally happen for the
// max 5-chapter campaigns this tool generates against a pool of 10 items.
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

// Caches every random decision from the last generated campaign (arc,
// twists, objective picks, both-language team facts) so switching the UI
// language afterward can fully re-render the SAME campaign in the new
// language (see renderCampaign/onLanguageChanged) without re-rolling any
// pick or doing another network fetch.
let campaignState = null;

// Every chapter before the campaign's last one offers a "may move up" promotion
// chance (see the fixed-currentDiv comment above), and each is an independent
// unknown outcome — so by chapter i, the user could realistically still be in
// the starting division, or as low as one division per prior promotion chance
// taken. Returns the full list of divisions they could be in for that chapter,
// e.g. starting Division 3 with promotion enabled: ch.1=[3], ch.2=[3,2], ch.3=[3,2,1].
function possibleDivisionsForChapter(currentDiv, chapterNum, canPromote) {
    if (!canPromote) return [currentDiv];
    const maxDrops = Math.min(chapterNum - 1, currentDiv - 1);
    const divs = [];
    for (let d = currentDiv; d >= currentDiv - maxDrops; d--) divs.push(d);
    return divs;
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

    // Real-world grounding only applies to curated real teams — a custom
    // team skips Wikipedia entirely and uses generic, division/difficulty
    // scenarios instead (no real facts to look up for a fictional club).
    // Both language editions are fetched up front so a later language
    // switch can re-translate the facts too, with no extra network call.
    const factByLang = customTeam ? null : {
        pt: await fetchTeamData(team, 'pt'),
        en: await fetchTeamData(team, 'en')
    };

    // Pick exactly ONE story arc for the whole campaign so the narrative
    // stays coherent chapter to chapter (see STORY_ARCS comment above).
    // Avoids recently-used arcs (persisted across generations) so the same
    // storyline doesn't resurface for a long time.
    const arcIdx = pickAvoidingRecent(STORY_ARCS.length, 'eleven_recent_arcs', Math.max(1, STORY_ARCS.length - 2));
    const twistPool = CHAPTER_TWISTS.pt; // length is identical across languages

    const usedMain = new Set();
    const usedSecondary = new Set();
    const usedSetup = new Set();
    const usedFailPenalty = new Set();
    // Division stays fixed for the whole printed campaign: this is a one-shot
    // PNP document, so it can never know whether a real playthrough actually
    // earned a promotion each chapter. Auto-decrementing here used to silently
    // assume every promotion succeeded, contradicting the "if you finish 1st
    // or 2nd, you MAY move up" wording shown in the result box.
    const currentDiv = parseInt(division);
    const chapterPicks = [];

    for (let i = 1; i <= chapters; i++) {
        // A procedural per-chapter twist, independent of the arc, so the
        // combined arc+stage+twist+objectives space stays fresh for a long
        // time even across many separately-generated campaigns.
        const twistIdx = pickAvoidingRecent(twistPool.length, 'eleven_recent_twists', Math.max(1, twistPool.length - 2));
        const mainPicks = pickUnique(MAIN_OBJECTIVES, 2, o => o.appliesDiv(currentDiv), usedMain);
        const secondaryPicks = pickUnique(SECONDARY_OBJECTIVES, 2, null, usedSecondary);
        const setupPicks = pickUnique(SETUP_CHANGES, 2, null, usedSetup);
        // Only chapters that AREN'T the last one need a printed fail-penalty
        // (the last chapter's failure text is the fired/game-over one instead).
        const failPenaltyPick = i < chapters ? pickUnique(FAIL_PENALTIES, 1, null, usedFailPenalty)[0] : null;
        chapterPicks.push({ twistIdx, mainPicks, secondaryPicks, setupPicks, failPenaltyPick });
    }

    campaignState = { team, league, division, diff, chapters, canPromote, customTeam, factByLang, arcIdx, chapterPicks };
    renderCampaign(lang);
}


// Rebuilds the campaign PDF preview from the cached `campaignState` in the
// requested language — reuses every random pick made at generation time
// (arc, twists, objectives) so switching language never re-rolls the
// campaign, it only re-translates it. Called both right after generation
// and again from onLanguageChanged() whenever the UI language toggles.
function renderCampaign(lang) {
    const state = campaignState;
    if (!state) return;
    const ui = CAMPAIGN_UI[lang] || CAMPAIGN_UI.pt;
    const { team, league, division, diff, chapters, canPromote, customTeam, factByLang, arcIdx, chapterPicks } = state;

    const loader = document.getElementById('campaign-loader');
    const output = document.getElementById('campaign-output');
    const container = document.getElementById('pdf-container');

    const factData = customTeam ? null : (factByLang[lang] || factByLang.pt || factByLang.en);
    const sentences = customTeam
        ? genericFactSentences(lang, division, diff)
        : (factData && factData.extract ? splitSentences(factData.extract) : []);
    const fallbackThumb = customTeam ? null : ((factByLang.pt && factByLang.pt.thumbnail) || (factByLang.en && factByLang.en.thumbnail));
    const bgImage = (!customTeam && factData && factData.thumbnail) ? factData.thumbnail.source : (fallbackThumb ? fallbackThumb.source : '');

    const arc = STORY_ARCS[arcIdx];
    const arcText = arc[lang] || arc.pt;
    const twistPool = CHAPTER_TWISTS[lang] || CHAPTER_TWISTS.pt;

    let html = '';
    // Fixed for the whole campaign — see the matching comment in generateCampaign().
    const currentDiv = parseInt(division);

    for (let i = 1; i <= chapters; i++) {
        const picks = chapterPicks[i - 1];
        const stage = pickStage(arcText.stages, i, chapters);

        const fact = sentences.length ? sentences[(i - 1) % sentences.length] : '';
        const twist = twistPool[picks.twistIdx].replace('{team}', team);
        const introText = `${stage.text} ${twist}`.replace('{team}', team).replace('{fact}', fact).replace(/\s{2,}/g, ' ').trim();

        // Each chapter after the first demands numerically tougher targets
        // than the one before it (only for MAIN/SECONDARY objectives — see
        // pickNum's comment for why SETUP_CHANGES is excluded).
        const chapterFactor = (i - 1) * 0.12;
        const pipCount = 4;
        const pipsFilled = chapters > 1 ? Math.round((i - 1) * pipCount / (chapters - 1)) : 0;
        const difficultyPips = '●'.repeat(pipsFilled) + '○'.repeat(pipCount - pipsFilled);

        const mainPicks = picks.mainPicks;
        const goals = mainPicks.map(o => o[lang](diff, chapterFactor));
        const extraGoals = picks.secondaryPicks.map(o => o[lang](diff, chapterFactor));
        const setup = picks.setupPicks.map(o => o[lang](diff));

        // Failure isn't always a firing offense: only the campaign's finale
        // or a chapter carrying a `critical` objective (e.g. avoiding
        // relegation) results in getting fired. Any other failed chapter
        // just means the board's patience wears thinner going forward —
        // backed by a concrete, printed setup penalty for the next chapter
        // (see FAIL_PENALTIES) instead of just flavor text.
        const isCritical = (i === chapters) || mainPicks.some(o => o.critical);
        const failPenaltyText = (!isCritical && picks.failPenaltyPick) ? picks.failPenaltyPick[lang](diff) : '';

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
                        <div class="meta-line">${ui.division}: ${possibleDivisionsForChapter(currentDiv, i, canPromote).join('/')}</div>
                        <div class="meta-line">${ui.difficultyLabel}: ${difficultyPips}</div>
                        ${isCritical ? `<div class="meta-line critical-flag">⚠ ${ui.criticalChapterNote}</div>` : ''}
                    </div>
                </div>

                <div class="pdf-narrative">${introText}</div>

                <div class="pdf-field">
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
                        <p>${ui.resultComplete} ${canPromote && i < chapters && currentDiv > 1 ? ui.resultPromote + ' ' + (currentDiv - 1) + '.' : ''}</p>
                        <p>${isCritical ? ui.resultFail : ui.resultFailSoft}${failPenaltyText ? ` <strong>${ui.failPenaltyLabel}:</strong> ${failPenaltyText}` : ''}</p>
                    </div>
                </div>

                <div class="pdf-continuity">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/></svg>
                    <span>${ui.continuityNote}</span>
                </div>
            </div>
        `;
        html += chapterHtml;
    }

    loader.style.display = 'none';
    output.style.display = 'block';
    container.innerHTML = html;
}

// Called from setLang() in eleven_bot_v1.html whenever the UI language
// toggles — re-renders an already-generated campaign in the new language
// (cached picks + cached bilingual team facts, no re-roll, no refetch).
function onLanguageChanged(lang) {
    if (!campaignState) return;
    const output = document.getElementById('campaign-output');
    if (output && output.style.display === 'block') {
        renderCampaign(lang);
    }
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

