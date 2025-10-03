/**
 * Downloads Page JavaScript
 * Funcionalidades específicas para a página de downloads
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar funcionalidades da página
    initDownloadTracking();
    initDownloadAnimations();
    initAccessibility();
});

/**
 * Rastrear downloads e adicionar analytics
 */
function initDownloadTracking() {
    const downloadLinks = document.querySelectorAll('.download-btn');
    
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const fileName = this.getAttribute('href').split('/').pop();
            const softwareName = this.textContent.trim().replace('Baixar ', '');
            
            // Log do download para analytics (se disponível)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'download', {
                    'event_category': 'Software',
                    'event_label': softwareName,
                    'value': fileName
                });
            }
            
            // Mostrar feedback visual
            showDownloadFeedback(this, softwareName);
            
            // Analytics alternativo ou log local
            console.log(`Download iniciado: ${softwareName} (${fileName})`);
        });
    });
}

/**
 * Mostrar feedback visual quando o download é iniciado
 */
function showDownloadFeedback(button, softwareName) {
    const originalText = button.innerHTML;
    const originalClass = button.className;
    
    // Mudar o visual do botão temporariamente
    button.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Iniciando download...';
    button.classList.add('downloading');
    button.style.pointerEvents = 'none';
    
    // Restaurar após alguns segundos
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Download iniciado!';
        button.classList.remove('downloading');
        button.classList.add('download-success');
        
        // Restaurar completamente após mais tempo
        setTimeout(() => {
            button.innerHTML = originalText;
            button.className = originalClass;
            button.style.pointerEvents = 'auto';
        }, 3000);
    }, 1500);
    
    // Mostrar notificação toast (se quiser implementar)
    showToast(`Download do ${softwareName} iniciado!`, 'success');
}

/**
 * Animações e efeitos visuais
 */
function initDownloadAnimations() {
    // Animação de entrada para os cards
    const cards = document.querySelectorAll('.download-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        cardObserver.observe(card);
    });
    
    // Efeito hover nos ícones
    const downloadIcons = document.querySelectorAll('.download-icon');
    downloadIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

/**
 * Melhorias de acessibilidade
 */
function initAccessibility() {
    // Adicionar suporte a teclado para os cards
    const cards = document.querySelectorAll('.download-card');
    
    cards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const downloadBtn = this.querySelector('.download-btn');
                if (downloadBtn) {
                    e.preventDefault();
                    downloadBtn.click();
                }
            }
        });
    });
    
    // Melhorar anúncios para leitores de tela
    const downloadBtns = document.querySelectorAll('.download-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('focus', function() {
            const card = this.closest('.download-card');
            const title = card.querySelector('.download-title').textContent;
            const description = card.querySelector('.download-description').textContent;
            
            this.setAttribute('aria-describedby', 'download-description-' + title.replace(/\s+/g, '-').toLowerCase());
        });
    });
}

/**
 * Sistema de notificações toast simples
 */
function showToast(message, type = 'info') {
    // Remover toasts existentes
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Criar novo toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${getToastIcon(type)}" aria-hidden="true"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close" aria-label="Fechar notificação">&times;</button>
    `;
    
    // Estilos inline para o toast (para não depender de CSS externo)
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        zIndex: '9999',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '400px',
        animation: 'slideInRight 0.3s ease'
    });
    
    // Adicionar ao DOM
    document.body.appendChild(toast);
    
    // Botão de fechar
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));
    
    // Auto-remover após 5 segundos
    setTimeout(() => removeToast(toast), 5000);
}

function getToastIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function removeToast(toast) {
    if (toast && toast.parentElement) {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }
}

/**
 * Adicionar animações CSS dinamicamente
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .download-btn.downloading {
        background: linear-gradient(135deg, #607D8B, #455A64) !important;
        cursor: not-allowed;
    }
    
    .download-btn.download-success {
        background: linear-gradient(135deg, #4CAF50, #388E3C) !important;
    }
    
    .download-icon {
        transition: transform 0.3s ease;
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .toast-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .toast-close:hover {
        opacity: 0.7;
    }
`;

document.head.appendChild(style);

/**
 * Verificar se os arquivos existem antes de permitir download
 */
async function checkFileExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

/**
 * Validar links de download na inicialização
 */
async function validateDownloadLinks() {
    const downloadLinks = document.querySelectorAll('.download-btn');
    
    for (let link of downloadLinks) {
        const href = link.getAttribute('href');
        const exists = await checkFileExists(href);
        
        if (!exists) {
            link.style.opacity = '0.6';
            link.style.cursor = 'not-allowed';
            link.title = 'Arquivo temporariamente indisponível';
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showToast('Arquivo temporariamente indisponível. Tente novamente mais tarde.', 'error');
            });
        }
    }
}

// Validar links quando a página carregar
document.addEventListener('DOMContentLoaded', validateDownloadLinks);