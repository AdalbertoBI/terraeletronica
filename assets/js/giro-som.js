// Giro Som 09 Interactive Page
class GiroSomPage {
    constructor() {
        // Frequências das 9 teclas do Giro Som (escala pentatônica + extras)
        this.giroFrequencies = [
            261.63, 293.66, 329.63, 392.00, 440.00, // C, D, E, G, A (pentatônica)
            523.25, 587.33, 659.25, 783.99          // C5, D5, E5, G5 (oitava superior)
        ];
        
        // Notas musicais para visualização - tema girassol
        this.musicalNotes = ['🌻', '♪', '♫', '♩', '♬', '🎵', '🎶', '☀️', '🌼'];
        
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
        this.setupGiroSomDemo();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupSoundWaves();
        this.setupGlobalHoverSounds();
        this.initializeAnimations();
        this.addGiroSomDescription();
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
                console.log('🌻 Áudio do Giro Som ativado!');
            });
        } else if (this.audioContext) {
            this.isAudioEnabled = true;
        }
    }

    setupSoundControl() {
        // Escutar evento global de toggle de som
        document.addEventListener('soundToggle', (event) => {
            this.isSoundEnabled = !this.isSoundEnabled;
            console.log(`🌻 Giro Som - Som ${this.isSoundEnabled ? 'ativado' : 'desativado'}`);
            
            // Criar feedback visual
            if (this.isSoundEnabled) {
                this.createSoundTriggeredNote(0);
            }
        });
    }
    
    // Test audio functionality
    playTestNote() {
        this.enableAudio();
        if (this.isAudioEnabled) {
            this.playGiroNote(0);
        }
    }
    
    // Sound-triggered note creation with sunflower theme
    createSoundTriggeredNote(noteIndex, element = null) {
        const note = document.createElement('div');
        note.className = 'musical-note sound-triggered giro-note';
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
        
        // Cores específicas para tema girassol - tons quentes
        const colors = ['#F39C12', '#E67E22', '#D68910', '#F1C40F', '#F39800', '#FF8C00', '#FFA500', '#FFD700', '#FFAB00'];
        const color = colors[noteIndex % colors.length];
        
        note.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 2.8rem;
            font-weight: bold;
            color: ${color};
            text-shadow: 
                0 0 15px ${color},
                0 0 25px ${color},
                2px 2px 4px rgba(0, 0, 0, 0.5);
            filter: drop-shadow(0 0 12px ${color});
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%) scale(0) rotate(-20deg);
            opacity: 0;
            animation: giroNoteFloat 3s ease-out forwards;
        `;
        
        document.body.appendChild(note);
        
        setTimeout(() => {
            if (note.parentNode) {
                note.parentNode.removeChild(note);
            }
        }, 3000);
    }
    
    setupProductImageInteraction() {
        const productImage = document.querySelector('.product-image');
        const productImg = productImage?.querySelector('img');
        
        if (!productImage || !productImg) return;
        
        // Interface do Giro Som removida - imagem emite escala musical normalmente
        // this.createGiroSomInterface(productImage);
        
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
    
    createGiroSomInterface(container) {
        const giroContainer = document.createElement('div');
        giroContainer.className = 'giro-som-container';
        
        // Criar 9 pétalas do girassol em formato circular
        for (let i = 0; i < 9; i++) {
            const petal = document.createElement('div');
            petal.className = 'giro-petal';
            petal.dataset.petalIndex = i;
            petal.dataset.frequency = this.giroFrequencies[i];
            
            // Calcular posição circular para cada pétala
            const angle = (i / 9) * 2 * Math.PI - Math.PI / 2; // Começar do topo
            const radius = 80;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            petal.style.transform = `translate(${x}px, ${y}px) rotate(${(i * 40)}deg)`;
            
            // Adicionar ícone de girassol
            const petalIcon = document.createElement('span');
            petalIcon.className = 'petal-icon';
            petalIcon.textContent = '🌻';
            petal.appendChild(petalIcon);
            
            // Adicionar número da pétala
            const petalNumber = document.createElement('span');
            petalNumber.className = 'petal-number';
            petalNumber.textContent = i + 1;
            petal.appendChild(petalNumber);
            
            petal.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playGiroNote(i, petal);
                this.animatePetal(petal);
            });
            
            petal.addEventListener('mouseenter', () => {
                this.previewGiroNote(i, petal);
            });
            
            giroContainer.appendChild(petal);
        }
        
        // Adicionar centro do girassol
        const center = document.createElement('div');
        center.className = 'giro-center';
        center.innerHTML = '☀️';
        giroContainer.appendChild(center);
        
        // Adicionar controles do Giro Som
        const controlsPanel = document.createElement('div');
        controlsPanel.className = 'giro-controls';
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
        
        container.appendChild(giroContainer);
        container.appendChild(controlsPanel);
    }
    
    setupGiroSomDemo() {
        // Simular 9 pétalas do Giro Som
        const giroPetals = document.querySelectorAll('.highlight-item, .feature-card, .application-card');
        
        giroPetals.forEach((petal, index) => {
            if (index < 9) {
                petal.addEventListener('click', () => {
                    this.playGiroNote(index % this.giroFrequencies.length, petal);
                    this.animateElement(petal);
                });
            }
        });
    }
    
    playGiroNote(noteIndex, element = null) {
        if (!this.isSoundEnabled || !this.isAudioEnabled || !this.audioContext) {
            if (!this.isSoundEnabled) return;
            this.enableAudio();
            if (!this.isAudioEnabled) return;
        }
        
        const frequency = this.giroFrequencies[noteIndex % this.giroFrequencies.length];
        
        // Criar oscilador para som pentatônico (mais orgânico)
        const oscillator = this.audioContext.createOscillator();
        const noteGain = this.audioContext.createGain();
        
        oscillator.type = 'sine'; // Som suave como pétalas
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        // Envelope ADSR suave para efeito orgânico
        noteGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        noteGain.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.25, this.audioContext.currentTime + 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.2);
        
        oscillator.connect(noteGain);
        noteGain.connect(this.gainNode);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 1.2);
        
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
        // Criar efeito de partícula girassol no hover
        const particle = document.createElement('div');
        particle.className = 'hover-particle sunflower-particle';
        
        const rect = element.getBoundingClientRect();
        particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, #F39C12, #E67E22);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: sunflowerParticleFloat 1.2s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1200);
    }
    
    setupSoundWaves() {
        // Criar ondas sonoras visuais com tema girassol
        const waveContainer = document.createElement('div');
        waveContainer.className = 'sound-waves giro-waves';
        waveContainer.innerHTML = `
            <div class="wave wave-1 sunflower-wave"></div>
            <div class="wave wave-2 sunflower-wave"></div>
            <div class="wave wave-3 sunflower-wave"></div>
            <div class="wave wave-4 sunflower-wave"></div>
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
            
            this.playGiroNote(this.currentNoteIndex);
            this.highlightNote(this.currentNoteIndex);
            
            this.currentNoteIndex++;
            
            if (this.currentNoteIndex < this.giroFrequencies.length) {
                setTimeout(playNextNote, 250); // Um pouco mais lento para efeito orgânico
            } else {
                // Repetir a escala descendente
                this.currentNoteIndex = this.giroFrequencies.length - 1;
                setTimeout(() => this.playDescendingScale(), 150);
            }
        };
        
        playNextNote();
    }
    
    playDescendingScale() {
        const playPrevNote = () => {
            if (!this.isPlaying) return;
            
            this.playGiroNote(this.currentNoteIndex);
            this.highlightNote(this.currentNoteIndex);
            
            this.currentNoteIndex--;
            
            if (this.currentNoteIndex >= 0) {
                setTimeout(playPrevNote, 250);
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
            }, 400);
        }
        
        // Criar nota visual sincronizada (será criada pelo playGiroNote)
    }
    
    removeAllHighlights() {
        document.querySelectorAll('.note-highlight').forEach(el => {
            el.classList.remove('note-highlight');
        });
    }
    
    playChord() {
        if (!this.isAudioEnabled || !this.audioContext) return;
        
        // Tocar acorde pentatônico (C, E, G, A)
        const chordNotes = [0, 2, 3, 4]; // C, E, G, A da escala pentatônica
        const productImage = document.querySelector('.product-image');
        
        chordNotes.forEach((noteIndex, i) => {
            setTimeout(() => this.playGiroNote(noteIndex, productImage), i * 60);
        });
    }
    
    animatePetal(petal) {
        petal.classList.add('spinning');
        petal.style.transform += ' scale(1.1)';
        
        setTimeout(() => {
            petal.classList.remove('spinning');
            petal.style.transform = petal.style.transform.replace(' scale(1.1)', '');
        }, 300);
    }
    
    animateElement(element) {
        element.style.transform = 'scale(1.08) rotate(2deg)';
        element.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            element.style.transform = '';
        }, 300);
    }
    
    createParticleEffect(container) {
        for (let i = 0; i < 9; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle sunflower-particle';
                particle.textContent = Math.random() > 0.5 ? '🌻' : '☀️';
                
                const rect = container.getBoundingClientRect();
                particle.style.cssText = `
                    position: fixed;
                    left: ${rect.left + rect.width / 2}px;
                    top: ${rect.top + rect.height / 2}px;
                    font-size: 1.5rem;
                    pointer-events: none;
                    z-index: 1000;
                `;
                
                const angle = (i / 9) * Math.PI * 2;
                const velocity = 120 + Math.random() * 80;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;
                
                let x = rect.left + rect.width / 2;
                let y = rect.top + rect.height / 2;
                let opacity = 1;
                let rotation = 0;
                
                const animate = () => {
                    x += vx * 0.02;
                    y += vy * 0.02;
                    opacity -= 0.025;
                    rotation += 5;
                    
                    particle.style.left = x + 'px';
                    particle.style.top = y + 'px';
                    particle.style.opacity = opacity;
                    particle.style.transform = `rotate(${rotation}deg)`;
                    
                    if (opacity > 0) {
                        requestAnimationFrame(animate);
                    } else {
                        particle.remove();
                    }
                };
                
                document.body.appendChild(particle);
                animate();
            }, i * 30);
        }
    }
    
    setupGlobalHoverSounds() {
        // Elementos que devem emitir sons no hover - adaptado para Giro Som
        const soundSelectors = [
            '.btn',                    // Botões
            '.highlight-item',         // Destaques do produto
            '.benefit-item',          // Itens de benefícios
            '.spec-category',         // Categorias de especificação
            '.application-card',      // Cards de aplicação
            '.giro-petal',           // Pétalas do Giro Som
            '.product-image',        // Imagem do produto
            '.nav-link',             // Links de navegação
            '.final-benefit',        // Benefícios finais
            '.accessibility-btn',    // Botões de acessibilidade
            'h3',                    // Títulos
            '.cta-section',          // Seção CTA
            '.petal-item'            // Itens de pétala (se existirem)
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
                        const noteIndex = (index + elementIndex) % this.giroFrequencies.length;
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
        
        const frequency = this.giroFrequencies[noteIndex];
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        // Diferentes tipos de som para diferentes elementos
        if (elementType.includes('btn')) {
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        } else if (elementType.includes('giro-petal')) {
            oscillator.type = 'triangle';
            gainNode.gain.setValueAtTime(0.35, this.audioContext.currentTime);
        } else {
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        }
        
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.4);
        
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
            width: 8px;
            height: 8px;
            background: rgba(243, 156, 18, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: sunflowerParticleHover 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
    
    initializeAnimations() {
        // Adicionar classes de animação após carregamento
        setTimeout(() => {
            document.querySelectorAll('.product-hero, .product-details').forEach(section => {
                section.classList.add('loaded');
            });
        }, 100);
    }
    
    addGiroSomDescription() {
        // Adicionar descrição específica do Giro Som se necessário
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && !document.querySelector('.giro-som-description')) {
            const description = document.createElement('p');
            description.className = 'giro-som-description';
            description.textContent = 'Controlador MIDI único em formato de girassol com 9 teclas, giroscópio e design orgânico.';
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
    console.log('🌻 Inicializando Giro Som 09...');
    
    const giroSom = new GiroSomPage();
    window.giroSomInstance = giroSom;
    
    // Sistema de ativação automática do áudio
    let audioActivated = false;
    const audioActivationEvents = ['click', 'touchstart', 'keydown'];
    
    const tryActivateAudio = () => {
        const instance = window.giroSomInstance || giroSom;
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
window.GiroSomPage = GiroSomPage;