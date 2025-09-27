// JS específico da página Instrumentos NET-MIDI-T.A.

document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando página de instrumentos MIDI...');
    
    // Marcar que o carrossel será inicializado por esta página
    window.videoCarouselInitialized = true;
    
    // Inicializar recursos específicos da página
    initInstrumentCardsInteraction();
});

function initInstrumentosPage() {
    // Função mantida para compatibilidade
    initInstrumentCardsInteraction();
}

// Função removida - agora usando video-modal.js

function initInstrumentCardsInteraction() {
    // Adicionar interação especial aos cards de instrumentos
    const instrumentCards = document.querySelectorAll('.video-card');
    
    instrumentCards.forEach(card => {
        // Melhorar feedback visual ao hover/focus
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}
