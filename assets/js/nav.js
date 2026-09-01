(() => {
  const scriptEl = document.currentScript;
  if (!scriptEl) {
    return;
  }

  const resolveUrl = () => {
    try {
      const attrSrc = scriptEl.getAttribute('src');
      if (attrSrc) {
        return new URL(attrSrc, window.location.href);
      }
    } catch (error) {
      console.warn('[terra-nav] Falha ao resolver URL pelo atributo src.', error);
    }
    try {
      if (scriptEl.src) {
        return new URL(scriptEl.src, window.location.href);
      }
    } catch (error) {
      console.warn('[terra-nav] Falha ao resolver URL pela propriedade src.', error);
    }
    return new URL(window.location.href);
  };

  const scriptUrl = resolveUrl();
  const assetsRootUrl = new URL('../', scriptUrl);
  const siteRootUrl = new URL('../', assetsRootUrl);
  const siteRootPath = (siteRootUrl.pathname.endsWith('/') ? siteRootUrl.pathname : `${siteRootUrl.pathname}/`).replace(/\\/g, '/');
  const templateUrl = new URL('templates/nav.html', assetsRootUrl).href;
  const footerScriptUrl = new URL('footer.js', scriptUrl).href;

  const ensureFooterLoader = () => {
    if (document.querySelector('script[data-terra-footer-loader]')) {
      return;
    }
    const loader = document.createElement('script');
    loader.src = footerScriptUrl;
    loader.defer = true;
    loader.dataset.terraFooterLoader = 'true';
    document.head.appendChild(loader);
  };

  const computeBasePath = () => {
    const currentPath = window.location.pathname.replace(/\\/g, '/');
    if (!currentPath.startsWith(siteRootPath)) {
      return '';
    }
    const subPath = currentPath.slice(siteRootPath.length);
    if (!subPath) {
      return '';
    }
    const parts = subPath.split('/').filter(Boolean);
    if (!parts.length) {
      return '';
    }
    const last = parts[parts.length - 1];
    const isFile = /\.[a-z0-9]+$/i.test(last);
    const depth = isFile ? parts.length - 1 : parts.length;
    return depth > 0 ? '../'.repeat(depth) : '';
  };

  const basePath = computeBasePath();

  let headerResizeObserver = null;
  let headerResizeHandler = null;

  const setHeaderOffset = (headerEl) => {
    if (!headerEl) {
      return;
    }
    const height = Math.round(headerEl.getBoundingClientRect().height);
    if (height > 0) {
      document.documentElement.style.setProperty('--header-offset', `${height}px`);
    }
  };

  const observeHeaderOffset = (headerEl) => {
    if (!headerEl) {
      return;
    }

    setHeaderOffset(headerEl);

    if (typeof ResizeObserver !== 'undefined') {
      if (headerResizeObserver) {
        headerResizeObserver.disconnect();
      }

      headerResizeObserver = new ResizeObserver(() => {
        setHeaderOffset(headerEl);
      });

      headerResizeObserver.observe(headerEl);
    } else {
      if (headerResizeHandler) {
        window.removeEventListener('resize', headerResizeHandler);
      }

      headerResizeHandler = () => {
        setHeaderOffset(headerEl);
      };

      window.addEventListener('resize', headerResizeHandler, { passive: true });
    }
  };

  const NAV_TEMPLATE_FALLBACK = `
<div data-nav-template>
  <nav class="navbar" aria-label="Main Navigation">
    <div class="container">
  <button class="nav-toggle-btn" type="button" aria-expanded="false" aria-label="Abrir menu de navegação" aria-controls="navDrawer">
        <span></span><span></span><span></span>
      </button>
      <div class="nav-brand">
        <a href="{{BASE}}index.html" aria-label="Voltar para a página inicial">
          <picture>
            <source type="image/webp" srcset="{{BASE}}assets/images/logos/terra-horizontal.webp" media="(min-width:900px)">
            <source type="image/webp" srcset="{{BASE}}assets/images/logos/terra-compact.webp" media="(max-width:899px)">
            <source srcset="{{BASE}}assets/images/logos/terra-horizontal.png" media="(min-width:900px)">
            <source srcset="{{BASE}}assets/images/logos/terra-compact.png" media="(max-width:899px)">
            <img src="{{BASE}}assets/images/logos/terra-horizontal.png" alt="Terra Eletrônica" class="logo" loading="lazy">
          </picture>
        </a>
        <h1 class="sr-only">Terra Eletrônica</h1>
      </div>
      <ul class="nav-menu" id="main-nav">
        <li>
          <a href="{{BASE}}index.html#home" class="nav-link" data-nav-id="home">
            <i class="fas fa-home" aria-hidden="true"></i>
            <span>Página Inicial</span>
          </a>
        </li>
        <li><a href="{{BASE}}produtos/instrumentos-midi.html" class="nav-link" data-nav-id="instrumentos-midi">Instrumentos MIDI</a></li>
  <li><a href="https://www.vibrosensory.com.br/" class="nav-link" data-nav-id="sensory-musical" target="_blank" rel="noopener">Vibro Sensory Music</a></li>
        <li><a href="{{BASE}}produtos/tecnologia-assistiva.html" class="nav-link" data-nav-id="tecnologia-assistiva">Tecnologia Assistiva</a></li>
        <li><a href="{{BASE}}partituras-interativas.html" class="nav-link" data-nav-id="partituras-interativas">Partituras Interativas</a></li>
        <li><a href="{{BASE}}downloads.html" class="nav-link" data-nav-id="downloads">Downloads</a></li>
        <li><a href="{{BASE}}manuais.html" class="nav-link" data-nav-id="manuais">Manuais</a></li>
        <li><a href="{{BASE}}index.html#sobre" class="nav-link" data-nav-id="sobre">Sobre</a></li>
        <li><a href="{{BASE}}index.html#contato" class="nav-link" data-nav-id="contato">Contato</a></li>
      </ul>
    </div>
  </nav>

  <div class="nav-drawer" id="navDrawer" aria-hidden="true" aria-label="Menu Mobile">
    <nav class="nav-drawer-panel" aria-label="Links principais">
      <button class="nav-drawer-close" type="button" aria-label="Fechar menu" data-nav-close>&times;</button>
      <ul class="nav-drawer-list" id="navDrawerList"></ul>
    </nav>
  </div>
</div>`;

  const fetchTemplate = async () => {
    if (!window.fetch) {
      return NAV_TEMPLATE_FALLBACK;
    }
    try {
      const response = await fetch(templateUrl, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.warn('[terra-nav] Falha ao carregar template externo, usando fallback embutido.', error);
      return NAV_TEMPLATE_FALLBACK;
    }
  };

  const normalizePath = (path) => {
    if (!path) {
      return '';
    }
    let normalized = path.replace(/\\/g, '/');
    if (normalized.startsWith(siteRootPath)) {
      normalized = normalized.slice(siteRootPath.length);
    }
    normalized = normalized.replace(/index\.html$/i, '');
    normalized = normalized.replace(/\/+/g, '/');
    normalized = normalized.replace(/^\//, '');
    normalized = normalized.replace(/\/$/, '');
    return normalized;
  };

  const setActiveLink = (headerEl, id) => {
    if (!id) {
      return false;
    }
    const target = headerEl.querySelector(`.nav-link[data-nav-id="${id}"]`);
    if (!target) {
      return false;
    }
    target.classList.add('active');
    target.setAttribute('aria-current', 'page');
    return true;
  };

  const highlightActive = (headerEl) => {
    const links = Array.from(headerEl.querySelectorAll('.nav-link'));
    if (!links.length) {
      return;
    }

    links.forEach((link) => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    });

    const manualId = document.body?.dataset.navActive || document.documentElement?.dataset.navActive;
    if (setActiveLink(headerEl, manualId)) {
      return;
    }

    const currentNormalized = normalizePath(window.location.pathname);
    let chosen = null;

    for (const link of links) {
      const href = link.getAttribute('href');
      if (!href) {
        continue;
      }
      const url = new URL(href, window.location.href);
      const linkNormalized = normalizePath(url.pathname);

      if (linkNormalized === currentNormalized) {
        if (!url.hash || url.hash === window.location.hash || (!window.location.hash && link.dataset.navId === 'home')) {
          chosen = link;
          break;
        }
      }
    }

    if (!chosen) {
      const fallbackRules = [
        { id: 'instrumentos-midi', match: (path) => path.startsWith('produtos/instrumentos') || path.includes('instrumentos-midi') },
        { id: 'sensory-musical', match: (path) => path.includes('sensory-musical') },
        { id: 'tecnologia-assistiva', match: (path) => path.includes('tecnologia-assistiva') },
        { id: 'tecnologia-assistiva', match: (path) => /(big-ball-mouse|roller-mouse|lupa-bolinha|biblia-eletronica)/.test(path) }
      ];
      const rule = fallbackRules.find((item) => item.match(currentNormalized));
      if (rule) {
        chosen = headerEl.querySelector(`.nav-link[data-nav-id="${rule.id}"]`);
      }
    }

    if (!chosen && currentNormalized === '') {
      chosen = headerEl.querySelector('.nav-link[data-nav-id="home"]');
    }

    if (chosen) {
      chosen.classList.add('active');
      chosen.setAttribute('aria-current', 'page');
    }
  };

  const enableSmoothAnchors = (root) => {
    root.addEventListener('click', (event) => {
      const anchor = event.target.closest('a.nav-link');
      if (!anchor) {
        return;
      }
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }
      const url = new URL(href, window.location.href);
      if (!url.hash) {
        return;
      }
      const samePath = normalizePath(url.pathname) === normalizePath(window.location.pathname);
      if (!samePath) {
        return;
      }
      const targetId = url.hash.slice(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) {
        return;
      }
      event.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, document.title, `#${targetId}`);
    });
  };

  const initializeNav = async () => {
    const headerEl = document.querySelector('header.header');
    if (!headerEl) {
      return;
    }

    const templateMarkup = (await fetchTemplate()).replace(/\{\{BASE\}\}/g, basePath);
    const template = document.createElement('template');
    template.innerHTML = templateMarkup.trim();
    const wrapper = template.content.querySelector('[data-nav-template]');
    if (!wrapper) {
      return;
    }

    const navEl = wrapper.querySelector('nav.navbar');
    const drawerEl = wrapper.querySelector('.nav-drawer');

    const existingDrawer = document.getElementById('navDrawer');
    if (existingDrawer) {
      existingDrawer.remove();
    }

    if (navEl) {
      headerEl.innerHTML = '';
      headerEl.appendChild(navEl);
    }

    if (drawerEl) {
      headerEl.insertAdjacentElement('afterend', drawerEl);
    }

    enableSmoothAnchors(document);
    highlightActive(headerEl);
    observeHeaderOffset(headerEl);
    ensureFooterLoader();

    document.dispatchEvent(new CustomEvent('terra-nav-ready', {
      detail: {
        header: headerEl,
        drawer: drawerEl,
        templateUrl,
        basePath
      }
    }));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNav, { once: true });
  } else {
    initializeNav();
  }
})();
