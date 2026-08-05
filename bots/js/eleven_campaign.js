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

// Each template carries both languages so a chosen scenario stays internally
// consistent (same story/goals) regardless of which language it's rendered in.
const SCENARIO_TEMPLATES = [
    {
        pt: {
            title: "Primeiro Amor",
            intro: "O clube passou por problemas financeiros recentemente. A gestão da cidade mudou e investidores ameaçam comprar o estádio para demoli-lo. Você voltou para salvar o clube de coração.",
            goals: [
                "Atinja o nível 'Diretor Assistente'.",
                "Termine o cenário no mínimo em 4º lugar na liga."
            ],
            extraGoals: [
                "Termine em 2º lugar ou superior.",
                "Tenha o marcador de Fãs no nível 5."
            ],
            setup: [
                "Comece com -1 Dinheiro.",
                "Coloque um marcador não utilizado no 0 da Trilha de Poupança."
            ]
        },
        en: {
            title: "First Love",
            intro: "The club has recently gone through financial trouble. City management has changed, and investors are threatening to buy the stadium just to demolish it. You came back to save the club you love.",
            goals: [
                "Reach the 'Assistant of a Manager' level.",
                "Finish the scenario in at least 4th place in the league."
            ],
            extraGoals: [
                "Finish in 2nd place or higher.",
                "Have the Fan Base marker at level 5."
            ],
            setup: [
                "Start with -1 Money.",
                "Place an unused marker on the 0 space of the Savings track."
            ]
        }
    },
    {
        pt: {
            title: "Tempos de Crise",
            intro: "O seu clube perdeu o seu principal patrocinador de forma repentina. Você precisa reerguer as finanças e provar à torcida que o time ainda é forte.",
            goals: [
                "Atinja o nível 'Manager Promissor'.",
                "Não seja rebaixado (Mantenha-se fora dos últimos 2 lugares)."
            ],
            extraGoals: [
                "Contrate pelo menos 3 jovens talentos.",
                "Termine com pelo menos 5 milhões em caixa."
            ],
            setup: [
                "Não receba patrocinadores iniciais.",
                "Seus jogadores veteranos custam +1 na primeira semana."
            ]
        },
        en: {
            title: "Times of Crisis",
            intro: "Your club suddenly lost its main sponsor. You need to rebuild the finances and prove to the fans that the team is still strong.",
            goals: [
                "Reach the 'Promising Manager' level.",
                "Avoid relegation (stay out of the bottom 2 places)."
            ],
            extraGoals: [
                "Hire at least 3 young talents.",
                "Finish with at least 5 million in cash."
            ],
            setup: [
                "Don't receive any starting Sponsors.",
                "Your Veteran Players cost +1 in the first Week."
            ]
        }
    },
    {
        pt: {
            title: "A Caminho da Glória",
            intro: "Os torcedores estão empolgados! A diretoria liberou fundos para infraestrutura, mas exige resultados imediatos.",
            goals: [
                "Aumente seu estádio com pelo menos 2 arquibancadas.",
                "Termine no Top 3 da sua Divisão."
            ],
            extraGoals: [
                "Seja campeão da Liga.",
                "Mantenha o time principal sem lesões durante a temporada."
            ],
            setup: [
                "Comece com +2 Dinheiro.",
                "O seu primeiro jogador veterano custa -1."
            ]
        },
        en: {
            title: "On the Road to Glory",
            intro: "The fans are thrilled! The board has released funds for infrastructure, but demands immediate results.",
            goals: [
                "Expand your stadium with at least 2 Stands.",
                "Finish in the Top 3 of your Division."
            ],
            extraGoals: [
                "Become League Champion.",
                "Keep your main team injury-free during the season."
            ],
            setup: [
                "Start with +2 Money.",
                "Your first Veteran Player costs -1."
            ]
        }
    }
];

function getRandomTemplate(lang) {
    const tpl = SCENARIO_TEMPLATES[Math.floor(Math.random() * SCENARIO_TEMPLATES.length)];
    return tpl[lang] || tpl.pt;
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
    
    if(!team) {
        alert(ui.alertNoTeam);
        return;
    }

    loader.style.display = 'block';
    output.style.display = 'none';
    container.innerHTML = '';

    // Fetch team info
    const teamData = await fetchTeamData(team);
    
    let html = '';
    let currentDiv = parseInt(division);

    for(let i = 1; i <= chapters; i++) {
        const tpl = getRandomTemplate(lang);
        
        let introText = tpl.intro;
        if (i === 1 && teamData && teamData.extract) {
            introText = `<em>${teamData.extract.substring(0, 150)}...</em><br><br>${introText}`;
        }

        let bgImage = teamData && teamData.thumbnail ? teamData.thumbnail.source : '';

        let chapterHtml = `
            <div class="pdf-preview" id="chapter-${i}">
                <div style="display:flex; justify-content:space-between;">
                    <h1>${team.toUpperCase()}</h1>
                    ${bgImage ? `<img src="${bgImage}" style="height:60px; object-fit:contain;">` : ''}
                </div>
                <div class="season-info">${ui.chapter} ${i}/${chapters} | ${ui.league}: ${league.toUpperCase()} | ${ui.division}: ${currentDiv}</div>
                
                <div class="flavor-text">
                    <strong>${ui.history}</strong><br>
                    ${introText}
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                    <div class="pdf-box goals">
                        <h3>${ui.goalsTitle}</h3>
                        <p><strong>${ui.directive}</strong></p>
                        <ul>${tpl.goals.map(g => `<li>${g}</li>`).join('')}</ul>
                        <br>
                        <p><strong>${ui.bonus}</strong></p>
                        <ul>${tpl.extraGoals.map(g => `<li>${g}</li>`).join('')}</ul>
                    </div>
                    <div class="pdf-box">
                        <h3>${ui.setupTitle}</h3>
                        <ul>${tpl.setup.map(g => `<li>${g}</li>`).join('')}</ul>
                    </div>
                </div>
                
                <div class="pdf-box">
                    <h3>${ui.resultTitle}</h3>
                    <p>${ui.resultComplete} ${canPromote && i < chapters ? ui.resultPromote + ' ' + (currentDiv-1) + '.' : ''}</p>
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
