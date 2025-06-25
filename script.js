document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURAÇÕES GLOBAIS ---
    const THEME_STORAGE_KEY = 'rigorMortisSelectedTheme_vFinal_Enhanced';
    const BLOCK_LAYOUT_KEY = 'rigorMortisBlockLayout_vFinal_Enhanced';
    const CHARACTER_DATA_KEY = 'rigorMortisCharacterData_vFinal_Enhanced';

    // --- SELETORES DE ELEMENTOS PRINCIPAIS ---
    // (Mantidos como na sua versão, são extensos)
    const themeSelector = document.getElementById('themeSelector');
    const htmlElement = document.documentElement;
    const workspaceContainer = document.getElementById('workspaceContainer');
    const notificationArea = document.getElementById('notificationArea');
    const saveButton = document.getElementById('saveButton');
    const loadButton = document.getElementById('loadButton');
    const clearButton = document.getElementById('clearButton');
    const resetLayoutButton = document.getElementById('resetLayoutButton');
    const roll2d6Button = document.getElementById('roll2d6Button');
    const diceResultDisplay = document.getElementById('diceResult');
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
    const maxAptidoesCountDisplay = document.getElementById('maxAptidoesCount');
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
    const inventarioItensDiv = document.getElementById('inventarioItens');
    const vestimentasAtivasDiv = document.getElementById('vestimentasAtivas');
    const contatosList = document.getElementById('contatosList');
    const pontosAprimoramentoInput = document.getElementById('pontosAprimoramento');
    const habilidadesAdquiridas = document.getElementById('habilidadesAdquiridas');
    const casoPerguntasText = document.getElementById('casoPerguntasText');
    const palacioMentalText = document.getElementById('palacioMentalText');
    const anotacoesGeraisText = document.getElementById('anotacoesGeraisText');
    const aptidoesTitle = document.getElementById('aptidoesTitle');


    const allFieldDataConfig = [
        { id: 'charName', type: 'text' }, { id: 'charConceito', type: 'text' }, { id: 'charAspiracao', type: 'text' },
        { id: 'charArquetipo', type: 'select', default: "" }, // Explicit default for selects
        { id: 'attrImpeto', type: 'number', default: 0 }, { id: 'attrCinesia', type: 'number', default: 0 },
        { id: 'attrFinesse', type: 'number', default: 0 }, { id: 'attrErudicao', type: 'number', default: 0 },
        { id: 'saudeValue', type: 'hidden', default: 3 }, { id: 'volicaoValue', type: 'hidden', default: 3 },
        { id: 'saudeConsequencias', type: 'textarea' }, { id: 'volicaoConsequencias', type: 'textarea' },
        { id: 'isTensionado', type: 'checkbox' }, { id: 'vicioPersonagem', type: 'text' },
        { id: 'ocupacaoInput', type: 'text' }, { id: 'nivelFortunaSelect', type: 'select', default: "3"},
        { id: 'misterioDetail', type: 'text' }, { id: 'segredoDetail', type: 'text' },
        { id: 'interpretacaoPenumbraDetail', type: 'text' }, { id: 'medosDetail', type: 'text' },
        { id: 'focosCount', type: 'number', default: 0 }, { id: 'contatosList', type: 'textarea' },
        { id: 'pontosAprimoramento', type: 'number', default: 0 }, { id: 'habilidadesAdquiridas', type: 'textarea' },
        { id: 'casoPerguntasText', type: 'textarea' }, { id: 'palacioMentalText', type: 'textarea' },
        { id: 'anotacoesGeraisText', type: 'textarea' },
    ];

    // --- CRITICAL DATA DEFINITIONS ---
    const aptidoesBase = [
        'Limiar da Dor', 'Instinto', 'Confronto', 'Fervor', 'Atletismo', 'Artimanha', 'Sobrevivência',
        'Pontaria', 'Percepção', 'Reação', 'Destreza', 'Mecânica', 'Infiltração', 'Direção',
        'Acalento', 'Teatro', 'Charme', 'Vontade', 'Autoridade', 'Agricultura', 'Espírito',
        'Raciocínio', 'Abstração', 'Pesquisa', 'Memória', 'Balística', 'Medicina', 'Empiria'
    ].map(nome => ({
        id: nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').replace(/[^\w-]+/gi, ''), // More robust ID
        nome: nome
    }));

    const fortunaItensMap = {
        "5": "2 itens de Classe I",
        "4": "2 itens de Classe I e 1 item de Classe II",
        "3": "2 itens de Classe I e 2 itens de Classe II",
        "2": "3 itens de Classe I e 2 itens de Classe II",
        "1": "3 itens de Classe I, 2 itens de Classe II e 1 item de Classe III"
    };
    // --- END CRITICAL DATA ---


    let fardoAtual = 0;
    let maxAptidoesSelecionaveis = 5;
    let blockStates = {};
    let maxZIndex = 0;

    // --- FUNÇÃO AUXILIAR: Salvar no LocalStorage com Error Handling ---
    function saveToLocalStorage(key, dataString) {
        try {
            localStorage.setItem(key, dataString);
        } catch (e) {
            console.error(`Falha ao salvar no localStorage (chave: ${key}):`, e);
            showNotification("Erro ao salvar: Armazenamento local pode estar cheio ou desabilitado.", 5000);
        }
    }

    // --- INICIALIZAÇÃO GERAL ---
    function initializeApp() {
        loadTheme();
        setupThemeSwitcher();
        loadBlockLayout();
        initializeInteractJs();
        
        if (document.getElementById('blockPersonagem')) {
            initAppLogic();
        } else {
            console.warn("Bloco de personagem não encontrado, lógica da ficha não inicializada completamente.");
        }
        setupGlobalEventListeners();
    }

    // --- LÓGICA DE TEMAS ---
    function loadTheme() {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        applyTheme(savedTheme || 'theme-noir-azul');
    }
    function applyTheme(themeName) {
        htmlElement.className = '';
        htmlElement.classList.add(themeName);
        if(themeSelector) themeSelector.value = themeName;
        saveToLocalStorage(THEME_STORAGE_KEY, themeName);
    }
    function setupThemeSwitcher() {
        if (themeSelector) {
            themeSelector.addEventListener('change', (event) => applyTheme(event.target.value));
        }
    }

    // --- LÓGICA DOS BLOCOS (INTERACT.JS) ---
    function initializeInteractJs() { /* ... (mantido como antes, já é robusto) ... */
        if (!workspaceContainer || typeof interact === 'undefined') {
            console.warn("Workspace container ou Interact.js não encontrado.");
            return;
        }

        maxZIndex = 0; // Recalcular ao inicializar
        document.querySelectorAll('.draggable-block').forEach(el => {
            const z = parseInt(el.style.zIndex) || 0;
            if (z > maxZIndex) maxZIndex = z;
        });


        interact('.resize-drag')
            .draggable({
                inertia: { resistance: 15, minSpeed: 200, endSpeed: 100 },
                modifiers: [ interact.modifiers.restrictRect({ restriction: 'parent', endOnly: true }) ],
                autoScroll: true,
                allowFrom: '.block-header',
                listeners: {
                    start (event) {
                        maxZIndex++;
                        event.target.style.zIndex = maxZIndex;
                        event.target.classList.add('interact-dragging');
                    },
                    move (event) {
                        const target = event.target;
                        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
                        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
                        target.style.transform = `translate(${x}px, ${y}px)`;
                        target.setAttribute('data-x', x);
                        target.setAttribute('data-y', y);
                    },
                    end (event) {
                        event.target.classList.remove('interact-dragging');
                        saveBlockLayout();
                    }
                }
            })
            .resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                listeners: {
                    start (event) {
                        maxZIndex++;
                        event.target.style.zIndex = maxZIndex;
                        event.target.classList.add('interact-resizing');
                    },
                    move (event) {
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
                    end (event) {
                        event.target.classList.remove('interact-resizing');
                        saveBlockLayout();
                    }
                },
                modifiers: [ interact.modifiers.restrictSize({ min: { width: 300, height: 150 } }) ],
                inertia: false
            });
    }

    function saveBlockLayout() {
        blockStates = {};
        document.querySelectorAll('.draggable-block').forEach(el => {
            const id = el.dataset.blockId;
            if (id) {
                blockStates[id] = {
                    x: parseFloat(el.getAttribute('data-x')) || 0,
                    y: parseFloat(el.getAttribute('data-y')) || 0,
                    width: el.style.width,
                    height: el.style.height,
                    zIndex: el.style.zIndex || 'auto' // Salvando zIndex como string "auto" ou número
                };
            }
        });
        saveToLocalStorage(BLOCK_LAYOUT_KEY, JSON.stringify(blockStates));
    }

    function loadBlockLayout() {
        const savedStatesJSON = localStorage.getItem(BLOCK_LAYOUT_KEY);
        maxZIndex = 0; 
        if (savedStatesJSON) {
            try {
                blockStates = JSON.parse(savedStatesJSON);
            } catch (e) {
                console.error("Erro ao parsear layout salvo. Resetando para padrão.", e);
                localStorage.removeItem(BLOCK_LAYOUT_KEY); // Remove dados corrompidos
                blockStates = {};
                setDefaultBlockLayout();
                return;
            }
            
            let foundBlocks = 0;
            for (const id in blockStates) {
                const el = document.querySelector(`.draggable-block[data-block-id="${id}"]`);
                const state = blockStates[id];
                if (el && state) {
                    foundBlocks++;
                    el.style.width = state.width || el.dataset.defaultWidth || 'auto';
                    el.style.height = state.height || el.dataset.defaultHeight || 'auto';
                    el.style.transform = `translate(${state.x || 0}px, ${state.y || 0}px)`;
                    el.setAttribute('data-x', state.x || 0);
                    el.setAttribute('data-y', state.y || 0);
                    // Certifique-se de que zIndex é um número válido ou "auto"
                    el.style.zIndex = (state.zIndex && !isNaN(parseInt(state.zIndex))) ? parseInt(state.zIndex) : 'auto';

                    if (el.style.zIndex !== 'auto' && parseInt(el.style.zIndex) > maxZIndex) {
                        maxZIndex = parseInt(el.style.zIndex);
                    }
                }
            }
            if(foundBlocks === 0 && document.querySelectorAll('.draggable-block').length > 0) {
                setDefaultBlockLayout();
            }
        } else if (document.querySelectorAll('.draggable-block').length > 0){
            setDefaultBlockLayout();
        }
    }


    function setDefaultBlockLayout() { /* ... (mantido como antes) ... */
        if (!workspaceContainer) return;
        const blocks = Array.from(workspaceContainer.querySelectorAll('.draggable-block'));
        let currentTop = 10; let currentLeft = 10; let rowHeight = 0;
        const workspaceWidth = workspaceContainer.clientWidth - 20; // Subtrai padding

        maxZIndex = 0; // Reset zIndex for default layout

        blocks.forEach((block, index) => {
            const defaultWidth = parseInt(block.dataset.defaultWidth) || Math.min(400, workspaceWidth);
            const defaultHeightStr = block.dataset.defaultHeight;
            
            block.style.width = `${defaultWidth}px`;
            if (defaultHeightStr && defaultHeightStr !== 'auto') {
                block.style.height = `${parseInt(defaultHeightStr)}px`;
            } else {
                 block.style.height = 'auto'; // Permite que o conteúdo defina a altura
            }

            if (currentLeft + defaultWidth > workspaceWidth && currentLeft > 10) { 
                currentLeft = 10; currentTop += rowHeight + 10; rowHeight = 0;
            }
            block.style.transform = `translate(${currentLeft}px, ${currentTop}px)`;
            block.setAttribute('data-x', currentLeft);
            block.setAttribute('data-y', currentTop);
            
            const currentZ = index + 1;
            block.style.zIndex = currentZ;
            if (currentZ > maxZIndex) maxZIndex = currentZ;

            const blockActualHeight = block.offsetHeight;
            if (blockActualHeight > rowHeight) rowHeight = blockActualHeight;
            
            currentLeft += defaultWidth + 10;
        });
        saveBlockLayout(); // Salva o layout padrão
    }
    
    if(resetLayoutButton) { /* ... (mantido como antes) ... */
        resetLayoutButton.addEventListener('click', () => {
            if (confirm("Tem certeza que deseja resetar o layout dos blocos para o padrão?")) {
                localStorage.removeItem(BLOCK_LAYOUT_KEY);
                blockStates = {};
                setDefaultBlockLayout();
                showNotification("Layout resetado para o padrão.", 2000);
            }
        });
    }


    // --- LÓGICA INTERNA DA FICHA ---
    function initAppLogic() {
        if (aptidoesGrid) populateAptidoes(); else console.warn("Aptidoes grid not found");
        if (inventarioItensDiv && vestimentasAtivasDiv) initInventorySlots(); else console.warn("Inventory/Vestimenta divs not found");
        if (saudePoleElement && saudeValueInput) initPoleBubbles(saudePoleElement, saudeValueInput);
        if (volicaoPoleElement && volicaoValueInput) initPoleBubbles(volicaoPoleElement, volicaoValueInput);
        if (attrErudicao) updateMaxAptidoesDisplay(); // Call initially
        if (nivelFortunaSelect) updateFortunaMalandragemDisplay(); // Call initially
        setupAppEventListeners();
        loadCharacterData(); // Carrega dados após tudo estar pronto
    }

    function setupAppEventListeners() { /* ... (mantido como antes) ... */
        if(attrErudicao) attrErudicao.addEventListener('input', updateMaxAptidoesDisplay);
        if(nivelFortunaSelect) nivelFortunaSelect.addEventListener('change', updateFortunaMalandragemDisplay);
        if(saudePoleElement && saudeValueInput) saudePoleElement.addEventListener('click', (e) => handlePoleClick(e, saudePoleElement, saudeValueInput, 'saude'));
        if(volicaoPoleElement && volicaoValueInput) volicaoPoleElement.addEventListener('click', (e) => handlePoleClick(e, volicaoPoleElement, volicaoValueInput, 'volicao'));
        if(pontoFardoButton) pontoFardoButton.addEventListener('click', togglePontoFardo);
        if(ativarArquetipoButton && charArquetipo) ativarArquetipoButton.addEventListener('click', () => {
            if(charArquetipo.value) showNotification(`Habilidade do Arquétipo ${charArquetipo.options[charArquetipo.selectedIndex].text} ativada (1 vez/ambiente).`, 3000);
            else showNotification("Selecione um Arquétipo primeiro.", 2000);
        });
    }

    // APRIMORADO: Refatoração para Ponto de Fardo
    function updatePontoFardoButtonDisplay() {
        if (!pontoFardoButton) return;
        const svgIcon = `<svg class="icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>`;
        pontoFardoButton.innerHTML = `${svgIcon} PONTO DE FARDO (${fardoAtual})`;
    }

    function togglePontoFardo() {
        if (!pontoFardoButton) return;
        fardoAtual = fardoAtual === 0 ? 1 : 0;
        updatePontoFardoButtonDisplay();
        if (fardoAtual === 1) showNotification("Ponto de Fardo Ativado!", 5000);
    }
    
    function updateMaxAptidoesDisplay() { /* ... (como na v5) ... */
        if (!attrErudicao || !maxAptidoesCountDisplay) return;
        const erudicaoVal = parseInt(attrErudicao.value) || 0;
        maxAptidoesSelecionaveis = 5 + erudicaoVal;
        // maxAptidoesCountDisplay.textContent = maxAptidoesSelecionaveis; // O H3 já tem o span
         if(aptidoesTitle && aptidoesTitle.querySelector('small')) {
            aptidoesTitle.querySelector('small').innerHTML = `(ESCOLHA <span id="maxAptidoesCount">${maxAptidoesSelecionaveis}</span> COM +1)`;
        }
    }

    function populateAptidoes() { /* ... (mantido como antes, ID das aptidões atualizado em aptidoesBase) ... */
        if(!aptidoesGrid) return;
        aptidoesGrid.innerHTML = '';
        aptidoesBase.forEach(apt => {
            const itemDiv = document.createElement('div'); itemDiv.classList.add('aptidao-item');
            const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.id = `apt-${apt.id}`; checkbox.name = 'aptidaoSelecionada'; checkbox.value = apt.id;
            const label = document.createElement('label'); label.htmlFor = `apt-${apt.id}`; label.innerHTML = `<span class="aptidao-nome">${apt.nome}</span>`;
            checkbox.addEventListener('change', () => {
                const checkedCount = document.querySelectorAll('.draggable-block input[name="aptidaoSelecionada"]:checked').length;
                if (checkedCount > maxAptidoesSelecionaveis) { checkbox.checked = false; showNotification(`Você pode escolher apenas ${maxAptidoesSelecionaveis} aptidões com bônus.`, 2000); }
                label.querySelector('.aptidao-nome').classList.toggle('selected-aptitude', checkbox.checked);
            });
            itemDiv.appendChild(checkbox); itemDiv.appendChild(label); aptidoesGrid.appendChild(itemDiv);
        });
    }
    function updateFortunaMalandragemDisplay() { /* ... (mantido como antes) ... */
        if(!nivelFortunaSelect || !displayNivelFortuna || !displayNivelMalandragem || !itensIniciaisFortunaDisplay) return;
        const fortunaValorEscolhido = parseInt(nivelFortunaSelect.value); 
        const fortunaNiveisTexto = ["I (Mítico)", "II (Alta)", "III (Confortável)", "IV (Moderada)", "V (Baixa)"]; // Simplificado para corresponder aos valores
        const malandragemNiveisTexto = ["V", "IV", "III", "II", "I"]; 
        // A lógica do índice precisa casar valor do select (1-5) com índice do array (0-4)
        displayNivelFortuna.textContent = fortunaNiveisTexto[parseInt(nivelFortunaSelect.options[nivelFortunaSelect.selectedIndex].text.split(' ')[0]) -1] || fortunaNiveisTexto[5 - fortunaValorEscolhido]; // Melhorado para usar o texto
        displayNivelMalandragem.textContent = malandragemNiveisTexto[5 - fortunaValorEscolhido];
        itensIniciaisFortunaDisplay.textContent = fortunaItensMap[fortunaValorEscolhido.toString()] || "N/A";
    }

    function initInventorySlots() { /* ... (mantido como antes) ... */
        if(!inventarioItensDiv || !vestimentasAtivasDiv) return;
        inventarioItensDiv.innerHTML = ''; vestimentasAtivasDiv.innerHTML = '';
        for (let i = 0; i < 5; i++) inventarioItensDiv.innerHTML += `<div class="item-slot"><input type="text" id="itemSlot${i}" placeholder="Item ${i+1}..."></div>`;
        for (let i = 0; i < 2; i++) vestimentasAtivasDiv.innerHTML += `<div class="vestimenta-slot"><input type="text" id="vestimentaSlot${i}" placeholder="Vestimenta ${i+1} (em uso)..."></div>`;
    }
    function initPoleBubbles(poleEl, valIn) { if(!poleEl || !valIn) return; const max = parseInt(poleEl.dataset.maxPoints) || 10; poleEl.innerHTML = ''; for(let i=0;i<max;i++){ const b=document.createElement('div');b.classList.add('pole-bubble');b.dataset.index=i;poleEl.appendChild(b); } updatePoleDisplay(poleEl,valIn); }
    function updatePoleDisplay(poleEl, valIn) { if(!poleEl || !valIn) return; const curr = parseInt(valIn.value) || 0; poleEl.querySelectorAll('.pole-bubble').forEach((b,idx) => b.classList.toggle('filled', idx < curr)); }
    function handlePoleClick(evt, poleEl, valIn, type) { if(!poleEl || !valIn) return; const bubble = evt.target.closest('.pole-bubble'); if(!bubble) return; const idx = parseInt(bubble.dataset.index); let newVal = idx + 1; if(newVal === parseInt(valIn.value)) newVal=idx; valIn.value=newVal; updatePoleDisplay(poleEl, valIn); if(newVal<=0){ const consArea = type==='saude'?saudeConsequencias:volicaoConsequencias; const msg = type === 'saude'?"SAÚDE A 0! Narrador: Lesão, Cicatriz, Amputação ou Morte?":"VOLIÇÃO A 0! Narrador: Fobia, Mania ou Colapso?"; showNotification(msg, 7000); if(consArea)consArea.focus();}}
    function showNotification(msg, dur = 3000) { if(!notificationArea) return; notificationArea.textContent=msg; notificationArea.classList.add('show'); setTimeout(()=>notificationArea.classList.remove('show'), dur); }


    function setupGlobalEventListeners() {
        if(saveButton) saveButton.addEventListener('click', () => { saveCharacterData(); saveBlockLayout(); showNotification('Ficha e Layout Salvos!'); });
        if(loadButton) loadButton.addEventListener('click', () => { loadCharacterData(); loadBlockLayout(); showNotification('Ficha e Layout Carregados!'); });
        if(clearButton) clearButton.addEventListener('click', () => { if(confirm("Limpar TODOS os dados e layout?")){ clearCharacterData(); localStorage.removeItem(BLOCK_LAYOUT_KEY); blockStates={}; setDefaultBlockLayout(); showNotification('Ficha e Layout Limpos.');}});
        if(roll2d6Button) roll2d6Button.addEventListener('click', () => { const d1=Math.floor(Math.random()*6)+1; const d2=Math.floor(Math.random()*6)+1; if(diceResultDisplay) diceResultDisplay.textContent=`${d1+d2} (${d1}+${d2})`;});
    }

    function saveCharacterData() {
        const data = {};
        allFieldDataConfig.forEach(field => { const element = document.getElementById(field.id); if (element) data[field.id] = field.type === 'checkbox' ? element.checked : element.value; });
        const aptidoesCheckboxes = document.querySelectorAll('.draggable-block input[name="aptidaoSelecionada"]:checked');
        data.aptidoesSelecionadas = Array.from(aptidoesCheckboxes).map(cb => cb.value);
        data.inventario = Array.from({length: 5}, (_, i) => { const el = document.getElementById(`itemSlot${i}`); return el ? el.value : "";});
        data.vestimentas = Array.from({length: 2}, (_, i) => { const el = document.getElementById(`vestimentaSlot${i}`); return el ? el.value : "";});
        data.pontoFardoAtual = fardoAtual;
        saveToLocalStorage(CHARACTER_DATA_KEY, JSON.stringify(data));
    }

    function loadCharacterData() {
        const savedDataJSON = localStorage.getItem(CHARACTER_DATA_KEY);
        if (savedDataJSON) {
            let data;
            try {
                data = JSON.parse(savedDataJSON);
            } catch(e) {
                console.error("Erro ao parsear dados do personagem. Dados podem estar corrompidos.", e);
                showNotification("Erro ao carregar dados da ficha. Podem estar corrompidos.", 4000);
                // Opcional: Chamar clearCharacterData() aqui ou carregar padrões.
                clearCharacterData(); // Carrega padrões definidos.
                updateFortunaMalandragemDisplay(); // Assegura display correto.
                return;
            }

            allFieldDataConfig.forEach(field => {
                const element = document.getElementById(field.id);
                if (element && data[field.id] !== undefined) {
                    if (field.type === 'checkbox') element.checked = data[field.id];
                    else element.value = data[field.id];
                } else if (element && field.default !== undefined) { // Se o dado não existir mas houver default
                     if (field.type === 'checkbox') element.checked = field.default; // Supondo que default para checkbox é booleano
                     else element.value = field.default;
                }
            });

            // Aptidões
            document.querySelectorAll('.draggable-block input[name="aptidaoSelecionada"]').forEach(cb => {
                cb.checked = false;
                const labelSpan = cb.nextElementSibling.querySelector('.aptidao-nome');
                if (labelSpan) labelSpan.classList.remove('selected-aptitude');
            });
            if (data.aptidoesSelecionadas) {
                data.aptidoesSelecionadas.forEach(aptId => {
                    const cb = document.getElementById(`apt-${aptId}`);
                    if (cb) {
                        cb.checked = true;
                        const labelSpan = cb.nextElementSibling.querySelector('.aptidao-nome');
                        if (labelSpan) labelSpan.classList.add('selected-aptitude');
                    }
                });
            }

            if (data.inventario) for (let i = 0; i < 5; i++) { const el = document.getElementById(`itemSlot${i}`); if(el) el.value = data.inventario[i] || '';}
            if (data.vestimentas) for (let i = 0; i < 2; i++) { const el = document.getElementById(`vestimentaSlot${i}`); if(el) el.value = data.vestimentas[i] || '';}
            
            fardoAtual = data.pontoFardoAtual !== undefined ? data.pontoFardoAtual : 0;
            updatePontoFardoButtonDisplay();

            if (saudePoleElement && saudeValueInput) updatePoleDisplay(saudePoleElement, saudeValueInput);
            if (volicaoPoleElement && volicaoValueInput) updatePoleDisplay(volicaoPoleElement, volicaoValueInput);
            updateMaxAptidoesDisplay();
            updateFortunaMalandragemDisplay();
        } else {
            // Se não há dados salvos, inicializa com valores padrão e atualiza displays
            clearCharacterData(); // Aplicará os defaults definidos no allFieldDataConfig
            updateFortunaMalandragemDisplay();
            updateMaxAptidoesDisplay();
            updatePontoFardoButtonDisplay(); // Garante que o botão de fardo esteja correto
            if (saudePoleElement && saudeValueInput) updatePoleDisplay(saudePoleElement, saudeValueInput);
            if (volicaoPoleElement && volicaoValueInput) updatePoleDisplay(volicaoPoleElement, volicaoValueInput);
        }
    }

    function clearCharacterData() {
        allFieldDataConfig.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                if (field.type === 'checkbox') element.checked = field.default !== undefined ? field.default : false;
                else if (field.type === 'number' || field.type === 'hidden') element.value = field.default !== undefined ? field.default : (field.type === 'hidden' ? 3 : 0);
                else if (field.type === 'select') element.value = field.default !== undefined ? field.default : "";
                else element.value = field.default !== undefined ? field.default : '';
            }
        });
        document.querySelectorAll('.draggable-block input[name="aptidaoSelecionada"]').forEach(cb => { cb.checked = false; cb.nextElementSibling.querySelector('.aptidao-nome').classList.remove('selected-aptitude'); });
        for (let i = 0; i < 5; i++) { const el = document.getElementById(`itemSlot${i}`); if(el) el.value = '';}
        for (let i = 0; i < 2; i++) { const el = document.getElementById(`vestimentaSlot${i}`); if(el) el.value = '';}
        
        fardoAtual = 0; // Padrão para fardo é 0
        updatePontoFardoButtonDisplay();

        if (saudePoleElement && saudeValueInput) updatePoleDisplay(saudePoleElement, saudeValueInput);
        if (volicaoPoleElement && volicaoValueInput) updatePoleDisplay(volicaoPoleElement, volicaoValueInput);
        updateMaxAptidoesDisplay();
        updateFortunaMalandragemDisplay();
    }

    initializeApp();
});