/**
 * PARTITURAS INTERATIVAS - JavaScript
 * Versão sem dependência da YouTube Data API. Os vídeos são fornecidos
 * manualmente para garantir estabilidade e simplicidade na integração.
 */

const PARTITURAS_PLAYLIST_URL = 'https://www.youtube.com/playlist?list=PLsguanbRtJ5Wn2jF-ItiZtOnq-ii6MeV5';

const PARTITURAS_STATIC_VIDEOS = [
    {
        id: '7Z0g7lIc6Z4',
        title: 'Vídeo de Partitura Interativa',
        description: 'Partitura interativa para utilizar com instrumentos MIDI-TA em terapias e atividades musicais.',
        thumbnail: 'https://img.youtube.com/vi/7Z0g7lIc6Z4/hqdefault.jpg'
    },
    {
        id: 'ufO4YT_J7XU',
        title: 'French Valse (Emilio Huerta) - XYLOPHONE PLAY ALONG',
        description: 'Acompanhe a valsa francesa de Emilio Huerta no xilofone e trabalhe musicalidade suave.',
        thumbnail: 'https://img.youtube.com/vi/ufO4YT_J7XU/hqdefault.jpg'
    },
    {
        id: 'NguVbelt1L4',
        title: 'Sailor, Sailor (with metronome) - XYLOPHONE PLAY ALONG',
        description: 'Exercite a pulsação constante com metrônomo e desenvolva coordenação motora fina.',
        thumbnail: 'https://img.youtube.com/vi/NguVbelt1L4/hqdefault.jpg'
    },
    {
        id: '8MDb8kkCgAs',
        title: 'Al jardí (canção folclórica catalã) - XYLOPHONE PLAY ALONG',
        description: 'Canção tradicional catalã adaptada para xilofone, ideal para atividades coletivas.',
        thumbnail: 'https://img.youtube.com/vi/8MDb8kkCgAs/hqdefault.jpg'
    },
    {
        id: 'fNlG61L--A4',
        title: 'Guateque (Emilio Huerta) - XYLOPHONE PLAY ALONG',
        description: 'Tema vibrante de Emilio Huerta para praticar dinâmicas e articulação marcante.',
        thumbnail: 'https://img.youtube.com/vi/fNlG61L--A4/hqdefault.jpg'
    },
    {
        id: '_TTZrx_b3Yg',
        title: 'Let Us Chase The Squirrel - XYLOPHONE PLAY ALONG',
        description: 'Canção infantil animada que estimula sequências rápidas e brincadeiras musicais.',
        thumbnail: 'https://img.youtube.com/vi/_TTZrx_b3Yg/hqdefault.jpg'
    },
    {
        id: 'pem6lxtbG1Q',
        title: 'Snail, Snail - XYLOPHONE PLAY ALONG (Easy)',
        description: 'Versão fácil com andamento lento, perfeita para iniciar atividades inclusivas.',
        thumbnail: 'https://img.youtube.com/vi/pem6lxtbG1Q/hqdefault.jpg'
    },
    {
        id: '6RlvC7XODkU',
        title: 'World Travellers (Original) - XYLOPHONE PLAY ALONG',
        description: 'Composição original para explorar mudanças de registro e criatividade musical.',
        thumbnail: 'https://img.youtube.com/vi/6RlvC7XODkU/hqdefault.jpg'
    },
    {
        id: 'icmunhUY9Wo',
        title: 'Warm Up (Arpeggios) - XYLOPHONE PLAY ALONG',
        description: 'Sequência de arpejos ideal para aquecimento e coordenação bilateral.',
        thumbnail: 'https://img.youtube.com/vi/icmunhUY9Wo/hqdefault.jpg'
    },
    {
        id: 'fJjhRUtBckY',
        title: 'Warm Up (C Major scale) - XYLOPHONE PLAY ALONG',
        description: 'Escala de dó maior para treinar movimento contínuo e precisão.',
        thumbnail: 'https://img.youtube.com/vi/fJjhRUtBckY/hqdefault.jpg'
    },
    {
        id: 'r67xYB0ckNQ',
        title: 'When The Saints Go Marching In (Louis Armstrong) - XYLOPHONE PLAY ALONG (Easy)',
        description: 'Clássico de Louis Armstrong em versão acessível para praticar melodias familiares.',
        thumbnail: 'https://img.youtube.com/vi/r67xYB0ckNQ/hqdefault.jpg'
    },
    {
        id: '3lcwVjlwd_Q',
        title: 'Big Band (Emilio Huerta) - XYLOPHONE PLAY ALONG',
        description: 'Arranjo estilo big band que incentiva articulação marcada e energia musical.',
        thumbnail: 'https://img.youtube.com/vi/3lcwVjlwd_Q/hqdefault.jpg'
    },
    {
        id: 'Kc7l3i3INPs',
        title: 'Sopa de caracol (Calipso) - DUET XYLOPHONE PLAY ALONG',
        description: 'Calipso divertido em formato duo para incentivar interação entre participantes.',
        thumbnail: 'https://img.youtube.com/vi/Kc7l3i3INPs/hqdefault.jpg'
    },
    {
        id: 'ksjTFEsMX9w',
        title: 'Qué será, será / Whatever will be will be (Doris Day) - XYLOPHONE PLAY ALONG',
        description: 'Clássico nostálgico que favorece relaxamento e trabalho de memória musical.',
        thumbnail: 'https://img.youtube.com/vi/ksjTFEsMX9w/hqdefault.jpg'
    },
    {
        id: 'kMbNA6p0VJ8',
        title: 'Ritmo sabroso (Emilio Huerta) - XYLOPHONE PLAY ALONG',
        description: 'Ritmo latino envolvente perfeito para explorar dinâmicas de percussão.',
        thumbnail: 'https://img.youtube.com/vi/kMbNA6p0VJ8/hqdefault.jpg'
    },
    {
        id: 'mNVibc4eAsI',
        title: 'Little Elephants - XYLOPHONE PLAY ALONG (Easy)',
        description: 'Peça leve para contar histórias musicais e estimular a imaginação.',
        thumbnail: 'https://img.youtube.com/vi/mNVibc4eAsI/hqdefault.jpg'
    },
    {
        id: 'MYf22KheEiU',
        title: 'A saltar i ballar (Canção Folclórica Catalã) - XYLOPHONE PLAY ALONG',
        description: 'Canção catalã alegre que incentiva movimento corporal e musicalidade.',
        thumbnail: 'https://img.youtube.com/vi/MYf22KheEiU/hqdefault.jpg'
    }
];

