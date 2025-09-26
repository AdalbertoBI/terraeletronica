// Board Som Interactive Page
class BoardSomPage {
    constructor() {
        // Frequências das 12 teclas do Board Som (C4 a B5)
        this.boardFrequencies = [
            261.63, 277.18, 293.66, 311.13, // C4, C#4, D4, D#4
            329.63, 349.23, 369.99, 392.00, // E4, F4, F#4, G4
            415.30, 440.00, 466.16, 493.88  // G#4, A4, A#4, B4
        ];
        
        // Notas musicais para visualização
        this.musicalNotes = ['♪', '♫', '♩', '♬', '♭', '♮', '♯', '𝄞'];
        
        this.audioContext = null;
        this.gainNode = null;
        this.isAudioEnabled = false;
        this.isSoundEnabled = true; // Controle do usuário para som
        this.currentNoteIndex = 0;
        this.isPlaying = false;
        
        this.init();
    }
    
    init() {
        this.setupAudioContext();
        this.setupSoundControl();
        this.setupProductImageInteraction();
        this.setupBoardSomDemo();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupSoundWaves();
        this.setupGlobalHoverSounds();
        this.initializeAnimations();
        this.addBoardSomDescription();
    }
    
    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        } catch (error) {
            console.warn('AudioContext não disponível:', error);
        }
    }
    
    enableAudio() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                this.isAudioEnabled = true;
                console.log('🎵 Áudio do Board Som ativado!');
            });
        } else if (this.audioContext) {
            this.isAudioEnabled = true;
        }
    }

    setupSoundControl() {
        const soundToggleBtn = document.getElementById('soundToggleBtn');
        const soundControlFloat = document.getElementById('soundControlFloat');
        
        if (!soundToggleBtn || !soundControlFloat) {
            console.log('Elementos de controle de som não encontrados');
            return;
        }

        // Configurar estado inicial
        this.updateSoundButton();

        // Event listener para o botão
        soundToggleBtn.addEventListener('click', () => {
            this.toggleSound();
        });

        // Mostrar o botão após um delay
        setTimeout(() => {
            soundControlFloat.style.opacity = '1';
            soundControlFloat.style.transform = 'translateY(0)';
        }, 1500);
    }

    toggleSound() {
        this.isSoundEnabled = !this.isSoundEnabled;
        this.updateSoundButton();
        
        // Feedback visual
        this.createSoundToggleFeedback();
        
        console.log(`🔊 Som ${this.isSoundEnabled ? 'ativado' : 'desativado'}`);
    }

    updateSoundButton() {
        const soundToggleBtn = document.getElementById('soundToggleBtn');
        if (!soundToggleBtn) return;

        const icon = soundToggleBtn.querySelector('i');
        
        if (this.isSoundEnabled) {
            soundToggleBtn.classList.remove('muted');
            soundToggleBtn.setAttribute('title', 'Desativar sons');
            soundToggleBtn.setAttribute('aria-label', 'Desativar reprodução de sons');
            icon.className = 'fas fa-volume-up';
        } else {
            soundToggleBtn.classList.add('muted');
            soundToggleBtn.setAttribute('title', 'Ativar sons');
            soundToggleBtn.setAttribute('aria-label', 'Ativar reprodução de sons');
            icon.className = 'fas fa-volume-mute';
        }
    }

    createSoundToggleFeedback() {
        const soundToggleBtn = document.getElementById('soundToggleBtn');
        if (!soundToggleBtn) return;

        // Criar efeito de ondas sonoras visuais
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const wave = document.createElement('div');
                wave.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 60px;
                    height: 60px;
                    border: 2px solid ${this.isSoundEnabled ? '#FF6B35' : '#9E9E9E'};
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    animation: soundWave 1s ease-out forwards;
                    pointer-events: none;
                    z-index: -1;
                `;

                soundToggleBtn.appendChild(wave);
                setTimeout(() => wave.remove(), 1000);
            }, i * 100);
        }

        // Criar notas musicais se som estiver ativado
        if (this.isSoundEnabled) {
            this.createMusicalNotes(soundToggleBtn);
        }
    }
    
    // Test audio functionality
    playTestNote() {
        this.enableAudio();
        if (this.isAudioEnabled) {
            this.playBoardNote(0);
        }
    }
    
    // Sound-triggered note creation
    createSoundTriggeredNote(noteIndex, element = null) {
        const note = document.createElement('div');
        note.className = 'musical-note sound-triggered';
        note.textContent = this.musicalNotes[noteIndex % this.musicalNotes.length];
        
        // Posicionar baseado no elemento ou posição aleatória
        let x, y;
        if (element) {
            const rect = element.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
        } else {
            x = Math.random() * window.innerWidth;
            y = window.innerHeight - 50;
        }
        
        // Cores específicas para cada nota - tons musicais
        const colors = ['#e74c3c', '#f39c12', '#e67e22', '#27ae60', '#2980b9', '#8e44ad', '#c0392b', '#d35400', '#16a085', '#2c3e50', '#8b4513', '#4682b4'];
        const color = colors[noteIndex % colors.length];
        
        note.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 2.5rem;
            font-weight: bold;
            color: ${color};
            text-shadow: 
                0 0 10px ${color},
                0 0 20px ${color},
                2px 2px 4px rgba(0, 0, 0, 0.5);
            filter: drop-shadow(0 0 8px ${color});
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%) scale(0) rotate(-15deg);
            opacity: 0;
            animation: boardNoteFloat 2.5s ease-out forwards;
        `;
        
        document.body.appendChild(note);
        
        setTimeout(() => {
            if (note.parentNode) {
                note.parentNode.removeChild(note);
            }
        }, 2500);
    }
    
    setupProductImageInteraction() {
        const productImage = document.querySelector('.product-image');
        const productImg = productImage?.querySelector('img');
        
        if (!productImage || !productImg) return;
        
        // Interface do Board Som removida - imagem emite escala musical normalmente
        // this.createBoardSomInterface(productImage);
        
        // Efeito hover na imagem principal
        productImage.addEventListener('mouseenter', () => {
            this.startMusicalScale();
        });
        
        productImage.addEventListener('mouseleave', () => {
            this.stopMusicalScale();
        });
        
        // Efeito de clique
        productImage.addEventListener('click', () => {
            this.playChord();
            this.createParticleEffect(productImage);
        });
    }
    
    createBoardSomInterface(container) {
        const boardContainer = document.createElement('div');
        boardContainer.className = 'board-som-container';
        
        // Criar 12 teclas do Board Som em formato 3x4
        for (let i = 0; i < 12; i++) {
            const key = document.createElement('div');
            key.className = 'board-key';
            key.dataset.keyIndex = i;
            key.dataset.frequency = this.boardFrequencies[i];
            
            // Adicionar ícone de nota
            const keyIcon = document.createElement('span');
            keyIcon.className = 'key-icon';
            keyIcon.textContent = '♪';
            key.appendChild(keyIcon);
            
            // Adicionar número da tecla
            const keyNumber = document.createElement('span');
            keyNumber.className = 'key-number';
            keyNumber.textContent = i + 1;
            key.appendChild(keyNumber);
            
            key.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playBoardNote(i, key);
                this.animateKey(key);
            });
            
            key.addEventListener('mouseenter', () => {
                this.previewBoardNote(i, key);
            });
            
            boardContainer.appendChild(key);
        }
        
        // Adicionar controles do Board Som
        const controlsPanel = document.createElement('div');
        controlsPanel.className = 'board-controls';
        controlsPanel.innerHTML = `
            <div class="control-item">
                <span class="control-icon">🔄</span>
                <span class="control-label">Botão Giratório Dual</span>
            </div>
            <div class="control-item">
                <span class="control-icon">🔛</span>
                <span class="control-label">Liga/Desliga</span>
            </div>
            <div class="control-item">
                <span class="control-icon">🔌</span>
                <span class="control-label">Entrada Carregador</span>
            </div>
        `;
        
        container.appendChild(boardContainer);
        container.appendChild(controlsPanel);
    }
    
    setupBoardSomDemo() {
        // Simular 12 teclas do Board Som
        const boardKeys = document.querySelectorAll('.highlight-item, .feature-card, .application-card');
        
        boardKeys.forEach((key, index) => {
            if (index < 12) {
                key.addEventListener('click', () => {
                    this.playBoardNote(index % this.boardFrequencies.length, key);
                    this.animateElement(key);
                });
            }
        });
    }
    
    playBoardNote(noteIndex, element = null) {
        // Sempre criar nota visual
        this.createSoundTriggeredNote(noteIndex, element);
        
        // Só reproduzir som se estiver habilitado
        if (!this.isSoundEnabled || !this.isAudioEnabled || !this.audioContext) {
            if (!this.isAudioEnabled) this.enableAudio();
            if (!this.isSoundEnabled) return;
        }
        
        const frequency = this.boardFrequencies[noteIndex % this.boardFrequencies.length];
        
        // Criar oscilador para o som da tecla
        const oscillator = this.audioContext.createOscillator();
        const noteGain = this.audioContext.createGain();
        
        oscillator.type = 'triangle'; // Som mais suave para o Board Som
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        // Envelope ADSR para teclas
        noteGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 0.01);
        noteGain.gain.exponentialRampToValueAtTime(0.2, this.audioContext.currentTime + 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
        
        oscillator.connect(noteGain);
        noteGain.connect(this.gainNode);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.8);
        
        // Criar nota visual
        this.createSoundTriggeredNote(noteIndex, element);
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observar elementos para animação
        document.querySelectorAll('.benefit-item, .spec-category, .application-card, .final-benefit')
               .forEach(el => observer.observe(el));
    }
    
    setupHoverEffects() {
        // Efeitos de hover para elementos interativos
        document.querySelectorAll('.benefit-item, .application-card, .spec-category').forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.createHoverEffect(item);
            });
        });
    }
    
    createHoverEffect(element) {
        // Criar efeito de partícula no hover
        const particle = document.createElement('div');
        particle.className = 'hover-particle';
        
        const rect = element.getBoundingClientRect();
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: 8px;
            height: 8px;
            background: radial-gradient(circle, #4A90E2, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: particleFloat 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
    
    setupSoundWaves() {
        // Criar ondas sonoras visuais
        const waveContainer = document.createElement('div');
        waveContainer.className = 'sound-waves';
        waveContainer.innerHTML = `
            <div class="wave wave-1"></div>
            <div class="wave wave-2"></div>
            <div class="wave wave-3"></div>
        `;
        
        // Adicionar ao hero
        const hero = document.querySelector('.product-hero');
        if (hero) {
            hero.appendChild(waveContainer);
        }
    }
    
    startMusicalScale() {
        if (!this.isSoundEnabled || this.isPlaying) return;
        
        this.isPlaying = true;
        this.currentNoteIndex = 0;
        
        const playNextNote = () => {
            if (!this.isPlaying) return;
            
            this.playBoardNote(this.currentNoteIndex);
            this.highlightNote(this.currentNoteIndex);
            
            this.currentNoteIndex++;
            
            if (this.currentNoteIndex < this.boardFrequencies.length) {
                setTimeout(playNextNote, 200);
            } else {
                // Repetir a escala descendente
                this.currentNoteIndex = this.boardFrequencies.length - 1;
                setTimeout(() => this.playDescendingScale(), 100);
            }
        };
        
        playNextNote();
    }
    
    playDescendingScale() {
        const playPrevNote = () => {
            if (!this.isPlaying) return;
            
            this.playBoardNote(this.currentNoteIndex);
            this.highlightNote(this.currentNoteIndex);
            
            this.currentNoteIndex--;
            
            if (this.currentNoteIndex >= 0) {
                setTimeout(playPrevNote, 200);
            } else {
                this.isPlaying = false;
            }
        };
        
        playPrevNote();
    }
    
    stopMusicalScale() {
        this.isPlaying = false;
        this.removeAllHighlights();
    }
    
    highlightNote(noteIndex) {
        // Destacar elemento correspondente à nota
        const highlights = document.querySelectorAll('.highlight-item');
        if (highlights[noteIndex % highlights.length]) {
            highlights[noteIndex % highlights.length].classList.add('note-highlight');
            setTimeout(() => {
                highlights[noteIndex % highlights.length].classList.remove('note-highlight');
            }, 300);
        }
        
        // Criar nota visual sincronizada (será criada pelo playBoardNote)
    }
    
    removeAllHighlights() {
        document.querySelectorAll('.note-highlight').forEach(el => {
            el.classList.remove('note-highlight');
        });
    }
    
    playChord() {
        if (!this.isAudioEnabled || !this.audioContext) return;
        
        // Tocar acorde com teclas do Board Som (C, E, G, C)
        const chordNotes = [0, 4, 7, 11]; // C, E, G, B
        const productImage = document.querySelector('.product-image');
        
        chordNotes.forEach((noteIndex, i) => {
            setTimeout(() => this.playBoardNote(noteIndex, productImage), i * 50);
        });
    }
    
    animateKey(key) {
        key.classList.add('active');
        key.style.transform = 'translateY(2px) scale(0.95)';
        
        setTimeout(() => {
            key.classList.remove('active');
            key.style.transform = '';
        }, 200);
    }
    
    animateElement(element) {
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            element.style.transform = '';
        }, 200);
    }
    
    createParticleEffect(container) {
        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                const rect = container.getBoundingClientRect();
                particle.style.cssText = `
                    position: fixed;
                    left: ${rect.left + rect.width / 2}px;
                    top: ${rect.top + rect.height / 2}px;
                    width: 6px;
                    height: 6px;
                    background: hsl(${Math.random() * 360}, 70%, 60%);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                `;
                
                const angle = (i / 12) * Math.PI * 2;
                const velocity = 100 + Math.random() * 100;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;
                
                let x = rect.left + rect.width / 2;
                let y = rect.top + rect.height / 2;
                let opacity = 1;
                
                const animate = () => {
                    x += vx * 0.02;
                    y += vy * 0.02;
                    opacity -= 0.02;
                    
                    particle.style.left = x + 'px';
                    particle.style.top = y + 'px';
                    particle.style.opacity = opacity;
                    
                    if (opacity > 0) {
                        requestAnimationFrame(animate);
                    } else {
                        particle.remove();
                    }
                };
                
                document.body.appendChild(particle);
                animate();
            }, i * 20);
        }
    }
    
    setupGlobalHoverSounds() {
        // Elementos que devem emitir sons no hover - adaptado para Board Som
        const soundSelectors = [
            '.btn',                    // Botões
            '.highlight-item',         // Destaques do produto
            '.benefit-item',          // Itens de benefícios
            '.spec-category',         // Categorias de especificação
            '.application-card',      // Cards de aplicação
            '.board-key',            // Teclas do Board Som
            '.product-image',        // Imagem do produto
            '.nav-link',             // Links de navegação
            '.final-benefit',        // Benefícios finais
            '.accessibility-btn',    // Botões de acessibilidade
            'h3',                    // Títulos
            '.cta-section',          // Seção CTA
            '.key-item'              // Itens de tecla (se existirem)
        ];
        
        // Configurar sons para cada tipo de elemento
        soundSelectors.forEach((selector, index) => {
            document.querySelectorAll(selector).forEach((element, elementIndex) => {
                element.addEventListener('mouseenter', () => {
                    // Garantir que o áudio está habilitado
                    if (!this.isAudioEnabled) {
                        this.enableAudio();
                    }
                    
                    if (this.isAudioEnabled) {
                        // Tocar nota baseada no tipo de elemento e posição
                        const noteIndex = (index + elementIndex) % this.boardFrequencies.length;
                        this.playHoverNote(noteIndex, selector, element);
                    }
                });
                
                // Adicionar feedback visual sutil
                element.addEventListener('mouseenter', () => {
                    if (this.isSoundEnabled) {
                        this.createHoverParticle(element);
                    }
                });
            });
        });
    }
    
    playHoverNote(noteIndex, elementType, element) {
        if (!this.isSoundEnabled || !this.isAudioEnabled || !this.audioContext) return;
        
        const frequency = this.boardFrequencies[noteIndex];
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        // Diferentes tipos de som para diferentes elementos
        if (elementType.includes('btn')) {
            oscillator.type = 'triangle';
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        } else if (elementType.includes('board-key')) {
            oscillator.type = 'square';
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        } else {
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        }
        
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
        
        // Criar nota visual sincronizada com o som
        this.createSoundTriggeredNote(noteIndex, element);
    }
    
    createHoverParticle(element) {
        const rect = element.getBoundingClientRect();
        const particle = document.createElement('div');
        
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
            width: 6px;
            height: 6px;
            background: rgba(74, 144, 226, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: particleHover 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 800);
    }
    
    initializeAnimations() {
        // Adicionar classes de animação após carregamento
        setTimeout(() => {
            document.querySelectorAll('.product-hero, .product-details').forEach(section => {
                section.classList.add('loaded');
            });
        }, 100);
    }
    
    addBoardSomDescription() {
        // Adicionar descrição específica do Board Som se necessário
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && !document.querySelector('.board-som-description')) {
            const description = document.createElement('p');
            description.className = 'board-som-description';
            description.textContent = 'Controlador MIDI inovador com 12 teclas grandes, giroscópio e design único em formato de quadro.';
            description.style.cssText = `
                margin-top: 1rem;
                font-size: 1.1rem;
                color: rgba(255, 255, 255, 0.9);
                font-weight: 300;
            `;
            
            const subtitle = heroContent.querySelector('.product-subtitle');
            if (subtitle) {
                subtitle.after(description);
            }
        }
    }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎹 Inicializando Board Som...');
    
    const boardSom = new BoardSomPage();
    window.boardSomInstance = boardSom;
    
    // Sistema de ativação automática do áudio
    let audioActivated = false;
    const audioActivationEvents = ['click', 'touchstart', 'keydown'];
    
    const tryActivateAudio = () => {
        const instance = window.boardSomInstance || boardSom;
        if (!audioActivated && instance) {
            instance.enableAudio();
            if (instance.isAudioEnabled) {
                audioActivated = true;
                console.log('🎵 Áudio ativado com sucesso!');
                
                // Remover listeners após ativação
                audioActivationEvents.forEach(event => {
                    document.removeEventListener(event, tryActivateAudio);
                });
            }
        }
    };
    
    // Adicionar listeners para múltiplos eventos
    audioActivationEvents.forEach(event => {
        document.addEventListener(event, tryActivateAudio, { once: true, passive: true });
    });
    
    // Tentar ativar imediatamente após um delay
    setTimeout(tryActivateAudio, 500);
    
    // Tentar ativar quando a página ficar visível
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && !audioActivated) {
            tryActivateAudio();
        }
    });
});

// Export para uso em outros módulos se necessário
window.BoardSomPage = BoardSomPage;
