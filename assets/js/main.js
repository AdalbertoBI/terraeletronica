// Terra Eletrônica - JavaScript Moderno

// Inicialização quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Função principal de inicialização
function initializeApp() {
    initNavigation();
    initScrollEffects();
    initAnimations();
    initForms();
    initSmoothScrolling();
    initAccessibility();
    initLegalNoticePopup();
    
    // Garantir que os carrosséis funcionem após carregamento
    setTimeout(() => {
        ensureCarouselsWork();
    }, 100);
}

// ===== GARANTIR FUNCIONAMENTO DOS CARROSSÉIS =====
function ensureCarouselsWork() {
    // Re-inicializar eventos de touch se necessário
    const carouselTracks = document.querySelectorAll('.carousel-track, .videos-carousel .carousel-track');
    
    carouselTracks.forEach(track => {
        // Garantir que o elemento é interativo
        track.style.pointerEvents = 'auto';
        track.style.touchAction = 'pan-x pan-y';
        
        // Garantir que elementos filhos são clicáveis
        const interactiveElements = track.querySelectorAll('.video-item, .carousel-item, .play-overlay');
        interactiveElements.forEach(el => {
            el.style.pointerEvents = 'auto';
            el.style.cursor = 'pointer';
        });
    });
    
    // Garantir que botões de navegação funcionem
    const carouselButtons = document.querySelectorAll('.carousel-btn');
    carouselButtons.forEach(btn => {
        btn.style.pointerEvents = 'auto';
        btn.style.touchAction = 'manipulation';
    });
}

// ===== NAVEGAÇÃO RESPONSIVA =====
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu-mobile');
    const header = document.querySelector('.header');
    
    // Menu mobile toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navMenu.classList.contains('active');
            
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Prevenir scroll do body quando menu está aberto
            if (!isActive) {
                document.body.style.overflow = 'hidden';
                document.body.classList.add('menu-open');
            } else {
                document.body.style.overflow = '';
                document.body.classList.remove('menu-open');
            }
            
            // Animação do hamburguer melhorada
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (!isActive) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = '';
                    span.style.opacity = '';
                }
            });
            
            // Acessibilidade - aria-expanded
            navToggle.setAttribute('aria-expanded', !isActive);
        });
    }
    
    // Fechar menu ao clicar em link (mobile)
    const navLinksMobile = document.querySelectorAll('.nav-link-mobile');
    navLinksMobile.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && navMenu?.classList.contains('active')) {
                closeMenu();
            }
        });
    });
    
    // Fechar menu ao clicar fora (mobile)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!e.target.closest('.navbar') && navMenu?.classList.contains('active')) {
                closeMenu();
            }
        }
    });
    
    // Fechar menu com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Função para fechar menu
    function closeMenu() {
        navMenu?.classList.remove('active');
        navToggle?.classList.remove('active');
        document.body.style.overflow = '';
        document.body.classList.remove('menu-open');
        
        // Reset hamburguer animation
        const spans = navToggle?.querySelectorAll('span');
        spans?.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
        });
        
        navToggle?.setAttribute('aria-expanded', 'false');
    }
    
    // Responsividade no redimensionamento
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768 && navMenu?.classList.contains('active')) {
                closeMenu();
            }
            
            // Ajustar viewport height para mobile
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        }, 100);
    });
    
    // Configurar viewport height inicial
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}

// ===== EFEITOS DE SCROLL =====
function initScrollEffects() {
    const header = document.querySelector('.header');
    
    // Header com efeito ao scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });
    
    // Parallax no hero (performático)
    const hero = document.querySelector('.hero');
    const heroImg = document.querySelector('.hero-img');
    
    if (hero && heroImg) {
        let ticking = false;
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    const scrolled = window.pageYOffset;
                    const rate = scrolled * -0.3;
                    
                    if (scrolled < window.innerHeight) {
                        heroImg.style.transform = `translateY(${rate}px)`;
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
}

// ===== ANIMAÇÕES =====
function initAnimations() {
    // Inicializar AOS se disponível com configurações otimizadas
    if (typeof AOS !== 'undefined') {
        const isMobile = window.innerWidth <= 768;
        AOS.init({
            duration: isMobile ? 300 : 800,
            offset: isMobile ? 30 : 100,
            once: true,
            easing: 'ease-out-cubic',
            disable: function() {
                // Desabilita em dispositivos muito lentos ou pequenos
                return window.innerWidth <= 480 || window.devicePixelRatio < 1.5;
            },
            throttleDelay: isMobile ? 200 : 99,
            debounceDelay: isMobile ? 100 : 50
        });
    }
    
    // Observer para animações customizadas
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.produto-card, .stat, .info-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Counter animation para stats
    const stats = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// Animação de contador
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const counter = setInterval(function() {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(counter);
        }
        
        const suffix = element.textContent.includes('+') ? '+' : 
                      element.textContent.includes('%') ? '%' : '';
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// ===== FORMULÁRIOS =====
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
        
        // Validação em tempo real
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    });
}

// Manipular envio de formulário
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const isValid = validateForm(form);
    
    if (!isValid) {
        showNotification('Por favor, corrija os campos com erro.', 'error');
        return;
    }
    
    // Simular envio (substituir pela integração real)
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    // Simular delay de envio
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.reset();
        showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
    }, 2000);
}

