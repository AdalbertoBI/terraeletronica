// Navegação responsiva: drawer mobile + lista original para desktop
(() => {
  let initialized = false;
  let currentHeader = null;
  let currentDrawer = null;
  let cleanup = null;

  function setupNavigation(detail){
    const header = detail?.header || document.querySelector('header.header') || document.querySelector('header');
    const sourceList = detail?.header?.querySelector('.nav-menu') || header?.querySelector('.nav-menu') || document.querySelector('.nav-menu');
    const drawer = detail?.drawer || document.getElementById('navDrawer');

    if(initialized){
      if(header && drawer && (header !== currentHeader || drawer !== currentDrawer)){
        cleanup?.();
        cleanup = null;
        initialized = false;
      } else if(header === currentHeader && drawer === currentDrawer){
        return true;
      }
    }

    if(!header || !sourceList || !drawer) return false;

    cleanup?.();
    cleanup = null;

    const drawerPanel = drawer.querySelector('.nav-drawer-panel');
    const drawerList = drawer.querySelector('#navDrawerList');
    const closeBtn = drawer.querySelector('[data-nav-close]') || drawer.querySelector('.nav-drawer-close');
    if(!drawerPanel || !drawerList) return false;

    // Cria/usa botão hamburguer
    let toggleBtn = header.querySelector('.nav-toggle-btn') || document.querySelector('.nav-toggle-btn');
    if(!toggleBtn){
      toggleBtn = document.createElement('button');
      toggleBtn.className = 'nav-toggle-btn';
      toggleBtn.type = 'button';
      toggleBtn.setAttribute('aria-expanded','false');
      toggleBtn.setAttribute('aria-label','Abrir menu de navegação');
      toggleBtn.innerHTML = '<span></span><span></span><span></span>';
      (header.querySelector('.container') || header).prepend(toggleBtn);
    }
    toggleBtn.setAttribute('aria-controls', drawer.id || 'navDrawer');

    function populateDrawer(){
      drawerList.innerHTML = '';
      const links = sourceList.querySelectorAll('a');
      links.forEach((link, idx) => {
        const li = document.createElement('li');
        const clone = link.cloneNode(true);
        clone.style.animationDelay = (0.05 * (idx+1)) + 's';
        li.appendChild(clone);
        drawerList.appendChild(li);
      });
      drawerList.dataset.populated = 'true';
      // Destacar link ativo (comparando path simples)
      const currentPath = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
      drawerList.querySelectorAll('a[href]')
        .forEach(a => {
          const href = a.getAttribute('href');
          if(!href || href.startsWith('#')) return;
          const cleanHref = href.split('#')[0].split('?')[0].split('/').pop().toLowerCase();
          if(cleanHref === currentPath) a.classList.add('active');
        });
    }
    populateDrawer();

    drawer.setAttribute('aria-hidden','true');
    drawer.setAttribute('role','dialog');
    drawer.setAttribute('aria-modal','true');
    drawerPanel.setAttribute('role','document');

    let isOpen = false;
    let lastFocused = null;

    function openDrawer(){
      if(isOpen) return;
      lastFocused = document.activeElement;
      drawer.setAttribute('aria-hidden','false');
      toggleBtn.setAttribute('aria-expanded','true');
      toggleBtn.setAttribute('aria-label','Fechar menu de navegação');
      document.documentElement.classList.add('nav-lock');
      document.body.classList.add('nav-lock');
      isOpen = true;
      const firstLink = drawerList.querySelector('a');
      firstLink?.focus({preventScroll:true});
      trapFocus();
    }

    function closeDrawer(){
      if(!isOpen) return;
      drawer.setAttribute('aria-hidden','true');
      toggleBtn.setAttribute('aria-expanded','false');
      toggleBtn.setAttribute('aria-label','Abrir menu de navegação');
      document.documentElement.classList.remove('nav-lock');
      document.body.classList.remove('nav-lock');
      isOpen = false;
      releaseFocus();
      if(lastFocused?.focus){ lastFocused.focus({preventScroll:true}); } else { toggleBtn.focus({preventScroll:true}); }
    }

    function trapFocus(){
      const focusable = drawer.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      if(!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      function handle(e){
        if(!isOpen) return;
        if(e.key === 'Tab'){
          if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
          else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
        } else if(e.key === 'Escape'){
          closeDrawer();
        }
      }
      document.addEventListener('keydown', handle);
      drawer._focusHandler = handle;
    }
    function releaseFocus(){
      if(drawer._focusHandler){ document.removeEventListener('keydown', drawer._focusHandler); delete drawer._focusHandler; }
    }

    const handleToggle = () => { isOpen ? closeDrawer() : openDrawer(); };
    const handleCloseClick = () => closeDrawer();
    const handleBackdrop = (e) => { if(e.target === drawer) closeDrawer(); };
    const handleListClick = (e) => {
      const targetLink = e.target.closest('a');
      if(targetLink){
        closeDrawer();
      }
    };
    const handleResize = () => { if(window.innerWidth > 768 && isOpen){ closeDrawer(); } };

    toggleBtn.addEventListener('click', handleToggle);
    closeBtn?.addEventListener('click', handleCloseClick);
    drawer.addEventListener('click', handleBackdrop);
    drawerList.addEventListener('click', handleListClick);
    window.addEventListener('resize', handleResize);

    cleanup = () => {
      toggleBtn.removeEventListener('click', handleToggle);
      closeBtn?.removeEventListener('click', handleCloseClick);
      drawer.removeEventListener('click', handleBackdrop);
      drawerList.removeEventListener('click', handleListClick);
      window.removeEventListener('resize', handleResize);
      releaseFocus();
      document.documentElement.classList.remove('nav-lock');
      document.body.classList.remove('nav-lock');
      isOpen = false;
      lastFocused = null;
    };

    currentHeader = header;
    currentDrawer = drawer;
    initialized = true;
    return true;
  }

  function handleNavReady(event){
    setupNavigation(event?.detail);
  }

  function handleDomReady(){
    setupNavigation();
  }

  document.addEventListener('terra-nav-ready', handleNavReady);

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', handleDomReady, { once: true });
  } else {
    handleDomReady();
  }
})();
