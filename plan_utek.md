# Plano de Correção Visual — Ultra Tiny Epic Kingdoms

## Diagnóstico

A interface atual de `bots/utek_bot.html` está estruturalmente quebrada, não apenas pouco refinada:

- O HTML usa classes essenciais que não possuem regras no CSS principal: `.container`, `.row`, `.small`, `.badge`, `.btn-icon`, `.icon-inline`, `.two-col`, `.wide-grid`, `.forest`, `.secondary`, `.danger`, `.checkbox-row`, `.guidance` e `.log-list`.
- Sem `.btn-icon` e `.icon-inline`, os SVGs ficam com dimensões intrínsecas ou sem escala controlada. Isso explica os ícones gigantes e os botões visualmente desproporcionais na captura.
- Sem `.row`, `.two-col` e `.wide-grid`, o conteúdo não respeita a composição de colunas prevista pelo HTML e se comprime em uma sequência longa e desorganizada.
- O arquivo contém um segundo bloco `<style>` quase duplicado depois do JavaScript, próximo ao final do documento. Esse bloco repete variáveis e componentes, mas não resolve as classes ausentes e torna a manutenção/cascata mais frágil.
- Há uma regra de desktop para `#game-ui`, mas não existe elemento com esse id; portanto ela não organiza a interface real.
- A linguagem visual atual mistura mesa de madeira, pergaminho claro, botões verdes/vermelhos e componentes genéricos. Falta uma hierarquia diegética clara de reino medieval de fantasia.

## Objetivo

Transformar o bot em uma interface legível e intencional, inspirada em um painel de reino medieval: pergaminho, madeira, brasões, selos, placas de comando e cores distintas para jogador e Bot. A lógica de turnos, pontuação, guerra, persistência e os dois modos solo devem permanecer inalterados.

## Plano de Implementação

1. Fazer backup lógico criando o próximo arquivo somente se isso for solicitado; por padrão, editar `bots/utek_bot.html` em lugar, conforme a convenção atual desta tarefa.
2. Consolidar o CSS em um único bloco no `<head>`:
   - remover o bloco duplicado de estilos do final do documento;
   - manter o botão Home no local correto, sem estilos soltos depois do JavaScript;
   - eliminar regras mortas como `#game-ui` ou adaptá-las aos ids/classes reais.
3. Restaurar as primitivas de layout e tipografia:
   - `.container` como coluna principal com largura máxima e espaçamento consistente;
   - `.row` como flex responsivo com `gap`, quebra controlada e alinhamento vertical;
   - `.two-col` e `.wide-grid` como grids responsivos, com uma coluna no mobile;
   - `.small`, `.badge`, `.guidance` e `.log-list` com escala adequada para leitura;
   - `min-width: 0` nos itens de grid/flex para evitar overflow de textos longos.
4. Corrigir a escala dos controles:
   - definir `.icon-inline` e `.btn-icon` com largura/altura explícitas, `flex-shrink: 0` e alinhamento vertical;
   - aplicar um sistema único de botões (`.btn`, `.forest`, `.secondary`, `.danger`, `.btn-primary`) com alturas, padding e tamanhos de fonte proporcionais;
   - limitar botões de ação à largura do conteúdo, usando `.btn-block` apenas onde o comando realmente deve ocupar a linha inteira;
   - ajustar o botão flutuante de ajuda para não competir visualmente com o conteúdo;
   - garantir alvos de toque de pelo menos 44px sem criar botões visualmente enormes.
5. Reorganizar a experiência em camadas diegéticas:
   - fundo de mesa escura com textura discreta;
   - hero compacto com a arte real de `../assets/art/Utek.webp`, tratado como estandarte/brasão do reino;
   - setup como pergaminho principal, sem excesso de cards aninhados;
   - tracker de rodada como painel de carta de ação;
   - recursos/pontuação como placas de reino separadas, com acentos consistentes;
   - compass oficial como artefato central, com moldura de madeira/metal e escala controlada;
   - histórico como registro de escriba, mantendo contraste e rolagem próprios.
