// BIG_KBD_25 Specific JavaScript
class BigKbd25Page {
    constructor() {
        this.audioContext = null;
        this.isAudioEnabled = false;
        this.isSoundEnabled = true; // Controle do usuário para som
        this.musicalNotes = ['♪', '♫', '♬', '♭', '♯', '𝄞', '𝄢', '𝅘𝅥𝅮'];
        this.scaleFrequencies = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C4 to C5
        this.scaleNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
        this.currentNoteIndex = 0;
        this.isPlaying = false;
        
        this.init();
    }
    
    init() {
        // Garantir que as animações CSS sejam inseridas primeiro
        this.insertAnimationStyles();
        
        this.setupAudioContext();
        this.setupSoundControl();
        this.setupProductImageInteraction();
        this.setupPianoKeys();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupSoundWaves();
        this.setupGlobalHoverSounds();
        this.initializeAnimations();
        
        // Adicionar função de teste para debug
        this.setupDebugTest();
        
        console.log('🎹 BIG_KBD_25 page initialized with musical enhancements!');
    }
    
    insertAnimationStyles() {
        // Inserir estilos de animação imediatamente
        if (!document.querySelector('#musicalNotesAnimations')) {
            const style = document.createElement('style');
            style.id = 'musicalNotesAnimations';
            style.textContent = `
                .musical-note.sound-triggered {
                    position: fixed !important;
                    pointer-events: none !important;
                    z-index: 9999 !important;
                    font-family: "Times New Roman", serif !important;
                    font-weight: bold !important;
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
                
                @keyframes soundNoteBounce {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0) translateY(0);
                    }
                    25% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1.3) translateY(-30px);
                    }
                    50% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1.1) translateY(-10px);
                    }
                    75% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1.2) translateY(-40px);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.3) translateY(-80px);
                    }
                }
                
                @keyframes soundNoteSpin {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0) rotate(0deg);
                    }
                    30% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1.4) rotate(180deg);
                    }
                    70% {
                        opacity: 1;
                        transform: translate(-50%, -60%) scale(1) rotate(360deg);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -80%) scale(0.2) rotate(540deg);
                    }
                }
                
                @keyframes soundNoteZoom {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0);
                    }
                    15% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(2);
                    }
                    85% {
                        opacity: 1;
                        transform: translate(-50%, -70%) scale(0.8);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -100%) scale(0);
                    }
                }
                
                @keyframes noteTrail {
                    0% {
                        opacity: 0.8;
                        transform: scale(0);
                    }
                    50% {
                        opacity: 0.5;
                        transform: scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(2);
                    }
                }
                
                @keyframes toggleNoteFeedback {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0) rotate(0deg);
                    }
                    30% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1.3) rotate(180deg);
                    }
                    70% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(0.9) rotate(360deg);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0) rotate(540deg);
                    }
                }
            `;
            document.head.appendChild(style);
            console.log('✅ Estilos de animação das notas musicais inseridos');
        }
    }
    
