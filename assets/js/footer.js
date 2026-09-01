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
      console.warn('[terra-footer] Não foi possível resolver a URL via atributo src.', error);
    }
    try {
      if (scriptEl.src) {
        return new URL(scriptEl.src, window.location.href);
      }
    } catch (error) {
      console.warn('[terra-footer] Não foi possível resolver a URL via propriedade src.', error);
    }
    return new URL(window.location.href);
  };

  const scriptUrl = resolveUrl();
  const assetsRootUrl = new URL('../', scriptUrl);
  const siteRootUrl = new URL('../', assetsRootUrl);
  const siteRootPath = (siteRootUrl.pathname.endsWith('/') ? siteRootUrl.pathname : `${siteRootUrl.pathname}/`).replace(/\\/g, '/');
  const templateUrl = new URL('templates/footer.html', assetsRootUrl).href;

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

  const FOOTER_TEMPLATE_FALLBACK = `
<div class="container">
  <div class="footer-content">
    <div class="footer-section footer-section--brand">
      <div class="footer-brand">
        <picture>
          <source type="image/webp" srcset="{{BASE}}assets/images/logos/terra-compact.webp">
          <img src="{{BASE}}assets/images/logos/terra-compact.png" alt="Terra Eletrônica" class="logo" loading="lazy">
        </picture>
        <p>Tecnologia que liberta seu potencial</p>
      </div>
      <div class="social-links">
        <a href="https://www.facebook.com/terraeletronica/?locale=pt_BR" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
        <a href="https://www.instagram.com/terraeletronica/" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
        <a href="https://www.youtube.com/@terraeletronicaoficial" target="_blank" rel="noopener" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
        <a href="https://wa.me/5512991653176" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
      </div>
    </div>

    <div class="footer-section">
      <h4>Produtos</h4>
      <ul>
        <li><a href="{{BASE}}produtos/instrumentos-midi.html">Instrumentos MIDI-TA</a></li>
        <li><a href="{{BASE}}produtos/tecnologia-assistiva.html">Tecnologia Assistiva</a></li>
        <li><a href="https://www.vibrosensory.com.br/" target="_blank" rel="noopener">Vibro Sensory Music</a></li>
      </ul>
    </div>

    <div class="footer-section">
      <h4>Empresa</h4>
      <ul>
        <li><a href="{{BASE}}index.html#sobre">Sobre Nós</a></li>
        <li><a href="{{BASE}}index.html#contato">Contato</a></li>
      </ul>
    </div>

    <div class="footer-section">
      <h4>Suporte</h4>
      <ul>
        <li><a href="{{BASE}}manuais.html?tipo=manual">Manuais</a></li>
        <li><a href="{{BASE}}manuais.html?tipo=download">Downloads</a></li>
      </ul>
    </div>
  </div>

  <div class="footer-bottom">
    <p>&copy; {{YEAR}} Terra Eletrônica. Todos os direitos reservados.</p>
    <p>Desenvolvido com ❤️ para promover inclusão e acessibilidade.</p>
    <p class="footer-legal-notice" role="note">
      Ao continuar navegando, você concorda com o uso responsável de cookies essenciais e com o tratamento dos dados fornecidos em conformidade com o Marco Civil da Internet (Lei nº 12.965/2014) e com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018).
    </p>
  </div>
</div>`;

  const fetchTemplate = async () => {
    if (!window.fetch) {
      return FOOTER_TEMPLATE_FALLBACK;
    }
    try {
      const response = await fetch(templateUrl, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.warn('[terra-footer] Falha ao carregar template externo, usando fallback embutido.', error);
      return FOOTER_TEMPLATE_FALLBACK;
    }
  };

  const hydrateFooter = (html) => {
    const currentYear = new Date().getFullYear();
    const resolvedHtml = html
      .replace(/\{\{BASE\}\}/g, basePath)
      .replace(/\{\{YEAR\}\}/g, `${currentYear}`);

    const parser = document.createElement('template');
    parser.innerHTML = resolvedHtml.trim();

    let footerEl = document.querySelector('footer.footer');
    if (!footerEl) {
      footerEl = document.createElement('footer');
      footerEl.className = 'footer';
      document.body.appendChild(footerEl);
    }

    footerEl.setAttribute('data-terra-footer', 'carregado');
    footerEl.innerHTML = '';
    footerEl.appendChild(parser.content.cloneNode(true));
  };

  fetchTemplate().then(hydrateFooter).catch((error) => {
    console.error('[terra-footer] Não foi possível aplicar o rodapé.', error);
  });
})();
