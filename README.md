
# Guia rápido: HTTPS em `www.terraeletronica.com.br`

Este repositório hospeda o site público da Terra Eletrônica por meio do GitHub Pages. Para que o endereço `https://www.terraeletronica.com.br` funcione com certificado automático, é preciso manter os registros DNS corretos no Registro.br e validar a configuração na aba **Pages** do GitHub.

## 1. Configuração DNS no Registro.br

1. Acesse [https://registro.br](https://registro.br) → **Domínios** → `terraeletronica.com.br` → **Editar Zona DNS**.
2. Remova registros antigos que apontem para outros provedores (A, AAAA, CNAME ou TXT de validação que não sejam usados).
3. Cadastre **quatro registros A** no domínio raiz (apex):

    | Host | Tipo | Valor |
    | ---- | ---- | ----- |
    | `@`  | A    | `185.199.108.153` |
    | `@`  | A    | `185.199.109.153` |
    | `@`  | A    | `185.199.110.153` |
    | `@`  | A    | `185.199.111.153` |

4. Opcional (recomendado): cadastre **quatro registros AAAA** para suporte IPv6:

    | Host | Tipo | Valor |
    | ---- | ---- | ----- |
    | `@`  | AAAA | `2606:50c0:8000::153` |
    | `@`  | AAAA | `2606:50c0:8001::153` |
    | `@`  | AAAA | `2606:50c0:8002::153` |
    | `@`  | AAAA | `2606:50c0:8003::153` |

5. Cadastre o **CNAME** do subdomínio `www` apontando para o usuário/organização GitHub (garanta o ponto final):

    | Host  | Tipo  | Valor                     |
    | ----- | ----- | ------------------------- |
    | `www` | CNAME | `adalbertobi.github.io.` |

6. Salve e publique a zona DNS.

## 2. Ajustes no GitHub Pages

1. No repositório → **Settings** → **Pages**, confirme que o campo **Custom domain** contém `www.terraeletronica.com.br`. Se alterar, clique em **Save changes**.
2. Verifique o arquivo `CNAME` na raiz do repositório: ele deve conter apenas `www.terraeletronica.com.br` em uma linha.
3. Após a propagação do DNS (pode levar até 6 h), a opção **Enforce HTTPS** deve ficar disponível. Marque-a para forçar o redirecionamento para HTTPS.

## 3. Testes e monitoramento

- Use `nslookup`/`dig` ou serviços como [https://dnschecker.org](https://dnschecker.org) para confirmar que o apex responde com os IPs do GitHub e que `www` resolve para `adalbertobi.github.io`.
- Acesse `https://terraeletronica.com.br`. Deve ocorrer redirecionamento 301 para `https://www.terraeletronica.com.br` com certificado válido emitido por “GitHub, Inc.”.
- Valide cabeçalhos de segurança (HSTS, CSP) com [https://securityheaders.com](https://securityheaders.com). Ajustes podem ser feitos via `_headers` ou serviços como Cloudflare, se adotados.
- Configure alertas de expiração de certificado e uptime em serviços como UptimeRobot.

## 4. Solução de problemas

| Sintoma | Possível causa | Ação sugerida |
|---------|----------------|---------------|
| “HTTPS not available” no GitHub Pages | DNS ainda aponta para servidor antigo ou CNAME incorreto | Reconfirme registros conforme tabela acima e aguarde propagação |
| `terraeletronica.com.br` abre sem redirecionar para `www` | Registros A faltando ou `Enforce HTTPS` desmarcado | Revise os registros A e habilite o redirecionamento nas Configurações |
| Warning de certificado inválido | Propagação parcial ou CDN interferindo | Limpe caches, aguarde até 24h, evite proxys que insiram certificados próprios |

---

Manter esses registros garante que o GitHub Pages consiga emitir e renovar automaticamente o certificado TLS para `www.terraeletronica.com.br`.