    setupDebugTest() {
        // Função para testar notas visuais manualmente
        window.testMusicalNote = (noteIndex = 0) => {
            console.log('🧪 Testando nota visual:', noteIndex);
            console.log('🔊 Som habilitado:', this.isSoundEnabled);
            if (this.isSoundEnabled) {
                this.createSoundTriggeredNote(noteIndex);
            } else {
                console.log('❌ Som desabilitado - ative o som para ver notas visuais');
            }
        };
        
        // Função para forçar teste (ignora estado do som)
        window.forceTestNote = (noteIndex = 0) => {
            console.log('🧪 FORÇANDO teste de nota visual (ignora som):', noteIndex);
            this.createSoundTriggeredNote(noteIndex);
        };
        
        // Função para teste visual estático (sem animação)
        window.testStaticNote = () => {
            console.log('🧪 Testando nota estática');
            const note = document.createElement('div');
            note.textContent = '♫';
            note.style.cssText = `
                position: fixed !important;
                left: 50% !important;
                top: 50% !important;
                font-size: 4rem !important;
                font-weight: bold !important;
                color: red !important;
                z-index: 999999 !important;
                background: yellow !important;
                padding: 10px !important;
                border: 5px solid blue !important;
                transform: translate(-50%, -50%) !important;
            `;
            document.body.appendChild(note);
            
            setTimeout(() => {
                if (note?.parentNode) {
                    note.parentNode.removeChild(note);
                }
            }, 5000);
        };
        
        // Adicionar tecla de atalho para teste (Ctrl + Shift + M)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                e.preventDefault();
                console.log('🎯 Teste de nota visual ativado');
                this.createSoundTriggeredNote(Math.floor(Math.random() * 8));
            }
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                console.log('🎯 Teste de nota estática ativado');
                window.testStaticNote();
            }
        });
        
        console.log('🧪 Debug ativado:');
        console.log('  - Ctrl+Shift+M: notas animadas (respeita som)');
        console.log('  - Ctrl+Shift+S: nota estática');
        console.log('  - window.forceTestNote(): força nota (ignora som)');
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
            
            // Não criar nota visual para teste (é apenas para ativar o contexto)
        } catch (error) {
            console.log('Erro ao tocar nota de teste:', error);
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
        
        // Feedback visual e sonoro
        this.createSoundToggleFeedback();
        
        console.log(`🔊 Som e notas visuais ${this.isSoundEnabled ? 'ativados' : 'desativados'}`);
    }

    updateSoundButton() {
        const soundToggleBtn = document.getElementById('soundToggleBtn');
        if (!soundToggleBtn) return;

        const icon = soundToggleBtn.querySelector('i');
        
        if (this.isSoundEnabled) {
            soundToggleBtn.classList.remove('muted');
            soundToggleBtn.setAttribute('title', 'Desativar sons e notas visuais');
            soundToggleBtn.setAttribute('aria-label', 'Desativar reprodução de sons e efeitos visuais');
            icon.className = 'fas fa-volume-up';
        } else {
            soundToggleBtn.classList.add('muted');
            soundToggleBtn.setAttribute('title', 'Ativar sons e notas visuais');
            soundToggleBtn.setAttribute('aria-label', 'Ativar reprodução de sons e efeitos visuais');
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

                // Remover após animação
                setTimeout(() => wave.remove(), 1000);
            }, i * 100);
        }

        // Criar notas musicais apenas se som estiver sendo ATIVADO (não desativado)
        if (this.isSoundEnabled) {
            this.createMusicalNotes(soundToggleBtn);
            console.log('🎵 Notas visuais ativadas junto com o som');
        } else {
            console.log('🔇 Notas visuais desativadas junto com o som');
        }

        // Adicionar estilo de animação se não existir
        if (!document.getElementById('soundWaveAnimation')) {
            const style = document.createElement('style');
            style.id = 'soundWaveAnimation';
            style.textContent = `
                @keyframes soundWave {
                    0% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 0.8;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(3);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    createSoundTriggeredNote(noteIndex, element = null) {
        try {
            // Debug log
            console.log('🎵 Criando nota visual:', { noteIndex, element: element?.tagName || 'none' });
            
            const note = document.createElement('div');
            note.className = 'musical-note-test';
            
            // Garantir que o índice seja válido
            const validNoteIndex = Math.abs(noteIndex) % this.musicalNotes.length;
            note.textContent = this.musicalNotes[validNoteIndex];
            
            // Posicionar baseado no elemento ou posição aleatória
            let x, y;
            if (element?.getBoundingClientRect) {
                const rect = element.getBoundingClientRect();
                x = rect.left + rect.width / 2;
                y = rect.top + rect.height / 2;
                
                // Verificar se as coordenadas são válidas
                if (isNaN(x) || isNaN(y)) {
                    x = window.innerWidth / 2;
                    y = window.innerHeight / 2;
                }
                
                // Adicionar pequena variação para múltiplas notas do mesmo elemento
                x += (Math.random() - 0.5) * 60;
                y += (Math.random() - 0.5) * 40;
            } else {
                x = Math.random() * (window.innerWidth - 100) + 50;
                y = window.innerHeight - 100 - Math.random() * 200;
            }
            
            // Cores mais vibrantes e específicas para cada nota musical
            const colors = [
                '#FF4081', '#FF6B35', '#FFB74D', '#66BB6A', 
                '#42A5F5', '#AB47BC', '#EF5350', '#FF8A65'
            ];
            const color = colors[validNoteIndex];
            
            // VERSÃO SIMPLIFICADA PARA TESTE - usar apenas CSS inline básico
            note.style.cssText = `
                position: fixed !important;
                left: ${x}px !important;
                top: ${y}px !important;
                font-size: 3rem !important;
                font-weight: bold !important;
                color: ${color} !important;
                text-shadow: 0 0 20px ${color}, 0 0 40px ${color} !important;
                pointer-events: none !important;
                z-index: 99999 !important;
                font-family: "Times New Roman", serif !important;
                transform: translate(-50%, -50%) !important;
                opacity: 1 !important;
                display: block !important;
                visibility: visible !important;
            `;
            
            // Adicionar ao DOM
            document.body.appendChild(note);
            
            // ANIMAÇÃO SUAVE VIA JAVASCRIPT
            let scale = 0.5;
            let opacity = 1;
            let yOffset = 0;
            let rotation = 0;
            
            console.log('🎵 Iniciando animação da nota na posição:', { x, y });
            
            const animate = () => {
                scale += 0.03;
                opacity -= 0.015;
                yOffset -= 1.5;
                rotation += 3;
                
                if (opacity > 0 && scale < 2.5) {
                    note.style.transform = `translate(-50%, -50%) scale(${scale}) translateY(${yOffset}px) rotate(${rotation}deg)`;
                    note.style.opacity = opacity;
                    requestAnimationFrame(animate);
                } else {
                    // Remover nota quando a animação terminar
                    if (note?.parentNode) {
                        note.parentNode.removeChild(note);
                        console.log('🗑️ Nota removida após animação');
                    }
                }
            };
            
            // Iniciar animação após pequeno delay
            setTimeout(() => {
                animate();
            }, 100);
            
            // Debug: verificar se a nota foi adicionada
            console.log('✅ Nota adicionada ao DOM:', {
                position: { x, y },
                color,
                content: note.textContent,
                inDOM: document.body.contains(note),
                styles: note.style.cssText
            });
            
            // Criar rastro de brilho
            this.createNoteTrail(x, y, color);
            
        } catch (error) {
            console.error('❌ Erro ao criar nota visual:', error);
        }
    }
    
    createNoteTrail(x, y, color) {
        // Versão simplificada do rastro para teste
        try {
            const trail = document.createElement('div');
            trail.style.cssText = `
                position: fixed !important;
                left: ${x}px !important;
                top: ${y}px !important;
                width: 10px !important;
                height: 10px !important;
                background: ${color} !important;
                border-radius: 50% !important;
                pointer-events: none !important;
                z-index: 9998 !important;
                transform: translate(-50%, -50%) !important;
                opacity: 0.8 !important;
            `;
            
            document.body.appendChild(trail);
            
            // Animação simples via JavaScript
            let scale = 1;
            let opacity = 0.8;
            
            const animateTrail = () => {
                scale += 0.1;
                opacity -= 0.05;
                
                if (opacity > 0) {
                    trail.style.transform = `translate(-50%, -50%) scale(${scale})`;
                    trail.style.opacity = opacity;
                    requestAnimationFrame(animateTrail);
                } else {
                    if (trail?.parentNode) {
                        trail.parentNode.removeChild(trail);
                    }
                }
            };
            
            animateTrail();
        } catch (error) {
            console.log('Erro no rastro:', error);
        }
    }
    
    createMusicalNotes(element) {
        // Criar várias notas musicais flutuando ao redor do elemento
        const notes = ['♪', '♫', '♬', '♩', '♯'];
        const colors = ['#FF4081', '#FF6B35', '#66BB6A', '#42A5F5', '#AB47BC'];
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const noteDiv = document.createElement('div');
                noteDiv.className = 'musical-note toggle-feedback';
                noteDiv.textContent = notes[i % notes.length];
                
                const rect = element.getBoundingClientRect();
                const angle = (360 / 5) * i;
                const distance = 80;
                
                const x = rect.left + rect.width / 2 + Math.cos(angle * Math.PI / 180) * distance;
                const y = rect.top + rect.height / 2 + Math.sin(angle * Math.PI / 180) * distance;
                
                noteDiv.style.cssText = `
                    position: fixed;
                    left: ${x}px;
                    top: ${y}px;
                    font-size: 1.8rem;
                    font-weight: bold;
                    color: ${colors[i % colors.length]};
                    text-shadow: 
                        0 0 10px ${colors[i % colors.length]},
                        0 0 20px ${colors[i % colors.length]};
                    pointer-events: none;
                    z-index: 9999;
                    transform: translate(-50%, -50%) scale(0);
                    animation: toggleNoteFeedback 1.5s ease-out forwards;
                `;
                
                document.body.appendChild(noteDiv);
                
                setTimeout(() => {
                    if (noteDiv.parentNode) {
                        noteDiv.parentNode.removeChild(noteDiv);
                    }
                }, 1500);
            }, i * 100);
        }
    }
    
    setupProductImageInteraction() {
        const productImage = document.querySelector('.product-image');
        const productImg = productImage?.querySelector('img');
        
        if (!productImage || !productImg) return;
        
        // Teclas de piano removidas - imagem emite escala musical normalmente
        // this.createPianoKeys(productImage);
        
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
    
    createPianoKeys(container) {
        const keysContainer = document.createElement('div');
        keysContainer.className = 'piano-keys';
        
        // Criar 8 teclas (uma oitava)
        const whiteKeys = [0, 2, 4, 5, 7]; // C, E, G, F, B
        const blackKeys = [1, 3, 6]; // D, F, A
        
        // Teclas brancas
        whiteKeys.forEach((noteIndex, keyIndex) => {
            const key = document.createElement('div');
            key.className = 'piano-key white';
            key.dataset.note = this.scaleNotes[noteIndex];
            key.dataset.frequency = this.scaleFrequencies[noteIndex];
            
            key.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playNote(noteIndex);
                this.animateKey(key);
            });
            
            keysContainer.appendChild(key);
        });
        
        // Teclas pretas (sobrepor às brancas)
        blackKeys.forEach(noteIndex => {
            const key = document.createElement('div');
            key.className = 'piano-key black';
            key.dataset.note = this.scaleNotes[noteIndex];
            key.dataset.frequency = this.scaleFrequencies[noteIndex];
            
            key.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playNote(noteIndex);
                this.animateKey(key);
            });
            
            keysContainer.appendChild(key);
        });
        
        container.appendChild(keysContainer);
    }
    
    setupPianoKeys() {
        const pianoKeys = document.querySelectorAll('.piano-key');
        
        pianoKeys.forEach((key, index) => {
            key.addEventListener('mouseenter', () => {
                key.style.transform = 'translateY(-2px) scale(1.05)';
                key.style.boxShadow = '0 8px 20px rgba(0, 150, 136, 0.3)';
            });
            
            key.addEventListener('mouseleave', () => {
                key.style.transform = '';
                key.style.boxShadow = '';
            });
        });
    }
    
    playNote(noteIndex, element = null) {
        // Só criar nota visual se som estiver habilitado
        if (this.isSoundEnabled) {
            this.createSoundTriggeredNote(noteIndex, element);
        }
        
        // Só reproduzir som se estiver habilitado
        if (!this.isSoundEnabled || !this.isAudioEnabled || !this.audioContext) {
            console.log('🔇 Som e notas visuais desabilitados');
            return;
        }
        
        const frequency = this.scaleFrequencies[noteIndex];
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 1);
    }
    
    startMusicalScale() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.currentNoteIndex = 0;
        
        const playNextNote = () => {
            if (!this.isPlaying) return;
            
            this.playNote(this.currentNoteIndex);
            this.highlightNote(this.currentNoteIndex);
            
            this.currentNoteIndex++;
            
            if (this.currentNoteIndex < this.scaleFrequencies.length) {
                setTimeout(playNextNote, 200);
            } else {
                // Repetir a escala descendente
                this.currentNoteIndex = this.scaleFrequencies.length - 1;
                setTimeout(() => this.playDescendingScale(), 100);
            }
        };
        
        playNextNote();
    }
    
    playDescendingScale() {
        const playPrevNote = () => {
            if (!this.isPlaying) return;
            
            this.playNote(this.currentNoteIndex);
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
        
        // Tocar acorde C maior (C, E, G)
        const chordNotes = [0, 2, 4]; // C, E, G
        const productImage = document.querySelector('.product-image');
        
        chordNotes.forEach((noteIndex, i) => {
            setTimeout(() => this.playNote(noteIndex, productImage), i * 50);
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
            '.piano-key',            // Teclas do piano
            '.product-image',        // Imagem do produto
            '.nav-link',             // Links de navegação
            '.final-benefit',        // Benefícios finais
            '.accessibility-btn',    // Botões de acessibilidade
            'h3',                    // Títulos
            '.cta-section'           // Seção CTA
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
                        const noteIndex = (index + elementIndex) % this.scaleFrequencies.length;
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
        // Só criar nota visual se som estiver habilitado
        if (this.isSoundEnabled) {
            this.createSoundTriggeredNote(noteIndex, element);
        }
        
        // Só reproduzir som se estiver habilitado
        if (!this.isSoundEnabled || !this.isAudioEnabled || !this.audioContext) {
            console.log('🔇 Hover sem som e sem notas visuais');
            return;
        }
        
        const frequency = this.scaleFrequencies[noteIndex];
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        // Diferentes tipos de som para diferentes elementos
        if (elementType.includes('btn')) {
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        } else if (elementType.includes('piano-key')) {
            oscillator.type = 'triangle';
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        } else {
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        }
        
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
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
                    icon.classList.add('hover-glow');
                    setTimeout(() => icon.classList.remove('hover-glow'), 800);
                }
                item.classList.add('beam-glow-active');
                setTimeout(() => item.classList.remove('beam-glow-active'), 600);
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
        
        const initialPosition = button.style.position;
        const initialOverflow = button.style.overflow;
        if (window.getComputedStyle(button).position === 'static') {
            button.style.position = 'relative';
        }
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
            if (initialOverflow) {
                button.style.overflow = initialOverflow;
            } else {
                button.style.removeProperty('overflow');
            }
            if (initialPosition) {
                button.style.position = initialPosition;
            } else if (window.getComputedStyle(button).position === 'relative') {
                button.style.removeProperty('position');
            }
        }, 600);
    }
    
    setupSoundWaves() {
        // Adicionar ondas sonoras aos elementos que fazem som
        const soundElements = document.querySelectorAll('.product-image, .piano-key, .btn-primary');
        
        soundElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (this.isSoundEnabled) {
                    this.createSoundWaveEffect(element);
                }
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
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const bigKbd25 = new BigKbd25Page();
    // Instanciar gerenciador de efeitos visuais
    const visualEffects = new VisualEffectsManager();
    
    // Armazenar instâncias globalmente para referência
    window.bigKbd25Instance = bigKbd25;
    window.visualEffectsInstance = visualEffects;
    
    // Adicionar estilo fadeOut básico se não existir
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
        const instance = window.bigKbd25Instance || bigKbd25;
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
window.BigKbd25Page = BigKbd25Page;