# Legado do Vale 3D

Protótipo de sobrevivência e exploração medieval em 3D, para PC e celular, inspirado no gênero de construção e vida medieval.

## Primeira entrega — Fase 1

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

## Tecnologia

- HTML, CSS e JavaScript.
- Three.js carregado por CDN.
- GitHub Pages para publicação.
- LocalStorage para salvar a posição neste dispositivo.

## Publicação

O GitHub Pages publica automaticamente a branch `main` usando o publicador nativo do GitHub. O workflow em `.github/workflows/deploy.yml` valida a sintaxe JavaScript e a presença dos arquivos essenciais; ele não faz uma segunda publicação, evitando conflitos com o publicador nativo.

## Próximas etapas

1. Validar cenário, movimentação, câmera e controles em PC e celular.
2. Corrigir problemas encontrados.
3. Iniciar sistemas de sobrevivência e inventário.
4. Construção, agricultura, produção, moradores e dinastia.
5. Substituir gradualmente os modelos provisórios por modelos 3D melhores.
