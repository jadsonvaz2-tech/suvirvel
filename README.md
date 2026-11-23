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

Os modelos são provisórios (low-poly). Construção, coleta, agricultura, criação de animais e cozinha já fazem parte do protótipo; moradores e comércio serão desenvolvidos nas próximas fases.

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


## Fase 2 — Bancada e fabricação de ferramentas

- Uma bancada de fabricação low-poly fica posicionada na clareira inicial, próxima ao ponto de partida.
- Aproxime-se da bancada e pressione E no PC ou toque em USAR BANCADA no celular.
- Na oficina, fabrique um machado simples usando 3 galhos e 2 pedras da mochila.
- Os materiais são descontados somente quando a fabricação é concluída; o machado fica registrado como ferramenta fabricada e aparece na mochila.
- A mochila e o estado do machado são salvos localmente, inclusive após atualizar a página.
- A receita já prepara o inventário para futuras ferramentas e atividades, sem alterar as funções de sobrevivência, coleta, alimentação e hidratação.


## Fase 2 — Corte de árvores e madeira

- Depois de fabricar o machado, aproxime-se de uma árvore e mire nela.
- Pressione E no PC ou toque em CORTAR ÁRVORE no celular para golpear.
- Cada árvore precisa de três golpes; o braço e o machado fazem uma animação a cada golpe.
- No terceiro golpe, a árvore cai com animação e deixa um toco e um tronco no chão.
- Cada árvore derrubada concede 4 unidades de madeira, exibidas na mochila.
- Árvores derrubadas, golpes em andamento e madeira ficam salvos localmente para continuar após recarregar a página.
- Árvores derrubadas deixam de bloquear a passagem. Os sistemas anteriores de coleta, sobrevivência, alimentação, hidratação e fabricação permanecem disponíveis.


## Fase 2 — Primeira cabana de madeira

- Use o botão CONSTRUIR CABANA para entrar no modo de posicionamento.
- A prévia translúcida acompanha o terreno à frente do personagem; mova-se para escolher outro local.
- Use R ou GIRAR 45° para mudar a orientação. No celular, use o botão GIRAR 45° no painel.
- A posição é validada para evitar sobreposição com árvores, bancada, recursos e rio, além de impedir terrenos muito inclinados.
- A construção custa 12 madeiras e 8 galhos. Confirme com E ou CONSTRUIR.
- A cabana pronta e sua posição/orientação ficam salvas localmente e reaparecem ao atualizar a página.
- É possível construir uma primeira cabana nesta etapa; o modo pode ser cancelado com ESC ou no botão ×.


## Fase 2 — Interior da cabana e baú

- Aproxime-se da entrada e pressione E (ou use o botão de ação no celular) para abrir ou fechar a porta.
- Com a porta aberta, atravesse a entrada para acessar o interior; as paredes continuam bloqueando a passagem.
- Um baú de madeira fica dentro da cabana. Aproxime-se dele e pressione E ou toque em ABRIR BAÚ.
- Guarde ou retire unidades de madeira, galhos, pedras e frutas usando os botões do baú.
- A porta, o conteúdo do baú, a mochila e a posição do personagem são salvos localmente. O progresso permanece após atualizar a página.


## Fase 2 — Descanso na cabana

- Uma cama de madeira aparece no interior da cabana construída.
- Aproxime-se da cama e pressione E (ou toque no botão DORMIR no celular).
- Escolha dormir por 6 ou 8 horas. O relógio do vale avança pelo período escolhido e o vigor é recuperado completamente.
- Fome e sede diminuem durante o descanso; se alguma necessidade chegar a zero, a saúde também pode ser afetada.
- O relógio (dia e horário), vigor e necessidades são salvos automaticamente e continuam após atualizar a página.
- O relógio do jogo começa no Dia 1 às 08:00 e avança um minuto a cada cinco segundos reais.


## Fase 3 — Agricultura

- Ao construir a cabana, três canteiros de madeira e terra aparecem ao lado do abrigo.
- A mochila começa com 3 sementes de cada cultura: trigo, cenoura e repolho.
- Aproxime-se de um canteiro e pressione E (ou use o botão de ação no celular) para plantar ou colher.
- Cada canteiro recebe uma cultura por vez. O crescimento é calculado pelo relógio do jogo: trigo 6 horas, cenoura 8 horas e repolho 10 horas.
- Colha as culturas maduras e consuma trigo (+20 de fome), cenoura (+28) ou repolho (+34).
- Sementes, colheitas, horário e estado de cada canteiro são salvos automaticamente no dispositivo.


## Fase 4 — Criação de animais

