import { oakCors } from 'https://deno.land/x/cors@v1.2.2/mod.ts';
import {
  Application,
  FlashServer,
  hasFlash,
  Router,
} from 'https://deno.land/x/oak@v11.1.0/mod.ts';

import logger from 'https://deno.land/x/oak_logger@1.0.0/mod.ts';
import {
  fetchPokemon,
  getPokemonById,
  incrementPokemonVote,
} from './db_adapter.ts';

const router = new Router();

router.get('/', async (ctx) => {
  const getRandomPokemonId = () => Math.ceil(Math.random() * 151);

  const pokemonAId = getRandomPokemonId();
  let pokemonBId = getRandomPokemonId();
  while (pokemonAId === pokemonBId) {
    pokemonBId = getRandomPokemonId();
  }

  ctx.response.body = [
    await getPokemonById(pokemonAId),
    await getPokemonById(pokemonBId),
  ];
});

router.get('/vote/:id', async (ctx) => {
  ctx.response.body = await incrementPokemonVote(Number(ctx.params.id));
});

router.get('/:id', async (ctx) => {
  ctx.response.body = await getPokemonById(Number(ctx.params.id));
});

const appOptions = hasFlash() ? { serverConstructor: FlashServer } : undefined;
const app = new Application(appOptions);

app.use(oakCors());
app.use(logger.logger);
app.use(logger.responseTime);
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', () => {
  console.log('Listening on http://localhost:8080');
});

await fetchPokemon();
await app.listen({ port: 8080 });