6. Definir uma hierarquia cromática explícita:
   - pergaminho para superfícies de leitura;
   - verde floresta para ações positivas e reino do jogador/Bot quando apropriado;
   - bordô para perigo, guerra e encerramento;
   - dourado apenas para destaque, seleção e brasões;
   - texto escuro em superfícies claras e texto claro apenas sobre fundos escuros.
7. Preservar e testar os estados funcionais existentes:
   - setup vs. jogo (`.hidden`);
   - modo GJJ vs. Oficial (`.gjj-only`/`.official-only`);
   - início, continuação, reset e encerramento;
   - tracker de ações, Bússola, guidance, resolvedor de guerra e log;
   - troca PT/EN e atualização de textos HTML.

## Validação

- Executar `node --check` no script inline extraído de `bots/utek_bot.html`.
- Abrir o bot em servidor local e verificar, no setup inicial, que apenas o setup aparece.
- Medir via navegador os SVGs `.icon-inline` e `.btn-icon`; nenhum deve exceder o tamanho definido pelo CSS.
- Verificar que os botões principais mantêm alturas semelhantes, texto dentro do botão e alvos de toque utilizáveis.
- Iniciar uma partida nos modos GJJ e Oficial e confirmar que os grids, tracker, compass e painéis não colapsam nem criam overflow horizontal.
- Testar em pelo menos 1440px, 1024px, 768px e 390px de largura.
- Capturar screenshots do setup, jogo GJJ e jogo Oficial para comparar hierarquia, proporção e legibilidade.
- Verificar troca de idioma, abertura do modal de ajuda, avanço de turno, encerramento, reset e console sem erros.
- Confirmar que nenhuma função de lógica ou chave de i18n foi removida durante a consolidação do CSS.

## Critérios de Conclusão

- A interface não exibe mais SVGs gigantes ou botões desproporcionais.
- Setup e jogo ocupam uma composição previsível em desktop e mobile.
- Os componentes parecem pertencer a um painel de reino medieval de fantasia, sem parecer um formulário genérico.
- O modo selecionado controla corretamente a visibilidade dos blocos.
- A lógica existente permanece funcional e a página não produz erros no console.

## Status da Implementação

Implementado em `bots/utek_bot.html`:

- Restauradas as primitivas de layout ausentes: container, rows, grids, badges, textos auxiliares, guidance e log.
- Restauradas dimensões explícitas para ícones inline e ícones de botões.
- Aplicado um sistema proporcional para botões principais, variantes de ação, botão flutuante e alvos de toque.
- Criada composição responsiva para setup, tracker, pontuação, assistência, guerra e histórico.
- Aplicada direção visual de mesa de reino medieval, com estandarte, pergaminho, madeira, brasões e acentos de floresta/bordô/dourado.
- Neutralizado o bloco duplicado de estilos no final do HTML para evitar sobrescritas acidentais.
- Restaurado o botão de café como link compacto direto, sem aplicar o seletor incorreto de link-filho.
- Adicionadas as regras visuais da Bússola Oficial: ponteiro, marcações, rótulo da rolagem, badge de fase e estado noturno.
- Corrigida a geometria final do ponteiro e das marcações da Bússola, que estavam sendo manipuladas pelo JavaScript sem estilos correspondentes.
- Mantida a alternância entre modo GJJ e Modo Oficial, sem alteração da lógica de turnos ou pontuação.

Validação concluída:

- `node --check` do JavaScript inline passou.
- Desktop em 1440px e mobile em 390px sem overflow horizontal.
- SVGs medidos no navegador com dimensões controladas.
- Setup e jogo alternam corretamente.
- Modos GJJ e Oficial exibem apenas seus blocos correspondentes.
- Partida iniciou e renderizou tracker, Bússola, assistência, resolvedor de guerra e histórico sem erros de página.
- Bússola Oficial testada com rolagem real e ponteiro girando para o número/ação resultante.
- Botão de café medido em 185×44 px no mobile, sem dimensões exageradas.
- Bússola Oficial medida em 240×240 px no mobile, com 12 marcações, ponteiro rotacionado e rolagem exibida no centro.
