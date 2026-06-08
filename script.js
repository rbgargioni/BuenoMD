document.addEventListener("DOMContentLoaded", () => {

// Inicialização de Ícones
lucide.createIcons();

// Gráfico de Crescimento //  
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
                borderColor: '#1a1a1a', // Linha preta minimalista
                borderWidth: 2,
                pointRadius: 6,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#22c55e', // Borda do ponto verde
                pointBorderWidth: 3,
                fill: false,
                tension: 0 // Linhas retas estilo "arquitetura"
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

// Função para aplicar a máscara de telefone
const handlePhone = (event) => {
    let input = event.target;
    input.value = phoneMask(input.value);
};

const phoneMask = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, ''); // Remove tudo que não é número
    value = value.replace(/(\d{2})(\d)/, "($1) $2"); // Coloca parênteses no DDD
    value = value.replace(/(\d{5})(\d)/, "$1-$2"); // Coloca o hífen no quinto dígito
    return value;
};

const telInput = document.querySelector('input[name="telefone"]');
if (telInput) {
    telInput.addEventListener('keyup', (e) => {
        e.target.value = phoneMask(e.target.value);
    });
}

const textarea = document.querySelector('textarea[name="mensagem"]');
const count = document.getElementById('char-count');

if (textarea && count) {
    textarea.addEventListener('input', () => {
        const remaining = 8000 - textarea.value.length;
        count.textContent = `Restam ${remaining} caracteres`;
        count.style.color = remaining < 100 ? '#ff4444' : '#666';
    });
}

// Envio AJAX Formspree (Sem recarregar a página)
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

});
