// Script legacy do menu mobile substituído por nav-responsive.js.
// Mantido vazio para evitar erros em páginas que ainda referenciem este arquivo.

// Estilos de suporte injetados (para reduzir dependência de inline !important)
(function injectSupportStyles(){
    if(document.getElementById('mobile-menu-support-css')) return;
    const css = `
    .no-scroll-mobile { overflow: hidden; }
    #mobile-menu-layer { position: relative; z-index: 2147483646; }
    .mobile-menu-simple { box-shadow: 0 8px 24px rgba(0,0,0,.25); border: 0; border-bottom: 4px solid var(--primary-color, #2c5aa0); }
    .mobile-menu-simple.show { animation: mobileMenuFade .25s ease; }
    .mobile-menu-close { position:absolute; top:8px; right:12px; background:none; border:0; font-size:2rem; line-height:1; cursor:pointer; color:#333; }
    @media (max-width:768px){ .mobile-menu-simple { display:none !important; background:#fff!important; } .mobile-menu-simple.show { display:block !important; } }
    @keyframes mobileMenuFade { from { opacity:0; transform:translateY(-8px);} to {opacity:1; transform:translateY(0);} }`;
    const style = document.createElement('style');
    style.id = 'mobile-menu-support-css';
    style.textContent = css;
    document.head.appendChild(style);
})();