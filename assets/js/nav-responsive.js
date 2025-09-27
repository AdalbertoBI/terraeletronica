// Navegação responsiva: drawer mobile + lista original para desktop
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const sourceList = document.querySelector('.nav-menu'); // lista desktop (ocultada no mobile via CSS)
  const drawer = document.getElementById('navDrawer');
  if(!header || !sourceList || !drawer) return;
  const drawerPanel = drawer.querySelector('.nav-drawer-panel');
  const drawerList = drawer.querySelector('#navDrawerList');
  const closeBtn = drawer.querySelector('[data-nav-close]') || drawer.querySelector('.nav-drawer-close');
  if(!drawerPanel || !drawerList) return;

  // Cria/usa botão hamburguer
  let toggleBtn = document.querySelector('.nav-toggle-btn');
  if(!toggleBtn){
    toggleBtn = document.createElement('button');
    toggleBtn.className = 'nav-toggle-btn';
    toggleBtn.type = 'button';
    toggleBtn.setAttribute('aria-expanded','false');
    toggleBtn.setAttribute('aria-label','Abrir menu de navegação');
    toggleBtn.innerHTML = '<span></span><span></span><span></span>';
    (header.querySelector('.container') || header).prepend(toggleBtn);
  }

  function populateDrawer(){
    if(drawerList.dataset.populated === 'true') return;
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

  toggleBtn.addEventListener('click', () => { isOpen ? closeDrawer() : openDrawer(); });
  closeBtn?.addEventListener('click', closeDrawer);
  drawer.addEventListener('click', (e) => { if(e.target === drawer) closeDrawer(); });

  window.addEventListener('resize', () => { if(window.innerWidth > 768 && isOpen){ closeDrawer(); } });
});