- Ao construir a cabana, surge um galinheiro com três galinhas e um cercado com duas ovelhas.
- Aproxime-se da cerca e pressione E (ou use o botão de ação no celular) para cuidar do grupo.
- Alimente as galinhas com 1 trigo: elas produzem ovos a cada 6 horas de jogo enquanto estiverem alimentadas.
- Alimente as ovelhas com 1 repolho: elas produzem lã a cada 12 horas de jogo enquanto estiverem alimentadas.
- Cada alimentação mantém o grupo alimentado por 12 horas de jogo. A produção fica disponível para recolher no painel do respectivo cercado.
- Os ovos podem ser consumidos para recuperar 22 pontos de fome; a lã fica guardada na mochila para futuras receitas.
- Animais, alimentação, produção pendente, ovos e lã são salvos automaticamente.


## Fase 5 — Cozinha e preparo de alimentos

- Ao construir a cabana, uma estação rústica com fogueira e panela aparece ao lado do abrigo.
- Aproxime-se da fogueira e pressione E no PC ou use o botão de ação no celular para abrir as receitas.
- Pão caseiro: 2 trigos + 1 madeira como combustível; recupera 45 pontos de fome.
- Omelete: 2 ovos + 1 madeira; recupera 52 pontos de fome.
- Sopa de legumes: 1 cenoura + 1 repolho + 1 madeira; recupera 62 pontos de fome.
- Mingau de frutas: 2 frutas silvestres + 1 trigo + 1 madeira; recupera 55 pontos de fome.
- Cada preparo consome os ingredientes e uma madeira, e adiciona uma refeição à mochila.
- As refeições preparadas podem ser consumidas na mochila; quantidades e ingredientes continuam salvos localmente.

## Fase 5 — Cozinha e preparo de alimentos

- Ao construir a cabana, uma estação rústica com fogueira e panela aparece ao lado do abrigo.
- Aproxime-se da fogueira e pressione E no PC ou use o botão de ação no celular para abrir as receitas.
- Pão caseiro: 2 trigos + 1 madeira como combustível; recupera 45 pontos de fome.
- Omelete: 2 ovos + 1 madeira; recupera 52 pontos de fome.
- Sopa de legumes: 1 cenoura + 1 repolho + 1 madeira; recupera 62 pontos de fome.
- Mingau de frutas: 2 frutas silvestres + 1 trigo + 1 madeira; recupera 55 pontos de fome.
- Cada preparo consome os ingredientes e uma madeira, e adiciona uma refeição à mochila.
- As refeições preparadas podem ser consumidas na mochila; quantidades e ingredientes continuam salvos localmente.

## Fase 6 — Vestuário e proteção contra o frio

- Ao construir a cabana, um tear artesanal aparece próximo à cozinha.
- Aproxime-se e pressione E no PC ou use o botão de ação no celular para abrir o tear.
- Transforme 2 lãs em 1 tecido.
- Túnica: 2 tecidos + 1 lã; proteção térmica de 28%.
- Calças: 1 tecido + 1 lã; proteção térmica de 18%.
- Botas: 1 tecido + 1 lã; proteção térmica de 14%.
- Fabrique cada peça uma vez, equipe ou retire pelo painel do tear e acompanhe os itens na mochila.
- O frio atua durante a noite (18h às 7h). O calor corporal recupera durante o dia ou dentro da cabana; roupas equipadas reduzem a perda de calor.
- Calor corporal, roupas, equipamentos e materiais são salvos automaticamente.

## Interface da mochila

- A mochila organiza os itens em recursos e ferramentas, sementes, alimentos e materiais especiais.
- O cabeçalho e o rodapé permanecem visíveis; somente a lista interna rola quando há muitos itens.
- A grade se adapta à largura e à altura disponíveis em computadores e celulares, mantendo nomes, quantidades e ações dentro do painel.
- A reorganização é somente visual: itens, quantidades, consumo e salvamento continuam usando o mesmo inventário existente.


## Fase 7 — Sementes renováveis e pacote de retomada da horta

- Em salvamentos existentes, o jogador recebe uma única vez +10 sementes de trigo, +10 de cenoura e +10 de repolho para retomar a produção.
- Ao colher trigo, cenoura ou repolho, recebe de volta 1 semente da mesma cultura.
- Cada colheita tem ainda 25% de chance de conceder uma segunda semente.
- O pacote inicial é marcado no salvamento para não ser concedido novamente ao recarregar o jogo.
- Sementes e colheitas continuam integradas à mochila e ao sistema de plantio já existente.


## Ajuste de acesso ao tear

- O tear foi reposicionado para o lado oposto à cozinha e aos cercados, com espaço mais livre para aproximação.
- A área de interação foi ampliada e tem prioridade sobre água, cozinha e animais quando o jogador está junto à estação.
- A tecla E no PC e o botão de ação no celular abrem diretamente o painel do tear.
