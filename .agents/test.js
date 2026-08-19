
    // --- Translations ---
    const I18N = {
        pt: {
            pageTitle: "Space Base Bot",
            title: "Space Base Bot",
            subtitle: "Automa e Ataque à Base (SoloPlay)",
            setupTitle: "Configuração do Jogo", physSetupTitle: "Setup Físico (Joanna):", physSetupDesc: "Coloque os 3 cubos da Joanna no 0 (VP, Moeda e Renda). Compre uma carta inicial Nível 1 aleatória para ela. Ela não recebe cartas iniciais de setor.",
            gameMode: "Modo de Jogo",
            modeJoanna: "Automa (Joanna/Devin/Clarie)",
            modeBaseAttack: "Ataque à Base (SoloPlay)",
            difficulty: "Dificuldade (Automa)",
            diffEasy: "Joanna (Fácil)",
            diffMedium: "Devin (Médio)",
            diffHard: "Clarie (Difícil)",
            diceMode: "Rolagem de Dados",
            diceVirtual: "Dados Virtuais 3D",
            dicePhysical: "Dados Físicos (Manual)",
            startBtn: "Iniciar Partida",
            turnControl: "Controle do Turno",
            nextTurn: "Próximo Turno (Revelar Carta)",
            vpTracker: "Rastreador de VP (Opcional)",
            baseAttackPrompt: "O que você comprou no seu turno?",
            baColony: "Comprei Colony Ship (Ataque: 0)",
            baShip: "Comprei Ship (Ataque: 2)",
            baDidNotBuy: "Não comprei nada (Ataque baseado na sua renda):",
            shuffleDeckBtn: "Embaralhar Descarte no Deck",
            botArea: "Área do Bot",
            cardInstruction: "Mova o cubo do automa na sua base e escolha a linha correspondente à trilha onde o cubo está.",
            emptyLog: "Aguardando a resolução do seu turno...",
            rulesTitle: "Regras & Ajuda",
            newGame: "🔄 Nova Partida",
            attackMessage: "Oponentes atacam com {n} nave(s) nos setores:",
            rulesTitle: 'Regras & Ajuda',
            ruleAutomaTitle: 'Modo Automa (Joanna, Devin, Clarie)',
            ruleAutoma1: '<strong>Seu Turno:</strong> Jogue normalmente. O Automa só ganha coisas no seu turno se você ativar uma recompensa vermelha que beneficia "todos os outros jogadores" (ele ganha os VPs indicados, mas ignora moedas/renda).',
            ruleAutoma2: '<strong>Turno do Automa:</strong> Clique em "Próximo Turno". O bot rolará os dados e revelará a carta do turno. Os dados rolam para você ativar recompensas vermelhas.',
            ruleAutoma3: '<strong>Verificar Trilhas:</strong> A carta mostra 3 trilhas: VPs (topo), Renda (meio) e Moedas (baixo). O Automa age dependendo do seu progresso:<br><ul style="margin-top:6px; color:#94a3b8;"><li>Se os VPs do Automa forem <strong>menores</strong> que o Limite (ex: 4.0 VP), use a linha de VP.</li><li>Se VPs >= Limite, mas a Renda do Automa for menor que o Limite (ex: 15🌍), use a linha de Renda.</li><li>Se Renda >= Limite, use a linha de Moedas.</li></ul>',
            ruleAutoma4: '<strong>Ação da Linha:</strong> Na linha ativada, observe qual espaço (1 a 6) tem um \'X\'. <strong>Descarte</strong> a carta de nave daquele espaço no mercado central (níveis 1, 2 e 3 correspondem aos ícones). Em seguida, o Automa ganha a quantidade de VPs no foguete azul daquela linha. (Nota: o Automa nunca ganha moedas ou renda de verdade).',
            ruleAutoma5: '<strong>Ciclo do Deck:</strong> O deck tem 6 cartas. Quando sobrar apenas 1, ela será ignorada, o deck é re-embaralhado e o ciclo recomeça.',
            ruleSoloTitle: 'Modo SoloPlay (Ataque à Base)',
            ruleSolo1: 'Neste modo você não joga contra um Automa com pontos, mas contra um deck de ataque que destrói suas posições.',
            ruleSolo2: 'Sempre que você usar uma ação de compra ou implantação, clique no botão correspondente na lateral esquerda. O bot sorteará cartas de ataque.',
            ruleSolo3: 'Cada carta sacada ataca um setor numérico da sua base. Coloque a carta do baralho de ataque invertida debaixo do setor atacado (ela funcionará como uma recompensa vermelha para você no futuro!).',
            ruleSolo4: '<strong>Destruição:</strong> Se um mesmo setor acumular 4 cartas de dano, ele é permanentemente destruído. Retire as 4 cartas de dano e vire-as para cima bloqueando aquele setor. Se você perder 5 setores, você perde o jogo.',
            shuffledLog: '🔄 Deck de Ataque Embaralhado',
            creditsText: 'Space Base Bot desenvolvido com ❤️ por Thiago Colletes.',
            backHome: 'Voltar para Home',
            manualDicePrompt: 'Dados físicos: informe o resultado dos dois dados:',
            die1Label: 'Dado 1',
            die2Label: 'Dado 2',
            sumLabel: 'Soma'
        },
        en: {
            pageTitle: "Space Base Bot",
            title: "Space Base Bot",
            subtitle: "Automa and Base Attack (SoloPlay)",
            setupTitle: "Game Setup", physSetupTitle: "Physical Setup (Joanna):", physSetupDesc: "Place Joanna\'s 3 cubes on 0 (VP, Coins, and Income). Draw one random Level 1 starting card for her. She does not get sector starting cards.",
            gameMode: "Game Mode",
            modeJoanna: "Official Automa (Joanna/Devin/Clarie)",
            modeBaseAttack: "Base Attack (SoloPlay)",
            difficulty: "Difficulty (Automa)",
            diffEasy: "Joanna (Easy)",
            diffMedium: "Devin (Medium)",
            diffHard: "Clarie (Hard)",
            diceMode: "Dice Rolling",
            diceVirtual: "3D Virtual Dice",
            dicePhysical: "Physical Dice (Manual)",
            startBtn: "Start Game",
            turnControl: "Turn Control",
            nextTurn: "Next Turn (Reveal Card)",
            vpTracker: "VP Tracker (Optional)",
            baseAttackPrompt: "What did you buy on your turn?",
            baColony: "Bought Colony Ship (Attack: 0)",
            baShip: "Bought Ship (Attack: 2)",
            baDidNotBuy: "Did not buy (Attack based on income):",
            shuffleDeckBtn: "Shuffle Discard into Deck",
            botArea: "Bot Area",
            cardInstruction: "Move the automa's cube on your board and choose the row matching the track the cube is on.",
            emptyLog: "Waiting for your turn resolution...",
            rulesTitle: "Rules & Help",
            newGame: "🔄 New Game",
            attackMessage: "Opponents attack with {n} ship(s) in sectors:",
            rulesTitle: 'Rules & Help',
            ruleAutomaTitle: 'Automa Mode (Joanna, Devin, Clarie)',
            ruleAutoma1: '<strong>Your Turn:</strong> Play normally. The Automa only gains things on your turn if you trigger a red reward that benefits "all other players" (it gains the indicated VPs, but ignores coins/income).',
            ruleAutoma2: '<strong>Automa\'s Turn:</strong> Click "Next Turn". The bot will roll dice and reveal the turn card. The dice roll is for you to activate your red rewards.',
            ruleAutoma3: '<strong>Check Tracks:</strong> The card shows 3 tracks: VPs (top), Income (middle), and Coins (bottom). The Automa acts depending on its progress:<br><ul style="margin-top:6px; color:#94a3b8;"><li>If Automa VPs are <strong>less</strong> than the Limit (e.g. 4.0 VP), use the VP track.</li><li>If VPs >= Limit, but Automa Income is less than the Limit (e.g. 15🌍), use the Income track.</li><li>If Income >= Limit, use the Coins track.</li></ul>',
            ruleAutoma4: '<strong>Track Action:</strong> On the active track, check which space (1 to 6) has an \'X\'. <strong>Discard</strong> the ship card from that space in the central market (levels 1, 2, and 3 correspond to the icons). Then, the Automa gains the amount of VPs in the blue rocket of that track. (Note: the Automa never actually gains coins or income).',
            ruleAutoma5: '<strong>Deck Cycle:</strong> The deck has 6 cards. When only 1 is left, it is ignored, the deck is reshuffled, and the cycle restarts.',
            ruleSoloTitle: 'SoloPlay Mode (Base Attack)',
            ruleSolo1: 'In this mode you do not play against a scoring Automa, but against an attack deck that destroys your stations.',
            ruleSolo2: 'Whenever you use a buy or deploy action, click the corresponding button on the left sidebar. The bot will draw attack cards.',
            ruleSolo3: 'Each drawn card attacks a numbered sector of your base. Tuck the attack card upside down under the attacked sector (it will act as a red reward for you in the future!).',
            ruleSolo4: '<strong>Destruction:</strong> If the same sector accumulates 4 damage cards, it is permanently destroyed. Remove the 4 damage cards and flip them face up to block that sector. If you lose 5 sectors, you lose the game.',
            shuffledLog: '🔄 Attack Deck Shuffled',
            creditsText: 'Space Base Bot developed with ❤️ by Thiago Colletes.',
            backHome: 'Back to Home',
            manualDicePrompt: 'Physical dice: enter the result of both dice:',
            die1Label: 'Die 1',
            die2Label: 'Die 2',
            sumLabel: 'Sum'
        }
    };

    let currentLang = localStorage.getItem('boardbots_lang') || 'pt';

    function t(key, vars = {}) {
        let str = I18N[currentLang][key] || I18N['pt'][key] || key;
        for (let k in vars) {
            str = str.replace(new RegExp(`{${k}}`, 'g'), vars[k]);
        }
        return str;
    }

    function applyI18n() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.innerHTML = t(el.getAttribute('data-i18n'));
        });
        document.documentElement.lang = currentLang;
    }

    window.toggleLanguage = function() {
        currentLang = currentLang === 'pt' ? 'en' : 'pt';
        localStorage.setItem('boardbots_lang', currentLang);
        applyI18n();
        updateDeckStatusText();
    };

    // --- State Variables ---
    let gameMode = 'joanna';
    let diceMode = 'virtual';
    let difficulty = 'easy'; // easy, medium, hard
    
    // Joanna State
    let automaDeck = [0, 1, 2, 3, 4, 5];
    let automaDiscard = [];
    
    // Base Attack State
    let attackDeck = [];
    let attackDiscard = [];

    const LS_KEY = 'space_base_bot_v1';

    function saveState() {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify({
                gameMode, diceMode, difficulty,
                automaDeck, automaDiscard,
                attackDeck, attackDiscard,
                vpCounter: parseInt(document.getElementById('vpCounter')?.value || 0)
            }));
        } catch(e) {}
    }

    function loadState() {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (!raw) return false;
            const s = JSON.parse(raw);
            gameMode = s.gameMode ?? 'joanna';
            diceMode = s.diceMode ?? 'virtual';
            difficulty = s.difficulty ?? 'easy';
            automaDeck = s.automaDeck ?? [0,1,2,3,4,5];
            automaDiscard = s.automaDiscard ?? [];
            attackDeck = s.attackDeck ?? [];
            attackDiscard = s.attackDiscard ?? [];
            return { vpCounter: s.vpCounter ?? 0 };
        } catch(e) { return false; }
    }

    // --- Joanna Card Data ---
    // Approximated 6-card distribution for the automa
    const automaCardsData = [
        { r1: {x:4, vp:1}, r2: {x:3, vp:1}, r3: {x:1, vp:1} },
        { r1: {x:5, vp:1}, r2: {x:4, vp:1}, r3: {x:2, vp:1} },
        { r1: {x:2, vp:2}, r2: {x:5, vp:2}, r3: {x:3, vp:2} },
        { r1: {x:3, vp:2}, r2: {x:6, vp:2}, r3: {x:4, vp:2} },
        { r1: {x:4, vp:3}, r2: {x:2, vp:3}, r3: {x:5, vp:3} },
        { r1: {x:6, vp:3}, r2: {x:1, vp:3}, r3: {x:6, vp:3} }
    ];

    const diffConfigs = {
        easy:   { name: 'Joanna', t_coins: 25, t_income: 15, vp_mod: 0 },
        medium: { name: 'Devin',  t_coins: 28, t_income: 12, vp_mod: 1 },
        hard:   { name: 'Clarie', t_coins: 26, t_income: 14, vp_mod: 2 }
    };

    // --- Logic ---
    function updateSetupUI() {
        gameMode = document.getElementById('gameMode').value;
        const titleEl = document.querySelector('[data-i18n="physSetupTitle"]');
        const descEl = document.querySelector('[data-i18n="physSetupDesc"]');
        
        if(gameMode === 'joanna') {
            document.getElementById('joannaDiffRow').style.display = 'block';
            titleEl.innerHTML = currentLang === 'en' ? 'Physical Setup (Joanna):' : 'Setup Físico (Joanna):';
            descEl.innerHTML = currentLang === 'en' ? 'Place Joanna\'s 3 cubes on 0 (VP, Coins, and Income). Draw one random Level 1 starting card for her. She does not get sector starting cards. Players start with their normal boards (cubes on 5, 0, 0) and 1 starting ship.' : 'Coloque os 3 cubos da Joanna no 0 (VP, Moeda e Renda). Compre uma carta inicial Nível 1 aleatória para ela. Ela não recebe cartas iniciais de setor. Os jogadores começam com seus tabuleiros normais (cubos no 5, 0, 0) e 1 nave inicial.';
        } else {
            document.getElementById('joannaDiffRow').style.display = 'none';
            titleEl.innerHTML = currentLang === 'en' ? 'Physical Setup (Base Attack):' : 'Setup Físico (Ataque à Base):';
            descEl.innerHTML = currentLang === 'en' ? 'There is no Automa board. Set up your normal player board (cubes on 5, 0, 0) and 1 starting ship. Every time you buy/deploy a card, click the corresponding button on the bot.' : 'Não há tabuleiro de Automa. Prepare seu tabuleiro normal de jogador (cubos no 5, 0, 0) e 1 nave inicial. Sempre que você comprar/implantar uma carta, clique no botão correspondente no bot.';
        }
    }

    // --- Dice Animation using @3d-dice/dice-box ---
    let diceBox = null;
    let diceBoxReady = false;

    async function initDiceBox() {
        if(diceBox) return;
        try {
            const { default: DiceBox } = await import('../assets/dice-box/dice-box.es.min.js');
            diceBox = new DiceBox({
                container: '#dice-box',
                assetPath: '../assets/dice-box/', origin: '',
                
                theme: 'default',
                themeColor: '#1e293b',
                scale: 6,
                gravity: 2.5,
                friction: 0.8,
                restitution: 0.5
            });
            await Promise.race([
                diceBox.init(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 4000))
            ]);
            diceBoxReady = true;
            
            diceBox.onRollComplete = (results) => {
                const d1 = results[0]?.value ?? 1;
                const d2 = results[1]?.value ?? 1;
                const txt = document.getElementById('diceResultText');
                txt.style.display = 'block';
                txt.innerText = `🎲 ${d1} | ${d2}  (Soma: ${d1+d2})`;
            };
        } catch(err) {
            console.error("Failed to load dice-box", err);
            diceBoxReady = false;
        }
    }

    function rollVirtualDice() {
        if(diceMode !== 'virtual') return;
        if(!diceBoxReady) {
            // fallback
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            const txt = document.getElementById('diceResultText');
            txt.style.display = 'block';
            txt.innerText = `🎲 ${d1} | ${d2}  (Soma: ${d1+d2})`;
            return;
        }
        
        document.getElementById('diceResultText').style.display = 'none';
        diceBox.roll('2d6');
    }


    let manualD1 = 1;
    let manualD2 = 1;

    window.setManualDie = function(die, value) {
        if (die === 1) {
            manualD1 = value;
            document.querySelectorAll('#die1Buttons .sb-die-btn').forEach((b, i) => b.classList.toggle('active-die1', i + 1 === value));
        } else {
            manualD2 = value;
            document.querySelectorAll('#die2Buttons .sb-die-btn').forEach((b, i) => b.classList.toggle('active-die2', i + 1 === value));
        }
        document.getElementById('manualDiceSum').textContent = manualD1 + manualD2;
    };


    window.startGame = async function() {
        gameMode = document.getElementById('gameMode').value;
        diceMode = document.getElementById('diceMode').value;
        difficulty = document.getElementById('difficulty').value;
        
        document.getElementById('setupOverlay').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'grid';
        
        if (diceMode === 'virtual') {
            document.getElementById('dice-box').style.display = 'block';
            await initDiceBox();
        }

        if (diceMode === 'physical') {
            document.getElementById('manualDiceArea').style.display = 'block';
        }

        if (gameMode === 'joanna') {
            document.getElementById('joannaControls').style.display = 'block';
            document.getElementById('baseAttackControls').style.display = 'none';
            document.getElementById('joannaCardDisplay').style.display = 'block';
            document.getElementById('attackLogContainer').style.display = 'none';
            
            const conf = diffConfigs[difficulty];
            document.getElementById('cardDiffName').innerText = conf.name;
            document.getElementById('vpThresholds').innerText = `${conf.t_coins}🪙 | ${conf.t_income}🌍 | 4.0VP`;
            
            shuffleArray(automaDeck);
            // Mostrar a primeira carta e rolar dados imediatamente:
            nextJoannaTurn(false);
        } else {
            document.getElementById('joannaControls').style.display = 'none';
            document.getElementById('baseAttackControls').style.display = 'block';
            document.getElementById('joannaCardDisplay').style.display = 'none';
            document.getElementById('attackLogContainer').style.display = 'block';
            
            initAttackDeck();
            // Rolar os dados iniciais para o jogador no modo Base Attack
            rollVirtualDice();
        }
        saveState();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // --- Joanna Logic ---
    window.nextJoannaTurn = function(skipRoll = false) {
        if (automaDeck.length <= 1) {
            // "Whenever Joanna has one card left... shuffle all back... skip one card"
            automaDeck = [0, 1, 2, 3, 4, 5];
            shuffleArray(automaDeck);
            // Skip one card (remove it completely for this cycle)
            automaDeck.pop();
            automaDiscard = [];
        }
        
        const cardIndex = automaDeck.pop();
        automaDiscard.push(cardIndex);
        
        renderJoannaCard(cardIndex);
        updateDeckStatusText();
        if (!skipRoll) rollVirtualDice();
        saveState();
    }

    function renderJoannaCard(index) {
        const data = automaCardsData[index];
        const conf = diffConfigs[difficulty];
        
        function renderRow(rowId, rowData) {
            const container = document.getElementById(`row${rowId}Ships`);
            container.innerHTML = '';
            for(let i=1; i<=6; i++) {
                if(i === rowData.x) {
                    container.innerHTML += `<div class="ship-slot ship-crossed"></div>`;
                } else {
                    container.innerHTML += `<div class="ship-slot"></div>`;
                }
            }
            // Add VP mod for devin/clarie for higher VP values (e.g. if base vp >= 2, add mod)
            let finalVP = rowData.vp;
            if (finalVP >= 2 && conf.vp_mod > 0) {
                finalVP += conf.vp_mod;
            }
            document.getElementById(`row${rowId}VP`).innerText = finalVP;
        }

        renderRow(1, data.r1);
        renderRow(2, data.r2);
        renderRow(3, data.r3);
    }

    window.changeVP = function(amount) {
        const input = document.getElementById('vpCounter');
        let val = parseInt(input.value) || 0;
        val += amount;
        if(val < 0) val = 0;
        input.value = val;
        saveState();
    }

    // --- Base Attack Logic ---
    function initAttackDeck() {
        attackDeck = [];
        for(let i=1; i<=12; i++) {
            attackDeck.push(i, i, i, i); // 4 of each
        }
        shuffleArray(attackDeck);
        attackDiscard = [];
        updateDeckStatusText();
    }

    window.baseAttackTurn = function(cardsToDraw) {
        if(cardsToDraw === 0) {
            rollVirtualDice();
            return; // no attack
        }
        
        document.getElementById('emptyLogState').style.display = 'none';
        
        let drawn = [];
        for(let i=0; i<cardsToDraw; i++) {
            if(attackDeck.length === 0) {
                // Should not happen often, but if it does, shuffle discard
                attackDeck = [...attackDiscard];
                attackDiscard = [];
                shuffleArray(attackDeck);
            }
            if(attackDeck.length > 0) {
                const c = attackDeck.pop();
                drawn.push(c);
                attackDiscard.push(c);
            }
        }
        
        drawn.sort((a,b) => a-b);
        
        const log = document.getElementById('attackLogDisplay');
        log.style.display = 'block';
        
        let cardsHTML = '';
        drawn.forEach(num => {
            cardsHTML += `<div class="attack-card">${num}</div>`;
        });
        
        const msg = t('attackMessage').replace('{n}', drawn.length);
        
        const li = document.createElement('li');
        li.className = 'attack-item';
        li.innerHTML = `
            <div style="font-size:0.9em; color:#cbd5e1; margin-bottom:5px;">${msg}</div>
            <div class="attack-cards-grid">${cardsHTML}</div>
        `;
        log.prepend(li);
        
        updateDeckStatusText();
        rollVirtualDice();
        saveState();
    }

    window.shuffleAttackDeck = function() {
        attackDeck = attackDeck.concat(attackDiscard);
        attackDiscard = [];
        shuffleArray(attackDeck);
        updateDeckStatusText();
        
        // Add log entry
        const log = document.getElementById('attackLogDisplay');
        log.style.display = 'block';
        const li = document.createElement('li');
        li.className = 'attack-item';
        li.style.borderColor = '#3b82f6';
        li.style.background = 'rgba(59, 130, 246, 0.1)';
        li.innerHTML = `<div style="color:#3b82f6; font-weight:bold; text-align:center;">${t('shuffledLog')}</div>`;
        log.prepend(li);
        saveState();
    }

    function updateDeckStatusText() {
        if(gameMode === 'joanna') {
            let txt = currentLang === 'en' ? `Cards in Deck: ${automaDeck.length} | Discard: ${automaDiscard.length}` : `Cartas no Deck: ${automaDeck.length} | Descarte: ${automaDiscard.length}`;
            document.getElementById('joannaDeckStatus').innerText = txt;
        } else {
            let txt = currentLang === 'en' ? `Attack Deck: ${attackDeck.length}/48` : `Baralho de Ataque: ${attackDeck.length}/48`;
            document.getElementById('baDeckStatus').innerText = txt;
        }
    }

    // Init i18n on load
    applyI18n();
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
        document.getElementById("setupOverlay").style.display = "none";
        document.getElementById("mainContainer").style.display = "grid";
        loadState();
        if (diceMode === "virtual") { document.getElementById("dice-box").style.display = "block"; initDiceBox(); }
        if (diceMode === "physical") { document.getElementById("manualDiceArea").style.display = "block"; }
    }

