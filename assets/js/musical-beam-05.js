/**
 * Musical Beam 05 - Interactive JavaScript
 * Simula o funcionamento dos sensores laser e efeitos visuais
 */

class MusicalBeam05 {
    constructor() {
        this.sensors = [];
        this.isActive = false;
        this.audioContext = null;
        this.gainNode = null;
        this.initialized = false;
        
        // Configuração dos sensores
        this.sensorConfig = {
            count: 5,
            range: 100, // 1 metro simulado como 100 unidades
            colors: ['#7B68EE', '#00CED1', '#FF6B9D', '#98FB98', '#FFD700'],
            notes: [261.63, 329.63, 392.00, 523.25, 659.25] // C4, E4, G4, C5, E5
        };
        
        this.init();
    }

    init() {
        this.setupAudioContext();
        this.createSensorElements();
        this.attachEventListeners();
        this.startLaserAnimation();
        this.initialized = true;
        console.log('Musical Beam 05 initialized successfully');
    }

    setupAudioContext() {
        try {
            // Criar contexto de áudio apenas quando necessário
            this.createAudioContext = () => {
                if (!this.audioContext) {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    this.gainNode = this.audioContext.createGain();
                    this.gainNode.connect(this.audioContext.destination);
                    this.gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                }
            };
        } catch (error) {
            console.warn('Web Audio API não suportado:', error);
        }
    }

    createSensorElements() {
        // Criar elementos visuais dos sensores laser na página
        const productImage = document.querySelector('.product-image');
        if (!productImage) return;

        const sensorContainer = document.createElement('div');
        sensorContainer.className = 'laser-sensors-overlay';
        sensorContainer.innerHTML = `
            <div class="sensor-tower">
                ${Array.from({length: 5}, (_, i) => `
                    <div class="laser-sensor" data-sensor="${i}">
                        <div class="sensor-beam" data-color="${this.sensorConfig.colors[i]}"></div>
                        <div class="sensor-indicator"></div>
                    </div>
                `).join('')}
            </div>
        `;

        productImage.appendChild(sensorContainer);

        // Adicionar estilos CSS dinâmicos
        this.injectSensorStyles();
    }

