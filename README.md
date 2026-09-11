# Iguana+

Site da Iguana+. O guia completo está em [docs/GUIA-DE-EDICAO.md](docs/GUIA-DE-EDICAO.md).

## Estrutura

```text
iguana-plus/
├── index.html              Página principal: textos e estrutura
├── package.json            Comandos npm e informações do projeto
├── README.md               Este resumo e ponto de entrada do GitHub
├── assets/
│   ├── data/chat.json      Conversas e caminhos do chat
│   └── img/                Fotos, logos e mascotes
├── css/styles.css          Aparência, responsividade e animações CSS
├── js/                     Configuração, conteúdo e interações do site
├── scripts/server.mjs      Servidor para visualizar o site localmente
├── tests/                  Testes automatizados
├── docs/                   Guia de edição
└── backups/                Cópias antigas locais; ignoradas pelo Git
```

## Iniciar

Com Node.js 18 ou superior, abra um terminal **na pasta deste README**, onde está `package.json`, e execute:

```powershell
npm start
```

Abra http://127.0.0.1:8765. Para verificar os scripts, use `npm run check`.

## Onde começar a editar

- **Fotos do portfólio e serviços:** `js/data.js`.
- **WhatsApp, e-mail e redes sociais:** `js/config.js`.
- **Conversas do chat:** `assets/data/chat.json`.
- **Textos da página:** `index.html`.
- **Cores, tamanhos e aparência:** `css/styles.css`.

Use **Ctrl+F → EDITAR:** nos arquivos para localizar os comentários explicativos.

`package.json` organiza os comandos do projeto; ele não contém conversas do chat. Mantenha-o na raiz para usar `npm start` normalmente.

Para hospedar o site estático, envie `index.html`, `assets/`, `css/` e `js/`. Documentação, testes, servidor local e backups são arquivos de apoio.
