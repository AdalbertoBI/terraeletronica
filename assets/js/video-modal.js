// Módulo independente para modal de vídeos
(function() {
    'use strict';
    
    let modal, modalPlayer, modalClose, modalBackdrop;
    
    function initVideoModal() {
        console.log('Inicializando modal de vídeo...');
        
        // Encontrar elementos
        modal = document.getElementById('videoModal');
        modalPlayer = document.getElementById('modalVideoPlayer');
        modalClose = document.getElementById('modalClose');
        modalBackdrop = document.getElementById('modalBackdrop');
        
        if (!modal || !modalPlayer) {
            console.error('Elementos do modal não encontrados');
            return false;
        }
        
        console.log('Modal encontrado e inicializado');
        
        // Configurar event listeners para fechar modal
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
        
        return true;
    }
    
    function openVideoModal(videoId) {
        console.log('Abrindo modal para:', videoId);
        
        if (!modal || !modalPlayer) {
            console.error('Modal não inicializado');
            return;
        }
        
        let embedUrl;
        const videoContainer = modalPlayer.parentElement;
        const modalContent = modal.querySelector('.modal-content');
        
        // Limpar classes anteriores
        videoContainer?.classList.remove('instagram');
        modalContent?.classList.remove('instagram');
        
        // Verificar se é um link do Instagram
        if (videoId.startsWith('https://www.instagram.com/') || videoId.startsWith('https://instagram.com/')) {
            const instagramUrl = videoId.split('?')[0];
            embedUrl = `${instagramUrl}embed/?cr=1&v=1&wp=658`;
            videoContainer?.classList.add('instagram');
            modalContent?.classList.add('instagram');
            console.log('Instagram URL:', embedUrl);
        } else {
            // Para YouTube
            embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
            console.log('YouTube URL:', embedUrl);
        }
        
        // Definir src e abrir modal
        modalPlayer.src = embedUrl;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focar no botão de fechar
        setTimeout(() => {
            modalClose?.focus();
        }, 100);
        
        console.log('Modal ativado');
    }
    
    function closeVideoModal() {
        console.log('Fechando modal');
        
        if (!modal || !modalPlayer) return;
        
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        modalPlayer.src = '';
        document.body.style.overflow = '';
        
        console.log('Modal fechado');
    }
    
    function setupVideoCards() {
        const videoCards = document.querySelectorAll('.video-card');
        console.log('Configurando', videoCards.length, 'cards de vídeo');
        
        videoCards.forEach((card, index) => {
            const videoId = card.getAttribute('data-video-id');
            console.log(`Card ${index}: ${videoId}`);
            
            // Remover event listeners antigos se existirem
            card.removeEventListener('click', handleCardClick);
            card.removeEventListener('keydown', handleCardKeydown);
            
            // Adicionar novos event listeners
            card.addEventListener('click', handleCardClick);
            card.addEventListener('keydown', handleCardKeydown);
        });
    }
    
    function handleCardClick(e) {
        e.preventDefault();
        const videoId = this.getAttribute('data-video-id');
        console.log('Click no card:', videoId);
        if (videoId) {
            openVideoModal(videoId);
        }
    }
    
    function handleCardKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const videoId = this.getAttribute('data-video-id');
            console.log('Keydown no card:', videoId);
            if (videoId) {
                openVideoModal(videoId);
            }
        }
    }
    
    // Inicializar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    function initialize() {
        console.log('Inicializando sistema de vídeo modal...');
        
        // Tentar inicializar várias vezes se necessário
        function tryInit() {
            if (initVideoModal()) {
                setupVideoCards();
                console.log('Sistema de vídeo modal inicializado com sucesso!');
            } else {
                console.log('Tentando novamente em 500ms...');
                setTimeout(tryInit, 500);
            }
        }
        
        tryInit();
    }
    
    // Expor funções globalmente se necessário
    window.openVideoModal = openVideoModal;
    window.closeVideoModal = closeVideoModal;
    
})();