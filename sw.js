const SITE_VERSION = '1.0.0.5.5';
const CACHE_NAME = 'terra-eletronica-cache-v5.5';

const SCOPE_URL = new URL('./', self.location);
const resolveScopeUrl = path => {
  if (!path) return SCOPE_URL.href;
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return new URL(normalizedPath || './', SCOPE_URL).href;
};

const VERSION_URL = resolveScopeUrl('version.json');
const FALLBACK_404_URL = resolveScopeUrl('404.html');

// Lista de arquivos para cachear
const STATIC_ASSETS = [
  './',
  'index.html',
  'manuais.html',
  'partituras-interativas.html',
  'downloads.html',
  '404.html',
  'version.json',
  '_config.yml',
  '_redirects',
  
  // CSS
  'assets/css/style.css',
  'assets/css/index.css',
  'assets/css/manuais.css',
  'assets/css/partituras-interativas.css',
  'assets/css/downloads.css',
  'assets/css/navigation-responsive.css',
  'assets/css/mobile-menu.css',
  'assets/css/404.css',
  
  // JavaScript
  'assets/js/main.js',
  'assets/js/index.js',
  'assets/js/manuais.js',
  'assets/js/partituras-interativas.js',
  'assets/js/downloads.js',
  'assets/js/nav.js',
  'assets/js/nav-responsive.js',
  'assets/js/mobile-menu-simple.js',
  'assets/js/404.js',
  'assets/js/cache-manager.js',
  
  // Imagens essenciais
  'assets/images/logos/terra-horizontal.png',
  'assets/images/logos/terra-horizontal.webp',
  'assets/images/logos/terra-compact.png',
  'assets/images/logos/terra-compact.webp',
  'assets/images/logos/logo-P.png',
  
  // Páginas de produtos
  'produtos/big-ball-mouse.html',
  'produtos/instrumentos-midi.html',
  'produtos/lupa-bolinha.html',
  'produtos/roller-mouse.html',
  'produtos/sensory-musical.html',
  'produtos/tecnologia-assistiva.html',
  'produtos/biblia-eletronica.html',
  
  // Instrumentos
  'produtos/instrumentos/big-kbd-25.html',
  'produtos/instrumentos/board-bells.html',
  'produtos/instrumentos/board-som.html',
  'produtos/instrumentos/giro-som-09.html',
  'produtos/instrumentos/musical-beam-05.html'
].map(resolveScopeUrl);

async function precacheAssets(cache) {
  const failedAssets = [];

  for (const assetUrl of STATIC_ASSETS) {
    try {
      await cache.add(assetUrl);
    } catch (error) {
      failedAssets.push({ assetUrl, error });
      console.warn('Service Worker: Falha ao cachear recurso', assetUrl, error);
    }
  }

  return failedAssets;
}

self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('Service Worker: Cacheando arquivos estáticos');
        const failures = await precacheAssets(cache);

        if (failures.length) {
          console.warn('Service Worker: Alguns arquivos não puderam ser pré-cacheados', failures.map(item => item.assetUrl));
        }
      } catch (error) {
        console.error('Service Worker: Erro durante instalação', error);
      }
    })().then(() => {
      // Força o novo Service Worker a se tornar ativo imediatamente.
      return self.skipWaiting();
    })
  );
});

// Ativar o Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Ativando...');
  event.waitUntil(
    (async () => {
      // Limpa caches antigos
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
      
      // Toma controle de todos os clientes abertos
      await self.clients.claim();

      // Notifica os clientes que a atualização foi concluída
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({ type: 'SW_ACTIVATED' });
      });
    })()
  );
});

// Interceptar requisições com estratégia híbrida
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Estratégia Network First para páginas HTML (garante conteúdo atualizado)
  if (event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(fetchResponse => {
          // Se a resposta for válida, atualiza o cache e retorna
          if (fetchResponse && fetchResponse.status === 200) {
            const responseClone = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseClone));
          }
          return fetchResponse;
        })
        .catch(() => {
          // Se falhar, tenta buscar do cache
          return caches.match(event.request)
            .then(response => response || caches.match(FALLBACK_404_URL));
        })
    );
    return;
  }
  
  // Estratégia Cache First para recursos estáticos (CSS, JS, imagens)
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(event.request)
          .then(fetchResponse => {
            if (fetchResponse && fetchResponse.status === 200 && shouldCache(event.request)) {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseClone);
                });
            }
            return fetchResponse;
          })
          .catch(() => {
            // Se falhar e for uma página HTML, retorna a página 404
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match(FALLBACK_404_URL);
            }
          });
      })
  );
});

// Verificar se deve cachear o arquivo
function shouldCache(request) {
  const url = new URL(request.url);
  
  // Não cacheia recursos de streaming ou de terceiros que mudam com frequência
  if (url.protocol === 'chrome-extension:' || request.url.includes('googletagmanager')) {
    return false;
  }
  
  // Cacheia arquivos estáticos do próprio domínio
  return STATIC_ASSETS.includes(url.href) || (
         url.origin === self.location.origin && (
         url.pathname.endsWith('.html') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.png') ||
         url.pathname.endsWith('.jpg') ||
         url.pathname.endsWith('.jpeg') ||
         url.pathname.endsWith('.gif') ||
         url.pathname.endsWith('.svg') ||
         url.pathname.endsWith('.webp') ||
         url.pathname.endsWith('.pdf')));
}

// Escutar mensagens dos clientes
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Responder com a versão atual quando solicitado
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: SITE_VERSION });
  }
  
  // Forçar limpeza de cache e atualização
  if (event.data && event.data.type === 'FORCE_UPDATE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }).then(() => {
        return self.clients.matchAll();
      }).then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'CACHE_CLEARED' });
        });
      })
    );
  }

});
