/**
 * Sistema de Cache Inteligente - Terra Eletrônica
 * Gerencia o Service Worker e notificações de atualização automática.
 */

class CacheManager {
  // O construtor foi removido para seguir as boas práticas,
  // já que a inicialização será feita de forma estática ou externa.

  async init() {
    if ('serviceWorker' in navigator) {
      try {
        await this.registerServiceWorker();
        this.listenForUpdate();
      } catch (error) {
        console.error('Erro ao inicializar cache manager:', error);
      }
    } else {
      console.log('Service Worker não suportado neste navegador');
    }
  }

  async registerServiceWorker() {
    try {
      const { scriptURL, scope } = this.getServiceWorkerConfig();
      const registration = await navigator.serviceWorker.register(scriptURL, { scope });
      console.log('Service Worker registrado:', registration);

      // O navegador verificará automaticamente se há uma nova versão do sw.js.
      // A lógica de atualização está agora no próprio Service Worker.
      
    } catch (error) {
      console.error('Erro ao registrar Service Worker:', error);
    }
  }

  getServiceWorkerConfig() {
    const swUrl = new URL('sw.js', window.location.href);
    const scopeUrl = new URL('./', swUrl);

    return {
      scriptURL: `${swUrl.pathname}${swUrl.search ?? ''}${swUrl.hash ?? ''}`,
      scope: scopeUrl.pathname.endsWith('/') ? scopeUrl.pathname : `${scopeUrl.pathname}/`
    };
  }

  listenForUpdate() {
    // O evento 'controllerchange' é disparado quando o SW que controla a página muda.
    // Isso indica que uma atualização foi concluída.
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker foi atualizado. Exibindo notificação.');
      this.showUpdatedToast();
    });
  }

  showUpdatedToast() {
    // Remove qualquer notificação antiga para evitar duplicatas
    const oldToast = document.getElementById('update-toast');
    if (oldToast) {
      oldToast.remove();
    }

    const toast = document.createElement('div');
    toast.id = 'update-toast';
    toast.innerHTML = `
      <div class="toast-icon">✅</div>
      <div class="toast-text">Site atualizado</div>
    `;
    
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #27ae60;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10001;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 16px;
      font-weight: 500;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s ease, transform 0.3s ease;
    `;
    
    document.body.appendChild(toast);

    // Animação de entrada
    setTimeout(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    }, 100);

    // Auto-esconder após 5 segundos
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }, 5000);
  }

  // Limpar cache manualmente (para desenvolvimento)
  async clearCache() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('Cache limpo');
      window.location.reload();
    }
  }
}

// Inicializar o gerenciador de cache
const cacheManager = new CacheManager();
cacheManager.init();

// Expor para uso global (útil para debug)
window.cacheManager = cacheManager;