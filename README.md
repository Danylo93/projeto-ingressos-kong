# Conferência da Zona Leste - Sistema de Venda de Ingressos

![Imersão Full Stack && Full Cycle](https://events-fullcycle.s3.amazonaws.com/events-fullcycle/static/site/img/grupo_4417.png)

Aplicação de exemplo para gestão de ingressos de eventos de igrejas. Evento de demonstração: **Conferência da Zona Leste** organizado pela **Igreja Itaquera**.

## Rodar a aplicação

1. Clone este repositório e entre na pasta:

   ```bash
   git clone <repo>
   cd projeto-ingressos-kong
   ```

2. Levante os serviços com Docker:

   ```bash
   docker compose up
   ```

3. Acesse cada serviço conforme necessário (veja os READMEs específicos):

   - [Kong API Gateway](./kong-api-gateway/README.md)
   - [Nest.JS](./nestjs-partners-api/README.md)
   - [Golang](./golang/README.md)
   - [Next.JS](./nextjs-frontend/README.md)

O frontend requer as variáveis de ambiente `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_APP_URL`, `GOLANG_API_URL` e `GOLANG_API_TOKEN`. Consulte o README da pasta `nextjs-frontend` para detalhes. Para comprar ingressos é necessário cadastrar-se e fazer login; somente usuários autenticados conseguem selecionar assentos. Após o login, os dados do usuário aparecem no cabeçalho e os assentos escolhidos com o valor total aparecem no rodapé da página.

---

Estamos utilizando uma opção do `Docker: include`; ao rodarmos `docker compose up` na raiz do repositório todos os `docker-compose.yaml` das pastas subsequentes serão executados.



## Sobre o repositório
Esse repositório contém todo código utilizado durante as aulas para referência.

Faça seu fork e também nos dê uma estrelinha para nos ajudar a divulgar o projeto.

As instruções de instalações estão no README.md de cada projeto.

---