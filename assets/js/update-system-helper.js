/**
 * Script de Teste do Sistema de Atualização
 * Console Helper para testar e monitorar o sistema de cache
 */

// Helper para adicionar ao console do navegador
window.updateSystemHelper = {
  // Verificar status do Service Worker
  async checkStatus() {
    console.log('🔍 Verificando status do Service Worker...\n');
    
    if (!('serviceWorker' in navigator)) {
      console.log('❌ Service Worker não suportado neste navegador');
      return;
    }

    const registration = await navigator.serviceWorker.getRegistration();
    
    if (!registration) {
      console.log('❌ Service Worker não registrado');
      return;
    }

    console.log('✅ Service Worker registrado');
    console.log('📍 Scope:', registration.scope);
    
    if (registration.active) {
      console.log('✅ Service Worker ativo');
      console.log('📝 Script URL:', registration.active.scriptURL);
      console.log('🔄 Estado:', registration.active.state);
    }

    if (registration.waiting) {
      console.log('⏳ Service Worker aguardando ativação');
    }

    if (registration.installing) {
      console.log('📥 Service Worker sendo instalado');
    }

    // Verificar versão
    if (window.cacheManager) {
      const version = await window.cacheManager.getVersion();
      console.log('📌 Versão atual:', version || 'não disponível');
    }

    console.log('\n');
  },

  // Forçar verificação de atualização
  async checkForUpdates() {
    console.log('🔄 Verificando atualizações...\n');
    
    if (!window.cacheManager) {
      console.log('❌ Cache Manager não disponível');
      return;
    }

    try {
      await window.cacheManager.forceUpdate();
      console.log('✅ Verificação de atualização iniciada');
      console.log('ℹ️ Se houver atualização, você será notificado automaticamente');
    } catch (error) {
      console.error('❌ Erro ao verificar atualizações:', error);
    }
  },

  // Limpar cache completamente
  async clearCache() {
    console.log('🗑️ Limpando cache...\n');
    
    if (!window.cacheManager) {
      console.log('❌ Cache Manager não disponível');
      return;
    }

    const confirm = window.confirm(
      'Tem certeza que deseja limpar o cache?\n' +
      'O site será recarregado após a limpeza.'
    );

    if (!confirm) {
      console.log('❌ Limpeza de cache cancelada');
      return;
    }

    try {
      await window.cacheManager.clearCache();
    } catch (error) {
      console.error('❌ Erro ao limpar cache:', error);
    }
  },

  // Listar todos os caches
  async listCaches() {
    console.log('📦 Listando caches armazenados...\n');
    
    if (!('caches' in window)) {
      console.log('❌ Cache API não suportada neste navegador');
      return;
    }

    try {
      const cacheNames = await caches.keys();
      
      if (cacheNames.length === 0) {
        console.log('📭 Nenhum cache encontrado');
        return;
      }

      console.log(`📦 Total de caches: ${cacheNames.length}\n`);

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        console.log(`\n📦 ${cacheName}`);
        console.log(`   └─ ${keys.length} recursos cacheados`);
      }

      console.log('\n');
    } catch (error) {
      console.error('❌ Erro ao listar caches:', error);
    }
  },

  // Mostrar recursos cacheados
  async showCachedResources() {
    console.log('📄 Mostrando recursos cacheados...\n');
    
    if (!('caches' in window)) {
      console.log('❌ Cache API não suportada neste navegador');
      return;
    }

    try {
      const cacheNames = await caches.keys();
      
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        console.log(`\n📦 ${cacheName} (${keys.length} recursos):`);
        
        keys.forEach((request, index) => {
          const url = new URL(request.url);
          console.log(`   ${index + 1}. ${url.pathname}`);
        });
      }

      console.log('\n');
    } catch (error) {
      console.error('❌ Erro ao mostrar recursos:', error);
    }
  },

  // Mostrar ajuda
  help() {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║         Sistema de Atualização - Terra Eletrônica             ║
║                      Console Helper                            ║
╚════════════════════════════════════════════════════════════════╝

📚 Comandos Disponíveis:

  updateSystemHelper.checkStatus()
    └─ Verifica status do Service Worker e versão atual

  updateSystemHelper.checkForUpdates()
    └─ Força verificação de atualizações

  updateSystemHelper.clearCache()
    └─ Limpa todo o cache e recarrega o site

  updateSystemHelper.listCaches()
    └─ Lista todos os caches armazenados

  updateSystemHelper.showCachedResources()
    └─ Mostra todos os recursos cacheados

  updateSystemHelper.help()
    └─ Mostra esta mensagem de ajuda

📋 Atalhos Diretos:

  window.cacheManager.forceUpdate()
    └─ Força atualização do Service Worker

  window.cacheManager.clearCache()
    └─ Limpa cache via Service Worker

  window.cacheManager.getVersion()
    └─ Obtém versão atual (retorna Promise)

═══════════════════════════════════════════════════════════════

💡 Dica: Execute updateSystemHelper.checkStatus() para começar!

    `);
  }
};

// Mostrar mensagem de boas-vindas ao carregar
console.log(`
╔════════════════════════════════════════════════════════════════╗
║    🚀 Sistema de Atualização Automática Carregado!            ║
╚════════════════════════════════════════════════════════════════╝

Digite: updateSystemHelper.help() para ver comandos disponíveis
`);
