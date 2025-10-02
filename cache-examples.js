/**
 * Exemplos de uso do Sistema de Cache Inteligente
 * Terra Eletrônica
 */

// ===================================
// EXEMPLOS DE USO BÁSICO
// ===================================

// Verificar se o sistema de cache está ativo
if (window.cacheManager) {
    console.log('✅ Sistema de cache ativo');
} else {
    console.log('❌ Sistema de cache não disponível');
}

// ===================================
// VERIFICAÇÃO MANUAL DE VERSÃO
// ===================================

// Verificar se há uma nova versão disponível
async function checkForUpdates() {
    if (window.cacheManager) {
        await window.cacheManager.checkVersion();
        console.log('Verificação de versão executada');
    }
}

// ===================================
// ATUALIZAÇÃO PROGRAMÁTICA
// ===================================

// Forçar atualização do site
function forceUpdate() {
    if (window.cacheManager) {
        window.cacheManager.updateSite();
    }
}

// ===================================
// LIMPEZA DE CACHE (DESENVOLVIMENTO)
// ===================================

// Limpar todo o cache durante desenvolvimento
async function clearAllCache() {
    if (window.cacheManager) {
        await window.cacheManager.clearCache();
        console.log('Cache limpo');
    }
}

// ===================================
// EVENTOS PERSONALIZADOS
// ===================================

// Escutar evento de atualização disponível
document.addEventListener('cache-update-available', function(event) {
    console.log('Nova versão disponível:', event.detail.version);
    
    // Implementar lógica customizada aqui
    // Por exemplo: mostrar uma notificação personalizada
    showCustomUpdateNotification(event.detail.version);
});

// Escutar evento de cache atualizado
document.addEventListener('cache-updated', function(event) {
    console.log('Cache atualizado para versão:', event.detail.version);
    
    // Implementar lógica pós-atualização
    // Por exemplo: analytics, logging, etc.
    trackCacheUpdate(event.detail.version);
});

// ===================================
// NOTIFICAÇÕES PERSONALIZADAS
// ===================================

function showCustomUpdateNotification(version) {
    // Criar notificação personalizada
    const notification = document.createElement('div');
    notification.className = 'custom-update-notification';
    notification.innerHTML = `
        <h3>🚀 Nova versão ${version} disponível!</h3>
        <p>Clique para atualizar e ver as novidades</p>
        <button onclick="forceUpdate()">Atualizar Agora</button>
        <button onclick="this.parentNode.remove()">Mais Tarde</button>
    `;
    
    document.body.appendChild(notification);
}

// ===================================
// ANALYTICS E TRACKING
// ===================================

function trackCacheUpdate(version) {
    // Exemplo com Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cache_update', {
            'version': version,
            'timestamp': new Date().toISOString()
        });
    }
    
    // Exemplo com console personalizado
    console.log(`📊 Cache Update Analytics:`, {
        version: version,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
    });
}

// ===================================
// CONFIGURAÇÃO AVANÇADA
// ===================================

// Configurar comportamento do cache manager (se suportado)
if (window.cacheManager?.configure) {
    window.cacheManager.configure({
        autoCheck: true,          // Verificar atualizações automaticamente
        checkInterval: 1800000,   // Verificar a cada 30 minutos
        notificationTimeout: 15000, // Notificação fica visível por 15 segundos
        autoUpdate: false,        // Não atualizar automaticamente
        debugMode: false          // Desabilitar logs de debug
    });
}

// ===================================
// UTILITÁRIOS DE DIAGNÓSTICO
// ===================================

