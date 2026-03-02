<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Fluxo de Partidas, Súmulas e Classificação

Resumo prático de como os módulos se conectam no backend:

1. Partida (match)
  - Responsável por agendar e manter partidas.
  - Cada partida referencia: local, time mandante, time visitante e (opcionalmente) delegado.
  - Status da partida: `scheduled`, `ongoing`, `finished`, `canceled`.

2. Súmula (match-report)
  - Representa o resultado oficial informado para uma partida.
  - Contém: placar mandante/visitante, observações, gols e cartões.
  - Status da súmula: `pending`, `validated`, `rejected`.
  - Regras principais:
    - Delegado só envia súmula da partida atribuída a ele.
    - Súmula validada não pode ser alterada.
    - Ao criar súmula, a partida vai para `finished`.
    - Ao remover súmula, a partida volta para `scheduled`.

3. Classificação (standings)
  - É persistida em tabela própria (`standing`).
  - A tabela armazena: time, pontos, jogos, vitórias, empates, derrotas, gols pró/contra, saldo e posição.
  - A classificação é recalculada automaticamente no GET de standings, usando apenas súmulas `validated`.
  - Não existe CRUD manual de classificação (POST/PATCH/DELETE retornam operação não suportada).

4. Regra de pontuação e ordenação
  - Vitória = 3 pontos, empate = 1, derrota = 0.
  - Ordem da tabela: pontos desc, vitórias desc, saldo de gols desc.

5. Ciclo completo (visão rápida)
  - Admin/gestão cria a partida.
  - Delegado envia a súmula (`pending`).
  - Revisão aceita (`validated`) ou rejeita (`rejected`).
  - Apenas súmulas validadas entram na classificação persistida.

## Formatos de competição (League x Knockout)

Hoje o backend suporta dois formatos diferentes de competição:

1. League (pontos corridos) — módulo `standings`
  - Formato de tabela por pontos (3/1/0).
  - Vence quem acumula mais pontos ao longo das partidas válidas.
  - Desempate atual: vitórias e saldo de gols.
  - Observação: este módulo poderá ser renomeado para `tournament-league` no futuro sem mudar o conceito.

2. Knockout (mata-mata) — módulo `tournament-knockout`
  - Formato eliminatório por fases (ex.: Oitavas, Quartas, Semi, Final).
  - Cada confronto é um vínculo manual para uma partida já existente em `match`.
  - O admin pode definir vencedor manualmente ou deixar o sistema inferir quando houver súmula validada sem empate.

Em resumo: `standings` e `tournament-knockout` não competem entre si; são dois modelos de torneio diferentes que podem coexistir no mesmo sistema.

## Tournament Knockout (manual)

Endpoints principais:

- `POST /tournament-knockout`
- `GET /tournament-knockout`
- `GET /tournament-knockout/:id`
- `PATCH /tournament-knockout/:id`
- `DELETE /tournament-knockout/:id`

Payload base (create/update):

```json
{
  "tournamentName": "Copa PlayZone 2026",
  "stage": "QUARTER_FINAL",
  "roundOrder": 1,
  "slot": 1,
  "matchId": 42,
  "winnerTeamId": 7,
  "notes": "W.O. visitante"
}
```

Regras importantes do knockout:

- `matchId` deve existir no módulo `match`.
- Uma partida só pode estar em um único confronto knockout.
- Não pode repetir `tournamentName + stage + slot`.
- Se `winnerTeamId` for informado, deve ser um dos times da partida vinculada.
- Se `winnerTeamId` não for informado, o sistema tenta inferir o vencedor via `match-report` validada (apenas quando não há empate).

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migrations (TypeORM + Postgres)

## Request body limit

Para payloads JSON maiores (ex.: `imageUrl` base64 no endpoint `POST /location`), configure:

```env
REQUEST_BODY_LIMIT=1mb
```

Se não definir, o backend usa `1mb` por padrão.

Para controlar o tamanho do campo `imageUrl` no `POST/PATCH /location`, configure:

```env
LOCATION_IMAGE_URL_MAX_LENGTH=200000
```

Se não definir, o backend usa `200000` caracteres por padrão.

Para usar migrations com segurança:

1. Desative sincronização automática do schema:

```env
DB_SYNCHRONIZE=false
```

2. Garanta que o banco esteja configurado:

```env
DATABASE_URL=postgres://user:password@host:5432/database
```

3. (Opcional) Executar migrations automaticamente no startup:

```env
DB_MIGRATIONS_RUN=true
```

Comandos:

```bash
# cria arquivo vazio de migration (Windows npm config)
npm run migration:create --name=InitSchema

# gera migration comparando entities x banco (Windows npm config)
npm run migration:generate --name=InitSchema

# executa migrations pendentes
npm run migration:run

# reverte última migration aplicada
npm run migration:revert

# lista status das migrations
npm run migration:show
```

Observação: As migrations ficam em `src/database/migrations` e o DataSource da CLI está em `src/database/data-source.ts`.

## Bootstrap do primeiro admin

Para criar automaticamente um admin no startup (apenas uma vez, de forma idempotente), configure no `.env`:

```env
BOOTSTRAP_ADMIN_ENABLED=true
BOOTSTRAP_ADMIN_NAME=PlayZone Admin
BOOTSTRAP_ADMIN_EMAIL=admin@playzone.com
BOOTSTRAP_ADMIN_PASSWORD=troque-por-uma-senha-forte
BOOTSTRAP_ADMIN_TYPE=delegado
```

Regras importantes:

- Se já existir usuário com esse email e role `admin`, nada é criado.
- Se existir usuário com esse email mas role diferente, a criação é ignorada e um warning é emitido.
- Em produção, o bootstrap só roda se também definir:

```env
BOOTSTRAP_ADMIN_ALLOW_IN_PRODUCTION=true
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
