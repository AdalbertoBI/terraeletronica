/* ===== MENU MOBILE DEBUG - ULTRA SIMPLES ===== */

console.log('Script de debug carregando...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, procurando elementos...');
    
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu-mobile');
    
    console.log('navToggle:', navToggle);
    console.log('navMenu:', navMenu);
    
    if (navToggle && navMenu) {
        console.log('Elementos encontrados! Configurando click...');
        
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botão clicado!');
            
            const isActive = navMenu.classList.contains('active');
            console.log('Menu está ativo?', isActive);
            
            if (isActive) {
                navMenu.classList.remove('active');
                console.log('Menu fechado');
                console.log('Classes após fechar:', navMenu.classList.toString());
            } else {
                navMenu.classList.add('active');
                console.log('Menu aberto');
                console.log('Classes após abrir:', navMenu.classList.toString());
                console.log('Elemento do menu:', navMenu);
                console.log('Estilo computado display:', getComputedStyle(navMenu).display);
                console.log('Estilo computado background:', getComputedStyle(navMenu).background);
            }
        });
        
        console.log('Event listener configurado!');
    } else {
        console.error('ERRO: Elementos não encontrados!');
        console.log('Elementos disponíveis:');
        console.log('Todos os .nav-toggle:', document.querySelectorAll('.nav-toggle'));
        console.log('Todos os .nav-menu-mobile:', document.querySelectorAll('.nav-menu-mobile'));
    }
});