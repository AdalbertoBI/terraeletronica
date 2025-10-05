# Sistema de Atualização Automática - Terra Eletrônica

## 📋 Visão Geral

O site Terra Eletrônica possui um **sistema robusto de atualização automática** que garante que todos os usuários recebam as versões mais recentes do site, mesmo quando estão offline ou com conexão intermitente.

## 🔄 Como Funciona

### 1. **Service Worker (sw.js)**
- Intercepta todas as requisições do site
- Gerencia o cache de recursos estáticos
- Implementa estratégias híbridas de cache:
  - **Network First** para páginas HTML (garante conteúdo sempre atualizado)
  - **Cache First** para recursos estáticos (CSS, JS, imagens)

### 2. **Cache Manager (cache-manager.js)**
- Registra e gerencia o Service Worker
- Verifica atualizações automaticamente **a cada 30 minutos**
- Notifica o usuário quando uma atualização é aplicada
- Fornece métodos para forçar atualizações

### 3. **Controle de Versão (version.json)**
- Mantém registro da versão atual do site
- Histórico de mudanças (changelog)
- Data da última atualização

## 🚀 Recursos Implementados

### Atualização Automática
```javascript
// Verifica atualizações a cada 30 minutos
setInterval(() => {
  registration.update();
}, 30 * 60 * 1000);
```

### Notificação ao Usuário
Quando o site é atualizado, uma notificação verde aparece no canto inferior direito:
- ✅ "Site atualizado"
- Desaparece automaticamente após 5 segundos

### Estratégia Network First para HTML
```javascript
// Páginas HTML sempre tentam buscar da rede primeiro
if (event.request.headers.get('accept')?.includes('text/html')) {
  // Busca da rede -> Se falhar, usa cache
}
```

### Métodos Disponíveis

#### 1. Forçar Atualização
```javascript
// No console do navegador
window.cacheManager.forceUpdate();
```

#### 2. Limpar Cache Completamente
```javascript
// No console do navegador
window.cacheManager.clearCache();
```

#### 3. Verificar Versão Atual
```javascript
// No console do navegador
const version = await window.cacheManager.getVersion();
console.log('Versão atual:', version);
```

## 📊 Versão Atual

**Versão:** 1.0.0.2.8  
**Data:** 05/10/2025

### Melhorias nesta versão:
- ✅ Estratégia Network First para páginas HTML
- ✅ Verificação automática de atualizações a cada 30 minutos
- ✅ Método para forçar atualização do site
- ✅ Método para obter versão do Service Worker
- ✅ Melhor controle de cache e limpeza
- ✅ Notificações aprimoradas de atualização

## 🔧 Para Desenvolvedores

### Atualizar a Versão do Site

Quando fizer mudanças no site que devem ser propagadas para todos os usuários:

1. **Atualize a versão em `sw.js`:**
```javascript
const SITE_VERSION = '1.0.0.2.9'; // Incremente a versão
const CACHE_NAME = 'terra-eletronica-cache-v2.9'; // Incremente o cache
```

2. **Atualize o `version.json`:**
```json
{
  "version": "1.0.0.2.9",
  "updated": "2025-10-05",
  "previous_version": "1.0.0.2.8",
  "changelog": "Descrição das mudanças"
}
```

3. **Faça commit e push das mudanças**

### O que acontece automaticamente:

1. Usuários ativos verificam atualizações a cada 30 minutos
2. Quando um usuário visita o site, o navegador detecta o novo `sw.js`
3. O novo Service Worker é instalado em segundo plano
4. Quando pronto, o novo SW é ativado
5. Cache antigo é limpo automaticamente
6. Usuário recebe notificação de atualização
7. Próxima navegação usa a nova versão

## 🎯 Garantia de Atualização

### Para usuários frequentes:
- Verificação automática a cada 30 minutos
- Atualização transparente em segundo plano
- Notificação discreta quando concluída

### Para usuários ocasionais:
- Verificação na primeira visita após atualização
- Network First garante HTML sempre atualizado
- Cache de recursos estáticos para performance

### Para casos críticos:
- Administrador pode instruir usuários a:
  - Pressionar F5 (refresh) ou Ctrl+F5 (hard refresh)
  - Ou executar `window.cacheManager.forceUpdate()` no console
  - Ou executar `window.cacheManager.clearCache()` para limpar tudo

## 📱 Compatibilidade

O sistema funciona em todos os navegadores modernos que suportam Service Workers:
- ✅ Chrome/Edge (v40+)
- ✅ Firefox (v44+)
- ✅ Safari (v11.1+)
- ✅ Opera (v27+)
- ✅ Chrome Android
- ✅ Safari iOS

## 🔍 Debug e Monitoramento

### Ver logs do Service Worker:
1. Abra DevTools (F12)
2. Vá para Console
3. Filtre por "Service Worker"

### Inspecionar Service Worker:
1. Chrome: `chrome://serviceworker-internals/`
2. Firefox: `about:serviceworkers`
3. Ou DevTools > Application/Storage > Service Workers

### Forçar desregistro (desenvolvimento):
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(r => r.unregister());
});
```

## 🛡️ Segurança

- Service Worker só funciona em HTTPS (ou localhost para desenvolvimento)
- Cache limitado ao domínio do site
- Recursos de terceiros não são cacheados automaticamente
- Páginas HTML sempre tentam buscar versão atualizada da rede

## 📈 Performance

- Recursos estáticos carregam do cache (instantâneo)
- Páginas HTML carregam da rede com fallback para cache
- Atualizações em segundo plano não bloqueiam navegação
- Cache limpo automaticamente quando há novas versões

---

**Última atualização:** 05/10/2025  
**Desenvolvido por:** Terra Eletrônica