class PartiturasInterativas {
    constructor() {
        this.playlistUrl = PARTITURAS_PLAYLIST_URL;
        this.allVideos = [];

        this.loadingIndicator = document.getElementById('loading-indicator');
        this.errorMessage = document.getElementById('error-message');
        this.videosGrid = document.getElementById('videos-grid');

        this.modal = document.getElementById('video-modal');
        this.modalPlayerContainer = document.getElementById('video-player-container');
        this.modalTitle = document.getElementById('video-modal-title');
        this.modalDescription = document.getElementById('video-modal-description');

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadPlaylistVideos();
    }

    bindEvents() {
        if (this.videosGrid) {
            this.videosGrid.addEventListener('click', (event) => {
                const card = event.target.closest('.video-card');
                if (!card) return;
                event.preventDefault();
                const videoId = card.dataset.videoId;
                const video = this.allVideos.find((item) => item.id === videoId);
                if (video) {
                    this.openVideoModal(video);
                }
            });
        }

        document.querySelectorAll('[data-modal-close]').forEach((button) => {
            button.addEventListener('click', () => this.closeVideoModal());
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.modal && !this.modal.classList.contains('hidden')) {
                this.closeVideoModal();
            }
        });

        if (this.modal) {
            this.modal.addEventListener('click', (event) => {
                if (event.target === this.modal) {
                    this.closeVideoModal();
                }
            });
        }
    }

    async loadPlaylistVideos() {
        if (!this.videosGrid) {
            return;
        }

        this.toggleLoading(true);

        this.videosGrid.innerHTML = '';

        if (this.errorMessage) {
            this.errorMessage.classList.add('hidden');
        }

        try {
            const videos = this.getConfiguredVideos();

            if (!videos.length) {
                throw new Error('Nenhum vídeo configurado.');
            }

            this.allVideos = videos;
            this.renderVideos(videos);
        } catch (error) {
            console.error('Erro ao carregar playlist estática:', error);
            if (this.errorMessage) {
                this.errorMessage.classList.remove('hidden');
            }
            this.showFallbackContent();
        } finally {
            this.toggleLoading(false);
        }
    }

    getConfiguredVideos() {
        const configured = window.PARTITURAS_CONFIG?.videos;
        const source = Array.isArray(configured) && configured.length ? configured : PARTITURAS_STATIC_VIDEOS;

        return source
            .map((video, index) => this.normalizeVideo(video, index))
            .filter((video) => Boolean(video));
    }

    extractVideoId(input = '') {
        if (typeof input !== 'string') {
            return '';
        }

        const trimmed = input.trim();
        if (!trimmed) {
            return '';
        }

        try {
            const parsedUrl = new URL(trimmed, 'https://www.youtube.com');
            if (parsedUrl.hostname === 'youtu.be' && parsedUrl.pathname.length > 1) {
                return parsedUrl.pathname.slice(1);
            }

            const searchId = parsedUrl.searchParams.get('v');
            if (searchId) {
                return searchId;
            }
        } catch (error) {
            // Ignora erro de parsing e tenta fallback via regex.
        }

        const match = trimmed.match(/[A-Za-z0-9_-]{11}/);
        return match ? match[0] : '';
    }

    normalizeVideo(video = {}, index = 0) {
        let id = typeof video.id === 'string' ? video.id.trim() : '';

        if (!id) {
            id = this.extractVideoId(video.url);
        }
        if (!id) {
            console.warn(`Vídeo na posição ${index + 1} ignorado por falta de ID.`);
            return null;
        }

        const title = (video.title || `Vídeo ${index + 1}`).trim();
        const description = (video.description || 'Conteúdo disponível em nossa playlist no YouTube.').trim();
        const thumbnail = video.thumbnail || `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
        const publishedAt = typeof video.publishedAt === 'string' ? video.publishedAt : '';
        const duration = typeof video.duration === 'string' ? video.duration.trim() : '';

        const rawUrl = typeof video.url === 'string' ? video.url.trim() : '';
        const url = rawUrl || `https://www.youtube.com/watch?v=${id}`;

        return {
            id,
            title,
            description,
            thumbnail,
            publishedAt,
            duration,
            url
        };
    }

    renderVideos(videos = []) {
        this.videosGrid.innerHTML = '';

        videos.forEach((video) => {
            const videoCard = this.createVideoCard(video);
            this.videosGrid.appendChild(videoCard);
        });
    }

    createVideoCard(video) {
        const card = document.createElement('article');
        card.className = 'video-card';
        card.dataset.videoId = video.id;
        card.dataset.videoUrl = video.url;

        const publishDate = this.formatPublishDate(video.publishedAt);
        const metaItems = [];
        if (publishDate) {
            metaItems.push(`<span class="video-date">${publishDate}</span>`);
        }
        if (video.duration) {
            metaItems.push(`<span class="video-duration">${video.duration}</span>`);
        }
        const metaHtml = metaItems.length
            ? `<div class="video-meta">${metaItems.join('')}</div>`
            : '';

        card.innerHTML = `
            <div class="video-thumbnail" aria-hidden="true">
                <img src="${video.thumbnail}" alt="Pré-visualização de ${video.title}" loading="lazy">
                <div class="video-youtube-badge">
                    <i class="fab fa-youtube" aria-hidden="true"></i>
                    <span>YouTube</span>
                </div>
                <button class="video-play-button" type="button" aria-label="Reproduzir ${video.title}">
                    <i class="fas fa-play" aria-hidden="true"></i>
                </button>
            </div>
            <div class="video-content">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-description">${video.description}</p>
                ${metaHtml}
            </div>
        `;

        return card;
    }

    openVideoModal(video) {
        if (!this.modal) return;

        if (this.modalTitle) {
            this.modalTitle.textContent = video.title;
        }

        if (this.modalDescription) {
            this.modalDescription.textContent = video.description;
        }

        // Carregar vídeo com método padrão
        if (this.modalPlayerContainer) {
            const embedUrl = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
            
            this.modalPlayerContainer.innerHTML = `
                <div class="video-embed">
                    <iframe src="${embedUrl}" title="${video.title}" frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen loading="lazy"></iframe>
                </div>
            `;
        }

        this.modal.classList.remove('hidden');
        document.body.classList.add('video-modal-open');

        const closeBtn = this.modal.querySelector('.video-modal-close');
        if (closeBtn) {
            closeBtn.focus({ preventScroll: true });
        }

        this.trackVideoClick(video.id, video.title);
    }

    closeVideoModal() {
        if (!this.modal) return;

        this.modal.classList.add('hidden');
        document.body.classList.remove('video-modal-open');
        if (this.modalPlayerContainer) {
            this.modalPlayerContainer.innerHTML = '';
        }
    }

    trackVideoClick(videoId, videoTitle) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'video_modal_open', {
                video_id: videoId,
                video_title: videoTitle,
                page_title: 'Partituras Interativas'
            });
        }
    }

    showFallbackContent() {
        if (!this.videosGrid) return;

        this.videosGrid.innerHTML = `
            <div class="fallback-content">
                <div class="fallback-card">
                    <div class="fallback-icon">
                        <i class="fab fa-youtube"></i>
                    </div>
                    <h3>Acesse nossa Playlist</h3>
                    <p>Visualize todos os vídeos de partituras interativas diretamente no YouTube.</p>
                    <a href="${this.playlistUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                        <i class="fab fa-youtube"></i> Ver no YouTube
                    </a>
                </div>
            </div>
        `;
    }

    formatPublishDate(dateString = '') {
        const trimmed = dateString.trim();
        if (!trimmed) {
            return '';
        }

        const parsed = new Date(trimmed);
        if (Number.isNaN(parsed.getTime())) {
            return trimmed;
        }

        return parsed.toLocaleDateString('pt-BR');
    }

    toggleLoading(isLoading) {
        if (!this.loadingIndicator) {
            return;
        }

        if (isLoading) {
            this.loadingIndicator.classList.remove('hidden');
        } else {
            this.loadingIndicator.classList.add('hidden');
        }
    }
}

// Garantir que seja executado antes de outros scripts
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PartiturasInterativas();
    });
} else {
    new PartiturasInterativas();
}

document.addEventListener('click', (event) => {
    if (event.target.matches('a[href^="#"]')) {
        const targetId = event.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            event.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '0px 0px 200px 0px'
    });

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('img[data-src]').forEach((img) => imageObserver.observe(img));
    });
}