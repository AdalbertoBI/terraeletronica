/**
 * Generic Sound Control System for Musical Instruments
 * Provides sound toggle functionality and musical note animations
 */

class SoundControlSystem {
    constructor() {
        this.isSoundEnabled = true;
        this.musicalNotes = ['♪', '♫', '♬', '♭', '♯', '𝄞', '𝄢', '𝅘𝅥𝅮', '♩', '♬', '♮'];
        this.noteColors = [
            '#e74c3c', '#f39c12', '#e67e22', '#27ae60', 
            '#2980b9', '#8e44ad', '#c0392b', '#d35400', 
            '#16a085', '#2c3e50', '#8b4513', '#4682b4'
        ];
        
        this.init();
    }

    init() {
        this.setupSoundControl();
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
        
        // Notificar outros sistemas sobre a mudança
        this.notifySoundToggle();
        
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

    notifySoundToggle() {
        // Disparar evento personalizado para outros sistemas
        const event = new CustomEvent('soundToggle', {
            detail: { enabled: this.isSoundEnabled }
        });
        document.dispatchEvent(event);
        
        // Atualizar sistemas conhecidos
        if (window.bigKbd25Page) {
            window.bigKbd25Page.isSoundEnabled = this.isSoundEnabled;
        }
        if (window.boardSomPage) {
            window.boardSomPage.isSoundEnabled = this.isSoundEnabled;
        }
        if (window.boardBellsPage) {
            window.boardBellsPage.isSoundEnabled = this.isSoundEnabled;
        }
        if (window.giroSomPage) {
            window.giroSomPage.isSoundEnabled = this.isSoundEnabled;
        }
        if (window.musicalBeam05) {
            window.musicalBeam05.isSoundEnabled = this.isSoundEnabled;
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

    createMusicalNotes(sourceElement) {
        const rect = sourceElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Criar várias notas musicais
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const note = document.createElement('div');
                note.className = 'musical-note sound-control-note';
                note.textContent = this.musicalNotes[Math.floor(Math.random() * this.musicalNotes.length)];
                
                const color = this.noteColors[Math.floor(Math.random() * this.noteColors.length)];
                const angle = (Math.PI * 2 * i) / 5; // Distribuir em círculo
                const radius = 40 + Math.random() * 20;
                const startX = centerX + Math.cos(angle) * radius;
                const startY = centerY + Math.sin(angle) * radius;
                
                note.style.cssText = `
                    position: fixed;
                    left: ${startX}px;
                    top: ${startY}px;
                    font-size: 1.8rem;
                    font-weight: bold;
                    color: ${color};
                    text-shadow: 
                        0 0 10px ${color},
                        0 0 20px ${color},
                        2px 2px 4px rgba(0, 0, 0, 0.5);
                    filter: drop-shadow(0 0 8px ${color});
                    pointer-events: none;
                    z-index: 10005;
                    animation: floatNote 2.5s ease-out forwards;
                    transform-origin: center;
                `;

                document.body.appendChild(note);

                // Remover após animação
                setTimeout(() => {
                    if (note.parentNode) {
                        note.parentNode.removeChild(note);
                    }
                }, 2500);
            }, i * 150);
        }
    }

    // Método para outros sistemas verificarem se o som está habilitado
    isSoundActive() {
        return this.isSoundEnabled;
    }

    // Método para outros sistemas ativarem/desativarem o som programaticamente
    setSoundEnabled(enabled) {
        if (this.isSoundEnabled !== enabled) {
            this.toggleSound();
        }
    }
}

// Inicializar o sistema quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que outros scripts carregaram
    setTimeout(() => {
        window.soundControlSystem = new SoundControlSystem();
    }, 100);
});

// Exportar para uso em módulos se necessário
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundControlSystem;
}