// Função para diagnóstico completo do cache
async function diagnosticCache() {
    console.group('🔍 Diagnóstico do Sistema de Cache');
    
    // Verificar suporte a Service Workers
    if ('serviceWorker' in navigator) {
        console.log('✅ Service Worker suportado');
        
        // Listar Service Workers registrados
        const registrations = await navigator.serviceWorker.getRegistrations();
        console.log(`📋 Service Workers registrados: ${registrations.length}`);
        
        registrations.forEach((registration, index) => {
            console.log(`   ${index + 1}. ${registration.scope}`);
        });
        
    } else {
        console.log('❌ Service Worker não suportado');
    }
    
    // Verificar caches disponíveis
    if ('caches' in window) {
        const cacheNames = await caches.keys();
        console.log(`💾 Caches disponíveis: ${cacheNames.length}`);
        
        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const keys = await cache.keys();
            console.log(`   📦 ${cacheName}: ${keys.length} arquivos`);
        }
    }
    
    // Verificar estado do cache manager
    if (window.cacheManager) {
        console.log('✅ Cache Manager ativo');
        console.log('🔄 Update Available:', window.cacheManager.updateAvailable);
    } else {
        console.log('❌ Cache Manager não encontrado');
    }
    
    console.groupEnd();
}

// ===================================
// PERFORMANCE MONITORING
// ===================================

// Monitor de performance do cache
class CachePerformanceMonitor {
    constructor() {
        this.metrics = {
            cacheHits: 0,
            cacheMisses: 0,
            totalRequests: 0,
            averageLoadTime: 0
        };
        
        this.startTime = performance.now();
        this.setupMonitoring();
    }
    
    setupMonitoring() {
        // Interceptar fetch requests para monitorar cache hits/misses
        const originalFetch = window.fetch;
        const monitor = this;
        
        window.fetch = function(...args) {
            const start = performance.now();
            monitor.metrics.totalRequests++;
            
            return originalFetch.apply(this, args).then(response => {
                const loadTime = performance.now() - start;
                monitor.updateMetrics(response, loadTime);
                return response;
            });
        };
    }
    
    updateMetrics(response, loadTime) {
        // Verificar se veio do cache (heurística baseada no tempo de resposta)
        if (loadTime < 50) { // Muito rápido, provavelmente cache
            this.metrics.cacheHits++;
        } else {
            this.metrics.cacheMisses++;
        }
        
        // Atualizar média de tempo de carregamento
        this.metrics.averageLoadTime = 
            (this.metrics.averageLoadTime + loadTime) / 2;
    }
    
    getReport() {
        const hitRate = (this.metrics.cacheHits / this.metrics.totalRequests * 100).toFixed(2);
        
        return {
            ...this.metrics,
            hitRate: `${hitRate}%`,
            uptime: performance.now() - this.startTime,
            timestamp: new Date().toISOString()
        };
    }
    
    logReport() {
        console.table(this.getReport());
    }
}

// Inicializar monitor de performance (opcional)
// const performanceMonitor = new CachePerformanceMonitor();

// ===================================
// COMANDOS DE CONSOLE ÚTEIS
// ===================================

// Adicionar comandos úteis ao objeto window para uso no console
window.cacheDebug = {
    check: checkForUpdates,
    update: forceUpdate,
    clear: clearAllCache,
    diagnostic: diagnosticCache,
    // monitor: performanceMonitor
};

// ===================================
// INICIALIZAÇÃO CUSTOMIZADA
// ===================================

// Executar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar cache manager estar disponível
    const waitForCacheManager = setInterval(function() {
        if (window.cacheManager) {
            clearInterval(waitForCacheManager);
            
            console.log('🚀 Sistema de Cache Terra Eletrônica inicializado');
            console.log('💡 Use window.cacheDebug para comandos de debug');
            
            // Executar verificação inicial após 5 segundos
            setTimeout(checkForUpdates, 5000);
        }
    }, 100);
});

// ===================================
// EXEMPLO DE INTEGRAÇÃO COM ANALYTICS
// ===================================

// Função para enviar métricas de cache para analytics
function sendCacheMetrics() {
    if (typeof gtag !== 'undefined' && window.cacheDebug.monitor) {
        const report = window.cacheDebug.monitor.getReport();
        
        gtag('event', 'cache_metrics', {
            'custom_map': {
                'metric1': 'cache_hit_rate',
                'metric2': 'average_load_time'
            },
            'metric1': parseFloat(report.hitRate),
            'metric2': report.averageLoadTime
        });
    }
}

// Enviar métricas a cada 10 minutos
setInterval(sendCacheMetrics, 600000);