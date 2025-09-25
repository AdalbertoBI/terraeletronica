// Board Bells Specific JavaScript - Terra Eletrônica
class BoardBellsPage {
    constructor() {
        this.audioContext = null;
        this.isAudioEnabled = false;
        this.musicalNotes = ['🔔', '🎵', '🎶', '♪', '♫', '♬', '♭', '♯', '�'];
        // Frequências de bells/sinos para Board Bells (8 teclas)
        this.bellFrequencies = [
            261.63, // C4 - Sino 1
            293.66, // D4 - Sino 2  
            329.63, // E4 - Sino 3
            349.23, // F4 - Sino 4
            392.00, // G4 - Sino 5
            440.00, // A4 - Sino 6
            493.88, // B4 - Sino 7
            523.25  // C5 - Sino 8
        ];
        this.boardBellsSpecs = {
            teclas: 8,
            formato: "sinos",
            controladorMidi: true,
            botaoGiratorio: true,
            funcoes: ["alt", "seleção de instrumentos", "cores padronizadas"]
        };
        this.currentNoteIndex = 0;
        this.isPlaying = false;
        
        this.init();
    }
    
    init() {
        this.setupAudioContext();
        this.setupProductImageInteraction();
        this.setupBoardBellsDemo();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupSoundWaves();
        this.setupGlobalHoverSounds();
        this.initializeAnimations();
        this.addBoardBellsDescription();
        
        console.log('🔔 Board Bells (Board Som) page initialized with musical enhancements!');
    }
    
    setupAudioContext() {
        try {
            // Criar AudioContext com compatibilidade
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            
            // Tentar habilitar áudio imediatamente
            this.enableAudio();
            
            // Fallback: habilitar na primeira interação se necessário
            if (!this.isAudioEnabled) {
                document.addEventListener('click', () => this.enableAudio(), { once: true });
                document.addEventListener('touchstart', () => this.enableAudio(), { once: true });
                document.addEventListener('mouseenter', () => this.enableAudio(), { once: true });
            }
        } catch (error) {
            console.log('AudioContext não suportado:', error);
        }
    }
    
