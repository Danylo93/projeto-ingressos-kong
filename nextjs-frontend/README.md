# Imersão Full Stack & FullCycle - Sistema de Venda de Ingressos

## Descrição

Repositório do FrontEnd da aplicação feito em Next.js. Agora inclui integração de pagamento com **Stripe** em modo de testes.

## Rodar a aplicação

Dentro da pasta `next-frontend` execute o comando abaixo para rodar o container `Docker`:
```
docker compose up
```

Quando o container estiver pronto, precisamos acessar o container do `nextjs` e executar a aplicação:

```
// entrar no container:
docker compose exec nextjs bash

// executar a aplicação:
npm run dev

```

### Variáveis de ambiente

Para testar o pagamento com Stripe é necessário definir as variáveis abaixo no arquivo `.env.local`:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
GOLANG_API_URL=http://localhost:8000
GOLANG_API_TOKEN=changeme
```

Utilize as chaves de teste disponibilizadas pelo [Stripe](https://stripe.com/docs/keys#test-live-modes) e cartões de teste para realizar compras.

Após subir a aplicação, acesse `http://localhost:3000` e crie uma conta com nome, e-mail, igreja, pastor, WhatsApp e senha. Somente usuários logados podem selecionar assentos; seus dados aparecem no cabeçalho e o resumo dos assentos escolhidos com o valor total é exibido no rodapé. Depois de selecionar os assentos, finalize o pagamento via Stripe.

Ao retornar da página de pagamento com sucesso, a aplicação confirma a compra junto à API em Go utilizando o `session_id` da Stripe, marcando os assentos como vendidos sem uso de dados falsos.

### Para Windows 

Lembrar de instalar o WSL2 e Docker. Vejo o vídeo: [https://www.youtube.com/watch?v=btCf40ax0WU](https://www.youtube.com/watch?v=btCf40ax0WU) 

Siga o guia rápido de instalação: [https://github.com/codeedu/wsl2-docker-quickstart](https://github.com/codeedu/wsl2-docker-quickstart)
