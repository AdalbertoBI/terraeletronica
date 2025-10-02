# Sistema de Cache Inteligente - Terra Eletrônica

Sistema automatizado de cache para melhorar a performance e a experiência do usuário no site da Terra Eletrônica.

## 🚀 Funcionalidades

- **Cache Automático**: Armazena arquivos estáticos (HTML, CSS, JS, imagens, PDFs) em segundo plano.
- **Atualizações Inteligentes**: Detecta novas versões e atualiza o cache automaticamente com base em `version.json`.
- **Notificações**: Exibe um aviso amigável para o usuário quando uma nova versão está disponível.
- **Offline First**: Mantém o site acessível mesmo sem conexão após a primeira visita.
- **Versionamento**: Usa formato estendido `major.minor.patch.build.revision` com scripts automatizados para incremento.

## 📁 Arquivos do Sistema

### Arquivos Principais

- `sw.js` – Service Worker responsável por cachear, atualizar e limpar os recursos. A constante `SITE_VERSION` ali definida é a fonte primária do número da versão.
- `assets/js/cache-manager.js` – Gerencia o ciclo de atualização, notificações e integração com o Service Worker.
- `version.json` – Espelho gerado automaticamente a partir do valor configurado em `sw.js`.

### Scripts de Atualização

- `update-version.py` – Script Python para incrementar, sincronizar e registrar versões.
- `update-version.bat` – Atalho Windows para executar o script Python com perguntas guiadas.
- Scripts NPM (`package.json`) – Facilidade para executar os mesmos comandos via `npm run`.

## 🔧 Como Usar

Escolha um dos métodos abaixo para atualizar a versão do site antes do deploy.

### Atualizando a Versão do Site

#### Método 1: Usando o Script Windows (Recomendado)

```batch
# Incrementa versão patch (1.0.0.0.0 → 1.0.1.0.0)
update-version.bat

# Incrementa versão minor (1.0.0.0.0 → 1.1.0.0.0)
update-version.bat minor

# Incrementa versão major (1.0.0.0.0 → 2.0.0.0.0)
update-version.bat major

# Incrementa build (1.0.0.0.0 → 1.0.0.1.0)
update-version.bat build

# Incrementa revisão (1.0.0.0.0 → 1.0.0.0.1)
update-version.bat revision

# Define versão específica
update-version.bat --version 1.5.0.0.0

# Mostra versão atual
update-version.bat --show-current

# Sincroniza version.json/package.json com o valor definido manualmente em sw.js
update-version.bat sync
```

#### Método 2: Usando NPM Scripts

```bash
# Incrementa versão patch
npm run version:patch

# Incrementa versão minor
npm run version:minor

# Incrementa versão major
npm run version:major

# Incrementa build
npm run version:build

# Incrementa revisão
npm run version:revision

# Mostra versão atual
npm run version:show

# Sincroniza version.json/package.json com o valor definido em sw.js
npm run version:sync
```

#### Método 3: Usando Python Diretamente

```bash
# Incrementa versão patch
python update-version.py --type patch

# Incrementa versão minor
python update-version.py --type minor

# Incrementa versão major
python update-version.py --type major

# Incrementa build
python update-version.py --type build

# Incrementa revisão
python update-version.py --type revision

# Define versão específica
python update-version.py --version 2.1.0.0.0

# Mostra versão atual
python update-version.py --show-current

# Sincroniza version.json/package.json com o valor definido em sw.js
python update-version.py --sync-from-sw
```

### Fluxo de Atualização

1. Faça suas alterações no site (HTML, CSS, JS, imagens etc.).
2. Rode um dos comandos acima para gerar uma nova versão.
3. Execute os testes rápidos/lints necessários.
4. Faça commit e push das alterações.
5. Os usuários receberão a notificação da nova versão automaticamente.

> 💡 **Dica**: Se você editar manualmente a constante `SITE_VERSION` dentro de `sw.js`, execute `update-version.bat sync`, `npm run version:sync` ou `python update-version.py --sync-from-sw` para refletir a alteração em `version.json` e `package.json`.

## 🔍 Como Funciona

### Service Worker

- Intercepta requisições e responde do cache quando possível.
- Revalida recursos críticos consultando `version.json`.
- Atualiza o cache em segundo plano quando detecta novas versões.

### Cache Manager

- Registra o Service Worker e monitora seu estado.
- Mostra alertas para atualizar quando uma versão nova é encontrada.
- Expõe funções utilitárias (`updateSite`, `clearCache`, `checkVersion`) no objeto global.

