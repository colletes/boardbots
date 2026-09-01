---
name: deploy-to-prod
description: >-
  Use this skill whenever the user explicitly requests to promote, merge, or deploy tested bot updates from staging into the production environment (main branch).
---

# Deploy to Production (deploy-to-prod)

Esta skill define o procedimento padronizado e seguro para promover alterações validadas no ambiente de Staging para o ambiente de Produção.

## 1. Pré-Requisitos e Validações Obrigatórias

Antes de realizar o deploy em produção, o agente DEVE verificar:

1. **Aprovação Explícita do Usuário:** O usuário deve ter testado no link de staging (`https://colletes.github.io/boardbots/staging/`) e expressado intenção de publicar em produção (ex: "deploy para prod", "pode subir para produção", "merge staging para main").
2. **Git Status Limpo em Staging:** Nenhuma alteração pendente não commitada na branch `staging`.
3. **Histórico Sincronizado:** A branch `staging` local deve estar em dia com `origin/staging`.

## 2. Passo-a-Passo de Execução

Execute rigorosamente a sequência de comandos abaixo:

### Passo 1: Garantir que staging está commitada e sincronizada
```bash
git checkout staging
git status
git pull origin staging
```

### Passo 2: Mudar para main e atualizar com o remoto
```bash
git checkout main
git pull origin main
```

### Passo 3: Mesclar staging em main
```bash
git merge staging -m "chore(release): promote staging updates to production"
```

### Passo 4: Fazer push para a branch main no GitHub
```bash
git push origin main
```
*Isso dispara automaticamente o GitHub Actions que publica o conteúdo de `main` em `https://colletes.github.io/boardbots/`.*

### Passo 5: Retornar imediatamente para a branch staging
```bash
git checkout staging
```
*O agente SEMPRE deve deixar o repositório posicionado na branch `staging` para que o próximo ciclo de desenvolvimento comece no ambiente correto.*

## 3. Comunicação com o Usuário

Ao concluir o deploy:
1. Informe que a promoção para Produção foi realizada com sucesso.
2. Forneça o link de Produção para conferência: [`https://colletes.github.io/boardbots/`](https://colletes.github.io/boardbots/).
3. Confirme que o ambiente de trabalho ativo foi retornado para `staging`.
