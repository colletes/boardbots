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
        alertNoTeam: 'Por favor, insira o nome de um time.',
        chapter: 'CAPÍTULO', league: 'LIGA', division: 'DIVISÃO',
        history: 'História:', goalsTitle: 'OBJETIVOS DA TEMPORADA',
        directive: 'A Diretoria exige que você:', bonus: 'Bônus se você:',
        setupTitle: 'MUDANÇAS DE SETUP', resultTitle: 'RESULTADO DO CENÁRIO',
        resultComplete: 'Se você completou os objetivos exigidos, avance para o próximo capítulo!',
        resultPromote: 'Se terminar em 1º ou 2º, você pode subir para a Divisão',
        resultFail: 'Se falhou, você foi demitido. Recomece o capítulo ou a campanha.',
        pdfFilename: 'Eleven_Campanha.pdf'
    },
    en: {
        alertNoTeam: 'Please enter a team name.',
        chapter: 'CHAPTER', league: 'LEAGUE', division: 'DIVISION',
        history: 'Story:', goalsTitle: 'SEASON OBJECTIVES',
        directive: 'The Board demands that you:', bonus: 'Bonus if you:',
        setupTitle: 'SETUP CHANGES', resultTitle: 'SCENARIO OUTCOME',
        resultComplete: 'If you completed the required objectives, advance to the next chapter!',
        resultPromote: 'If you finish 1st or 2nd, you may move up to Division',
        resultFail: 'If you failed, you were fired. Restart the chapter or the campaign.',
        pdfFilename: 'Eleven_Campaign.pdf'
    }
};

// Picks a numeric threshold that scales with the chosen difficulty.
function pickNum(difficulty, easy, medium, hard) {
    return ({ easy, medium, hard })[difficulty] ?? medium;
}