### Sistema de Versão

- A constante `SITE_VERSION` dentro de `sw.js` é a fonte primária do número de versão.
- `version.json` mantém o estado `version`, `previous_version`, `updated` e `changelog` gerado automaticamente a partir do Service Worker.
- `package.json` é mantido em sincronia para fins de publicação.
- Formato padrão: `major.minor.patch.build.revision` (ex.: `1.0.3.2.0`).
- Scripts automatizados garantem a sincronia entre esses arquivos, inclusive o novo modo `--sync-from-sw`.

## 🛠️ Configuração

### Arquivos Cacheados

- Páginas HTML (home, produtos, manuais etc.).
- Arquivos CSS (`assets/css/*.css`).
- Arquivos JavaScript (`assets/js/*.js`).
- Imagens (PNG, JPG, JPEG, GIF, SVG, WebP).
- PDFs (manuais e downloads).

### Personalização

Adicione ou remova recursos ajustando `STATIC_ASSETS` em `sw.js` ou criando regras extras com `shouldCache`. Para configurar notificações, edite `cache-manager.js` ou `cache-config.json`.

## 🐛 Solução de Problemas

### Cache não está funcionando

1. Verifique se o navegador suporta Service Workers.
2. Use DevTools → Application → Service Workers para confirmar registro e status.
3. Limpe caches antigos no DevTools e recarregue a página.

### Versão não está atualizando

1. Confirme que `version.json` e `package.json` foram atualizados e commitados.
2. Faça um hard refresh (`Ctrl + F5` ou `Cmd + Shift + R`).
3. Execute `cacheManager.clearCache()` no console para forçar limpeza local.

### Notificação não aparece

1. Cheque o console do navegador por erros de JavaScript.
2. Verifique se `cache-manager.js` foi carregado (aba Network).
3. Teste em aba anônima para descartar cache antigo ou extensões.

## 🎯 Benefícios

### Para Usuários

- Carregamento muito mais rápido após a primeira visita.
- Continuidade offline para páginas já visitadas.
- Alertas amigáveis ao disponibilizar novos conteúdos.

### Para Desenvolvedores

- Automatização completa do ciclo de cache + versionamento.
- Deploy simplificado: basta versionar, commitar e publicar.
- Ferramentas de debug expostas no console para inspeções rápidas.

## 📊 Monitoramento

### Console do Navegador

- Logs detalhados de instalação, atualização e remoção de caches.
- Mensagens quando uma nova versão é detectada.
- Erros informativos caso a busca por `version.json` falhe.

### Comandos de Debug

```javascript
// Verificar manualmente se há nova versão
cacheManager.checkVersion()

// Limpar todo o cache local (recomendado apenas para debug)
cacheManager.clearCache()

// Aplicar imediatamente a versão mais recente
cacheManager.updateSite()
```

## 🔄 Ciclo de Vida

1. Primeira visita: o Service Worker instala e cacheia os arquivos essenciais.
2. Visitas seguintes: recursos vêm do cache para melhorar o tempo de carregamento.
3. `version.json` é consultado periodicamente para detectar atualizações.
4. Versão nova encontrada: notificações são exibidas ao usuário.
5. Usuário aceita atualizar: cache antigo é descartado e o novo assume.
6. Experiência contínua: site sempre atualizado e performático.

## 📋 Checklist de Deploy

- [ ] Revisar alterações e testar localmente.
- [ ] Rodar `update-version.bat` (ou comando equivalente) para incrementar a versão **ou** `update-version.bat sync`/`npm run version:sync` caso tenha ajustado `sw.js` manualmente.
- [ ] Confirmar mudanças em `sw.js`, `version.json` e `package.json`.
- [ ] Executar lints/tests relevantes.
- [ ] `git add sw.js version.json package.json` (mais demais arquivos alterados), `git commit -m "Atualização do site - versão X.Y.Z.W.V"`, `git push`.
- [ ] Testar em produção e validar notificação de atualização.

## 🆘 Suporte

1. Verifique o console do navegador (F12) para entender falhas em tempo real.
2. Reproduza o problema em aba anônima ou outro dispositivo para isolar cache.
3. Consulte esta documentação ou `QUICK-START.md` para procedimentos rápidos.
4. Se precisar, contate a equipe de desenvolvimento com o número da versão exibido nas notificações.

---

**Terra Eletrônica** – Tecnologia que liberta seu potencial.
