# Imersão Full Stack & FullCycle - Sistema de Venda de Ingressos

## Descrição

Repositório do FrontEnd da aplicação feito em Next.js

## Rodar a aplicação

Dentro da pasta `next-frontend` execute o comando abaixo para rodar o container `Docker`:
```
docker compose up
```

Quando o container estiver pronto, precisamos acessar o container do `nextjs` e executar a aplicação:

```
// entrar no container:
docker compose exec nextjs bash

// instalar as dependências:
npm install

// executar a aplicação:
npm run dev

```

### Para Windows 

Lembrar de instalar o WSL2 e Docker. Vejo o vídeo: [https://www.youtube.com/watch?v=btCf40ax0WU](https://www.youtube.com/watch?v=btCf40ax0WU) 

Siga o guia rápido de instalação: [https://github.com/codeedu/wsl2-docker-quickstart](https://github.com/codeedu/wsl2-docker-quickstart)