    enableAudio() {
        if (!this.isAudioEnabled && window.AudioContext) {
            try {
                this.audioContext = new AudioContext();
                
                // Forçar o contexto a ser iniciado
                if (this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        this.isAudioEnabled = true;
                        console.log('🎵 Audio habilitado e retomado!');
                        
                        // Tocar uma nota silenciosa para ativar o contexto
                        this.playTestNote();
                    });
                } else {
                    this.isAudioEnabled = true;
                    console.log('🎵 Audio habilitado diretamente!');
                    
                    // Tocar uma nota silenciosa para ativar o contexto
                    this.playTestNote();
                }
            } catch (error) {
                console.log('Erro ao habilitar audio:', error);
                
                // Tentar novamente em 1 segundo
                setTimeout(() => this.enableAudio(), 1000);
            }
        }
    }
    
    playTestNote() {
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
            oscillator.type = 'sine';
            
            // Volume muito baixo para não incomodar
            gainNode.gain.setValueAtTime(0.001, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + 0.1);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Erro ao tocar nota de teste:', error);
        }
    }
    
    createSoundTriggeredNote(noteIndex, element = null) {
        const note = document.createElement('div');
        note.className = 'bell-note sound-triggered';
        note.textContent = '🔔'; // Ícone de sino para Board Som
        
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
        
        // Cores douradas/bronze específicas para sinos do Board Som
        const bellColors = ['#FFD700', '#FFA500', '#FF8C00', '#DAA520', '#B8860B', '#CD853F', '#DEB887', '#F4A460'];
        const color = bellColors[noteIndex % bellColors.length];
        
        note.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 2.2rem;
            font-weight: bold;
            color: ${color};
            text-shadow: 
                0 0 15px ${color},
                0 0 25px ${color},
                2px 2px 6px rgba(0, 0, 0, 0.6);
            filter: drop-shadow(0 0 12px ${color});
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%) scale(0) rotate(-15deg);
            opacity: 0;
            animation: bellNoteFloat 2.5s ease-out forwards;
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
        
        // Interface do Board Bells removida - imagem emite escala musical normalmente
        // this.createBoardBellsInterface(productImage);
        
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
    
    createBoardBellsInterface(container) {
        const bellsContainer = document.createElement('div');
        bellsContainer.className = 'board-bells-container';
        
        // Criar 8 sinos do Board Bells em formato 2x4
        for (let i = 0; i < 8; i++) {
            const bell = document.createElement('div');
            bell.className = 'board-bell';
            bell.dataset.bellIndex = i;
            bell.dataset.frequency = this.bellFrequencies[i];
            
            // Adicionar ícone de sino
            const bellIcon = document.createElement('span');
            bellIcon.className = 'bell-icon';
            bellIcon.textContent = '🔔';
            bell.appendChild(bellIcon);
            
            // Adicionar número do sino
            const bellNumber = document.createElement('span');
            bellNumber.className = 'bell-number';
            bellNumber.textContent = i + 1;
            bell.appendChild(bellNumber);
            
            bell.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playBellNote(i, bell);
                this.animateBell(bell);
            });
            
            bell.addEventListener('mouseenter', () => {
                this.previewBellNote(i, bell);
            });
            
            bellsContainer.appendChild(bell);
        }
        
        // Adicionar controles do Board Bells
        const controlsPanel = document.createElement('div');
        controlsPanel.className = 'board-controls';
        controlsPanel.innerHTML = `
            <div class="control-item">
                <span class="control-icon">�️</span>
                <span class="control-label">Botão Dual Function</span>
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
        
        container.appendChild(bellsContainer);
        container.appendChild(controlsPanel);
    }
    
    setupBoardBellsDemo() {
        // Simular 8 sinos do Board Bells
        const boardKeys = document.querySelectorAll('.highlight-item, .feature-card, .application-card');
        
        boardKeys.forEach((key, index) => {
            key.addEventListener('mouseenter', () => {
                // Efeito visual dos sinos do Board Bells
                key.style.transform = 'translateY(-3px) scale(1.02)';
                key.style.boxShadow = '0 8px 20px rgba(255, 215, 0, 0.4)';
                
                // Tocar som de bell correspondente (limitado a 8 sinos)
                if (index < this.bellFrequencies.length) {
                    this.playBellNote(index, key);
                }
            });
            
            key.addEventListener('mouseleave', () => {
                key.style.transform = '';
                key.style.boxShadow = '';
            });
        });
        
        // Demonstração dos controles do Board Bells
        this.setupBoardControlsDemo();
    }
    
    setupBoardControlsDemo() {
        // Simular controles do Board Bells
        let controlEffect = 0;
        
        setInterval(() => {
            controlEffect += 0.01;
            const productImage = document.querySelector('.product-image img');
            if (productImage && this.isPlaying) {
                // Efeito sutil simulando interação com controles
                const rotation = Math.sin(controlEffect) * 1.5;
                productImage.style.transform = `rotate(${rotation}deg) scale(1.02)`;
            }
        }, 150);
    }
    
    animateBell(bell) {
        // Adicionar classe de animação do sino
        bell.classList.add('ringing');
        
        // Remover a classe após a animação
        setTimeout(() => {
            bell.classList.remove('ringing');
        }, 600);
    }
    
    previewBellNote(index, bell) {
        if (!this.isPlaying) return;
        
        // Preview suave do som
        if (this.isAudioEnabled && this.audioContext) {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(this.bellFrequencies[index], this.audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.3);
        }
    }
    
    toggleDualFunction() {
        this.dualFunctionEnabled = !this.dualFunctionEnabled;
        const controlPanel = document.querySelector('.board-controls');
        
        if (this.dualFunctionEnabled) {
            controlPanel.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
            controlPanel.style.border = '2px solid #FFD700';
            this.activateDualFunctionMode();
        } else {
            controlPanel.style.backgroundColor = '';
            controlPanel.style.border = '';
            this.deactivateDualFunctionMode();
        }
    }
    
    activateDualFunctionMode() {
        if (this.dualFunctionInterval) clearInterval(this.dualFunctionInterval);
        
        let modeAngle = 0;
        this.dualFunctionInterval = setInterval(() => {
            modeAngle += 0.03;
            const bells = document.querySelectorAll('.board-bell');
            
            bells.forEach((bell, index) => {
                const offset = Math.sin(modeAngle + index * 0.8) * 1.5;
                const glowIntensity = Math.abs(Math.sin(modeAngle + index * 0.3));
                bell.style.transform = `translateY(${offset}px) rotate(${offset * 0.3}deg)`;
                bell.style.boxShadow = `0 4px 15px rgba(255, 215, 0, ${0.3 + glowIntensity * 0.3})`;
            });
        }, 80);
    }
    
    deactivateDualFunctionMode() {
        if (this.dualFunctionInterval) {
            clearInterval(this.dualFunctionInterval);
            this.dualFunctionInterval = null;
        }
        
        const bells = document.querySelectorAll('.board-bell');
        bells.forEach(bell => {
            bell.style.transform = '';
            bell.style.boxShadow = '';
        });
    }
    
    playBellNote(noteIndex, element = null) {
        if (!this.isAudioEnabled || !this.audioContext) return;
        
        // Usar frequência específica do Board Bells (8 sinos)
        const frequency = this.bellFrequencies[noteIndex % this.bellFrequencies.length];
        
        // Criar som de bell/sino com múltiplos osciladores para riqueza harmônica
        const fundamental = this.audioContext.createOscillator();
        const harmonic2 = this.audioContext.createOscillator();
        const harmonic3 = this.audioContext.createOscillator();
        
        const gainFund = this.audioContext.createGain();
        const gainHarm2 = this.audioContext.createGain();
        const gainHarm3 = this.audioContext.createGain();
        const masterGain = this.audioContext.createGain();
        
        // Configurar osciladores para som de sino
        fundamental.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        harmonic2.frequency.setValueAtTime(frequency * 2.5, this.audioContext.currentTime);
        harmonic3.frequency.setValueAtTime(frequency * 4.2, this.audioContext.currentTime);
        
        fundamental.type = 'sine';
        harmonic2.type = 'sine';
        harmonic3.type = 'triangle';
        
        // Conectar e configurar ganhos
        fundamental.connect(gainFund);
        harmonic2.connect(gainHarm2);
        harmonic3.connect(gainHarm3);
        
        gainFund.connect(masterGain);
        gainHarm2.connect(masterGain);
        gainHarm3.connect(masterGain);
        masterGain.connect(this.audioContext.destination);
        
        // Envelope típico de sino (ataque rápido, decay longo)
        gainFund.gain.setValueAtTime(0.4, this.audioContext.currentTime);
        gainHarm2.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gainHarm3.gain.setValueAtTime(0.08, this.audioContext.currentTime);
        masterGain.gain.setValueAtTime(1, this.audioContext.currentTime);
        
        masterGain.gain.exponentialRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
        masterGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 2);
        
        // Iniciar osciladores
        const now = this.audioContext.currentTime;
        fundamental.start(now);
        harmonic2.start(now);
        harmonic3.start(now);
        
        fundamental.stop(now + 2);
        harmonic2.stop(now + 2);
        harmonic3.stop(now + 2);
        
        // Criar nota visual sincronizada com o som
        this.createSoundTriggeredNote(noteIndex, element);
    }
    
    startMusicalScale() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.currentNoteIndex = 0;
        
        const playNextNote = () => {
            if (!this.isPlaying) return;
            
            this.playBellNote(this.currentNoteIndex);
            this.highlightNote(this.currentNoteIndex);
            
            this.currentNoteIndex++;
            
            if (this.currentNoteIndex < this.bellFrequencies.length) {
                setTimeout(playNextNote, 200);
            } else {
                // Repetir a escala descendente
                this.currentNoteIndex = this.bellFrequencies.length - 1;
                setTimeout(() => this.playDescendingScale(), 100);
            }
        };
        
        playNextNote();
    }
    
    playDescendingScale() {
        const playPrevNote = () => {
            if (!this.isPlaying) return;
            
            this.playBellNote(this.currentNoteIndex);
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
        // Destacar a tecla correspondente
        const keys = document.querySelectorAll('.piano-key');
        keys.forEach(key => key.classList.remove('active'));
        
        if (keys[noteIndex]) {
            keys[noteIndex].classList.add('active');
            setTimeout(() => keys[noteIndex].classList.remove('active'), 300);
        }
        
        // Criar nota visual sincronizada (será criada pelo playNote)
    }
    
    removeAllHighlights() {
        const keys = document.querySelectorAll('.piano-key');
        keys.forEach(key => key.classList.remove('active'));
    }
    

    
    playChord() {
        if (!this.isAudioEnabled || !this.audioContext) return;
        
        // Tocar acorde com sinos (C, E, G)
        const chordNotes = [0, 2, 4]; // C, E, G dos sinos
        const productImage = document.querySelector('.product-image');
        
        chordNotes.forEach((noteIndex, i) => {
            setTimeout(() => this.playBellNote(noteIndex, productImage), i * 50);
        });
    }
    
    animateKey(key) {
        key.classList.add('active');
        key.style.transform = 'translateY(2px) scale(0.95)';
        
        setTimeout(() => {
            key.classList.remove('active');
            key.style.transform = '';
        }, 150);
    }
    
    createParticleEffect(container) {
        const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 15;
            `;
            
            const angle = (360 / 12) * i;
            const distance = 100;
            
            particle.animate([
                {
                    transform: 'translate(-50%, -50%) scale(0)',
                    opacity: 1
                },
                {
                    transform: `translate(-50%, -50%) translateX(${Math.cos(angle * Math.PI / 180) * distance}px) translateY(${Math.sin(angle * Math.PI / 180) * distance}px) scale(1)`,
                    opacity: 0
                }
            ], {
                duration: 800,
                easing: 'ease-out'
            });
            
            container.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 800);
        }
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fadeInUp');
                    
                    // Efeitos especiais por seção
                    if (entry.target.classList.contains('benefit-item')) {
                        this.animateBenefitItem(entry.target);
                    } else if (entry.target.classList.contains('spec-category')) {
                        this.animateSpecCategory(entry.target);
                    } else if (entry.target.classList.contains('application-card')) {
                        this.animateApplicationCard(entry.target);
                    }
                }
            });
        }, observerOptions);
        
        // Observar elementos animáveis
        document.querySelectorAll('.benefit-item, .spec-category, .application-card, .highlight-item').forEach(el => {
            observer.observe(el);
        });
    }
    
    animateBenefitItem(item) {
        const icon = item.querySelector('.benefit-icon');
        if (icon) {
            setTimeout(() => {
                icon.style.animation = 'bounce 1s ease-in-out';
            }, 200);
        }
    }
    
    animateSpecCategory(category) {
        const icon = category.querySelector('h3 i');
        if (icon) {
            setTimeout(() => {
                icon.style.animation = 'pulse 1.5s ease-in-out 3';
            }, 300);
        }
    }
    
    animateApplicationCard(card) {
        const icon = card.querySelector('.app-icon');
        if (icon) {
            setTimeout(() => {
                icon.style.animation = 'rotate 2s ease-in-out';
            }, 400);
        }
    }
    
    setupGlobalHoverSounds() {
        // Elementos que devem emitir sons no hover
        const soundSelectors = [
            '.btn',                    // Botões
            '.highlight-item',         // Destaques do produto
            '.benefit-item',          // Itens de benefícios
            '.spec-category',         // Categorias de especificação
            '.application-card',      // Cards de aplicação
            '.board-bell',           // Sinos do Board Bells
            '.product-image',        // Imagem do produto
            '.nav-link',             // Links de navegação
            '.final-benefit',        // Benefícios finais
            '.accessibility-btn',    // Botões de acessibilidade
            'h3',                    // Títulos
            '.cta-section',          // Seção CTA
            '.sino-item',            // Itens de sino (se existirem)
            '.color-option'          // Opções de cores
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
                        const noteIndex = (index + elementIndex) % this.bellFrequencies.length;
                        this.playHoverNote(noteIndex, selector, element);
                    }
                });
                
                // Adicionar feedback visual sutil
                element.addEventListener('mouseenter', () => {
                    this.createHoverParticle(element);
                });
            });
        });
    }
    
    playHoverNote(noteIndex, elementType, element) {
        if (!this.isAudioEnabled || !this.audioContext) return;
        
        const frequency = this.bellFrequencies[noteIndex];
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        // Diferentes tipos de som para diferentes elementos
        if (elementType.includes('btn')) {
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        } else if (elementType.includes('board-bell')) {
            oscillator.type = 'sine'; // Som de sino suave
            gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
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
            background: rgba(0, 150, 136, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: hoverParticle 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 600);
    }

    setupHoverEffects() {
        // Efeitos hover nos botões CTA
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                this.createButtonRipple(btn);
            });
        });
        
        // Efeitos hover nos highlights
        document.querySelectorAll('.highlight-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                const icon = item.querySelector('i');
                if (icon) {
                    icon.style.animation = 'bounce 0.8s ease-in-out';
                }
            });
        });
    }
    
    createButtonRipple(button) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    setupSoundWaves() {
        // Adicionar ondas sonoras aos elementos que fazem som
        const soundElements = document.querySelectorAll('.product-image, .piano-key, .btn-primary');
        
        soundElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.createSoundWaveEffect(element);
            });
        });
    }
    
    createSoundWaveEffect(element) {
        const waves = document.createElement('div');
        waves.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            gap: 2px;
            pointer-events: none;
            z-index: 5;
        `;
        
        for (let i = 0; i < 5; i++) {
            const wave = document.createElement('div');
            wave.className = 'sound-wave';
            wave.style.animationDelay = `${i * 0.1}s`;
            waves.appendChild(wave);
        }
        
        element.style.position = 'relative';
        element.appendChild(waves);
        
        setTimeout(() => {
            if (waves.parentNode) {
                waves.parentNode.removeChild(waves);
            }
        }, 1200);
    }
    
    initializeAnimations() {
        // Adicionar estilos de animação dinâmicos
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Inicializar animações de entrada
        setTimeout(() => {
            document.querySelectorAll('.product-title, .product-subtitle').forEach((el, index) => {
                el.style.animation = `fadeInUp 0.8s ease-out ${index * 0.2}s both`;
            });
        }, 100);
    }
    
    getRandomColor() {
        const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#e91e63', '#ff5722'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Classe para gerenciar efeitos visuais avançados
class VisualEffectsManager {
    constructor() {
        this.setupParallaxEffect();
        this.setupMouseFollower();
    }
    
    setupParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.product-hero::before, .musical-notes');
            
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    setupMouseFollower() {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            
            // Criar efeito sutil de partículas seguindo o mouse
            if (Math.random() < 0.1) {
                this.createMouseParticle(followerX, followerY);
            }
            
            requestAnimationFrame(animateFollower);
        };
        
        animateFollower();
    }
    
    createMouseParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: rgba(0, 150, 136, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            animation: fadeOut 1s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
    
    addBoardBellsDescription() {
        const container = document.querySelector('.container');
        if (!container) return;
        
        const description = document.createElement('div');
        description.className = 'product-description fade-in';
        description.innerHTML = `
            <h3>🔔 Board Bells - Controlador MIDI Inovador</h3>
            <p>O Board Bells é um controlador MIDI com 8 teclas em formato de sinos, que podem ser usadas como acionadoras de notas musicais para vários instrumentos.</p>
            <div class="features-list">
                <div class="feature">
                    <span class="feature-icon">🔔</span>
                    <span>8 teclas em formato de sinos</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">🎨</span>
                    <span>Cores adequadas aos padrões internacionais</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">🎛️</span>
                    <span>Botão giratório com duas funções</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">🔛</span>
                    <span>Chave liga/desliga e entrada carregador</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">🎵</span>
                    <span>Compatível com sistemas MIDI</span>
                </div>
                <div class="feature">
                    <span class="feature-icon">♿</span>
                    <span>Funções similares ao BIG-KBD</span>
                </div>
            </div>
        `;
        
        container.appendChild(description);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const boardBells = new BoardBellsPage();
    new VisualEffectsManager();
    
    // Armazenar instância globalmente para referência
    window.boardBellsInstance = boardBells;
    
    // Adicionar estilo fadeOut se não existir
    if (!document.querySelector('#fadeOutStyle')) {
        const style = document.createElement('style');
        style.id = 'fadeOutStyle';
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; transform: scale(1); }
                to { opacity: 0; transform: scale(0); }
            }
            
            @keyframes hoverParticle {
                0% {
                    opacity: 1;
                    transform: scale(0) translateY(0);
                }
                50% {
                    opacity: 1;
                    transform: scale(1) translateY(-10px);
                }
                100% {
                    opacity: 0;
                    transform: scale(0) translateY(-20px);
                }
            }
            
            @keyframes soundNoteFloat {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0) rotate(0deg);
                }
                20% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1.2) rotate(10deg);
                }
                80% {
                    opacity: 1;
                    transform: translate(-50%, -70%) scale(1) rotate(-10deg);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -90%) scale(0.5) rotate(20deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Tentativas múltiplas de ativar áudio
    const audioActivationEvents = [
        'click', 'touchstart', 'mousedown', 'keydown', 
        'mousemove', 'mouseenter', 'focus', 'scroll'
    ];
    
    let audioActivated = false;
    
    const tryActivateAudio = () => {
        const instance = window.boardBellsInstance || boardBells;
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
window.BoardBellsPage = BoardBellsPage;