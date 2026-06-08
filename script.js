document.addEventListener("DOMContentLoaded", () => {

    // Inicialização de Ícones
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    // Gráfico de Crescimento (Mantido caso precise usar no futuro)
    const chartEl = document.getElementById('growthChart');
    if (chartEl && typeof Chart !== "undefined") {
        const ctx = chartEl.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(58, 131, 60, 0.25)');
        gradient.addColorStop(1, 'rgba(58, 131, 60, 0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2015', '2018', '2021', '2024', '2025'],
                datasets: [{
                    label: 'Performance',
                    data: [5, 15, 12, 35, 48],
                    borderColor: '#1a1a1a',
                    borderWidth: 2,
                    pointRadius: 6,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#22c55e',
                    pointBorderWidth: 3,
                    fill: false,
                    tension: 0
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { 
                        grid: { display: false },
                        ticks: { color: '#999', font: { size: 10 } }
                    },
                    y: { display: false }
                }
            }
        });
    }

    // Scroll Suave
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', e => {
            if (link.hash !== "") {
                e.preventDefault();
                const target = document.querySelector(link.hash);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Máscara de telefone
    const phoneMask = (value) => {
        if (!value) return "";
        value = value.replace(/\D/g, ''); 
        value = value.replace(/(\d{2})(\d)/, "($1) $2"); 
        value = value.replace(/(\d{5})(\d)/, "$1-$2"); 
        return value;
    };

    const telInput = document.querySelector('input[name="telefone"]');
    if (telInput) {
        telInput.addEventListener('keyup', (e) => {
            e.target.value = phoneMask(e.target.value);
        });
    }

    // Contador de caracteres do formulário
    const textarea = document.querySelector('textarea[name="mensagem"]');
    const count = document.getElementById('char-count');

    if (textarea && count) {
        textarea.addEventListener('input', () => {
            const remaining = 8000 - textarea.value.length;
            count.textContent = `Restam ${remaining} caracteres`;
            count.style.color = remaining < 100 ? '#ff4444' : '#666';
        });
    }

    // Envio AJAX Formspree
    const contactForm = document.getElementById("my-form");
    const statusMsg = document.getElementById("status-message");
    const submitBtn = document.getElementById("submit-button");

    if (contactForm) {
        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const data = new FormData(event.target);
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = "Enviando...";

            fetch("https://formspree.io/f/mqeeeeqz", {
                method: "POST",
                body: data,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                statusMsg.style.display = "block";
                if (response.ok) {
                    statusMsg.innerHTML = "✅ Mensagem enviada com sucesso!";
                    statusMsg.style.color = "#22c55e";
                    contactForm.reset();
                    if (count) count.textContent = "Restam 8000 caracteres";
                    submitBtn.style.display = "none";
                } else {
                    statusMsg.innerHTML = "❌ Erro ao enviar. Tente novamente.";
                    statusMsg.style.color = "#ff4444";
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Enviar mensagem';
                }
            })
            .catch(() => {
                statusMsg.style.display = "block";
                statusMsg.innerHTML = "❌ Erro de conexão.";
                statusMsg.style.color = "#ff4444";
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Enviar mensagem';
            });
        });
    }

    // --- LÓGICA DA MODAL DE ATENDIMENTO ---
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

    // Funções globais mapeadas para as ações dos botões
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
        if (modalContato) {
            modalContato.style.display = 'none';
        }
        const seçãoContato = document.getElementById('contato');
        if (seçãoContato) {
            seçãoContato.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Fechar ao clicar fora da modal
    window.addEventListener('click', (event) => {
        if (event.target === modalContato) {
            modalContato.style.display = 'none';
        }
    });

});

// Função exemplo mantida separada e correta no escopo global
function mostrarModalSucesso() {
    const modalSucesso = document.createElement("div");
    modalSucesso.id = "modalSucesso";
    modalSucesso.className = "modal-sucesso";
    modalSucesso.innerHTML = `
        <div class="modal-sucesso-conteudo">
            <div class="modal-sucesso-emoji">✅</div>
            <div class="modal-sucesso-texto">Sucesso!</div>
            <div class="modal-sucesso-subtexto">Sua solicitação foi processada. ✨</div>
        </div>
    `;
    document.body.appendChild(modalSucesso);

    setTimeout(() => {
        if (modalSucesso.parentNode) modalSucesso.remove();
    }, 3000);
}