// ---- Story Arcs ------------------------------------------------------
// Each arc is a narrative "hook" for a chapter. {team} is substituted with
// the real club name; {fact} is substituted with a real sentence pulled
// from that club's Wikipedia summary (a different sentence per chapter,
// when available) so every generated campaign is actually grounded in the
// chosen team's real history, not just generic filler text.
const STORY_ARCS = [
    {
        id: 'homecoming',
        pt: { title: 'Primeiro Amor', intro: 'Você voltou para casa. {team} é o clube da sua infância, e a torcida ainda lembra do seu nome. {fact} Agora é sua vez de devolver ao clube tudo o que ele um dia te deu.' },
        en: { title: 'First Love', intro: 'You have come home. {team} is the club of your childhood, and the fans still remember your name. {fact} Now it is your turn to give back everything the club once gave you.' }
    },
    {
        id: 'crisis',
        pt: { title: 'Tempos de Crise', intro: '{team} perdeu seu principal patrocinador de forma repentina e as contas não fecham. {fact} A torcida está impaciente e você precisa reerguer o clube antes que seja tarde demais.' },
        en: { title: 'Times of Crisis', intro: '{team} has just lost its main sponsor and the books no longer balance. {fact} The fans are growing impatient, and you must rebuild the club before it is too late.' }
    },
    {
        id: 'glory',
        pt: { title: 'A Caminho da Glória', intro: 'Os torcedores de {team} estão empolgados como há anos não se via. {fact} A diretoria liberou fundos para investir, mas exige resultados imediatos em troca.' },
        en: { title: 'On the Road to Glory', intro: 'Fans of {team} haven\'t been this excited in years. {fact} The board has released funds to invest, but demands immediate results in return.' }
    },
    {
        id: 'boardroom',
        pt: { title: 'Novos Donos, Novas Regras', intro: 'Um novo grupo investidor assumiu o comando de {team}. {fact} Eles falam em "projeto vencedor" e "resultados imediatos" — e não têm paciência para desculpas.' },
        en: { title: 'New Owners, New Rules', intro: 'A new ownership group has taken over {team}. {fact} They talk of a "winning project" and "immediate results" — and have no patience for excuses.' }
    },
    {
        id: 'academy',
        pt: { title: 'A Base do Futuro', intro: 'A diretoria de {team} decidiu apostar nas categorias de base. {fact} Cabe a você transformar Youngsters promissores em peças de confiança do time principal.' },
        en: { title: 'The Future Starts Here', intro: 'The board at {team} has decided to invest in the youth academy. {fact} It is up to you to turn promising Youngsters into trusted first-team players.' }
    },
    {
        id: 'departure',
        pt: { title: 'O Fim de uma Era', intro: 'O maior ídolo recente de {team} acabou de ser vendido para um clube maior, e o vestiário sente o baque. {fact} Reconstruir o time sem sua estrela será o maior desafio da temporada.' },
        en: { title: 'End of an Era', intro: '{team}\'s biggest recent star has just been sold to a bigger club, and the dressing room feels the blow. {fact} Rebuilding the squad without your star man will be the season\'s biggest test.' }
    },
    {
        id: 'derby',
        pt: { title: 'Rivalidade Local', intro: 'O clássico contra o maior rival está mais próximo do que nunca, e {team} não vence esse confronto há tempos. {fact} A cidade inteira espera um resultado digno de orgulho.' },
        en: { title: 'Local Rivalry', intro: 'The derby against the biggest rival is closer than ever, and {team} hasn\'t won that fixture in a long while. {fact} The whole city is hoping for a result worth celebrating.' }
    },
    {
        id: 'lastdance',
        pt: { title: 'Última Dança', intro: 'Esta é sua última temporada no comando de {team} antes da aposentadoria. {fact} Você quer ser lembrado não só pelas conquistas, mas por ter deixado o clube melhor do que o encontrou.' },
        en: { title: 'One Last Dance', intro: 'This is your final season in charge of {team} before retirement. {fact} You want to be remembered not only for the trophies, but for leaving the club better than you found it.' }
    }
];

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
    const team = document.getElementById('camp-team').value;
    const league = document.getElementById('camp-league').value;
    const division = document.getElementById('camp-division').value;
    const diff = document.getElementById('camp-difficulty').value;
    const chapters = parseInt(document.getElementById('camp-chapters').value);
    const canPromote = document.getElementById('camp-promotion').checked;

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

    // Fetch team info — real Wikipedia data feeds every chapter's story text,
    // not just a single truncated blurb on chapter 1.
    const teamData = await fetchTeamData(team);
    const sentences = teamData && teamData.extract ? splitSentences(teamData.extract) : [];
    const bgImage = teamData && teamData.thumbnail ? teamData.thumbnail.source : '';

    let html = '';
    let currentDiv = parseInt(division);
    const usedArcs = new Set();
    const usedMain = new Set();
    const usedSecondary = new Set();
    const usedSetup = new Set();

    for (let i = 1; i <= chapters; i++) {
        const arcCandidates = STORY_ARCS.filter((_, idx) => !usedArcs.has(idx));
        const arcPool = arcCandidates.length ? arcCandidates : STORY_ARCS;
        const arc = arcPool[Math.floor(Math.random() * arcPool.length)];
        usedArcs.add(STORY_ARCS.indexOf(arc));
        const arcText = arc[lang] || arc.pt;

        const fact = sentences.length ? sentences[(i - 1) % sentences.length] : '';
        const introText = arcText.intro.replace('{team}', team).replace('{fact}', fact).replace(/\s{2,}/g, ' ').trim();

        const mainPicks = pickUnique(MAIN_OBJECTIVES, 2, o => o.appliesDiv(currentDiv), usedMain);
        const secondaryPicks = pickUnique(SECONDARY_OBJECTIVES, 2, null, usedSecondary);
        const setupPicks = pickUnique(SETUP_CHANGES, 2, null, usedSetup);

        const goals = mainPicks.map(o => o[lang](diff));
        const extraGoals = secondaryPicks.map(o => o[lang](diff));
        const setup = setupPicks.map(o => o[lang](diff));

        let chapterHtml = `
            <div class="pdf-preview" id="chapter-${i}">
                <div style="display:flex; justify-content:space-between;">
                    <h1>${team.toUpperCase()}</h1>
                    ${bgImage ? `<img src="${bgImage}" style="height:60px; object-fit:contain;">` : ''}
                </div>
                <div class="season-info">${ui.chapter} ${i}/${chapters} | ${ui.league}: ${league.toUpperCase()} | ${ui.division}: ${currentDiv}</div>
                <div class="arc-title">${arcText.title}</div>

                <div class="flavor-text">
                    <strong>${ui.history}</strong><br>
                    ${introText}
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                    <div class="pdf-box goals">
                        <h3>${ui.goalsTitle}</h3>
                        <p><strong>${ui.directive}</strong></p>
                        <ul>${goals.map(g => `<li>${g}</li>`).join('')}</ul>
                        <br>
                        <p><strong>${ui.bonus}</strong></p>
                        <ul>${extraGoals.map(g => `<li>${g}</li>`).join('')}</ul>
                    </div>
                    <div class="pdf-box">
                        <h3>${ui.setupTitle}</h3>
                        <ul>${setup.map(g => `<li>${g}</li>`).join('')}</ul>
                    </div>
                </div>

                <div class="pdf-box">
                    <h3>${ui.resultTitle}</h3>
                    <p>${ui.resultComplete} ${canPromote && i < chapters ? ui.resultPromote + ' ' + (currentDiv - 1) + '.' : ''}</p>
                    <p>${ui.resultFail}</p>
                </div>
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
