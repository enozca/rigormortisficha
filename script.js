document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURAÇÕES GLOBAIS ---
    const THEME_STORAGE_KEY = 'rigorMortisSelectedTheme_vFinalGen_Professional';
    const BLOCK_LAYOUT_KEY = 'rigorMortisBlockLayout_vFinalGen_Professional';
    const CHARACTER_DATA_KEY_LOCAL = 'rigorMortisCharacterData_vFinalGen_Local_Professional';

    // --- SELETORES DE ELEMENTOS PRINCIPAIS ---
    const htmlElement = document.documentElement;
    const themeSelector = document.getElementById('themeSelector');
    const notificationArea = document.getElementById('notificationArea');
    const workspaceContainer = document.getElementById('workspaceContainer');
    const authPanel = document.getElementById('authPanel');

    // Controles Gerais
    const toggleAuthPanelButton = document.getElementById('toggleAuthPanelButton');
    const saveButton = document.getElementById('saveButton');
    const saveLayoutButton = document.getElementById('saveLayoutButton');
    const clearButton = document.getElementById('clearButton');
    const resetLayoutButton = document.getElementById('resetLayoutButton');
    const roll2d6Button = document.getElementById('roll2d6Button');
    const diceResultDisplay = document.getElementById('diceResult');

    // Elementos da ficha
    const charName = document.getElementById('charName');
    const charConceito = document.getElementById('charConceito');
    const charAspiracao = document.getElementById('charAspiracao');
    const pontoFardoButton = document.getElementById('pontoFardo');
    const charArquetipo = document.getElementById('charArquetipo');
    const ativarArquetipoButton = document.getElementById('ativarArquetipo');
    const attrImpeto = document.getElementById('attrImpeto');
    const attrCinesia = document.getElementById('attrCinesia');
    const attrFinesse = document.getElementById('attrFinesse');
    const attrErudicao = document.getElementById('attrErudicao');
    const saudePoleElement = document.getElementById('saudePole');
    const volicaoPoleElement = document.getElementById('volicaoPole');
    const saudeValueInput = document.getElementById('saudeValue');
    const volicaoValueInput = document.getElementById('volicaoValue');
    const saudeConsequencias = document.getElementById('saudeConsequencias');
    const volicaoConsequencias = document.getElementById('volicaoConsequencias');
    const isTensionadoCheckbox = document.getElementById('isTensionado');
    const vicioPersonagemInput = document.getElementById('vicioPersonagem');
    const aptidoesGrid = document.getElementById('aptidoesGrid');
    const aptidoesCountDisplay = document.getElementById('aptidoesCountDisplay');
    const ocupacaoInput = document.getElementById('ocupacaoInput');
    const nivelFortunaSelect = document.getElementById('nivelFortunaSelect');
    const displayNivelFortuna = document.getElementById('displayNivelFortuna');
    const displayNivelMalandragem = document.getElementById('displayNivelMalandragem');
    const itensIniciaisFortunaDisplay = document.getElementById('itensIniciaisFortuna');
    const misterioDetail = document.getElementById('misterioDetail');
    const segredoDetail = document.getElementById('segredoDetail');
    const interpretacaoPenumbraDetail = document.getElementById('interpretacaoPenumbraDetail');
    const medosDetail = document.getElementById('medosDetail');
    const focosCountInput = document.getElementById('focosCount');
    const inventarioItensText = document.getElementById('inventarioItensText');
    const vestimentasAtivasText = document.getElementById('vestimentasAtivasText');
    const contatosList = document.getElementById('contatosList');
    const pontosAprimoramentoInput = document.getElementById('pontosAprimoramento');
    const habilidadesAdquiridas = document.getElementById('habilidadesAdquiridas');
    const casoPerguntasText = document.getElementById('casoPerguntasText');
    const palacioMentalText = document.getElementById('palacioMentalText');
    const anotacoesGeraisText = document.getElementById('anotacoesGeraisText');

    // --- ELEMENTOS DE AUTENTICAÇÃO ---
    const authContainer = document.getElementById('authContainer');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const userInfo = document.getElementById('userInfo');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const loginUserButton = document.getElementById('loginUserButton');
    const showRegisterLink = document.getElementById('showRegisterLink');
    const registerEmailInput = document.getElementById('registerEmail');
    const registerPasswordInput = document.getElementById('registerPassword');
    const registerUserButton = document.getElementById('registerUserButton');
    const showLoginLink = document.getElementById('showLoginLink');
    const userEmailDisplay = document.getElementById('userEmailDisplay');
    const logoutButton = document.getElementById('logoutButton');
    const userCharacterSelect = document.getElementById('userCharacterSelect');
    const loadSelectedCharacterButton = document.getElementById('loadSelectedCharacterButton');
    const deleteSelectedCharacterButton = document.getElementById('deleteSelectedCharacterButton');
    const newCharSaveNameInput = document.getElementById('newCharSaveName');

    // --- CONFIGURAÇÃO FIREBASE ---
    const firebaseConfig = {
        apiKey: "AIzaSyA9MzGAF_rVGm39qX1MSGphbpzfhFq24TM", // ATENÇÃO: Chave visível. Proteja com regras do Firestore/Auth.
        authDomain: "rigor-mortis.firebaseapp.com",      
        projectId: "rigor-mortis",                       
        storageBucket: "rigor-mortis.appspot.com",
        messagingSenderId: "211797532635",               
        appId: "1:211797532635:web:0b7d3de5f7eb16aa85d1fe", 
        measurementId: "G-V9HGF46MMQ"
    };
    try {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig); else firebase.app();
        if (firebaseConfig.measurementId && typeof firebase.analytics === 'function') firebase.analytics();
    } catch (e) { console.error("Erro Firebase Init:", e); showNotification("Erro crítico na conexão de dados.", 5000, 'error'); }

    const auth = firebase.auth();
    const db = firebase.firestore();

    let currentUser = null;
    let currentCharacterId = null;
    let userCharactersList = [];
    let isDirty = false;

    // --- DEFINIÇÕES DE DADOS DO JOGO ---
    const aptidoesBase = [
        'Limiar da Dor', 'Instinto', 'Confronto', 'Fervor', 'Atletismo', 'Artimanha', 'Sobrevivência',
        'Pontaria', 'Percepção', 'Reação', 'Destreza', 'Mecânica', 'Infiltração', 'Direção',
        'Acalento', 'Teatro', 'Charme', 'Vontade', 'Autoridade', 'Agricultura', 'Espírito',
        'Raciocínio', 'Abstração', 'Pesquisa', 'Memória', 'Balística', 'Medicina', 'Empiria'
    ].map(nome => ({id: nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]+/gi, ''), nome: nome}));

    const fortunaItensMap = {
        "5": "2 itens de Classe I", "4": "2 itens de Classe I e 1 item de Classe II",
        "3": "2 itens de Classe I e 2 itens de Classe II", "2": "3 itens de Classe I e 2 itens de Classe II",
        "1": "3 itens de Classe I, 2 itens de Classe II e 1 item de Classe III"
    };
    const arquetiposHabilidades = {
        colerico: "Realiza uma façanha física qualquer com perfeição.",
        melancolico: "Escolhe uma pessoa para sentir uma emoção selecionada por ela.",
        sanguineo: "Disfarça-se de alguma forma com uma execução impecável.",
        fleumatico: "Escolhe um elemento da cena para saber uma característica sobre ele."
    };

    const allFieldDataConfig = [
        { id: 'charName', type: 'text', default: "" }, { id: 'charConceito', type: 'text', default: "" }, { id: 'charAspiracao', type: 'text', default: "" },
        { id: 'charArquetipo', type: 'select', default: "" },
        { id: 'attrImpeto', type: 'number', default: 0 }, { id: 'attrCinesia', type: 'number', default: 0 },
        { id: 'attrFinesse', type: 'number', default: 0 }, { id: 'attrErudicao', type: 'number', default: 0 },
        { id: 'saudeValue', type: 'hidden', default: 3 }, { id: 'volicaoValue', type: 'hidden', default: 3 },
        { id: 'saudeConsequencias', type: 'textarea', default: "" }, { id: 'volicaoConsequencias', type: 'textarea', default: "" },
        { id: 'isTensionado', type: 'checkbox', default: false }, { id: 'vicioPersonagem', type: 'text', default: "" },
        { id: 'ocupacaoInput', type: 'text', default: "" }, { id: 'nivelFortunaSelect', type: 'select', default: "3"},
        { id: 'misterioDetail', type: 'text', default: "" }, { id: 'segredoDetail', type: 'text', default: "" },
        { id: 'interpretacaoPenumbraDetail', type: 'text', default: "" }, { id: 'medosDetail', type: 'text', default: "" },
        { id: 'focosCount', type: 'number', default: 0 },
        { id: 'inventarioItensText', type: 'textarea', default: "" },
        { id: 'vestimentasAtivasText', type: 'textarea', default: "" },
        { id: 'contatosList', type: 'textarea', default: "" },
        { id: 'pontosAprimoramento', type: 'number', default: 0 },
        { id: 'habilidadesAdquiridas', type: 'textarea', default: "" },
        { id: 'casoPerguntasText', type: 'textarea', default: "" }, { id: 'palacioMentalText', type: 'textarea', default: "" },
        { id: 'anotacoesGeraisText', type: 'textarea', default: "" },
    ];

    let fardoAtual = 0;
    let maxAptidoesSelecionaveis = 5;
    let blockStates = {}; // Para salvar layout dos blocos
    let maxZIndex = 0; // Para sobreposição de blocos
    let appLogicInitialized = false;

    // --- FUNÇÕES AUXILIARES ---
    function setDirty(state = true) { isDirty = state; }
    function saveToLocalStorage(key, dataString) { try { localStorage.setItem(key, dataString); } catch (e) { console.error(`LocalStorage Save Error (key: ${key}):`, e); showNotification("Erro ao salvar localmente. Armazenamento pode estar cheio.", 4000, 'error'); }}
    function showNotification(msg, dur = 3000, type = 'info') {
        if (!notificationArea) return;
        notificationArea.textContent = msg;
        notificationArea.className = 'notification-area show';
        notificationArea.classList.add(type);
        setTimeout(() => notificationArea.classList.remove('show'), dur);
    }
    function getFriendlyAuthErrorMessage(error) {
        switch (error.code) {
            case 'auth/invalid-email': return 'Formato de email inválido.';
            case 'auth/user-disabled': return 'Esta conta de usuário foi desabilitada.';
            case 'auth/user-not-found': return 'Usuário não encontrado. Verifique o email ou registre-se.';
            case 'auth/wrong-password': return 'Senha incorreta.';
            case 'auth/email-already-in-use': return 'Este email já está em uso por outra conta.';
            case 'auth/weak-password': return 'A senha é muito fraca (mínimo 6 caracteres).';
            case 'auth/configuration-not-found': return 'Configuração de autenticação não encontrada.';
            case 'auth/network-request-failed': return 'Erro de rede. Verifique sua conexão com a internet.';
            default: console.error("Auth Error Raw:", error); return error.message || "Erro desconhecido na autenticação.";
        }
    }

    // --- INICIALIZAÇÃO E ESTADO DE AUTENTICAÇÃO ---
    function initializeApp() {
        if (htmlElement) loadTheme();
        if (themeSelector) setupThemeSwitcher();
        if (workspaceContainer && typeof interact !== 'undefined') initializeInteractJs();
        
        auth.onAuthStateChanged(user => {
            currentUser = user;
            updateAuthStateUI();
            if (user) {
                fetchUserCharacters().then(() => {
                    handleCharacterSelectionChange(false);
                });
                if(workspaceContainer) workspaceContainer.style.display = 'flex'; // 'flex' para permitir blocos lado a lado
                initAppLogicOnce();
            } else {
                currentCharacterId = null;
                userCharactersList = [];
                populateCharacterSelect();
                if (loadCharacterDataFromLocalStorage()) {
                    if(workspaceContainer) workspaceContainer.style.display = 'flex';
                    initAppLogicOnce();
                } else {
                    if(workspaceContainer) workspaceContainer.style.display = 'none';
                    clearCharacterSheetUI(false);
                }
            }
            if (workspaceContainer && workspaceContainer.style.display !== 'none') {
                loadBlockLayout();
            }
        });
        setupGlobalControlBarListeners();
        setupAuthPanelListeners();
    }

    function updateAuthStateUI() {
        if (currentUser) {
            loginForm.style.display = 'none';
            registerForm.style.display = 'none';
            userInfo.style.display = 'block';
            userEmailDisplay.textContent = currentUser.email;
            userCharacterSelect.disabled = false;
            loadSelectedCharacterButton.disabled = false;
            newCharSaveNameInput.disabled = false;
        } else {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            userInfo.style.display = 'none';
            userCharacterSelect.disabled = true;
            loadSelectedCharacterButton.disabled = true;
            deleteSelectedCharacterButton.style.display = 'none';
            newCharSaveNameInput.disabled = true;
            newCharSaveNameInput.value = '';
        }
    }

    function setupAuthPanelListeners() {
        if (toggleAuthPanelButton && authPanel) {
            toggleAuthPanelButton.addEventListener('click', () => {
                authPanel.classList.toggle('visible');
                // Se o painel ficar visível e o workspace estiver escondido (usuário não logado e sem dados locais),
                // E NÃO HOUVER DADOS LOCAIS, então manter o workspace escondido.
                // Isso evita que o workspace apareça só porque o painel de login foi aberto.
                if (authPanel.classList.contains('visible') && workspaceContainer.style.display === 'none' && !localStorage.getItem(CHARACTER_DATA_KEY_LOCAL) && !currentUser) {
                    // Não faz nada com o workspace
                } else if (authPanel.classList.contains('visible') && workspaceContainer.style.display === 'none' && (localStorage.getItem(CHARACTER_DATA_KEY_LOCAL) || currentUser)) {
                     workspaceContainer.style.display = 'flex'; // Mostrar se deveria estar visível
                     initAppLogicOnce(); // Garante que a lógica da ficha está ativa
                     loadBlockLayout(); // Carrega o layout dos blocos
                }
            });
        }
    }

    // --- LÓGICA DA FICHA (Listeners, Display Updates) ---
    function initAppLogicOnce() {
        if (appLogicInitialized) return;
        if (!document.getElementById('blockPersonagem')) return;

        appLogicInitialized = true;
        populateAptidoes();
        initPoleBubbles(saudePoleElement, saudeValueInput, 'saudePoleBubble', parseInt(saudePoleElement.dataset.maxPoints) || 6);
        initPoleBubbles(volicaoPoleElement, volicaoValueInput, 'volicaoPoleBubble', parseInt(volicaoPoleElement.dataset.maxPoints) || 6);
        
        updateMaxAptidoesDisplay();
        updateFortunaMalandragemDisplay();
        updatePontoFardoButtonDisplay();
        setupCharacterSheetEventListeners();

        allFieldDataConfig.forEach(field => {
            const el = document.getElementById(field.id);
            if (el) {
                const eventType = (el.type === 'checkbox' || el.tagName === 'SELECT') ? 'change' : 'input';
                el.addEventListener(eventType, () => setDirty(true));
            }
        });
        if (aptidoesGrid) {
            aptidoesGrid.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') setDirty(true);
            });
        }
        console.log("App Logic Initialized.");
    }

    function setupCharacterSheetEventListeners() {
        if(attrErudicao) attrErudicao.addEventListener('input', updateMaxAptidoesDisplay);
        if(nivelFortunaSelect) nivelFortunaSelect.addEventListener('change', updateFortunaMalandragemDisplay);
        
        if(saudePoleElement && saudeValueInput) {
            saudePoleElement.addEventListener('click', (e) => handlePoleClick(e, saudePoleElement, saudeValueInput, 'saude'));
        }
        if(volicaoPoleElement && volicaoValueInput) {
            volicaoPoleElement.addEventListener('click', (e) => handlePoleClick(e, volicaoPoleElement, volicaoValueInput, 'volicao'));
        }
        if(pontoFardoButton) pontoFardoButton.addEventListener('click', togglePontoFardo);
        
        if(ativarArquetipoButton && charArquetipo) {
            ativarArquetipoButton.addEventListener('click', () => {
                const arquetipoVal = charArquetipo.value;
                if(arquetipoVal && arquetiposHabilidades[arquetipoVal]) {
                    showNotification(`Arquétipo ${charArquetipo.options[charArquetipo.selectedIndex].text}: ${arquetiposHabilidades[arquetipoVal]} (1x por ambiente)`, 5000, 'info');
                } else {
                    showNotification("Selecione um Arquétipo primeiro.", 2000, 'error');
                }
            });
        }
        if (userCharacterSelect) userCharacterSelect.addEventListener('change', () => handleCharacterSelectionChange(true));
    }
    
    function togglePontoFardo() {
        fardoAtual = (fardoAtual === 0) ? 1 : 0;
        updatePontoFardoButtonDisplay();
        setDirty(true);
        const acao = fardoAtual === 1 ? 'gasto' : 'recuperado';
        const dica = fardoAtual === 1 ? "Use para sucesso automático ou recuperar Volição." : "Ganho ao agir na Aspiração.";
        showNotification(`Ponto de Fardo ${acao}. ${dica}`, 3000, 'info');
    }

    function updatePontoFardoButtonDisplay() {
        if (!pontoFardoButton) return;
        const textNode = Array.from(pontoFardoButton.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
        if (fardoAtual === 1) {
            if (textNode) textNode.textContent = ' FARDO GASTO';
            pontoFardoButton.classList.add('fardo-gasto');
        } else {
            if (textNode) textNode.textContent = ' P FARDO (0)';
            pontoFardoButton.classList.remove('fardo-gasto');
        }
    }

    function updateMaxAptidoesDisplay() {
        if (!attrErudicao || !aptidoesCountDisplay || !aptidoesGrid) return;
        const erudicaoVal = parseInt(attrErudicao.value) || 0;
        maxAptidoesSelecionaveis = 5 + erudicaoVal;

        const checkboxes = aptidoesGrid.querySelectorAll('input[type="checkbox"]');
        const selecionadas = Array.from(checkboxes).filter(cb => cb.checked).length;
        
        aptidoesCountDisplay.textContent = `(Selecionadas: ${selecionadas}/${maxAptidoesSelecionaveis})`;

        checkboxes.forEach(cb => {
            cb.disabled = (!cb.checked && selecionadas >= maxAptidoesSelecionaveis);
        });
    }
    function populateAptidoes() {
        if (!aptidoesGrid) return;
        aptidoesGrid.innerHTML = '';
        aptidoesBase.forEach(aptidao => {
            const div = document.createElement('div');
            div.className = 'aptidao-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `apt-${aptidao.id}`;
            checkbox.value = aptidao.id;
            checkbox.name = 'aptidoes';
            checkbox.addEventListener('change', updateMaxAptidoesDisplay); // Atualiza contagem e desabilita se max atingido

            const label = document.createElement('label');
            label.htmlFor = `apt-${aptidao.id}`;
            label.textContent = aptidao.nome;

            div.appendChild(checkbox);
            div.appendChild(label);
            aptidoesGrid.appendChild(div);
        });
        updateMaxAptidoesDisplay();
    }

    function updateFortunaMalandragemDisplay() {
        if (!nivelFortunaSelect || !displayNivelFortuna || !displayNivelMalandragem || !itensIniciaisFortunaDisplay) return;
        const fortunaNivel = nivelFortunaSelect.value;
        if (!fortunaNivel) return;

        const malandragemNivel = 6 - parseInt(fortunaNivel);
        displayNivelFortuna.textContent = fortunaNivel;
        displayNivelMalandragem.textContent = malandragemNivel.toString();
        itensIniciaisFortunaDisplay.textContent = fortunaItensMap[fortunaNivel] || "Nenhum item inicial padrão.";
    }

    function initPoleBubbles(poleEl, valIn, bubbleBaseClass, defaultCount = 6) {
        if (!poleEl || !valIn) return;
        poleEl.innerHTML = '';
        const maxPoints = parseInt(poleEl.dataset.maxPoints) || defaultCount;
        const typePrefix = poleEl.id.includes('saude') ? 'saude' : 'volicao';

        for (let i = 0; i < maxPoints; i++) {
            const bubble = document.createElement('div');
            bubble.className = `pole-bubble ${typePrefix}-pole-bubble`;
            bubble.dataset.index = i;
            poleEl.appendChild(bubble);
        }
        updatePoleDisplay(poleEl, valIn);
    }

    function updatePoleDisplay(poleEl, valIn) {
        if (!poleEl || !valIn) return;
        const currentValue = parseInt(valIn.value);
        const bubbles = poleEl.querySelectorAll(':scope > .pole-bubble');
        bubbles.forEach((bubble, index) => {
            bubble.classList.toggle('filled', index < currentValue);
        });
    }

    function handlePoleClick(evt, poleEl, valIn, type) {
        const targetBubble = evt.target.closest('.pole-bubble'); // Garante que pegamos o bubble mesmo se clicar em algo dentro dele
        if (!targetBubble || !poleEl.contains(targetBubble)) return; // Verifica se o clique foi num bubble filho do poleEl

        const bubbles = Array.from(poleEl.children).filter(el => el.classList.contains('pole-bubble'));
        const clickedIndex = bubbles.indexOf(targetBubble);
        if (clickedIndex === -1) return;
        
        let newValue;
        if (targetBubble.classList.contains('filled') && (parseInt(valIn.value) === clickedIndex + 1)) {
            newValue = clickedIndex;
        } else {
            newValue = clickedIndex + 1;
        }
        
        valIn.value = newValue;
        updatePoleDisplay(poleEl, valIn);
        setDirty(true);
    }

    // --- GERENCIAMENTO DE DADOS DA FICHA ---
    function getCharacterSheetDataForSaving() {
        const data = {};
        allFieldDataConfig.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                switch (field.type) {
                    case 'number': data[field.id] = parseFloat(element.value) || field.default; break;
                    case 'checkbox': data[field.id] = element.checked; break;
                    case 'select': data[field.id] = element.value; break;
                    case 'hidden': 
                        data[field.id] = parseInt(element.value, 10);
                        if(isNaN(data[field.id])) data[field.id] = field.default;
                        break;
                    default: data[field.id] = element.value || field.default; break; 
                }
            } else {
                 data[field.id] = field.default;
            }
        });
        data.aptidoes = Array.from(aptidoesGrid.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);
        data.fardoAtual = fardoAtual;
        return data;
    }

    function applyCharacterDataToSheetUI(dataToApply, fromRemote = false) {
        if (!dataToApply) {
            clearCharacterSheetUI(false);
            return;
        }
        allFieldDataConfig.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                const valueToSet = dataToApply[field.id] !== undefined ? dataToApply[field.id] : field.default;
                switch (field.type) {
                    case 'checkbox': element.checked = valueToSet; break;
                    default: element.value = valueToSet; break; 
                }
            }
        });

        if (aptidoesGrid) {
            aptidoesGrid.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = dataToApply.aptidoes ? dataToApply.aptidoes.includes(cb.value) : false;
            });
        }
        
        fardoAtual = dataToApply.fardoAtual !== undefined ? dataToApply.fardoAtual : 0;
        
        updatePontoFardoButtonDisplay();
        updateMaxAptidoesDisplay(); 
        if (saudePoleElement && saudeValueInput) updatePoleDisplay(saudePoleElement, saudeValueInput);
        if (volicaoPoleElement && volicaoValueInput) updatePoleDisplay(volicaoPoleElement, volicaoValueInput);
        updateFortunaMalandragemDisplay();
        
        if (fromRemote) {
            showNotification(`Personagem "${dataToApply.charName || 'Sem Nome'}" carregado.`, 2000, 'success');
        }
        setDirty(false);
    }

    function clearCharacterSheetUI(notify = true) {
        allFieldDataConfig.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                switch (field.type) {
                    case 'checkbox': element.checked = field.default; break;
                    default: element.value = field.default; break;
                }
            }
        });
        if (aptidoesGrid) {
            aptidoesGrid.querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; cb.disabled = false; });
        }
        fardoAtual = 0;
        
        updatePontoFardoButtonDisplay();
        updateMaxAptidoesDisplay();
        updateFortunaMalandragemDisplay();
        if (saudePoleElement && saudeValueInput) updatePoleDisplay(saudePoleElement, saudeValueInput);
        if (volicaoPoleElement && volicaoValueInput) updatePoleDisplay(volicaoPoleElement, volicaoValueInput);
        
        if (notify) {
            showNotification("Ficha limpa. Pronta para novo personagem ou carregar.", 2000, 'info');
        }
        setDirty(false);
    }

    // --- LÓGICA DE DADOS LOCAIS ---
    function saveCharacterDataToLocal() {
        try {
            const charData = getCharacterSheetDataForSaving();
            saveToLocalStorage(CHARACTER_DATA_KEY_LOCAL, JSON.stringify(charData));
            showNotification('Progresso salvo localmente!', 2000, 'success');
            setDirty(false);
        } catch (e) {
            console.error("Erro ao salvar personagem localmente:", e);
            showNotification('Erro ao salvar localmente. Verifique o console.', 3000, 'error');
        }
    }
    function loadCharacterDataFromLocalStorage() {
        const dataString = localStorage.getItem(CHARACTER_DATA_KEY_LOCAL);
        if (dataString) {
            try {
                const charData = JSON.parse(dataString);
                applyCharacterDataToSheetUI(charData, false);
                return true;
            } catch (e) {
                console.error("Erro ao carregar dados do localStorage:", e);
                showNotification('Erro ao ler dados locais. Podem estar corrompidos.', 3000, 'error');
                localStorage.removeItem(CHARACTER_DATA_KEY_LOCAL); 
                return false;
            }
        }
        return false;
    }

    // --- LÓGICA FIREBASE (Auth, Firestore) ---
    async function handleLogin() {
        if (!loginEmailInput || !loginPasswordInput) return;
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;
        if (!email || !password) {
            showNotification("Email e senha são obrigatórios.", 2000, 'error');
            return;
        }
        showNotification("Efetuando login...", 5000, 'info');
        try {
            await auth.signInWithEmailAndPassword(email, password);
            showNotification("Login bem-sucedido!", 2000, 'success');
            authPanel.classList.remove('visible'); // Fecha o painel após login
        } catch (error) {
            showNotification(getFriendlyAuthErrorMessage(error), 4000, 'error');
        }
    }
    async function handleRegister() {
        if (!registerEmailInput || !registerPasswordInput) return;
        const email = registerEmailInput.value;
        const password = registerPasswordInput.value;
        if (!email || !password) {
            showNotification("Email e senha são obrigatórios.", 2000, 'error');
            return;
        }
        if (password.length < 6) {
             showNotification("A senha deve ter pelo menos 6 caracteres.", 2000, 'error');
             return;
        }
        showNotification("Registrando usuário...", 5000, 'info');
        try {
            await auth.createUserWithEmailAndPassword(email, password);
            showNotification("Registro bem-sucedido! Logando...", 2000, 'success');
            authPanel.classList.remove('visible'); // Fecha o painel após registro
        } catch (error) {
            showNotification(getFriendlyAuthErrorMessage(error), 4000, 'error');
        }
    }
    async function handleLogout() {
        if (isDirty && confirm("Você tem alterações não salvas. Deseja salvá-las antes de sair?")) {
            if (currentUser) await saveCharacterDataToFirebase();
            else saveCharacterDataToLocal();
        }
        showNotification("Deslogando...", 2000, 'info');
        try {
            await auth.signOut();
            // onAuthStateChanged lidará com a UI.
        } catch (error) {
            showNotification("Erro ao deslogar: " + getFriendlyAuthErrorMessage(error), 3000, 'error');
        }
    }

    function populateCharacterSelect() {
        userCharacterSelect.innerHTML = '<option value="">-- Novo Personagem --</option>';
        userCharactersList.forEach(char => {
            const option = document.createElement('option');
            option.value = char.id;
            option.textContent = char.name;
            userCharacterSelect.appendChild(option);
        });
        if (currentCharacterId && userCharactersList.some(c => c.id === currentCharacterId)) {
            userCharacterSelect.value = currentCharacterId;
        } else {
            userCharacterSelect.value = "";
        }
    }
    
    async function fetchUserCharacters() {
        if (!currentUser) return;
        try {
            const querySnapshot = await db.collection('users').doc(currentUser.uid).collection('characters').orderBy("charName").get();
            userCharactersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().charName || `Personagem Sem Nome (${doc.id.substring(0,5)})`
            }));
            populateCharacterSelect();
        } catch (error) {
            console.error("Erro ao buscar personagens:", error);
            showNotification("Erro ao buscar seus personagens: " + error.message, 3000, 'error');
            userCharacterSelect.innerHTML = '<option value="">-- Erro ao carregar --</option>';
        }
    }

    async function loadCharacterFromFirebase(characterIdToLoad) {
        if (!currentUser || !characterIdToLoad) {
            showNotification("Não foi possível carregar: usuário não logado ou ID do personagem faltando.", 2000, 'error');
            return;
        }
        if (isDirty && !confirm("Você tem alterações não salvas. Deseja descartá-las e carregar este personagem?")) {
            userCharacterSelect.value = currentCharacterId || ""; // Reverte a seleção no dropdown
            return;
        }
        showNotification("Carregando personagem...", 5000, 'info');
        try {
            const docRef = db.collection('users').doc(currentUser.uid).collection('characters').doc(characterIdToLoad);
            const docSnap = await docRef.get();

            // CORREÇÃO AQUI:
            if (docSnap.exists) { // Usar a propriedade .exists para o SDK compatível
                const charData = docSnap.data();
                applyCharacterDataToSheetUI(charData, true); // true para notificar
                currentCharacterId = characterIdToLoad;
                if (newCharSaveNameInput) newCharSaveNameInput.value = charData.charName || ""; // Preenche nome para "Salvar Como"
                saveCharacterDataToLocal(); // Salva uma cópia local do que foi carregado
                authPanel.classList.remove('visible'); // Fecha o painel
            } else {
                showNotification("Personagem não encontrado no banco de dados.", 3000, 'error');
                currentCharacterId = null; // Personagem não existe mais
                if (userCharacterSelect) userCharacterSelect.value = ""; // Volta para "Novo"
                clearCharacterSheetUI(false);
                await fetchUserCharacters(); // Atualiza lista caso tenha sido deletado em outra aba
            }
        } catch (error) {
            console.error("Erro ao carregar personagem:", error);
            // Exibir a mensagem de erro específica pode ajudar no debug
            showNotification(`Erro ao carregar personagem: ${error.message}`, 4000, 'error');
        }
    }

    async function saveCharacterDataToFirebase() {
        if (!currentUser) {
            showNotification("Você precisa estar logado para salvar online.", 3000, 'error');
            if(confirm("Salvar localmente em vez disso?")) saveCharacterDataToLocal();
            return;
        }

        let charData = getCharacterSheetDataForSaving();
        let saveNameFromInput = newCharSaveNameInput.value.trim();
        let finalCharName = charName.value.trim();

        if (!finalCharName && saveNameFromInput) {
            finalCharName = saveNameFromInput;
            charName.value = finalCharName;
        } else if (!finalCharName && !saveNameFromInput && !currentCharacterId) {
            finalCharName = prompt("Por favor, dê um nome ao seu novo personagem:", "Investigador Sem Nome");
            if (!finalCharName) {
                showNotification("Salvamento cancelado. Nome é necessário.", 2000, 'info');
                return;
            }
            charName.value = finalCharName;
        }
        charData.charName = finalCharName;

        showNotification("Salvando personagem online...", 10000, 'info');

        let targetIdForSave = currentCharacterId;
        let operationType = "atualizado";
        const selectedCharInDropdown = userCharacterSelect.value ? userCharactersList.find(c => c.id === userCharacterSelect.value) : null;

        if (saveNameFromInput && (!selectedCharInDropdown || saveNameFromInput !== selectedCharInDropdown.name || !currentCharacterId)) {
            charData.charName = saveNameFromInput;
            if (charName.value !== saveNameFromInput) charName.value = saveNameFromInput;

            const existingCharByName = userCharactersList.find(c => c.name === saveNameFromInput);
            if (existingCharByName && existingCharByName.id !== currentCharacterId) { // Se nome existe e não é o char atual
                if (confirm(`Já existe um personagem chamado "${saveNameFromInput}". Deseja sobrescrevê-lo?`)) {
                    targetIdForSave = existingCharByName.id;
                } else {
                    showNotification("Salvamento cancelado.", 2000, 'info');
                    return;
                }
            } else if (!existingCharByName || (existingCharByName && existingCharByName.id === currentCharacterId)) { // Nome novo ou é o nome do char atual (Salvar Como ele mesmo)
                 targetIdForSave = null; // Força criação se nome é novo, ou se o usuário quer "Salvar Como" o atual com novo nome no campo
                 if (existingCharByName && existingCharByName.id === currentCharacterId && saveNameFromInput === selectedCharInDropdown.name) {
                    targetIdForSave = currentCharacterId; // É um "Salvar" normal sobre o personagem atual
                 } else {
                    // Se o saveNameFromInput é o nome de um *outro* personagem, já foi tratado acima.
                    // Se é um nome completamente novo, targetIdForSave continua null para criar.
                 }
            }
        } else if (!saveNameFromInput && !currentCharacterId) { // Salvando um personagem totalmente novo sem nome no newCharSaveNameInput
            // O nome já foi pego de charName.value ou prompt
            targetIdForSave = null;
        }


        try {
            if (targetIdForSave) {
                await db.collection('users').doc(currentUser.uid).collection('characters').doc(targetIdForSave).set(charData, { merge: true });
                currentCharacterId = targetIdForSave;
            } else {
                const docRef = await db.collection('users').doc(currentUser.uid).collection('characters').add(charData);
                currentCharacterId = docRef.id;
                operationType = "criado e salvo";
                if(newCharSaveNameInput) newCharSaveNameInput.value = charData.charName;
            }

            await fetchUserCharacters();
            if (userCharacterSelect) userCharacterSelect.value = currentCharacterId;
            
            showNotification(`Personagem "${charData.charName || 'Sem Nome'}" ${operationType} online!`, 3000, 'success');
            setDirty(false);
            saveCharacterDataToLocal();
        } catch (error) {
            console.error("Erro ao salvar personagem online:", error);
            showNotification("Erro ao salvar personagem online: " + error.message, 4000, 'error');
        }
    }
    
    async function deleteCharacterFromFirebase(characterIdToDelete) {
        if (!currentUser || !characterIdToDelete) return;
        const charToDelete = userCharactersList.find(c => c.id === characterIdToDelete);
        const charNameToDelete = charToDelete ? charToDelete.name : "este personagem";

        if (!confirm(`Tem certeza que deseja deletar "${charNameToDelete}" permanentemente? Essa ação não pode ser desfeita.`)) return;

        showNotification(`Deletando "${charNameToDelete}"...`, 5000, 'info');
        try {
            await db.collection('users').doc(currentUser.uid).collection('characters').doc(characterIdToDelete).delete();
            showNotification(`Personagem "${charNameToDelete}" deletado.`, 2000, 'success');
            
            if (currentCharacterId === characterIdToDelete) {
                currentCharacterId = null;
                clearCharacterSheetUI(false);
                if (newCharSaveNameInput) newCharSaveNameInput.value = '';
            }
            await fetchUserCharacters();
            handleCharacterSelectionChange(false);
        } catch (error) {
            console.error("Erro ao deletar personagem:", error);
            showNotification("Erro ao deletar personagem: " + error.message, 3000, 'error');
        }
    }

    function handleCharacterSelectionChange(promptIfDirty = true) {
        if (!userCharacterSelect) return;
        const selectedValue = userCharacterSelect.value;

        if (promptIfDirty && isDirty && selectedValue !== currentCharacterId) {
            if (!confirm("Você tem alterações não salvas. Deseja descartá-las e mudar de personagem/limpar a ficha?")) {
                userCharacterSelect.value = currentCharacterId || "";
                return;
            }
        }
        // Não setar isDirty(false) aqui, porque a ficha só é efetivamente limpa/carregada no clique do botão "Carregar/Limpar"

        if (selectedValue === "") {
            // Não limpar a ficha aqui, apenas ajustar a UI do painel de personagem
            // currentCharacterId = null; // Não zerar aqui, o usuário pode querer voltar
            if (newCharSaveNameInput) {
                newCharSaveNameInput.value = "";
                newCharSaveNameInput.placeholder = "Nome do Novo Personagem";
            }
            if (loadSelectedCharacterButton) loadSelectedCharacterButton.textContent = "Limpar para Nova Ficha";
            if (deleteSelectedCharacterButton) deleteSelectedCharacterButton.style.display = 'none';
        } else {
            const selectedCharacter = userCharactersList.find(c => c.id === selectedValue);
            if (selectedCharacter) {
                if (newCharSaveNameInput) {
                    newCharSaveNameInput.value = selectedCharacter.name;
                    newCharSaveNameInput.placeholder = "Salvar como (ou deixe em branco)";
                }
            }
            if (loadSelectedCharacterButton) loadSelectedCharacterButton.textContent = "Carregar Selecionado";
            if (deleteSelectedCharacterButton && currentUser) {
                deleteSelectedCharacterButton.style.display = 'inline-block';
            }
        }
    }

    // --- SETUP DE LISTENERS GLOBAIS ---
    function setupGlobalControlBarListeners() {
        if(saveButton) saveButton.addEventListener('click', () => {
            if (currentUser) saveCharacterDataToFirebase();
            else saveCharacterDataToLocal();
        });

        if(clearButton) clearButton.addEventListener('click', () => {
            if (isDirty && !confirm("Tem certeza que deseja limpar todos os dados da ficha atual? Alterações não salvas serão perdidas.")) return;
            
            clearCharacterSheetUI(true);
            currentCharacterId = null;
            if (userCharacterSelect) userCharacterSelect.value = "";
            if (newCharSaveNameInput) newCharSaveNameInput.value = "";
            handleCharacterSelectionChange(false);
        });
        
        if(saveLayoutButton) saveLayoutButton.addEventListener('click', () => {
             saveBlockLayout();
             showNotification("Layout dos blocos salvo!", 1500, 'success');
        });
        if(resetLayoutButton) resetLayoutButton.addEventListener('click', () => {
            if (confirm("Redefinir o layout dos blocos para o padrão?")) {
                 setDefaultBlockLayout();
                 showNotification("Layout dos blocos redefinido.", 1500, 'info');
            }
        });
        if(roll2d6Button && diceResultDisplay) roll2d6Button.addEventListener('click', () => {
            const die1 = Math.floor(Math.random() * 6) + 1;
            const die2 = Math.floor(Math.random() * 6) + 1;
            diceResultDisplay.textContent = `Resultado: ${die1 + die2} (${die1}, ${die2})`;
            showNotification(`Rolagem 2d6: ${die1+die2}`, 2000, 'info');
        });

        if (loginUserButton) loginUserButton.addEventListener('click', handleLogin);
        if (showRegisterLink) showRegisterLink.addEventListener('click', (e) => { e.preventDefault(); loginForm.style.display = 'none'; registerForm.style.display = 'block'; });
        if (registerUserButton) registerUserButton.addEventListener('click', handleRegister);
        if (showLoginLink) showLoginLink.addEventListener('click', (e) => { e.preventDefault(); registerForm.style.display = 'none'; loginForm.style.display = 'block'; });
        if (logoutButton) logoutButton.addEventListener('click', handleLogout);

        if (loadSelectedCharacterButton && userCharacterSelect) {
            loadSelectedCharacterButton.addEventListener('click', () => {
                const selectedVal = userCharacterSelect.value;
                if (selectedVal && selectedVal !== "") {
                     loadCharacterFromFirebase(selectedVal);
                } else {
                    if (isDirty && !confirm("Você tem alterações não salvas. Deseja descartá-las e criar uma nova ficha?")) return;
                    clearCharacterSheetUI(true);
                    currentCharacterId = null;
                    if (newCharSaveNameInput) newCharSaveNameInput.value = "";
                    setDirty(false); // Ficha está limpa
                    handleCharacterSelectionChange(false);
                    authPanel.classList.remove('visible'); // Fecha o painel
                }
            });
        }
        if (deleteSelectedCharacterButton && userCharacterSelect) {
            deleteSelectedCharacterButton.addEventListener('click', () => {
                 if (userCharacterSelect.value && userCharacterSelect.value !== "") {
                     deleteCharacterFromFirebase(userCharacterSelect.value);
                } else {
                     showNotification("Nenhum personagem selecionado para deletar.", 2000, 'error');
                }
            });
        }
    }

    // --- FUNÇÕES DE TEMA E LAYOUT DE BLOCOS ---
    function loadTheme() { if(!htmlElement) return; const savedTheme = localStorage.getItem(THEME_STORAGE_KEY); applyTheme(savedTheme || 'theme-noir-azul'); }
    function applyTheme(themeName) { if(htmlElement) { htmlElement.className = ''; htmlElement.classList.add(themeName);} if(themeSelector) themeSelector.value = themeName; saveToLocalStorage(THEME_STORAGE_KEY, themeName); }
    function setupThemeSwitcher() { if (themeSelector) themeSelector.addEventListener('change', (event) => applyTheme(event.target.value));}
    
    function initializeInteractJs() {
        if (!workspaceContainer || typeof interact === 'undefined') return;
        maxZIndex = 0;
        document.querySelectorAll('.draggable-block').forEach(el => { 
            const z = parseInt(window.getComputedStyle(el).zIndex, 10);
            if (!isNaN(z) && z > maxZIndex) maxZIndex = z; 
        });

        interact('.resize-drag.draggable-block')
            .draggable({
                inertia: { resistance: 15, minSpeed: 200, endSpeed: 100 },
                modifiers: [interact.modifiers.restrictRect({ restriction: 'parent', endOnly: true })],
                autoScroll: true,
                allowFrom: '.block-header',
                listeners: {
                    start(event) { maxZIndex++; event.target.style.zIndex = maxZIndex; event.target.classList.add('interact-dragging'); },
                    move(event) {
                        const target = event.target;
                        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                        target.style.transform = `translate(${x}px, ${y}px)`;
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    },
                    end(event) { event.target.classList.remove('interact-dragging'); saveBlockLayout(); }
                }
            })
            .resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                listeners: {
                    start(event) { maxZIndex++; event.target.style.zIndex = maxZIndex; event.target.classList.add('interact-resizing'); },
                    move(event) {
                        const target = event.target;
                        let x = (parseFloat(target.getAttribute('data-x')) || 0);
                        let y = (parseFloat(target.getAttribute('data-y')) || 0);
                        target.style.width = event.rect.width + 'px';
                        target.style.height = event.rect.height + 'px';
                        x += event.deltaRect.left;
                        y += event.deltaRect.top;
                        target.style.transform = `translate(${x}px, ${y}px)`;
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    },
                    end(event) { event.target.classList.remove('interact-resizing'); saveBlockLayout(); }
                },
                modifiers: [interact.modifiers.restrictSize({ min: { width: 250, height: 120 } })],
                inertia: false
            });
    }
    function saveBlockLayout() {
        const layout = {};
        document.querySelectorAll('.resize-drag.draggable-block').forEach(block => {
            if (block.id) {
                layout[block.id] = {
                    x: block.getAttribute('data-x') || '0',
                    y: block.getAttribute('data-y') || '0',
                    width: block.style.width || getComputedStyle(block).width,
                    height: block.style.height || getComputedStyle(block).height,
                    zIndex: block.style.zIndex || 'auto'
                };
            }
        });
        saveToLocalStorage(BLOCK_LAYOUT_KEY, JSON.stringify(layout));
    }
    function loadBlockLayout() {
        const savedLayout = localStorage.getItem(BLOCK_LAYOUT_KEY);
        if (savedLayout) {
            try {
                const layout = JSON.parse(savedLayout);
                let currentMaxZ = 0;
                Object.keys(layout).forEach(id => {
                    const block = document.getElementById(id);
                    if (block) {
                        const s = layout[id];
                        block.style.transform = `translate(${s.x || 0}px, ${s.y || 0}px)`;
                        block.setAttribute('data-x', s.x || 0);
                        block.setAttribute('data-y', s.y || 0);
                        if(s.width) block.style.width = s.width;
                        if(s.height) block.style.height = s.height;
                        if(s.zIndex && s.zIndex !== 'auto') {
                             block.style.zIndex = s.zIndex;
                             const z = parseInt(s.zIndex, 10);
                             if (z > currentMaxZ) currentMaxZ = z;
                        } else {
                             block.style.zIndex = ''; // Usa o z-index padrão do CSS se não definido
                        }
                    }
                });
                maxZIndex = currentMaxZ > 0 ? currentMaxZ : 0;
            } catch (e) {
                console.error("Error parsing block layout from localStorage:", e);
                localStorage.removeItem(BLOCK_LAYOUT_KEY);
                setDefaultBlockLayout();
            }
        } else {
            setDefaultBlockLayout();
        }
    }
    function setDefaultBlockLayout() {
        document.querySelectorAll('.resize-drag.draggable-block').forEach(block => {
            block.style.transform = '';
            block.style.width = block.dataset.defaultWidth || ''; // Usa default do data-attribute se existir
            block.style.height = block.dataset.defaultHeight || '';// Usa default do data-attribute se existir
            block.style.zIndex = ''; // Reseta para o valor do CSS
            block.removeAttribute('data-x');
            block.removeAttribute('data-y');
        });
        maxZIndex = 0; // Recalcular com base nos z-index do CSS dos blocos
        document.querySelectorAll('.draggable-block').forEach(el => { 
            const z = parseInt(window.getComputedStyle(el).zIndex, 10);
            if (!isNaN(z) && z > maxZIndex) maxZIndex = z; 
        });
        localStorage.removeItem(BLOCK_LAYOUT_KEY);
        console.log("Block layout reset to default (CSS styles).");
    }

    // === PONTO DE ENTRADA PRINCIPAL ===
    if (htmlElement) {
        initializeApp();
    } else {
        console.error("Elemento HTML raiz não encontrado. A aplicação não pode iniciar.");
        const body = document.body;
        if (body) {
            const errDiv = document.createElement('div');
            errDiv.textContent = "ERRO CRÍTICO: Impossível iniciar aplicação. Elemento HTML não encontrado.";
            errDiv.style.color = "red";
            errDiv.style.padding = "20px";
            errDiv.style.fontSize = "20px";
            body.insertBefore(errDiv, body.firstChild);
        }
    }
});