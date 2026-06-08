document.addEventListener("DOMContentLoaded", () => {

    // Inicialização de Ícones Lucide
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    // Controle de Escopo da Modal de Atendimento
    let unidadeSelecionada = '';
    const btnFlutuante = document.getElementById('btnContatoFlutuante');
    const modalContato = document.getElementById('modalContato');
    const etapa1 = document.getElementById('etapa1');
    const etapa2 = document.getElementById('etapa2');

    if (btnFlutuante && modalContato) {
        btnFlutuante.addEventListener('click', () => {
            modalContato.style.display = 'flex';
            etapa1.style.display = 'block';
            etapa2.style.display = 'none';
        });
    }

    // Funções atribuídas ao escopo global (window) para responder ao HTML original
    window.selecionarUnidade = function(unidade) {
        unidadeSelecionada = unidade;
        etapa1.style.display = 'none';
        etapa2.style.display = 'block';
    };

    window.abrirWhatsapp = function() {
        let numero = '';
        if (unidadeSelecionada === 'brusque') {
            numero = '5547999999999'; // Substitua pelo número real de Brusque
        } else if (unidadeSelecionada === 'itajai') {
            numero = '5547999999998'; // Substitua pelo número real de Itajaí
        }

        if (numero) {
            window.open('https://wa.me/' + numero, '_blank');
        }
    };

    window.abrirEmail = function() {
        // 1. Fecha a modal instantaneamente
        if (modalContato) {
            modalContato.style.display = 'none';
        }
        
        // 2. Localiza a área de contato e rola travando no início da seção
        const secaoContato = document.getElementById('contato');
        if (secaoContato) {
            secaoContato.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start' // Força o alinhamento correto no topo do elemento
            });
        }
    };

    // Fechar a modal ao clicar na área escura de fundo
    window.addEventListener('click', (event) => {
        if (event.target === modalContato) {
            modalContato.style.display = 'none';
        }
    });

});