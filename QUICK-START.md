# Sistema de Cache Inteligente – Guia Rápido

## ✅ Sistema implementado com sucesso

O site Terra Eletrônica agora possui um sistema completo de cache inteligente, oferecendo carregamento rápido, suporte offline e atualização automática de versão.

## 🎯 Componentes principais

### Service Worker (`sw.js`)

- Cacheia arquivos essenciais e responde em modo offline.
- Verifica `version.json` para detectar novas versões.
- Atualiza o cache sem interromper a navegação.

### Cache Manager (`assets/js/cache-manager.js`)

- Exibe notificações de atualização para o usuário.
- Disponibiliza comandos (`updateSite`, `clearCache`, `checkVersion`).
- Garante transição suave para a versão mais recente.

### Sistema de versionamento

- A constante `SITE_VERSION` em `sw.js` é a fonte primária do número da versão.
- `version.json` espelha `version`, `previous_version`, `updated`, `changelog` com base no Service Worker.
- `update-version.py` (Python) e `update-version.bat` (Windows) automatizam incrementos e sincronização.
- Scripts NPM (`version:*`, incluindo `version:sync`) permitem executar os mesmos passos via linha de comando.
- Formato padrão: `major.minor.patch.build.revision` (ex.: `1.0.0.0.0`).

## 🚀 Como atualizar rapidamente

### Script Windows (recomendado)

```batch
# Incrementa versão patch (1.0.0.0.0 → 1.0.1.0.0)
update-version.bat

# Incrementa versão minor
update-version.bat minor

# Incrementa versão major
update-version.bat major

# Incrementa build
update-version.bat build

# Incrementa revisão
update-version.bat revision

# Define versão específica
update-version.bat --version 1.2.3.0.0

# Mostra versão atual
update-version.bat --show-current

# Sincroniza version.json/package.json com o valor definido em sw.js
update-version.bat sync
```

### Scripts NPM disponíveis

```bash
npm run version:patch     # Incrementa patch
npm run version:minor     # Incrementa minor
npm run version:major     # Incrementa major
npm run version:build     # Incrementa build
npm run version:revision  # Incrementa revisão
npm run version:show      # Exibe versão atual
npm run version:sync      # Replica versão definida em sw.js
```

### Python direto (opcional)

```bash
python update-version.py --type patch
python update-version.py --type build
python update-version.py --version 2.0.0.0.0
python update-version.py --show-current
python update-version.py --sync-from-sw
```

## 🔧 Ferramentas para desenvolvedores

### Debug no console

```javascript
window.cacheDebug.diagnostic(); // status geral
window.cacheDebug.update();     // força atualização imediata
window.cacheDebug.clear();      // limpa caches (uso em debug)
```

## 🧭 Navegação global reutilizável

Para manter o menu idêntico em todas as páginas, a navegação foi centralizada em dois arquivos reutilizados por JavaScript:

- `assets/templates/nav.html`: contém o HTML único do menu (logo, links e drawer mobile).
- `assets/js/nav.js`: injeta o template no `<header class="header">` de cada página e aplica o estado "ativo" correto.

### Como atualizar o menu

1. Edite apenas `assets/templates/nav.html` (ajuste textos, links ou ícones).
2. Se precisar de realces personalizados, utilize `data-nav-active="id"` no `<body>` da página desejada e cadastre o mesmo `data-nav-id` no link correspondente.
3. Garanta que a página carregue `assets/js/nav.js` **antes** de `assets/js/nav-responsive.js` (já configurado automaticamente).

> O template também é cacheado offline (via `cache-config.json`), por isso não há mais necessidade de replicar o HTML em cada página.

### Checklist rápido de deploy

1. Ajuste o conteúdo do site.
2. Atualize a versão com um dos comandos acima (`update-version.bat`, `npm run version:*`, etc.). Se alterou `SITE_VERSION` manualmente, finalize com `update-version.bat sync`/`npm run version:sync`.
3. Execute testes/lints necessários.
4. `git add sw.js version.json package.json` (e demais arquivos) `&& git commit -m "Atualização do site - versão X.Y.Z.W.V" && git push`
5. Valide em produção: a notificação deve aparecer para usuários com cache antigo.

## 🎉 Próximos passos

- Teste alterações localmente e observe o aviso de atualização.
- Documente mudanças no `changelog` dentro do `version.json` se necessário.
- Monitore os logs do navegador para garantir que o Service Worker esteja ativo.
- Aproveite a nova performance e experiência profissional do site!

---

**🏆 Parabéns! O site agora está equipado com um sistema de cache inteligente moderno.**

Terra Eletrônica – Tecnologia que liberta seu potencial