// Validar formulário
function validateForm(form) {
    const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validar campo individual
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remover erro anterior
    field.classList.remove('error');
    removeFieldError(field);
    
    // Validar campo obrigatório
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório.';
    }
    
    // Validar email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Digite um e-mail válido.';
        }
    }
    
    // Validar telefone
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\(\)\s\-\+\d]{8,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Digite um telefone válido.';
        }
    }
    
    if (!isValid) {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Mostrar erro no campo
function showFieldError(field, message) {
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

// Remover erro do campo
function removeFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// ===== SCROLL SUAVE =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ACESSIBILIDADE =====
function initAccessibility() {
    // Navegação por teclado nos dropdowns
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.nav-link');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (trigger && menu) {
            trigger.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    menu.classList.toggle('show');
                }
                
                if (e.key === 'Escape') {
                    menu.classList.remove('show');
                    trigger.focus();
                }
            });
        }
    });
    
    // Skip links para navegação por teclado
    createSkipLinks();
    
    // Detectar usuário navegando por teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Criar skip links para acessibilidade
function createSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
        <a href="#main-content" class="skip-link">Pular para o conteúdo principal</a>
        <a href="#produtos" class="skip-link">Pular para produtos</a>
        <a href="#contato" class="skip-link">Pular para contato</a>
    `;
    
    document.body.insertBefore(skipLinks, document.body.firstChild);
}

// ===== NOTIFICAÇÕES =====
function showNotification(message, type = 'info') {
    // Remover notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" aria-label="Fechar notificação">&times;</button>
        </div>
    `;
    
    // Adicionar estilos inline para funcionamento imediato
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 20px',
        borderRadius: '8px',
        color: 'white',
        zIndex: '10000',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-out',
        backgroundColor: type === 'success' ? '#28a745' : 
                        type === 'error' ? '#dc3545' : 
                        type === 'warning' ? '#ffc107' : '#17a2b8'
    });
    
    document.body.appendChild(notification);
    
    // Animar entrada
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Botão de fechar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto fechar após 5 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            closeNotification(notification);
        }
    }, 5000);
}

// Fechar notificação
function closeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 300);
}