    injectSensorStyles() {
        const styles = `
            .laser-sensors-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                z-index: 10;
            }

            .sensor-tower {
                position: relative;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                padding: 10% 20%;
            }

            .laser-sensor {
                position: relative;
                height: 15%;
                display: flex;
                align-items: center;
                cursor: pointer;
                pointer-events: all;
                transition: all 0.3s ease;
            }

            .laser-sensor:hover {
                transform: scale(1.05);
            }

            .sensor-beam {
                width: 100%;
                height: 3px;
                background: linear-gradient(90deg, transparent 0%, var(--beam-color) 20%, var(--beam-color) 80%, transparent 100%);
                border-radius: 2px;
                box-shadow: 0 0 10px var(--beam-color);
                opacity: 0.6;
                animation: laserPulse 2s ease-in-out infinite alternate;
            }

            .sensor-beam[data-color="#7B68EE"] { --beam-color: #7B68EE; }
            .sensor-beam[data-color="#00CED1"] { --beam-color: #00CED1; }
            .sensor-beam[data-color="#FF6B9D"] { --beam-color: #FF6B9D; }
            .sensor-beam[data-color="#98FB98"] { --beam-color: #98FB98; }
            .sensor-beam[data-color="#FFD700"] { --beam-color: #FFD700; }

            .sensor-indicator {
                position: absolute;
                right: -15px;
                top: 50%;
                transform: translateY(-50%);
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: var(--beam-color);
                box-shadow: 0 0 8px var(--beam-color);
                opacity: 0.8;
                animation: indicatorBlink 1.5s ease-in-out infinite;
            }

            @keyframes laserPulse {
                0% { opacity: 0.4; transform: scaleX(0.95); }
                100% { opacity: 0.8; transform: scaleX(1.05); }
            }

            @keyframes indicatorBlink {
                0%, 50% { opacity: 0.3; }
                100% { opacity: 1; }
            }

            .sensor-activated {
                animation: sensorActivation 0.5s ease-out !important;
            }

            @keyframes sensorActivation {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); box-shadow: 0 0 20px var(--beam-color); }
                100% { transform: scale(1.05); }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    attachEventListeners() {
        // Interação com os sensores
        document.addEventListener('click', (e) => {
            const sensor = e.target.closest('.laser-sensor');
            if (sensor) {
                this.activateSensor(parseInt(sensor.dataset.sensor));
            }
        });

        // Ativação automática dos botões CTA
        const ctaButtons = document.querySelectorAll('.btn-primary, .btn-purchase');
        ctaButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.playRandomSensorSound();
            });
        });

        // Scroll animations
        this.setupScrollAnimations();

        // Mouseover effects nos cards de benefícios
        const benefitItems = document.querySelectorAll('.benefit-item');
        benefitItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                this.createLaserEffect(item);
            });
        });
    }

    activateSensor(sensorIndex) {
        if (!this.initialized) return;

        const sensor = document.querySelector(`[data-sensor="${sensorIndex}"]`);
        if (!sensor) return;

        // Efeito visual
        sensor.classList.add('sensor-activated');
        setTimeout(() => {
            sensor.classList.remove('sensor-activated');
        }, 500);

        // Efeito sonoro
        this.playSensorSound(sensorIndex);

        // Criar efeito de partículas laser
        this.createLaserParticles(sensor);

        console.log(`Sensor ${sensorIndex + 1} activated!`);
    }

    playSensorSound(sensorIndex) {
        if (!window.AudioContext && !window.webkitAudioContext) return;

        try {
            this.createAudioContext();
            
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const oscillator = this.audioContext.createOscillator();
            const envelope = this.audioContext.createGain();

            oscillator.connect(envelope);
            envelope.connect(this.gainNode);

            // Configurar o som do sensor
            oscillator.frequency.setValueAtTime(
                this.sensorConfig.notes[sensorIndex], 
                this.audioContext.currentTime
            );
            oscillator.type = 'sine';

            // Envelope de som (attack, decay)
            envelope.gain.setValueAtTime(0, this.audioContext.currentTime);
            envelope.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.01);
            envelope.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.5);

        } catch (error) {
            console.warn('Erro ao reproduzir som:', error);
        }
    }

    playRandomSensorSound() {
        const randomSensor = Math.floor(Math.random() * this.sensorConfig.count);
        this.playSensorSound(randomSensor);
    }

    createLaserParticles(sensor) {
        const particles = document.createElement('div');
        particles.className = 'laser-particles';
        particles.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 20;
        `;

        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: ${this.sensorConfig.colors[Math.floor(Math.random() * 5)]};
                border-radius: 50%;
                animation: particleExplosion 0.8s ease-out forwards;
                animation-delay: ${i * 0.1}s;
            `;
            particles.appendChild(particle);
        }

        sensor.appendChild(particles);

        // Remover partículas após animação
        setTimeout(() => {
            particles.remove();
        }, 1000);
    }

    createLaserEffect(element) {
        const laser = document.createElement('div');
        laser.className = 'laser-sweep';
        laser.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(123, 104, 238, 0.3), transparent);
            animation: laserSweep 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(laser);

        setTimeout(() => {
            laser.remove();
        }, 600);
    }

    setupScrollAnimations() {
        // Intersection Observer para animações de scroll
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observar elementos para animação
        const animateElements = document.querySelectorAll('.benefit-item, .spec-category, .application-card, .feature-card');
        animateElements.forEach(el => observer.observe(el));

        // Adicionar estilos de animação
        const animationStyles = `
            @keyframes particleExplosion {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px) scale(0);
                    opacity: 0;
                }
            }

            @keyframes laserSweep {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            .benefit-item, .spec-category, .application-card, .feature-card {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease-out;
            }

            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = animationStyles;
        document.head.appendChild(styleSheet);
    }

    startLaserAnimation() {
        // Animação contínua dos lasers
        setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance
                const randomSensor = Math.floor(Math.random() * this.sensorConfig.count);
                const sensorElement = document.querySelector(`[data-sensor="${randomSensor}"]`);
                if (sensorElement) {
                    const beam = sensorElement.querySelector('.sensor-beam');
                    if (beam) {
                        beam.style.animation = 'none';
                        setTimeout(() => {
                            beam.style.animation = 'laserPulse 2s ease-in-out infinite alternate';
                        }, 100);
                    }
                }
            }
        }, 3000);
    }

    // Método para demonstração das funcionalidades
    startDemo() {
        console.log('Iniciando demonstração dos sensores...');
        
        for (let i = 0; i < this.sensorConfig.count; i++) {
            setTimeout(() => {
                this.activateSensor(i);
            }, i * 800);
        }
    }
}

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que todos os elementos estejam renderizados
    setTimeout(() => {
        window.musicalBeam05 = new MusicalBeam05();
        
        // Demo automática após 3 segundos
        setTimeout(() => {
            if (window.musicalBeam05) {
                window.musicalBeam05.startDemo();
            }
        }, 3000);
    }, 500);
});

// Função global para controle externo
window.activateBeamSensor = (index) => {
    if (window.musicalBeam05 && index >= 0 && index < 5) {
        window.musicalBeam05.activateSensor(index);
    }
};

// Interações especiais com elementos da página
document.addEventListener('DOMContentLoaded', () => {
    // Efeito especial no título
    const productTitle = document.querySelector('.product-title');
    if (productTitle) {
        productTitle.addEventListener('click', () => {
            if (window.musicalBeam05) {
                window.musicalBeam05.startDemo();
            }
        });
        
        // Tornar clicável
        productTitle.style.cursor = 'pointer';
        productTitle.title = 'Clique para demonstração dos sensores';
    }

    // Efeitos sonoros nos highlights
    const highlights = document.querySelectorAll('.highlight-item');
    highlights.forEach((highlight, index) => {
        highlight.addEventListener('mouseenter', () => {
            if (window.musicalBeam05) {
                window.musicalBeam05.playSensorSound(index % 5);
            }
        });
    });
});