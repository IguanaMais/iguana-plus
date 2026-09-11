# Iguana+

Site estático em HTML, CSS e JavaScript. Para executar, instale Node.js 18 ou superior, abra o terminal nesta pasta e rode:

```powershell
npm start
```

Acesse http://127.0.0.1:8765. Não abra o HTML diretamente com duplo clique: o chat carrega um JSON via HTTP. O servidor é destinado ao desenvolvimento local.

## Conteúdo

- `js/config.js`: WhatsApp, e-mail, redes sociais, estatísticas e chave pública do formulário Web3Forms.
- `js/data.js`: serviços, etapas e exemplos do portfólio. Substitua os exemplos por projetos autorizados e informe seus links para habilitar “Ver projeto”.
- `assets/data/chat.json`: mensagens e opções do atendimento.
- `css/styles.css`: identidade visual e layout responsivo.

O formulário usa Web3Forms e exige conexão à internet. A chave pública existente foi preservada; nenhuma credencial privada deve ser adicionada ao site. Os testes simulam o serviço e não enviam mensagens reais. A entrega ao e-mail e a ativação da chave precisam ser verificadas pelo responsável pela conta.

Antes da publicação, confirme o domínio `www.iguanaplus.com.br` nos metadados, os perfis sociais (marcados como provisórios na configuração), as estatísticas e os cases. Publique `index.html` e as pastas `css`, `js`, `assets` em hospedagem estática. Não publique `.git`, arquivos `.bak`, testes ou ferramentas de desenvolvimento.

## Verificação

`npm run check` valida a sintaxe dos scripts. Para repetir os testes de navegador com o Microsoft Edge instalado:

```powershell
npm install --no-save playwright
npm start
# Em outro terminal, nesta mesma pasta:
npm run test:browser
```

Os testes verificam renderização, arquivos locais, links sociais, filtros, chat, navegação por teclado, larguras de 320 a 1440 pixels, validação do formulário, sucesso, falha HTTP, falha de conexão e prevenção de envio duplicado. As requisições de envio são interceptadas antes de sair do navegador.