// ===== UTILITÁRIOS =====
// Debounce para otimizar eventos de scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle para eventos de scroll
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Detectar se é dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Lazy loading para imagens (se não usar nativo)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Gerenciamento de estado simples
const AppState = {
    isMenuOpen: false,
    currentSection: 'home',
    
    setMenuState(isOpen) {
        this.isMenuOpen = isOpen;
    },
    
    setCurrentSection(section) {
        this.currentSection = section;
        this.updateNavigation();
    },
    
    updateNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${this.currentSection}`) {
                link.classList.add('active');
            }
        });
    }
};

// Observer para detectar seção atual
function initSectionObserver() {
    const sections = document.querySelectorAll('section[id]');
    
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                AppState.setCurrentSection(entry.target.id);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-100px 0px -100px 0px'
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Inicializar observer de seções
document.addEventListener('DOMContentLoaded', () => {
    initSectionObserver();
});

// ===== PERFORMANCE =====
// Preload de páginas importantes - TEMPORARIAMENTE DESABILITADO
function preloadImportantPages() {
    console.log('Preload de páginas desabilitado para evitar erros 404');
    return;
    
    // TODO: Reativar quando todas as páginas estiverem criadas
    /*
    const importantPages = [
        'produtos/instrumentos-midi.html',
        'produtos/sensory-musical.html',
        'produtos/tecnologia-assistiva.html',
        'produtos/biblia-eletronica.html',
        'produtos/lupa-bolinha.html'
    ];
    
    importantPages.forEach(page => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
    });
    */
}

// Inicializar preload após load
window.addEventListener('load', () => {
    setTimeout(preloadImportantPages, 2000);
});

// ===== SERVICE WORKER (PWA) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        try {
            const swUrl = new URL('sw.js', window.location.href);
            navigator.serviceWorker.register(swUrl.pathname)
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        } catch (error) {
            console.log('SW registration failed: ', error);
        }
    });
}

// ===== WHATSAPP CONTACT =====
function enviarWhatsApp() {
    // Obter valores dos campos
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const assunto = document.getElementById('assunto').value;
    const mensagem = document.getElementById('mensagem').value.trim();
    
    // Construir mensagem do WhatsApp
    let textoWhatsApp = 'Olá! Estou entrando em contato através do site da Terra Eletrônica.';
    
    // Adicionar informações preenchidas
    if (nome) {
        textoWhatsApp += `\n\n👤 *Nome:* ${nome}`;
    }
    
    if (email) {
        textoWhatsApp += `\n📧 *E-mail:* ${email}`;
    }
    
    if (telefone) {
        textoWhatsApp += `\n📱 *Telefone:* ${telefone}`;
    }
    
    if (assunto) {
        const assuntos = {
            'duvidas': 'Dúvidas sobre Produtos',
            'orcamento': 'Solicitar Orçamento',
            'suporte': 'Suporte Técnico',
            'outros': 'Outros'
        };
        textoWhatsApp += `\n📋 *Assunto:* ${assuntos[assunto] || assunto}`;
    }
    
    if (mensagem) {
        textoWhatsApp += `\n\n💬 *Mensagem:*\n${mensagem}`;
    }
    
    // Codificar a mensagem para URL
    const mensagemCodificada = encodeURIComponent(textoWhatsApp);
    
    // Número do WhatsApp (formato internacional sem + e espaços)
    const numeroWhatsApp = '5512991653176';
    
    // Criar URL do WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    
    // Abrir WhatsApp em nova aba
    window.open(urlWhatsApp, '_blank');
    
    // Opcional: Limpar formulário após envio
    // document.getElementById('contatoForm').reset();
}

// ===== ACCESSIBILITY WIDGET =====
function initAccessibilityWidget() {
    const toggle = document.getElementById('accessibilityToggle');
    const panel = document.getElementById('accessibilityPanel');
    const closeBtn = document.getElementById('accessibilityClose');
    
    // Controles
    const increaseFontBtn = document.getElementById('increaseFontBtn');
    const decreaseFontBtn = document.getElementById('decreaseFontBtn');
    const highContrastBtn = document.getElementById('highContrastBtn');
    const darkModeBtn = document.getElementById('darkModeBtn');
    const readAloudBtn = document.getElementById('readAloudBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Estado das configurações
    let fontSizeLevel = 0; // 0 = normal, 1 = large, 2 = larger
    let isHighContrast = false;
    let isDarkMode = false;
    let isReadAloudActive = false;
    let speechSynthesis = window.speechSynthesis;
    
    // Toggle do painel
    toggle?.addEventListener('click', () => {
        const isActive = panel.classList.contains('active');
        panel.classList.toggle('active');
        panel.setAttribute('aria-hidden', isActive);
        
        if (!isActive) {
            // Focar no primeiro botão quando abrir
            increaseFontBtn?.focus();
        }
    });
    
    // Fechar painel
    closeBtn?.addEventListener('click', () => {
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
        toggle.focus();
    });
    
    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('active')) {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
            toggle.focus();
        }
    });
    
    // Aumentar fonte
    increaseFontBtn?.addEventListener('click', () => {
        document.body.classList.remove('large-font', 'larger-font');
        fontSizeLevel = Math.min(fontSizeLevel + 1, 2);
        
        if (fontSizeLevel === 1) {
            document.body.classList.add('large-font');
        } else if (fontSizeLevel === 2) {
            document.body.classList.add('larger-font');
        }
        
        localStorage.setItem('fontSizeLevel', fontSizeLevel);
        updateButtonStates();
    });
    
    // Diminuir fonte
    decreaseFontBtn?.addEventListener('click', () => {
        document.body.classList.remove('large-font', 'larger-font');
        fontSizeLevel = Math.max(fontSizeLevel - 1, 0);
        
        if (fontSizeLevel === 1) {
            document.body.classList.add('large-font');
        } else if (fontSizeLevel === 2) {
            document.body.classList.add('larger-font');
        }
        
        localStorage.setItem('fontSizeLevel', fontSizeLevel);
        updateButtonStates();
    });
    
    // Alto contraste
    highContrastBtn?.addEventListener('click', () => {
        isHighContrast = !isHighContrast;
        document.body.classList.toggle('high-contrast', isHighContrast);
        localStorage.setItem('highContrast', isHighContrast);
        updateButtonStates();
    });
    
    // Modo escuro
    darkModeBtn?.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('dark-mode', isDarkMode);
        localStorage.setItem('darkMode', isDarkMode);
        updateButtonStates();
    });
    
    // Leitura em voz alta
    readAloudBtn?.addEventListener('click', () => {
        if (!speechSynthesis) {
            alert('Leitura em voz alta não é suportada neste navegador.');
            return;
        }
        
        isReadAloudActive = !isReadAloudActive;
        
        if (isReadAloudActive) {
            enableReadAloud();
        } else {
            disableReadAloud();
        }
        
        updateButtonStates();
    });
    
    // Resetar configurações
    resetBtn?.addEventListener('click', () => {
        // Reset all settings
        fontSizeLevel = 0;
        isHighContrast = false;
        isDarkMode = false;
        isReadAloudActive = false;
        
        // Remove classes
        document.body.classList.remove('large-font', 'larger-font', 'high-contrast', 'dark-mode');
        
        // Clear localStorage
        localStorage.removeItem('fontSizeLevel');
        localStorage.removeItem('highContrast');
        localStorage.removeItem('darkMode');
        
        // Stop speech
        speechSynthesis.cancel();
        disableReadAloud();
        
        updateButtonStates();
    });
    
    // Atualizar estados dos botões
    function updateButtonStates() {
        // Font size buttons
        increaseFontBtn?.classList.toggle('active', fontSizeLevel > 0);
        decreaseFontBtn?.classList.toggle('active', fontSizeLevel > 0);
        
        // Other buttons
        highContrastBtn?.classList.toggle('active', isHighContrast);
        darkModeBtn?.classList.toggle('active', isDarkMode);
        readAloudBtn?.classList.toggle('active', isReadAloudActive);
    }
    
    // Habilitar leitura em voz alta
    function enableReadAloud() {
        document.addEventListener('click', readElementOnClick);
        document.addEventListener('keydown', readElementOnEnter);
    }
    
    // Desabilitar leitura em voz alta
    function disableReadAloud() {
        document.removeEventListener('click', readElementOnClick);
        document.removeEventListener('keydown', readElementOnEnter);
        speechSynthesis.cancel();
    }
    
    // Ler elemento ao clicar
    function readElementOnClick(e) {
        const text = getTextFromElement(e.target);
        if (text) {
            speakText(text);
        }
    }
    
    // Ler elemento ao pressionar Enter
    function readElementOnEnter(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            const text = getTextFromElement(e.target);
            if (text) {
                speakText(text);
            }
        }
    }
    
    // Extrair texto do elemento
    function getTextFromElement(element) {
        if (!element) return '';
        
        // Para botões e links, usar aria-label ou title primeiro
        if (element.getAttribute('aria-label')) {
            return element.getAttribute('aria-label');
        }
        
        if (element.title) {
            return element.title;
        }
        
        // Para outros elementos, usar textContent
        let text = element.textContent?.trim();
        
        // Limitar o tamanho do texto
        if (text && text.length > 200) {
            text = text.substring(0, 200) + '...';
        }
        
        return text || '';
    }
    
    // Falar texto
    function speakText(text) {
        if (!text || !speechSynthesis) return;
        
        // Cancelar fala anterior
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        
        speechSynthesis.speak(utterance);
    }
    
    // Carregar configurações salvas
    function loadSavedSettings() {
        // Font size
        const savedFontSize = localStorage.getItem('fontSizeLevel');
        if (savedFontSize) {
            fontSizeLevel = parseInt(savedFontSize);
            if (fontSizeLevel === 1) {
                document.body.classList.add('large-font');
            } else if (fontSizeLevel === 2) {
                document.body.classList.add('larger-font');
            }
        }
        
        // High contrast
        const savedHighContrast = localStorage.getItem('highContrast');
        if (savedHighContrast === 'true') {
            isHighContrast = true;
            document.body.classList.add('high-contrast');
        }
        
        // Dark mode
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            isDarkMode = true;
            document.body.classList.add('dark-mode');
        }
        
        updateButtonStates();
    }
    
    // Inicializar configurações salvas
    loadSavedSettings();
}

// Inicializar widget de acessibilidade
document.addEventListener('DOMContentLoaded', function() {
    initAccessibilityWidget();
});

// ===== CARROSSEL DE VÍDEOS =====
function initVideoCarousel() {
    console.log('Buscando carrossel de vídeos...');
    const carousel = document.getElementById('videosCarousel');
    if (!carousel) {
        console.log('Carrossel não encontrado com ID videosCarousel');
        return;
    }
    
    console.log('Carrossel encontrado, inicializando...');
    // Marcar como inicializado para evitar duplicação
    window.videoCarouselInitialized = true;

    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    const videoCards = document.querySelectorAll('.video-card');
    const modal = document.getElementById('videoModal');
    const modalPlayer = document.getElementById('modalVideoPlayer');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = document.getElementById('modalBackdrop');

    let currentSlide = 0;
    let cardsPerView = getCardsPerView();
    // Total de slides individuais (cada vídeo é um slide)
    const totalSlides = videoCards.length;

    // Verificar se todos os elementos necessários foram encontrados
    if (!track || !prevBtn || !nextBtn || indicators.length === 0 || videoCards.length === 0) {
        console.error('Elementos do carrossel não encontrados:', {
            track: !!track,
            prevBtn: !!prevBtn, 
            nextBtn: !!nextBtn,
            indicators: indicators.length,
            videoCards: videoCards.length
        });
        return;
    }
    
    console.log('Carrossel inicializado com', totalSlides, 'vídeos e', indicators.length, 'indicadores');

    // Calcular quantos cards mostrar por vez (sempre 1 para navegação individual)
    function getCardsPerView() {
        // Sempre retorna 1 para navegação individual de vídeos
        return 1;
    }

    // Atualizar posição do carrossel
    function updateCarousel() {
        const cardWidth = getCardWidth();
        const offset = currentSlide * cardWidth;
        track.style.transform = `translateX(-${offset}px)`;

        // Atualizar indicadores com ARIA attributes
        if (indicators && indicators.length > 0) {
            // Remover active de todos primeiro
            indicators.forEach(indicator => {
                indicator.classList.remove('active');
                indicator.setAttribute('aria-selected', 'false');
                indicator.setAttribute('tabindex', '-1');
                // Resetar estilos inline
                indicator.style.backgroundColor = '';
                indicator.style.transform = '';
            });
            
            // Adicionar active ao atual
            const activeIndicator = indicators[currentSlide];
            if (activeIndicator) {
                activeIndicator.classList.add('active');
                activeIndicator.setAttribute('aria-selected', 'true');
                activeIndicator.setAttribute('tabindex', '0');
                // Forçar estilo para garantir visibilidade
                activeIndicator.style.backgroundColor = '#2c5aa0';
                activeIndicator.style.transform = 'scale(1.2)';
            }
        }

        // Atualizar estado dos botões com acessibilidade
        // Garantir que currentSlide esteja dentro dos limites válidos
        currentSlide = Math.max(0, Math.min(currentSlide, totalSlides - 1));
        
        const isPrevDisabled = currentSlide <= 0;
        const isNextDisabled = currentSlide >= totalSlides - 1;
        
        if (prevBtn) {
            prevBtn.style.opacity = isPrevDisabled ? '0.5' : '1';
            prevBtn.disabled = isPrevDisabled;
            prevBtn.setAttribute('aria-disabled', isPrevDisabled.toString());
        }
        
        if (nextBtn) {
            nextBtn.style.opacity = isNextDisabled ? '0.5' : '1';
            nextBtn.disabled = isNextDisabled;
            nextBtn.setAttribute('aria-disabled', isNextDisabled.toString());
        }
        
        console.log(`Carrossel: vídeo ${currentSlide + 1}/${totalSlides} - Próximo: ${isNextDisabled ? 'bloqueado' : 'disponível'}`);
    }

    // Calcular largura do card baseada no viewport
    function getCardWidth() {
        const card = videoCards[0]; // Usar o primeiro card como referência
        if (card) {
            const cardRect = card.getBoundingClientRect();
            const cardStyle = window.getComputedStyle(card);
            const marginRight = parseFloat(cardStyle.marginRight) || 0;
            return cardRect.width + marginRight + 24; // width + gap
        }
        // Fallback caso não consiga medir
        const width = window.innerWidth;
        if (width < 480) return 284;
        if (width < 768) return 304;
        return 344;
    }

    // Navegação anterior
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }

    // Navegação próxima
    function nextSlide() {
        const maxIndex = totalSlides - 1;
        console.log(`nextSlide: atual=${currentSlide}, máx=${maxIndex}, total=${totalSlides}`);
        
        if (currentSlide < maxIndex) {
            currentSlide++;
            updateCarousel();
            console.log(`✓ Avançou para vídeo ${currentSlide + 1}`);
        } else {
            console.log(`✘ Não pode avançar - já está no último vídeo`);
        }
    }

    // Ir para slide específico
    function goToSlide(slideIndex) {
        // Garantir que o índice esteja dentro dos limites válidos
        const newIndex = Math.max(0, Math.min(slideIndex, totalSlides - 1));
        if (newIndex !== currentSlide) {
            currentSlide = newIndex;
            updateCarousel();
            console.log(`Navegou diretamente para vídeo ${currentSlide + 1}`);
        }
    }

    // Abrir modal de vídeo
    function openVideoModal(videoId) {
        console.log('openVideoModal chamada com videoId:', videoId);
        let embedUrl;
        const videoContainer = modalPlayer.parentElement;
        const modalContent = modal.querySelector('.modal-content');
        
        // Verificar se é um link do Instagram
        if (videoId.startsWith('https://www.instagram.com/') || videoId.startsWith('https://instagram.com/')) {
            // Converter URL do Instagram para embed com parâmetros para ocultar controles
            const instagramUrl = videoId.split('?')[0]; // Remove parâmetros UTM
            embedUrl = `${instagramUrl}embed/?cr=1&v=1&wp=658&rd=https%3A%2F%2Fwww.example.com&rp=%2Fp%2F`;
            videoContainer.classList.add('instagram');
            modalContent.classList.add('instagram');
        } else {
            // Para YouTube
            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            videoContainer.classList.remove('instagram');
            modalContent.classList.remove('instagram');
        }
        
        modalPlayer.src = embedUrl;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Para Instagram, aplicar visualização limpa após carregamento
        if (videoId.startsWith('https://www.instagram.com/') || videoId.startsWith('https://instagram.com/')) {
            modalPlayer.addEventListener('load', function() {
                setTimeout(() => {
                    videoContainer.classList.add('clean-view');
                }, 1000); // Aguardar 1 segundo para o Instagram carregar
            }, { once: true });
        }
        
        // Encontrar o card correspondente para anunciar o título
        const clickedCard = document.querySelector(`[data-video-id="${videoId}"]`);
        const videoTitle = clickedCard ? clickedCard.querySelector('h3').textContent : 'Vídeo demonstrativo';
        
        // Anunciar o vídeo para leitores de tela
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `Reproduzindo vídeo: ${videoTitle}`;
        document.body.appendChild(announcement);
        
        // Remover o anúncio após 3 segundos
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 3000);
        
        // Focar no botão de fechar para acessibilidade
        setTimeout(() => modalClose.focus(), 100);
    }

    // Fechar modal de vídeo
    function closeVideoModal() {
        const videoContainer = modalPlayer.parentElement;
        const modalContent = modal.querySelector('.modal-content');
        
        modalPlayer.src = '';
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Limpar classes específicas de plataforma
        videoContainer.classList.remove('instagram', 'clean-view');
        modalContent.classList.remove('instagram');
    }

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    // Indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    // Adicionar indicadores de plataforma
    function addPlatformIndicators() {
        videoCards.forEach(card => {
            const videoId = card.getAttribute('data-video-id');
            const thumbnail = card.querySelector('.video-thumbnail');
            
            // Remover indicador existente se houver
            const existingIndicator = thumbnail.querySelector('.platform-indicator');
            if (existingIndicator) {
                existingIndicator.remove();
            }
            
            // Criar novo indicador
            const indicator = document.createElement('div');
            indicator.className = 'platform-indicator';
            
            if (videoId.startsWith('https://www.instagram.com/') || videoId.startsWith('https://instagram.com/')) {
                indicator.classList.add('instagram');
                indicator.textContent = 'Instagram';
            } else {
                indicator.classList.add('youtube');
                indicator.textContent = 'YouTube';
            }
            
            thumbnail.appendChild(indicator);
        });
    }

    // Cards de vídeo
    console.log('Configurando event listeners para', videoCards.length, 'cards de vídeo');
    videoCards.forEach((card, index) => {
        console.log(`Card ${index}:`, card.getAttribute('data-video-id'));
        
        card.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            console.log('Click no card, videoId:', videoId);
            if (videoId) {
                openVideoModal(videoId);
            }
        });

        // Acessibilidade: Enter/Space para ativar
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const videoId = this.getAttribute('data-video-id');
                console.log('Keydown no card, videoId:', videoId);
                if (videoId) {
                    openVideoModal(videoId);
                }
            }
        });
    });

    // Fechar modal
    if (modalClose) {
        modalClose.addEventListener('click', closeVideoModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeVideoModal);
    }

    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    // Navegação com teclado
    carousel.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    });

    // Arraste unificado com Pointer Events (desktop + mobile)
    let pointerDown = false;
    let pointerId = null;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerDeltaX = 0;
    let isHorizontalDrag = false;

    const ensurePointerCapture = () => {
        if (pointerId === null || typeof track.setPointerCapture !== 'function') {
            return;
        }

        if (typeof track.hasPointerCapture !== 'function' || !track.hasPointerCapture(pointerId)) {
            track.setPointerCapture(pointerId);
        }
    };

    const releasePointer = () => {
        if (pointerId !== null && typeof track.releasePointerCapture === 'function') {
            if (typeof track.hasPointerCapture !== 'function' || track.hasPointerCapture(pointerId)) {
                track.releasePointerCapture(pointerId);
            }
        }
        track.classList.remove('dragging');
        track.style.transition = '';
        pointerDown = false;
        pointerId = null;
    pointerDeltaX = 0;
    isHorizontalDrag = false;
    };

    const endDrag = () => {
        const cardWidth = getCardWidth();
        const dynamicThreshold = Math.min(80, cardWidth * 0.25);

        if (Math.abs(pointerDeltaX) > dynamicThreshold) {
            if (pointerDeltaX < 0 && currentSlide < totalSlides - 1) {
                nextSlide();
            } else if (pointerDeltaX > 0 && currentSlide > 0) {
                prevSlide();
            } else {
                updateCarousel();
            }
        } else {
            updateCarousel();
        }

        releasePointer();
    };

    track.addEventListener('pointerdown', function(e) {
        if (e.pointerType === 'mouse' && e.button !== 0) {
            return;
        }

        pointerDown = true;
        pointerId = e.pointerId;
        pointerStartX = e.clientX;
        pointerStartY = e.clientY;
        pointerDeltaX = 0;
        isHorizontalDrag = false;
        track.style.transition = '';
    });

    track.addEventListener('pointermove', function(e) {
        if (!pointerDown || e.pointerId !== pointerId) {
            return;
        }

        const diffX = e.clientX - pointerStartX;
        const diffY = Math.abs(e.clientY - pointerStartY);

        if (!isHorizontalDrag) {
            if (diffY > Math.abs(diffX)) {
                // Permitir rolagem vertical natural
                releasePointer();
                updateCarousel();
                return;
            }

            if (Math.abs(diffX) > 6) {
                isHorizontalDrag = true;
                ensurePointerCapture();
                track.classList.add('dragging');
                track.style.transition = 'none';
            } else {
                return;
            }
        }

        pointerDeltaX = diffX;
        const cardWidth = getCardWidth();
        const baseOffset = -currentSlide * cardWidth;
        const overscroll = Math.min(cardWidth * 0.25, 120);
        const minTranslate = -(totalSlides - 1) * cardWidth - overscroll;
        const maxTranslate = overscroll;
        const proposedOffset = baseOffset + diffX;
        const clampedOffset = Math.max(Math.min(proposedOffset, maxTranslate), minTranslate);

        e.preventDefault();
        track.style.transform = `translateX(${clampedOffset}px)`;
    });

    const pointerUpHandler = function(e) {
        if (!pointerDown || (e.type !== 'lostpointercapture' && e.pointerId !== pointerId)) {
            return;
        }

        endDrag();
    };

    track.addEventListener('pointerup', pointerUpHandler);
    track.addEventListener('pointercancel', pointerUpHandler);
    track.addEventListener('lostpointercapture', pointerUpHandler);

    // Responsividade
    function handleResize() {
        const newCardsPerView = getCardsPerView();
        if (newCardsPerView !== cardsPerView) {
            cardsPerView = newCardsPerView;
            // Garantir que o slide atual não ultrapasse os limites
            currentSlide = Math.min(currentSlide, totalSlides - 1);
            updateCarousel();
        }
    }

    window.addEventListener('resize', debounce(handleResize, 250));

    // Adicionar indicadores de plataforma
    addPlatformIndicators();
    
    // Inicializar carrossel
    console.log('Inicializando carrossel - currentSlide:', currentSlide);
    updateCarousel();
    
    // Aguardar DOM estabilizar antes da inicialização final
    setTimeout(() => {
        updateCarousel();
        console.log('Carrossel finalizado - currentSlide:', currentSlide);
    }, 200);
    
}

// ===== AVISO LEGAL (PRIMEIRO ACESSO) =====
function initLegalNoticePopup() {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
    }

    if (window.__terraLegalNoticeInitialized) {
        return;
    }

    window.__terraLegalNoticeInitialized = true;

    const STORAGE_KEY = 'terraLegalNoticeAccepted';
    const CACHE_NAME = 'terra-eletronica-legal-cache';
    const CACHE_URL = '__terra-eletronica-legal-consent__';
    let noticeVisible = false;
    const bodyScrollState = {
        locked: false,
        previousOverflow: '',
        previousPaddingRight: ''
    };

    checkConsentStatus()
        .then(shouldShow => {
            if (!shouldShow || noticeVisible) {
                return;
            }

            noticeVisible = true;
            ensureLegalNoticeStyles();

            if (supportsNativeDialog()) {
                renderDialogNotice();
            } else {
                renderOverlayNotice();
            }
        })
        .catch(error => {
            reportConsentError('Falha ao verificar o status do consentimento.', error);
        });

    function supportsNativeDialog() {
        return typeof HTMLDialogElement === 'function';
    }

    function ensureLegalNoticeStyles() {
        if (document.getElementById('legal-notice-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'legal-notice-styles';
        style.textContent = `dialog.legal-notice-dialog::backdrop { background: rgba(0, 0, 0, 0.55); }
dialog.legal-notice-dialog { border: none; border-radius: 16px; padding: 2rem 1.75rem; max-width: min(480px, calc(100vw - 2.5rem)); box-shadow: 0 18px 48px rgba(0, 0, 0, 0.22); font-family: 'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.55; color: #1f2d3d; background: #ffffff; }
.legal-notice-overlay { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.55); display: flex; align-items: center; justify-content: center; padding: 1.5rem; z-index: 9999; }
.legal-notice-card { background: #ffffff; border-radius: 16px; padding: 2rem 1.75rem; max-width: min(480px, calc(100vw - 2.5rem)); box-shadow: 0 18px 48px rgba(0, 0, 0, 0.22); font-family: 'Inter', 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.55; color: #1f2d3d; }
.legal-notice-wrapper { display: flex; flex-direction: column; gap: 1rem; }
.legal-notice-wrapper h2 { margin: 0; font-size: 1.35rem; color: #009688; }
.legal-notice-text { margin: 0; font-size: 0.95rem; }
.legal-notice-text--muted { color: #546e7a; font-size: 0.88rem; }
.legal-notice-actions { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.5rem; }
.legal-notice-btn { background: #009688; color: #ffffff; border: none; border-radius: 999px; padding: 0.75rem 1.6rem; font-weight: 600; cursor: pointer; transition: background 0.2s ease, transform 0.2s ease; text-align: center; }
.legal-notice-btn:hover, .legal-notice-btn:focus-visible { background: #00796b; transform: translateY(-1px); outline: none; }
.legal-notice-link { color: #009688; font-weight: 500; text-decoration: underline; text-underline-offset: 0.25rem; cursor: pointer; }
.legal-notice-link:focus-visible { outline: 2px solid #80cbc4; outline-offset: 2px; }
@media (min-width: 520px) { .legal-notice-actions { flex-direction: row; justify-content: flex-end; align-items: center; } .legal-notice-actions .legal-notice-link { margin-right: auto; } }
`; // eslint-disable-line no-multi-str

        document.head.appendChild(style);
    }

    function renderDialogNotice() {
        const dialog = document.createElement('dialog');
        dialog.className = 'legal-notice-dialog';

        const titleId = generateUniqueId('legalNoticeTitle');
        const descriptionId = generateUniqueId('legalNoticeDescription');

        dialog.setAttribute('aria-labelledby', titleId);
        dialog.setAttribute('aria-describedby', descriptionId);

        const { container, primaryAction } = buildNoticeContent(titleId, descriptionId);
        dialog.appendChild(container);

        dialog.addEventListener('cancel', event => {
            event.preventDefault();
        });

        document.body.appendChild(dialog);

        const closeNotice = () => {
            try {
                dialog.close();
            } catch (error) {
                reportConsentError('Falha ao fechar o diálogo de consentimento.', error);
            }
            dialog.remove();
            unlockBodyScroll();
            noticeVisible = false;
        };

        bindAcceptanceAction(primaryAction, closeNotice);

        lockBodyScroll();

        requestAnimationFrame(() => {
            dialog.showModal();
            primaryAction.focus({ preventScroll: true });
        });
    }

    function renderOverlayNotice() {
        const overlay = document.createElement('div');
        overlay.className = 'legal-notice-overlay';

        const card = document.createElement('div');
        card.className = 'legal-notice-card';
        overlay.appendChild(card);

        const titleId = generateUniqueId('legalNoticeTitle');
        const descriptionId = generateUniqueId('legalNoticeDescription');

        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', titleId);
        overlay.setAttribute('aria-describedby', descriptionId);

        const { container, primaryAction } = buildNoticeContent(titleId, descriptionId);
        card.appendChild(container);

        overlay.addEventListener('click', event => {
            if (event.target === overlay) {
                event.stopPropagation();
            }
        });

        document.body.appendChild(overlay);

        const focusableElements = Array.from(card.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])'));
        overlay.addEventListener('keydown', event => {
            if (event.key !== 'Tab') {
                return;
            }

            if (!focusableElements.length) {
                event.preventDefault();
                return;
            }

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
                return;
            }

            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        });

        const closeNotice = () => {
            overlay.remove();
            unlockBodyScroll();
            noticeVisible = false;
        };

        bindAcceptanceAction(primaryAction, closeNotice);

        lockBodyScroll();

        requestAnimationFrame(() => {
            primaryAction.focus({ preventScroll: true });
        });
    }

    function buildNoticeContent(titleId, descriptionId) {
        const container = document.createElement('div');
        container.className = 'legal-notice-wrapper';

        const heading = document.createElement('h2');
        heading.id = titleId;
        heading.textContent = 'Aviso de Privacidade e Cookies';
        container.appendChild(heading);

        const description = document.createElement('p');
        description.id = descriptionId;
        description.className = 'legal-notice-text';
        description.textContent = 'Utilizamos cookies essenciais e tecnologias semelhantes para garantir o funcionamento seguro e acessível do site. Ao prosseguir, você concorda com essa utilização e com o tratamento dos dados fornecidos conforme o Marco Civil da Internet (Lei nº 12.965/2014) e a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).';
        container.appendChild(description);

        const actions = document.createElement('div');
        actions.className = 'legal-notice-actions';

        const infoLink = document.createElement('a');
        infoLink.href = '#contato';
        infoLink.className = 'legal-notice-link';
        infoLink.textContent = 'Ver canais de atendimento';
        infoLink.setAttribute('data-legal-more-info', 'true');
        actions.appendChild(infoLink);

        const confirmButton = document.createElement('button');
        confirmButton.type = 'button';
        confirmButton.className = 'legal-notice-btn';
        confirmButton.dataset.legalAccept = 'true';
        confirmButton.setAttribute('aria-describedby', descriptionId);
        confirmButton.textContent = 'Entendi e continuar';
        actions.appendChild(confirmButton);

        container.appendChild(actions);

        return { container, primaryAction: confirmButton };
    }

    function generateUniqueId(base) {
        let id = base;
        let suffix = 1;

        while (document.getElementById(id)) {
            id = `${base}-${suffix}`;
            suffix += 1;
        }

        return id;
    }

    function lockBodyScroll() {
        if (bodyScrollState.locked) {
            return;
        }

        bodyScrollState.previousOverflow = document.body.style.overflow || '';
        bodyScrollState.previousPaddingRight = document.body.style.paddingRight || '';

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }

        document.body.style.overflow = 'hidden';
        bodyScrollState.locked = true;
    }

    function unlockBodyScroll() {
        if (!bodyScrollState.locked) {
            return;
        }

        document.body.style.overflow = bodyScrollState.previousOverflow;
        document.body.style.paddingRight = bodyScrollState.previousPaddingRight;
        bodyScrollState.locked = false;
    }

    function reportConsentError(context, error) {
        if (typeof console !== 'undefined' && typeof console.warn === 'function') {
            console.warn(`[Aviso Legal] ${context}`, error);
        }
    }

    function bindAcceptanceAction(primaryAction, closeFn) {
        if (!primaryAction) {
            return;
        }

        primaryAction.addEventListener('click', () => {
            primaryAction.disabled = true;
            primaryAction.setAttribute('aria-busy', 'true');

            persistConsent()
                .catch(error => {
                    reportConsentError('Erro ao persistir o consentimento.', error);
                    return null;
                })
                .then(closeFn);
        });
    }

    async function persistConsent() {
        const timestamp = new Date().toISOString();
        let stored = false;

        try {
            window.localStorage.setItem(STORAGE_KEY, timestamp);
            stored = true;
        } catch (error) {
            reportConsentError('Não foi possível salvar o consentimento no localStorage.', error);
        }

        if (!stored) {
            try {
                window.sessionStorage.setItem(STORAGE_KEY, timestamp);
            } catch (error) {
                reportConsentError('Não foi possível salvar o consentimento no sessionStorage.', error);
            }
        }

        if ('caches' in window) {
            try {
                const cache = await caches.open(CACHE_NAME);
                const request = new Request(CACHE_URL);
                const response = new Response(timestamp, {
                    headers: {
                        'Content-Type': 'text/plain',
                        'Cache-Control': 'no-store'
                    }
                });
                await cache.put(request, response);
            } catch (error) {
                reportConsentError('Não foi possível armazenar o consentimento no Cache Storage.', error);
            }
        }
    }

    function getStoredConsent() {
        try {
            if (window.localStorage.getItem(STORAGE_KEY) || window.sessionStorage.getItem(STORAGE_KEY)) {
                return true;
            }
        } catch (error) {
            reportConsentError('Falha ao ler o consentimento nos storages disponíveis.', error);
        }
        return false;
    }

    async function hasCacheConsent() {
        if (!('caches' in window)) {
            return false;
        }

        try {
            const cache = await caches.open(CACHE_NAME);
            const match = await cache.match(CACHE_URL);
            return Boolean(match);
        } catch (error) {
            reportConsentError('Falha ao consultar o consentimento no Cache Storage.', error);
            return false;
        }
    }

    async function checkConsentStatus() {
        if (getStoredConsent()) {
            return false;
        }

        if (await hasCacheConsent()) {
            return false;
        }

        return true;
    }
}

