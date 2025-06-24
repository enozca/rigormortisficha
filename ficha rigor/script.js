// O script da v5 (anteriormente nomeado script_v5.js) já está bem adaptado.
// Apenas renomeie o arquivo ou copie o conteúdo dele para script.js.
// Cole o conteúdo de script_v5.js (fornecido na resposta anterior) aqui.

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'rigorMortisSheetData_unified'; 

    // Seletores de elementos (incluindo os novos)
    const charName = document.getElementById('charName'), charConceito = document.getElementById('charConceito'),
          charAspiracao = document.getElementById('charAspiracao'), pontoFardoButton = document.getElementById('pontoFardo'),
          charArquetipo = document.getElementById('charArquetipo'), ativarArquetipoButton = document.getElementById('ativarArquetipo'),
          attrImpeto = document.getElementById('attrImpeto'), attrCinesia = document.getElementById('attrCinesia'),
          attrFinesse = document.getElementById('attrFinesse'), attrErudicao = document.getElementById('attrErudicao'),
          saudePoleElement = document.getElementById('saudePole'), volicaoPoleElement = document.getElementById('volicaoPole'),
          saudeValueInput = document.getElementById('saudeValue'), volicaoValueInput = document.getElementById('volicaoValue'),
          saudeConsequencias = document.getElementById('saudeConsequencias'), volicaoConsequencias = document.getElementById('volicaoConsequencias'),
          isTensionadoCheckbox = document.getElementById('isTensionado'), vicioPersonagemInput = document.getElementById('vicioPersonagem'),
          aptidoesGrid = document.getElementById('aptidoesGrid'), maxAptidoesCountDisplay = document.getElementById('maxAptidoesCount'),
          ocupacaoInput = document.getElementById('ocupacaoInput'), nivelFortunaSelect = document.getElementById('nivelFortunaSelect'),
          displayNivelFortuna = document.getElementById('displayNivelFortuna'), displayNivelMalandragem = document.getElementById('displayNivelMalandragem'),
          itensIniciaisFortunaDisplay = document.getElementById('itensIniciaisFortuna'),
          misterioDetail = document.getElementById('misterioDetail'), segredoDetail = document.getElementById('segredoDetail'),
          interpretacaoPenumbraDetail = document.getElementById('interpretacaoPenumbraDetail'), medosDetail = document.getElementById('medosDetail'),
          focosCountInput = document.getElementById('focosCount'), inventarioItensDiv = document.getElementById('inventarioItens'),
          vestimentasAtivasDiv = document.getElementById('vestimentasAtivas'), contatosList = document.getElementById('contatosList'),
          pontosAprimoramentoInput = document.getElementById('pontosAprimoramento'), habilidadesAdquiridas = document.getElementById('habilidadesAdquiridas'),
          casoPerguntasText = document.getElementById('casoPerguntasText'), palacioMentalText = document.getElementById('palacioMentalText'),
          anotacoesGeraisText = document.getElementById('anotacoesGeraisText'),
          saveButton = document.getElementById('saveButton'), loadButton = document.getElementById('loadButton'),
          clearButton = document.getElementById('clearButton'), notificationArea = document.getElementById('notificationArea'),
          roll2d6Button = document.getElementById('roll2d6Button'), diceResultDisplay = document.getElementById('diceResult');

    const allFieldData = [ 
        { id: 'charName', type: 'text' }, { id: 'charConceito', type: 'text' }, { id: 'charAspiracao', type: 'text' },
        { id: 'charArquetipo', type: 'select' },
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

    const aptidoesBase = [ 
        'Limiar da Dor', 'Instinto', 'Confronto', 'Fervor', 'Atletismo', 'Artimanha', 'Sobrevivência',
        'Pontaria', 'Percepção', 'Reação', 'Destreza', 'Mecânica', 'Infiltração', 'Direção',
        'Acalento', 'Teatro', 'Charme', 'Vontade', 'Autoridade', 'Agricultura', 'Espírito',
        'Raciocínio', 'Abstração', 'Pesquisa', 'Memória', 'Balística', 'Medicina', 'Empiria'
    ].map(nome => ({ id: nome.toLowerCase().replace(/\s+/g, '').replace(/[^\w]/gi, ''), nome: nome }));


    const fortunaItensMap = {
        "5": "2 itens de Classe I", 
        "4": "2 itens de Classe I e 1 item de Classe II", 
        "3": "2 itens de Classe I e 2 itens de Classe II", 
        "2": "3 itens de Classe I e 2 itens de Classe II", 
        "1": "3 itens de Classe I, 2 itens de Classe II e 1 item de Classe III"
    };

    let fardoAtual = 0;
    let maxAptidoesSelecionaveis = 5;

    function init() {
        populateAptidoes();
        initInventorySlots();
        initPoleBubbles(saudePoleElement, saudeValueInput);
        initPoleBubbles(volicaoPoleElement, volicaoValueInput);
        updateMaxAptidoesDisplay();
        updateFortunaMalandragemDisplay();
        setupEventListeners();
        loadData();
    }

    function updateMaxAptidoesDisplay() {
        const erudicaoVal = parseInt(attrErudicao.value) || 0;
        maxAptidoesSelecionaveis = 5 + erudicaoVal;
        maxAptidoesCountDisplay.textContent = maxAptidoesSelecionaveis;
    }
    
    function populateAptidoes() {
        aptidoesGrid.innerHTML = '';
        aptidoesBase.forEach(apt => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('aptidao-item');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `apt-${apt.id}`;
            checkbox.name = 'aptidaoSelecionada';
            checkbox.value = apt.id;
            const label = document.createElement('label');
            label.htmlFor = `apt-${apt.id}`;
            label.innerHTML = `<span class="aptidao-nome">${apt.nome}</span>`;
            
            checkbox.addEventListener('change', () => {
                const checkedCount = document.querySelectorAll('input[name="aptidaoSelecionada"]:checked').length;
                if (checkedCount > maxAptidoesSelecionaveis) {
                    checkbox.checked = false;
                    showNotification(`Você pode escolher apenas ${maxAptidoesSelecionaveis} aptidões com bônus.`, 2000);
                }
                label.querySelector('.aptidao-nome').classList.toggle('selected-aptitude', checkbox.checked);
            });
            itemDiv.appendChild(checkbox);
            itemDiv.appendChild(label);
            aptidoesGrid.appendChild(itemDiv);
        });
    }

    function updateFortunaMalandragemDisplay() {
        const fortunaValorEscolhido = parseInt(nivelFortunaSelect.value); 
        const fortunaNiveisTexto = ["I (Nomádico/Mítico)", "II (Alta Renda)", "III (Confortável)", "IV (Moderada)", "V (Baixa)"];
        const malandragemNiveisTexto = ["V", "IV", "III", "II", "I"]; 

        displayNivelFortuna.textContent = fortunaNiveisTexto[5 - fortunaValorEscolhido];
        displayNivelMalandragem.textContent = malandragemNiveisTexto[5 - fortunaValorEscolhido];
        itensIniciaisFortunaDisplay.textContent = fortunaItensMap[fortunaValorEscolhido.toString()];
    }

    function initInventorySlots() {
        inventarioItensDiv.innerHTML = ''; vestimentasAtivasDiv.innerHTML = '';
        for (let i = 0; i < 5; i++) inventarioItensDiv.innerHTML += `<div class="item-slot"><input type="text" id="itemSlot${i}" placeholder="Item ${i+1}..."></div>`;
        for (let i = 0; i < 2; i++) vestimentasAtivasDiv.innerHTML += `<div class="vestimenta-slot"><input type="text" id="vestimentaSlot${i}" placeholder="Vestimenta ${i+1} (em uso)..."></div>`;
    }

    function initPoleBubbles(poleElement, valueInput) {
        const maxPoints = parseInt(poleElement.dataset.maxPoints) || 10;
        poleElement.innerHTML = '';
        for (let i = 0; i < maxPoints; i++) {
            const bubble = document.createElement('div');
            bubble.classList.add('pole-bubble');
            bubble.dataset.index = i;
            poleElement.appendChild(bubble);
        }
        updatePoleDisplay(poleElement, valueInput);
    }
    function updatePoleDisplay(poleElement, valueInput) {
        const currentValue = parseInt(valueInput.value) || 0;
        const bubbles = poleElement.querySelectorAll('.pole-bubble');
        bubbles.forEach((bubble, index) => {
            bubble.classList.toggle('filled', index < currentValue);
        });
    }
    function handlePoleClick(event, poleElement, valueInput, poleType) {
        const targetBubble = event.target.closest('.pole-bubble');
        if (!targetBubble) return;
        const clickedIndex = parseInt(targetBubble.dataset.index);
        let newValue = clickedIndex + 1;
        if (newValue === parseInt(valueInput.value)) { 
             newValue = clickedIndex; 
        }
        valueInput.value = newValue;
        updatePoleDisplay(poleElement, valueInput);

        if (newValue <= 0) {
            const consequenciaArea = poleType === 'saude' ? saudeConsequencias : volicaoConsequencias;
            const msg = poleType === 'saude' ?
                "SAÚDE A 0! Narrador: Lesão, Cicatriz, Amputação ou Morte?" :
                "VOLIÇÃO A 0! Narrador: Fobia, Mania ou Colapso?";
            showNotification(msg, 7000);
            consequenciaArea.focus();
        }
    }
    
    function togglePontoFardo() {
        fardoAtual = fardoAtual === 0 ? 1 : 0;
        pontoFardoButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg> PONTO DE FARDO (${fardoAtual})`;
        if (fardoAtual === 1) {
            showNotification("Ponto de Fardo Ativado! (Sucesso automático ou recupera Volição). Lembre-se de resetar no fim da sessão.", 5000);
        }
    }
    function showNotification(message, duration = 3000) {
        notificationArea.textContent = message;
        notificationArea.classList.add('show');
        setTimeout(() => notificationArea.classList.remove('show'), duration);
    }

    function setupEventListeners() {
        saveButton.addEventListener('click', saveData);
        loadButton.addEventListener('click', loadData);
        clearButton.addEventListener('click', clearData);
        roll2d6Button.addEventListener('click', () => {
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            diceResultDisplay.textContent = `${d1 + d2} (${d1}+${d2})`;
        });
        
        attrErudicao.addEventListener('input', updateMaxAptidoesDisplay);
        nivelFortunaSelect.addEventListener('change', updateFortunaMalandragemDisplay);

        saudePoleElement.addEventListener('click', (e) => handlePoleClick(e, saudePoleElement, saudeValueInput, 'saude'));
        volicaoPoleElement.addEventListener('click', (e) => handlePoleClick(e, volicaoPoleElement, volicaoValueInput, 'volicao'));
        pontoFardoButton.addEventListener('click', togglePontoFardo);
        ativarArquetipoButton.addEventListener('click', () => {
            if(charArquetipo.value) {
                showNotification(`Habilidade do Arquétipo ${charArquetipo.options[charArquetipo.selectedIndex].text} ativada (1 vez/ambiente).`, 3000);
            } else {
                showNotification("Selecione um Arquétipo primeiro.", 2000);
            }
        });
    }

    function saveData() {
        const data = {};
        allFieldData.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) data[field.id] = field.type === 'checkbox' ? element.checked : element.value;
        });
        data.aptidoesSelecionadas = Array.from(document.querySelectorAll('input[name="aptidaoSelecionada"]:checked')).map(cb => cb.value);
        data.inventario = Array.from({length: 5}, (_, i) => document.getElementById(`itemSlot${i}`).value);
        data.vestimentas = Array.from({length: 2}, (_, i) => document.getElementById(`vestimentaSlot${i}`).value);
        data.pontoFardoAtual = fardoAtual;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        showNotification('Ficha salva com sucesso!');
    }

    function loadData() {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            const data = JSON.parse(savedData);
            allFieldData.forEach(field => {
                const element = document.getElementById(field.id);
                if (element && data[field.id] !== undefined) {
                    if (field.type === 'checkbox') element.checked = data[field.id];
                    else element.value = data[field.id];
                }
            });
            document.querySelectorAll('input[name="aptidaoSelecionada"]').forEach(cb => {
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
            if (data.inventario) for (let i = 0; i < 5; i++) document.getElementById(`itemSlot${i}`).value = data.inventario[i] || '';
            if (data.vestimentas) for (let i = 0; i < 2; i++) document.getElementById(`vestimentaSlot${i}`).value = data.vestimentas[i] || '';
            fardoAtual = data.pontoFardoAtual !== undefined ? data.pontoFardoAtual : 0;
            // Chamar togglePontoFardo duas vezes para resetar o estado do botão sem disparar a notificação de "ativado"
            togglePontoFardo(); 
            if(fardoAtual === 0 && pontoFardoButton.textContent.includes("(1)") || fardoAtual === 1 && pontoFardoButton.textContent.includes("(0)") ) { // Corrige se o estado estiver dessincronizado
                 togglePontoFardo();
            }


            updatePoleDisplay(saudePoleElement, saudeValueInput);
            updatePoleDisplay(volicaoPoleElement, volicaoValueInput);
            updateMaxAptidoesDisplay();
            updateFortunaMalandragemDisplay();
            showNotification('Ficha carregada!');
        } else {
            updateFortunaMalandragemDisplay(); // Garante que os valores iniciais de fortuna/malandragem sejam exibidos
            showNotification('Nenhum dado salvo encontrado. Ficha inicializada.');
        }
    }

    function clearData() {
        if (confirm('Tem certeza que deseja limpar todos os campos da ficha? Esta ação não pode ser desfeita.')) {
            allFieldData.forEach(field => {
                const element = document.getElementById(field.id);
                if (element) {
                    if (field.type === 'checkbox') element.checked = false;
                    else if (field.type === 'number' || field.type === 'hidden') element.value = field.default !== undefined ? field.default : (field.type === 'hidden' ? 3 : 0);
                    else if (field.type === 'select') element.value = field.default !== undefined ? field.default : "";
                    else element.value = '';
                }
            });
            document.querySelectorAll('input[name="aptidaoSelecionada"]').forEach(cb => {
                cb.checked = false;
                cb.nextElementSibling.querySelector('.aptidao-nome').classList.remove('selected-aptitude');
            });
            for (let i = 0; i < 5; i++) document.getElementById(`itemSlot${i}`).value = '';
            for (let i = 0; i < 2; i++) document.getElementById(`vestimentaSlot${i}`).value = '';
            
            if(fardoAtual === 1) { togglePontoFardo(); } // Reseta o fardo para 0 se estiver 1

            updatePoleDisplay(saudePoleElement, saudeValueInput);
            updatePoleDisplay(volicaoPoleElement, volicaoValueInput);
            updateMaxAptidoesDisplay();
            updateFortunaMalandragemDisplay();
            showNotification('Ficha limpa.');
        }
    }
    init();
});