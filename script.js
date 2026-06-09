document.addEventListener("DOMContentLoaded", () => {

    // Inicialização unificada de Ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Scroll Suave Otimizado para Links do Topo e Hero Actions
    document.querySelectorAll('.nav-links a, .hero-actions a').forEach(link => {
        link.addEventListener('click', e => {
            const targetHash = link.hash;
            if (targetHash !== "") {
                e.preventDefault();
                smoothScrollTo(targetHash);
            }
        });
    });

    // Função Geral de Scroll Suave com Compensação do Header Fixo
    function smoothScrollTo(targetSelector) {
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            const headerOffset = 90; 
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // CONTROLE DINÂMICO DO MENU DE CONTATO FLUTUANTE
    const floatingMainBtn = document.getElementById('floating-main-btn');
    const floatingOptions = document.getElementById('floating-options');
    const triggerEmailScroll = document.getElementById('trigger-email-scroll');
    const contactBoxAnchor = document.getElementById('contact-box-anchor');
    const formNomeInput = document.getElementById('form-nome');
    
    const iconOpen = floatingMainBtn?.querySelector('.icon-open');
    const iconClose = floatingMainBtn?.querySelector('.icon-close');

    if (floatingMainBtn && floatingOptions) {
        // Evento para abrir ou fechar o card flutuante interativo
        floatingMainBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = floatingOptions.style.display === 'block';
            
            if (isOpen) {
                closeFloatingMenu();
            } else {
                openFloatingMenu();
            }
        });

        // Fecha a caixa flutuante se o usuário clicar em qualquer ponto fora dela
        document.addEventListener('click', (e) => {
            const container = document.getElementById('floating-menu-container');
            if (container && !container.contains(e.target)) {
                closeFloatingMenu();
            }
        });
    }

    function openFloatingMenu() {
        floatingOptions.style.display = 'block';
        if(iconOpen && iconClose) {
            iconOpen.style.display = 'none';
            iconClose.style.display = 'block';
        }
    }

    function closeFloatingMenu() {
        floatingOptions.style.display = 'none';
        if(iconOpen && iconClose) {
            iconOpen.style.display = 'block';
            iconClose.style.display = 'none';
        }
    }

    // Ação Inteligente do Botão de E-mail dentro do Menu Flutuante
    if (triggerEmailScroll) {
        triggerEmailScroll.addEventListener('click', () => {
            closeFloatingMenu(); 
            
            // Move suavemente a página até a seção do formulário de e-mail
            smoothScrollTo('#contato');
            
            // Dá um foco estético e foca o teclado direto no campo de texto "Nome"
            if (contactBoxAnchor) {
                contactBoxAnchor.classList.add('highlight-focus');
                setTimeout(() => {
                    contactBoxAnchor.classList.remove('highlight-focus');
                }, 1500);
            }
            if (formNomeInput) {
                setTimeout(() => {
                    formNomeInput.focus();
                }, 600);
            }
        });
    }

    // Menu Mobile Responsivo (Hambúrguer)
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    // Máscara Automatizada de Celular: (00) 00000-0000
    const phoneInput = document.querySelector('input[name="telefone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) value = '(' + value;
            if (value.length > 3) value = [value.slice(0, 3), ') ', value.slice(3)].join('');
            if (value.length > 10) value = [value.slice(0, 10), '-', value.slice(10)].join('');
            e.target.value = value.slice(0, 15);
        });
    }

    // Contador de Caracteres em Tempo Real (Mensagem do E-mail)
    const messageTextarea = document.querySelector('textarea[name="mensagem"]');
    const charCountLabel = document.getElementById('char-count');
    const maxChars = 4000;

    if (messageTextarea && charCountLabel) {
        messageTextarea.addEventListener('input', () => {
            const currentLength = messageTextarea.value.length;
            const remaining = maxChars - currentLength;
            charCountLabel.textContent = `Restam ${remaining} caracteres`;
            charCountLabel.style.color = remaining < 50 ? '#ef4444' : '#9ca3af';
        });
    }

    // Envio Assíncrono com Validação Própria via AJAX (Formspree)
    const contactForm = document.getElementById("my-form");
    const statusMsg = document.getElementById("status-message");
    const submitBtn = document.getElementById("submit-button");

    if (contactForm && statusMsg && submitBtn) {
        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            
            const originalButtonContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = "Processando Envio...";
            
            const formData = new FormData(event.target);

            try {
                const response = await fetch("https://formspree.io/f/mqeeeeqz", {
                    method: "POST",
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                statusMsg.style.display = "block";

                if (response.ok) {
                    statusMsg.innerHTML = "✅ Mensagem enviada com sucesso! Entraremos em contato em breve.";
                    statusMsg.style.color = "#10b981";
                    contactForm.reset();
                    if (charCountLabel) charCountLabel.textContent = `Restam ${maxChars} caracteres`;
                } else {
                    throw new Error();
                }
            } catch (error) {
                statusMsg.style.display = "block";
                statusMsg.innerHTML = "❌ Ocorreu um erro ao enviar. Por favor, tente novamente.";
                statusMsg.style.color = "#ef4444";
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalButtonContent;
            }
        });
    }
});