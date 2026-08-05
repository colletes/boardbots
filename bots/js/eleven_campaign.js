async function fetchTeamData(teamName) {
    const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(teamName)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data; // { extract, title, thumbnail }
    } catch (e) {
        console.error("Wikipedia fetch error", e);
        return null;
    }
}

const SCENARIO_TEMPLATES = [
    {
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
    {
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
    {
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
    }
];

function getRandomTemplate() {
    return SCENARIO_TEMPLATES[Math.floor(Math.random() * SCENARIO_TEMPLATES.length)];
}

async function generateCampaign() {
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
        alert('Por favor, insira o nome de um time.');
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
        const tpl = getRandomTemplate();
        
        let introText = tpl.intro;
        if (i === 1 && teamData && teamData.extract) {
            introText = `<em>A história do clube é rica: ${teamData.extract.substring(0, 150)}...</em><br><br>${introText}`;
        }

        let bgImage = teamData && teamData.thumbnail ? teamData.thumbnail.source : '';

        let chapterHtml = `
            <div class="pdf-preview" id="chapter-${i}">
                <div style="display:flex; justify-content:space-between;">
                    <h1>${team.toUpperCase()}</h1>
                    ${bgImage ? `<img src="${bgImage}" style="height:60px; object-fit:contain;">` : ''}
                </div>
                <div class="season-info">CAPÍTULO ${i}/${chapters} | LIGA: ${league.toUpperCase()} | DIVISÃO: ${currentDiv}</div>
                
                <div class="flavor-text">
                    <strong>História:</strong><br>
                    ${introText}
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
                    <div class="pdf-box goals">
                        <h3>OBJETIVOS DA TEMPORADA</h3>
                        <p><strong>A Diretoria exige que você:</strong></p>
                        <ul>${tpl.goals.map(g => `<li>${g}</li>`).join('')}</ul>
                        <br>
                        <p><strong>Bônus se você:</strong></p>
                        <ul>${tpl.extraGoals.map(g => `<li>${g}</li>`).join('')}</ul>
                    </div>
                    <div class="pdf-box">
                        <h3>MUDANÇAS DE SETUP</h3>
                        <ul>${tpl.setup.map(g => `<li>${g}</li>`).join('')}</ul>
                    </div>
                </div>
                
                <div class="pdf-box">
                    <h3>RESULTADO DO CENÁRIO</h3>
                    <p>Se você completou os objetivos exigidos, avance para o próximo capítulo! ${canPromote && i < chapters ? 'Se terminar em 1º ou 2º, você pode subir para a Divisão ' + (currentDiv-1) + '.' : ''}</p>
                    <p>Se falhou, você foi demitido. Recomece o capítulo ou a campanha.</p>
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
    const element = document.getElementById('pdf-container');
    const opt = {
      margin:       0.5,
      filename:     'Eleven_Campanha.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}
