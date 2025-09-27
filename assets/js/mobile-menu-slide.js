/* ===== MENU MOBILE SLIDE-IN - JAVASCRIPT ===== */

class MobileMenuSlide {
    constructor() {
        this.init();
    }

    init() {
        // Elementos
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu-mobile');
        this.overlay = document.querySelector('.menu-overlay');
        this.body = document.body;

        // Bind events
        this.bindEvents();
    }

    bindEvents() {
        // Toggle menu
        if (this.navToggle) {
            this.navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMenu();
            });
        }

        // Fechar ao clicar no overlay
        if (this.overlay) {
            this.overlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }

        // Fechar ao clicar em um link
        const mobileLinks = document.querySelectorAll('.nav-link-mobile');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Fechar com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });

        // Fechar ao redimensionar para desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const isActive = this.navToggle.classList.contains('active');
        
        if (isActive) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.navToggle.classList.add('active');
        this.navMenu.classList.add('active');
        this.overlay.classList.add('active');
        this.body.classList.add('menu-open');

        // Focus no menu para acessibilidade
        this.navMenu.focus();
    }

    closeMenu() {
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        this.overlay.classList.remove('active');
        this.body.classList.remove('menu-open');
    }

    // Método público para integração
    static getInstance() {
        if (!window.mobileMenuSlide) {
            window.mobileMenuSlide = new MobileMenuSlide();
        }
        return window.mobileMenuSlide;
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    MobileMenuSlide.getInstance();
});

// Fallback para casos onde DOMContentLoaded já passou
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        MobileMenuSlide.getInstance();
    });
} else {
    MobileMenuSlide.getInstance();
}