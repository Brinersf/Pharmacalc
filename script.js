document.addEventListener('DOMContentLoaded', () => {
    const calculatorsData = [
        {
            id: 'volAdm', name: '1. Volume a Administrar',
            description: 'Este cálculo determina o volume exato de uma solução medicamentosa que precisa ser administrado ao paciente, com base na dose que foi prescrita pelo médico e na concentração do medicamento que está disponível para uso.',
            formula: 'Volume (mL) = Dose Prescrita (em mg ou UI) / Concentração (em mg/mL ou UI/mL)',
            notes: 'Importante: As unidades da dose prescrita e da concentração do fármaco devem ser as mesmas para um cálculo correto (ex: se a dose é em mg, a concentração também deve ser em mg/mL). Verifique sempre a estabilidade da solução após a diluição e as recomendações do fabricante.',
            fields: [
                {label: 'Dose prescrita (mg):', originalId: 'ds_volAdm_dose', type: 'number', placeholder: 'Ex: 100'},
                {label: 'Concentração disponível (mg/mL):', originalId: 'ds_volAdm_conc', type: 'number', placeholder: 'Ex: 50'}
            ],
            resultLabel: 'Volume a administrar:', resultUnit: 'mL',
            calculationFunc: function(inputs) {
                const dose = inputs.ds_volAdm_dose;
                const conc = inputs.ds_volAdm_conc;
                if (conc === 0) throw new Error("A concentração disponível não pode ser zero.");
                return (dose / conc).toFixed(2);
            }
        },
        {
            id: 'numComp', name: '2. Número de Comprimidos',
            description: 'Calcula a quantidade de comprimidos (ou partes de comprimidos, se aplicável e seguro) que o paciente deve tomar para atingir a dose total prescrita pelo médico.',
            formula: 'Nº Comprimidos = Dose Prescrita (mg) / Dose por Comprimido (mg)',
            notes: 'Verifique se o comprimido pode ser partido, caso o resultado seja fracionado. Nem todos os comprimidos são sulcados ou têm liberação compatível com a partição.',
            fields: [
                {label: 'Dose prescrita (mg):', originalId: 'ds_numComp_dose', type: 'number', placeholder: 'Ex: 500'},
                {label: 'Dose por comprimido (mg):', originalId: 'ds_numComp_doseComp', type: 'number', placeholder: 'Ex: 250'}
            ],
            resultLabel: 'Número de comprimidos:',
            calculationFunc: function(inputs) {
                const dose = inputs.ds_numComp_dose;
                const doseComp = inputs.ds_numComp_doseComp;
                if (doseComp === 0) throw new Error("A dose por comprimido não pode ser zero.");
                return (dose / doseComp).toFixed(2); // Permite resultado fracionado, ex: 1.5 comprimidos
            }
        },
        {
            id: 'gtsMacro', name: '3. Gotas por Minuto (Macrogotas)',
            description: 'Determina a taxa de infusão em gotas por minuto para um equipo de macrogotas, usado em soroterapia para administrar volumes maiores em um tempo determinado.',
            formula: 'Gotas/min = (Volume Total (mL) * Fator de Gotas do Equipo) / Tempo Total (minutos)',
            notes: 'O fator de gotas padrão para equipos de macrogotas é geralmente 20 gotas/mL. Confirme o fator do equipo utilizado.',
            fields: [
                {label: 'Volume Total (mL):', originalId: 'ti_macro_vol', type: 'number', placeholder: 'Ex: 1000'},
                {label: 'Tempo Total (minutos):', originalId: 'ti_macro_tempoMin', type: 'number', placeholder: 'Ex: 480 (para 8 horas)'},
                {label: 'Fator Gotas (gotas/mL):', originalId: 'ti_macro_fator', type: 'number', value: '20', placeholder: 'Padrão: 20'}
            ],
            resultLabel: 'Taxa de infusão:', resultUnit: 'gotas/min',
            calculationFunc: function(inputs) {
                const vol = inputs.ti_macro_vol;
                const tempoMin = inputs.ti_macro_tempoMin;
                const fator = inputs.ti_macro_fator;
                if (tempoMin === 0) throw new Error("O tempo total em minutos não pode ser zero.");
                if (fator <= 0) throw new Error("O fator de gotas deve ser maior que zero.");
                return Math.round((vol * fator) / tempoMin);
            }
        },
        {
            id: 'gtsMicro', name: '4. Microgotas por Minuto',
            description: 'Determina a taxa de infusão em microgotas por minuto para um equipo de microgotas, frequentemente usado em pediatria ou para administração de volumes menores e precisos.',
            formula: 'Microgotas/min = (Volume Total (mL) * Fator de Gotas do Equipo) / Tempo Total (minutos)',
            notes: 'O fator de gotas padrão para equipos de microgotas é geralmente 60 microgotas/mL (o que faz com que mL/hora seja igual a microgotas/minuto). Confirme o fator do equipo.',
            fields: [
                {label: 'Volume Total (mL):', originalId: 'ti_micro_vol', type: 'number', placeholder: 'Ex: 500'},
                {label: 'Tempo Total (minutos):', originalId: 'ti_micro_tempoMin', type: 'number', placeholder: 'Ex: 720 (para 12 horas)'},
                {label: 'Fator Gotas (microgotas/mL):', originalId: 'ti_micro_fator', type: 'number', value: '60', placeholder: 'Padrão: 60'}
            ],
            resultLabel: 'Taxa de infusão:', resultUnit: 'microgotas/min',
            calculationFunc: function(inputs) {
                const vol = inputs.ti_micro_vol;
                const tempoMin = inputs.ti_micro_tempoMin;
                const fator = inputs.ti_micro_fator;
                if (tempoMin === 0) throw new Error("O tempo total em minutos não pode ser zero.");
                if (fator <= 0) throw new Error("O fator de gotas deve ser maior que zero.");
                return Math.round((vol * fator) / tempoMin);
            }
        },
        {
            id: 'mlHoraBomba', name: '5. mL por Hora (Bomba de Infusão)',
            description: 'Calcula a vazão em mililitros por hora (mL/h) a ser programada em uma bomba de infusão para administrar um determinado volume em um período específico.',
            formula: 'Taxa (mL/h) = Volume Total (mL) / Tempo Total (horas)',
            notes: 'Este cálculo é fundamental para garantir a administração correta de fluidos e medicamentos endovenosos contínuos.',
            fields: [
                {label: 'Volume Total (mL):', originalId: 'ti_bomba_vol', type: 'number', placeholder: 'Ex: 500'},
                {label: 'Tempo Total (horas):', originalId: 'ti_bomba_tempoH', type: 'number', placeholder: 'Ex: 6'}
            ],
            resultLabel: 'Taxa de infusão:', resultUnit: 'mL/h',
            calculationFunc: function(inputs) {
                const vol = inputs.ti_bomba_vol;
                const tempoH = inputs.ti_bomba_tempoH;
                if (tempoH === 0) throw new Error("O tempo total em horas não pode ser zero.");
                return (vol / tempoH).toFixed(2);
            }
        },
        {
            id: 'mlHMgh', name: '6. mL/h para infusão de mg/h',
            description: 'Converte uma dose prescrita em miligramas por hora (mg/h) para uma taxa de infusão em mililitros por hora (mL/h), dada a concentração da solução medicamentosa.',
            formula: 'Taxa (mL/h) = Dose Prescrita (mg/h) / Concentração da Solução (mg/mL)',
            notes: 'Útil para drogas administradas em infusão contínua onde a dose é titulada em massa por unidade de tempo.',
            fields: [
                {label: 'Dose prescrita (mg/h):', originalId: 'ti_mgh_dose', type: 'number', placeholder: 'Ex: 10'},
                {label: 'Concentração da solução (mg/mL):', originalId: 'ti_mgh_conc', type: 'number', placeholder: 'Ex: 1'}
            ],
            resultLabel: 'Taxa de infusão:', resultUnit: 'mL/h',
            calculationFunc: function(inputs) {
                const dose = inputs.ti_mgh_dose;
                const conc = inputs.ti_mgh_conc;
                if (conc === 0) throw new Error("A concentração da solução não pode ser zero.");
                return (dose / conc).toFixed(2);
            }
        },
        {
            id: 'mlHMcgKgMin', name: '7. mL/h para mcg/kg/min',
            description: 'Calcula a taxa de infusão em mL/hora necessária para administrar uma droga vasoativa ou outra medicação cuja dose é expressa em microgramas por quilograma de peso corporal por minuto (mcg/kg/min).',
            formula: 'Taxa (mL/h) = [Dose (mcg/kg/min) * Peso (kg) * 60 (min/h)] / Concentração da Solução (mcg/mL)',
            notes: 'Essencial em UTIs para titulação de drogas como noradrenalina, dobutamina, etc. Converta a concentração da droga na seringa/bolsa para mcg/mL se estiver em mg/mL (1 mg = 1000 mcg).',
            fields: [
                {label: 'Dose desejada (mcg/kg/min):', originalId: 'ti_mcgkgmin_dose', type: 'number', placeholder: 'Ex: 5'},
                {label: 'Peso do paciente (kg):', originalId: 'ti_mcgkgmin_peso', type: 'number', placeholder: 'Ex: 70'},
                {label: 'Concentração da solução (mcg/mL):', originalId: 'ti_mcgkgmin_conc', type: 'number', placeholder: 'Ex: 1600 (para 4mg em 250mL, ou seja, 16mcg/mL não, 4000mcg/250mL = 16mcg/mL. Ex: 4mg de Nora em 250ml SF -> 4000mcg/250ml = 16mcg/ml. Ex: 50mg de Dobuta em 250ml -> 50000mcg/250ml = 200mcg/ml)'}
            ],
            resultLabel: 'Taxa de infusão:', resultUnit: 'mL/h',
            calculationFunc: function(inputs) {
                const dose = inputs.ti_mcgkgmin_dose;
                const peso = inputs.ti_mcgkgmin_peso;
                const conc = inputs.ti_mcgkgmin_conc;
                if (peso <= 0) throw new Error("O peso do paciente deve ser maior que zero.");
                if (conc <= 0) throw new Error("A concentração da solução deve ser maior que zero.");
                return ((dose * peso * 60) / conc).toFixed(2);
            }
        },
        {
            id: 'concFinal', name: '8. Concentração Final (Diluição)',
            description: 'Calcula a concentração final de uma substância após sua diluição em um determinado volume de solvente.',
            formula: 'Concentração Final (unidade/mL) = Quantidade do Fármaco (unidade) / Volume Final da Solução (mL)',
            notes: 'Utilizado para preparar soluções com concentrações específicas a partir de uma forma mais concentrada do fármaco. "Unidade" pode ser mg, g, UI, etc.',
            fields: [
                {label: 'Quantidade do fármaco (mg ou unidade):', originalId: 'dm_cf_quantFarmaco', type: 'number', placeholder: 'Ex: 500'},
                {label: 'Volume final da solução (mL):', originalId: 'dm_cf_volFinal', type: 'number', placeholder: 'Ex: 250'}
            ],
            resultLabel: 'Concentração final:', resultUnit: '(unid/mL)',
            calculationFunc: function(inputs) {
                const quant = inputs.dm_cf_quantFarmaco;
                const vol = inputs.dm_cf_volFinal;
                if (vol === 0) throw new Error("O volume final da solução não pode ser zero.");
                return (quant / vol).toFixed(3);
            }
        },
        {
            id: 'volSolutoNec', name: '9. Volume do Soluto Necessário (para Dose)',
            description: 'Determina o volume de uma solução estoque (soluto) que precisa ser aspirado para obter uma dose específica de um medicamento.',
            formula: 'Volume do Soluto (mL) = Dose Desejada (unidade) / Concentração do Soluto (unidade/mL)',
            notes: 'Importante para preparar doses individuais a partir de frascos multidose ou soluções concentradas.',
            fields: [
                {label: 'Dose desejada (mg ou unidade):', originalId: 'dm_vsn_doseDesejada', type: 'number', placeholder: 'Ex: 100'},
                {label: 'Concentração do soluto (mg/mL ou unid/mL):', originalId: 'dm_vsn_conc', type: 'number', placeholder: 'Ex: 20'}
            ],
            resultLabel: 'Volume do soluto:', resultUnit: 'mL',
            calculationFunc: function(inputs) {
                const dose = inputs.dm_vsn_doseDesejada;
                const conc = inputs.dm_vsn_conc;
                if (conc === 0) throw new Error("A concentração do soluto não pode ser zero.");
                return (dose / conc).toFixed(2);
            }
        },
        {
            id: 'doseTotalPed', name: '10. Dose Total Pediátrica (por peso)',
            description: 'Calcula a dose total diária ou por tomada de um medicamento para uma criança, com base na prescrição em mg (ou outra unidade) por kg de peso corporal.',
            formula: 'Dose Total (unidade) = Dose por kg (unidade/kg) * Peso da Criança (kg)',
            notes: 'Fundamental para a segurança na pediatria, onde as doses variam significativamente com o peso.',
            fields: [
                {label: 'Dose por kg (mg/kg):', originalId: 'ped_dt_doseKg', type: 'number', placeholder: 'Ex: 15'},
                {label: 'Peso da criança (kg):', originalId: 'ped_dt_peso', type: 'number', placeholder: 'Ex: 12'}
            ],
            resultLabel: 'Dose total:', resultUnit: 'mg (ou unid.)',
            calculationFunc: function(inputs) {
                const doseKg = inputs.ped_dt_doseKg;
                const peso = inputs.ped_dt_peso;
                if (peso <= 0) throw new Error("O peso da criança deve ser maior que zero.");
                return (doseKg * peso).toFixed(2);
            }
        },
        {
            id: 'volAdmPed', name: '11. Volume a Administrar Pediátrico',
            description: 'Calcula o volume da apresentação líquida de um medicamento a ser administrado a uma criança, com base na dose total calculada e na concentração da apresentação.',
            formula: 'Volume (mL) = Dose Total Calculada (mg) / Concentração da Apresentação (mg/mL)',
            notes: 'Geralmente usado após o cálculo da dose total pediátrica (item 10).',
            fields: [
                {label: 'Dose total calculada (mg):', originalId: 'ped_vol_doseTotal', type: 'number', placeholder: 'Ex: 180'},
                {label: 'Concentração da apresentação (mg/mL):', originalId: 'ped_vol_conc', type: 'number', placeholder: 'Ex: 50'}
            ],
            resultLabel: 'Volume a administrar:', resultUnit: 'mL',
            calculationFunc: function(inputs) {
                const doseTotal = inputs.ped_vol_doseTotal;
                const conc = inputs.ped_vol_conc;
                if (conc === 0) throw new Error("A concentração da apresentação não pode ser zero.");
                return (doseTotal / conc).toFixed(2);
            }
        },
        {
            id: 'insulinaVol', name: '12. Insulina - Volume a Administrar',
            description: 'Calcula o volume de insulina (em mL) a ser aspirado de um frasco, com base na dose prescrita em Unidades Internacionais (UI) e na concentração da insulina (geralmente 100 UI/mL).',
            formula: 'Volume (mL) = Dose Prescrita (UI) / Concentração da Insulina (UI/mL)',
            notes: 'Utilize seringas apropriadas para insulina (geralmente graduadas em UI). A concentração mais comum é U-100 (100 UI/mL).',
            fields: [
                {label: 'Dose prescrita (UI):', originalId: 'ce_ins_doseUI', type: 'number', placeholder: 'Ex: 10'},
                {label: 'Concentração da insulina (UI/mL):', originalId: 'ce_ins_concUI', type: 'number', value: '100', placeholder: 'Ex: 100'}
            ],
            resultLabel: 'Volume a aspirar:', resultUnit: 'mL',
            calculationFunc: function(inputs) {
                const doseUI = inputs.ce_ins_doseUI;
                const concUI = inputs.ce_ins_concUI;
                if (concUI === 0) throw new Error("A concentração da insulina não pode ser zero.");
                return (doseUI / concUI).toFixed(2);
            }
        },
        {
            id: 'eletrolitosVol', name: '13. Eletrólitos - Volume a Administrar',
            description: 'Calcula o volume de uma solução concentrada de eletrólito (ex: NaCl 20%, KCl 10%) a ser adicionado a uma solução de infusão para atingir a quantidade prescrita em miliequivalentes (mEq).',
            formula: 'Volume (mL) = Quantidade Prescrita (mEq) / Concentração da Ampola (mEq/mL)',
            notes: 'É crucial conhecer a concentração exata em mEq/mL da apresentação do eletrólito que está sendo utilizada, pois varia entre diferentes eletrólitos e concentrações de ampolas.',
            fields: [
                {label: 'Quantidade prescrita (mEq):', originalId: 'ce_ele_quantMEQ', type: 'number', placeholder: 'Ex: 20'},
                {label: 'Concentração da ampola (mEq/mL):', originalId: 'ce_ele_concMEQ', type: 'number', placeholder: 'Ex: 3.42 (NaCl 20%)'}
            ],
            resultLabel: 'Volume a adicionar:', resultUnit: 'mL',
            calculationFunc: function(inputs) {
                const quantMEQ = inputs.ce_ele_quantMEQ;
                const concMEQ = inputs.ce_ele_concMEQ;
                if (concMEQ === 0) throw new Error("A concentração da ampola não pode ser zero.");
                return (quantMEQ / concMEQ).toFixed(2);
            }
        },
        {
            id: 'balancoHidrico', name: '14. Balanço Hídrico Total',
            description: 'Soma todos os líquidos administrados (ganhos) e todos os eliminados (perdas) em um período (geralmente 24h) para determinar o balanço hídrico do paciente.',
            formula: 'Balanço Hídrico (mL) = Total de Ganhos (mL) - Total de Perdas (mL)',
            notes: 'Um balanço positivo indica retenção de líquidos, enquanto um negativo indica perda. Importante para monitoramento em diversas condições clínicas.',
            fields: [
                {label: 'Entradas - Oral (mL):', originalId: 'bh_ent_oral', type: 'number', value: '0'},
                {label: 'Entradas - Sonda (mL):', originalId: 'bh_ent_sonda', type: 'number', value: '0'},
                {label: 'Entradas - IV (mL):', originalId: 'bh_ent_iv', type: 'number', value: '0'},
                {label: 'Entradas - Outras (mL):', originalId: 'bh_ent_outros', type: 'number', value: '0'},
                {label: 'Saídas - Urina (mL):', originalId: 'bh_sai_urina', type: 'number', value: '0'},
                {label: 'Saídas - Vômito/SNG (mL):', originalId: 'bh_sai_vomito', type: 'number', value: '0'},
                {label: 'Saídas - Dreno(s) (mL):', originalId: 'bh_sai_dreno', type: 'number', value: '0'},
                {label: 'Saídas - Fezes/Outras (mL):', originalId: 'bh_sai_outros', type: 'number', value: '0'}
            ],
            resultLabel: 'Balanço Hídrico (24h):',
            calculationFunc: function(inputs) {
                const totalEntradas = (inputs.bh_ent_oral || 0) + (inputs.bh_ent_sonda || 0) + (inputs.bh_ent_iv || 0) + (inputs.bh_ent_outros || 0);
                const totalSaidas = (inputs.bh_sai_urina || 0) + (inputs.bh_sai_vomito || 0) + (inputs.bh_sai_dreno || 0) + (inputs.bh_sai_outros || 0);
                const balanco = totalEntradas - totalSaidas;
                return `Total Entradas: <span class="value">${totalEntradas.toFixed(2)} mL</span><br>
                        Total Saídas: <span class="value">${totalSaidas.toFixed(2)} mL</span><br>
                        <strong>Balanço: <span class="value">${balanco.toFixed(2)} mL</span></strong>`;
            }
        }
        // Adicione mais calculadoras aqui, se necessário
    ];

    const menu = document.getElementById('calculator-menu');
    const calculatorDisplayArea = document.getElementById('calculator-display-area');
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('openSidebarBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const contentArea = document.querySelector('.content-area');

    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Preencher o menu lateral
    calculatorsData.forEach(calc => {
        const link = document.createElement('a');
        link.href = `#${calc.id}`;
        link.textContent = calc.name;
        link.dataset.calcId = calc.id;
        menu.appendChild(link);

        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = calc.id;
        });
    });
    
    function getUniqueFieldId(calculatorId, fieldOriginalId) {
        // Usa o originalId diretamente pois os campos agora são específicos da calculadora renderizada
        return fieldOriginalId ? `${calculatorId}_${fieldOriginalId}` : `${calculatorId}_field${Math.random().toString(36).substr(2, 5)}`;
    }

    function renderCalculator(calculatorId) {
        calculatorDisplayArea.innerHTML = '';
        const welcomeMessage = document.querySelector('.welcome-message');
         if (welcomeMessage) welcomeMessage.style.display = 'none';


        if (!calculatorId) {
            if(welcomeMessage) welcomeMessage.style.display = 'block';
             menu.querySelectorAll('a').forEach(l => l.classList.remove('active-link'));
            return;
        }

        const calcData = calculatorsData.find(c => c.id === calculatorId);
        if (!calcData) {
            if(welcomeMessage) welcomeMessage.style.display = 'block';
            calculatorDisplayArea.innerHTML = '<div class="calculadora" style="text-align:center; color:red;"><p>Calculadora não encontrada ou ID inválido.</p></div>';
            return;
        }
        
        menu.querySelectorAll('a').forEach(l => l.classList.remove('active-link'));
        const activeMenuLink = menu.querySelector(`a[data-calc-id="${calculatorId}"]`);
        if (activeMenuLink) activeMenuLink.classList.add('active-link');

        const calcDiv = document.createElement('div');
        calcDiv.className = 'calculadora';

        let contentHTML = `<h3>${calcData.name}</h3>`;

        if (calcData.description) {
            contentHTML += `<p class="calculator-description">${calcData.description}</p>`;
        }
        if (calcData.formula) {
            contentHTML += `<div class="calculator-formula"><strong>Fórmula:</strong> <span class="formula-text">${calcData.formula}</span></div>`;
        }
        if (calcData.notes) { // Usando a classe calculator-notes para a tag small
            contentHTML += `<small class="calculator-notes">${calcData.notes}</small>`;
        }
        if (calcData.description || calcData.formula || calcData.notes) {
            contentHTML += `<hr class="separator">`;
        }

        calcData.fields.forEach(field => {
            const fieldId = getUniqueFieldId(calcData.id, field.originalId); // Gerar IDs únicos aqui
            contentHTML += `<label for="${fieldId}">${field.label}</label>`;
            if (field.type === 'select') {
                contentHTML += `<select id="${fieldId}">`;
                (field.options || []).forEach(opt => {
                    contentHTML += `<option value="${opt.value}" ${opt.selected ? 'selected' : ''}>${opt.text}</option>`;
                });
                contentHTML += `</select>`;
            } else {
                contentHTML += `<input type="${field.type}" id="${fieldId}" placeholder="${field.placeholder || ''}" value="${field.value || ''}">`;
            }
        });

        contentHTML += `
            <div class="button-group">
                <button class="calculate-btn">Calcular</button>
                <button class="clear-btn">Limpar</button>
            </div>
            <div class="resultado-area" style="display:none;"></div>
        `;
        calcDiv.innerHTML = contentHTML;
        calculatorDisplayArea.appendChild(calcDiv);

        calcDiv.querySelector('.calculate-btn').addEventListener('click', () => executeCalculation(calcData, calcDiv));
        calcDiv.querySelector('.clear-btn').addEventListener('click', () => clearCalculator(calcData, calcDiv));
        
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    }
    
    function getNumericValue(elementId, fieldLabel, allowZeroAsValidInput = false) {
        const inputElement = document.getElementById(elementId);
        if (!inputElement) {
            throw new Error(`Erro interno: Campo ${elementId} não encontrado para "${fieldLabel}".`);
        }
        const valueStr = inputElement.value.trim();

        if (valueStr === '') {
            // Se o campo tem valor padrão '0' e está vazio, considera 0.
            const defaultValueAttribute = inputElement.getAttribute('value');
            if (allowZeroAsValidInput && defaultValueAttribute === '0') {
                return 0;
            }
            throw new Error(`Por favor, preencha o campo: "${fieldLabel}"`);
        }
        
        const value = parseFloat(valueStr.replace(',', '.'));

        if (isNaN(value)) {
            throw new Error(`Valor inválido para "${fieldLabel}". Use apenas números.`);
        }
        
        // Permite negativo apenas para campos de temperatura
        if (value < 0 && !elementId.toLowerCase().includes('temp')) { 
             if (!(allowZeroAsValidInput && value === 0)) {
                throw new Error(`Valor negativo não permitido para: "${fieldLabel}".`);
             }
        }
        return value;
    }

    function executeCalculation(calcData, calcDiv) {
        const inputs = {};
        const resultadoDiv = calcDiv.querySelector('.resultado-area');
        try {
            calcData.fields.forEach(field => {
                const allowZero = field.value === '0'; // Se o valor inicial no JSON é '0', permite zero
                inputs[field.originalId] = getNumericValue(getUniqueFieldId(calcData.id, field.originalId), field.label, allowZero);
            });

            const resultValue = calcData.calculationFunc(inputs);
            let resultHTML = '';
            if (calcData.resultLabel) {
                resultHTML = `<strong>${calcData.resultLabel}</strong> <span class="value">${resultValue}${calcData.resultUnit ? ' ' + calcData.resultUnit : ''}</span>`;
            } else if (typeof resultValue === 'string' && (resultValue.includes('<span class="value">') || resultValue.includes('<strong>'))) {
                resultHTML = resultValue;
            } else {
                 resultHTML = `<span class="value">${resultValue}${calcData.resultUnit ? ' ' + calcData.resultUnit : ''}</span>`;
            }
            
            resultadoDiv.innerHTML = resultHTML;
            resultadoDiv.className = 'resultado-area success';
            resultadoDiv.style.display = 'block';
        } catch (error) {
            resultadoDiv.innerHTML = error.message;
            resultadoDiv.className = 'resultado-area error';
            resultadoDiv.style.display = 'block';
        }
    }

    function clearCalculator(calcData, calcDiv) {
        calcData.fields.forEach(field => {
            const inputElement = document.getElementById(getUniqueFieldId(calcData.id, field.originalId));
            inputElement.value = field.value || '';
        });
        const resultadoDiv = calcDiv.querySelector('.resultado-area');
        resultadoDiv.style.display = 'none';
        resultadoDiv.innerHTML = '';
        resultadoDiv.className = 'resultado-area';
    }

    openSidebarBtn.addEventListener('click', () => sidebar.classList.add('open'));
    closeSidebarBtn.addEventListener('click', () => sidebar.classList.remove('open'));

    document.addEventListener('click', (event) => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
            if (!sidebar.contains(event.target) && !openSidebarBtn.contains(event.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
    
    function handleHashChange() {
        const calculatorIdFromHash = window.location.hash.substring(1);
        renderCalculator(calculatorIdFromHash);
    }

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); 
    if (!window.location.hash && calculatorDisplayArea.innerHTML.trim() === '') {
         const welcomeMsgDiv = document.querySelector('.welcome-message');
         if (welcomeMsgDiv) welcomeMsgDiv.style.display = 'block';
    }
});