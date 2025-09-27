/* ===== MENU MOBILE RESPONSIVO - JAVASCRIPT SIMPLES ===== */

class SimpleMobileMenu {
    constructor() {
        console.log('SimpleMobileMenu: Inicializando...');
        this.init();
    }

    init() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu-mobile');
        
        console.log('SimpleMobileMenu: navToggle =', this.navToggle);
        console.log('SimpleMobileMenu: navMenu =', this.navMenu);
        
        if (this.navToggle && this.navMenu) {
            console.log('SimpleMobileMenu: Elementos encontrados, configurando eventos...');
            this.bindEvents();
        } else {
            console.error('SimpleMobileMenu: Elementos não encontrados!');
        }
    }

    bindEvents() {
        // Toggle menu
        this.navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });

        // Fechar ao clicar em um link
        const mobileLinks = this.navMenu.querySelectorAll('.nav-link-mobile');
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

        // Fechar ao clicar fora (opcional)
        document.addEventListener('click', (e) => {
            if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        const isActive = this.navToggle.classList.contains('active');
        console.log('SimpleMobileMenu: toggleMenu(), isActive =', isActive);
        
        if (isActive) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        console.log('SimpleMobileMenu: Abrindo menu...');
        this.navToggle.classList.add('active');
        this.navMenu.classList.add('active');
        console.log('SimpleMobileMenu: Classes adicionadas');
    }

    closeMenu() {
        console.log('SimpleMobileMenu: Fechando menu...');
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new SimpleMobileMenu();
});