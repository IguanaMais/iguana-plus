# Iguana+

Site estático em HTML, CSS e JavaScript. Para executar, instale Node.js 18 ou superior, abra o terminal nesta pasta e rode:

```powershell
npm start
```

Acesse http://127.0.0.1:8765. Não abra o HTML diretamente com duplo clique: o chat carrega um JSON via HTTP. O servidor é destinado ao desenvolvimento local.

## Onde alterar cada parte

Os arquivos HTML, CSS e JavaScript têm um **MAPA DE EDIÇÃO** no início. Use **Ctrl+F** para procurar **EDITAR:** ou o nome da seção.

| Quero alterar | Arquivo / trecho |
| --- | --- |
| Títulos, textos, botões e ordem das seções | index.html; comentários com nomes das seções |
| Logo da aba, cabeçalho e mascotes | index.html; atributos href dos ícones e src das imagens |
| Fotos e ordem do carrossel | js/data.js → IGUANA_PROJECTS; exemplo comentado no próprio arquivo |
| Tamanho da imagem e prévias laterais | css/styles.css → Galeria com imagem central |
| Serviços e etapas do processo | js/data.js → IGUANA_SERVICES / IGUANA_PROCESS |
| WhatsApp, e-mail, redes e estatísticas | js/config.js |
| Assuntos e respostas do chat | assets/data/chat.json; preserve os destinos e não coloque comentários no JSON |
| Cores, fontes e espaçamento | css/styles.css → :root e bloco da seção |
| Intensidade da entrada dos blocos | js/motion.js → enter() e enterBlock() |
| Altura e velocidade da flutuação | css/styles.css → iguana-float e duração 6s |
| Campos do formulário | index.html; validação/envio em js/main.js |

## Conteúdo

- `js/config.js`: WhatsApp, e-mail, redes sociais, estatísticas e chave pública do formulário Web3Forms.
- `js/data.js`: serviços, etapas e exemplos do portfólio. O carrossel exibe somente os itens com `image` preenchida. Para adicionar fotos, salve cada arquivo em `assets/img/` e adicione um objeto com `id`, `title`, `image` e, opcionalmente, `link` em `IGUANA_PROJECTS`. Setas, indicadores e prévias laterais aparecem automaticamente a partir de duas imagens. A navegação aceita toque, setas do teclado e botões; não há avanço automático.
- `assets/data/chat.json`: mensagens e opções do atendimento.
- `css/styles.css`: identidade visual e layout responsivo.
- `js/motion.js`: entrada suave de seções e cartões, movimento das mascotes e controle para pausar animações e indicação da seção atual no menu. Respeita movimento reduzido e mantém o conteúdo visível sem JavaScript.

O formulário usa Web3Forms e exige conexão à internet. A chave pública existente foi preservada; nenhuma credencial privada deve ser adicionada ao site. Os testes simulam o serviço e não enviam mensagens reais. A entrega ao e-mail e a ativação da chave precisam ser verificadas pelo responsável pela conta.

Antes da publicação, confirme o domínio `www.iguanaplus.com.br` nos metadados, os perfis sociais (marcados como provisórios na configuração), as estatísticas e os cases. Publique `index.html` e as pastas `css`, `js`, `assets` em hospedagem estática. Não publique `.git`, arquivos `.bak`, testes ou ferramentas de desenvolvimento.

## Verificação

`npm run check` valida a sintaxe dos scripts. Para repetir os testes de navegador com o Microsoft Edge instalado:

```powershell
npm install --no-save playwright
npm start
# Em outro terminal, nesta mesma pasta:
npm run test:browser
npm run test:motion
npm run test:portfolio
```

Os testes verificam renderização, arquivos locais, links sociais, carrossel, animações, chat, navegação por teclado, larguras de 320 a 1440 pixels, validação do formulário, sucesso, falha HTTP, falha de conexão e prevenção de envio duplicado. As requisições de envio são interceptadas antes de sair do navegador.
