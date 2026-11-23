# Legado do Vale 3D

Protótipo de sobrevivência e exploração medieval em 3D, para PC e celular, inspirado no gênero de construção e vida medieval.

## Fase 1 — Mundo e movimentação

- Vale 3D procedural com terreno ondulado, floresta, rio e morros.
- Câmera em primeira pessoa com olhar de 360°.
- Movimentação com teclado no PC e joystick na tela do celular.
- Corrida no PC com Shift.
- Colisões simples com árvores, rio e limites do mapa.
- Salvamento local da posição e da direção da câmera neste dispositivo.
- Inicialização com tratamento de falha ao carregar a biblioteca 3D.
- Leito do rio ajustado para manter a água visível ao longo do vale.
- Validação dos dados recuperados do salvamento local.

Os modelos são provisórios (low-poly). Construção, coleta, agricultura, animais, moradores e comércio serão adicionados nas próximas fases, depois da validação desta base.

## Controles

### PC
- WASD ou setas: movimentar.
- Shift: correr.
- Clicar e arrastar o mouse: olhar ao redor.

### Celular
- Joystick no canto inferior esquerdo: movimentar.
- Arrastar a área livre da tela: olhar ao redor.
- Segurar CORRER no canto inferior direito: correr enquanto houver vigor.

## Tecnologia

- HTML, CSS e JavaScript.
- Three.js carregado por CDN.
- GitHub Pages para publicação.
- LocalStorage para salvar a posição neste dispositivo.

## Publicação

O GitHub Pages publica automaticamente a branch `main` usando o publicador nativo do GitHub. O workflow em `.github/workflows/deploy.yml` valida a sintaxe JavaScript e a presença dos arquivos essenciais; ele não faz uma segunda publicação, evitando conflitos com o publicador nativo.

## Fase 2 — Sobrevivência inicial

- Indicadores de vida, fome, sede e vigor em HUD adaptado para PC e celular.
- Fome e sede diminuem gradualmente enquanto o jogo está ativo.
- Correr com Shift no PC ou segurando o botão CORRER no celular consome vigor; ficar parado recupera vigor.
- Quando fome ou sede chegam a zero, a vida começa a diminuir.
- Os quatro atributos são salvos localmente junto da posição do jogador.
- HUD adaptado para monitor e telas de celular.

Os indicadores começam em 100%. Frutas silvestres podem ser consumidas pela mochila para recuperar fome, e água pode ser bebida na margem segura do rio para recuperar sede. A vida continua sendo afetada quando fome ou sede chegam a zero.

## Próximas etapas

1. Validar cenário, movimentação, câmera e controles em PC e celular.
2. Corrigir problemas encontrados.
3. Iniciar sistemas de sobrevivência e inventário.
4. Construção, agricultura, produção, moradores e dinastia.
5. Substituir gradualmente os modelos provisórios por modelos 3D melhores.

## Fase 2 — Coleta e inventário (protótipo)

- Três pontos de coleta na clareira inicial: galhos, pedras e frutas silvestres.
- Mire no recurso com a mira central e pressione E no PC.
- No celular, o botão RECOLHER aparece quando um recurso está ao alcance e no centro da mira.
- A mochila abre com I no PC ou pelo botão MOCHILA.
- Quantidades recolhidas são guardadas localmente junto dos atributos e posição.
- Os pontos de coleta já recolhidos continuam recolhidos ao recarregar o jogo.
- Na mochila, use COMER 1 para consumir uma fruta silvestre e recuperar 25 pontos de fome.
- Na margem segura do rio, pressione E no PC ou toque em BEBER ÁGUA no celular para recuperar 35 pontos de sede.
- Comer e beber atualizam os indicadores e salvam o progresso imediatamente.

Esta etapa inclui coleta, mochila, alimentação e hidratação; fabricação e construção permanecem para etapas futuras.
