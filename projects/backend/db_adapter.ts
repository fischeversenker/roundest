import { connect as connectRedis, Redis } from "https://deno.land/x/redis@v0.26.0/mod.ts";

interface Pokemon {
  id: number;
  name?: string;
  url: string;
  imageUrl: string;
  votes?: number;
}

let redisClient: Redis;

const getPokemonKey = (id: number) => `pokemon:${id}`;

export function incrementPokemonVote(id: number) {
  if (!redisClient) throw new Error('No DB connection');

  return redisClient.hincrby(getPokemonKey(id), "votes", 1);
}

/**
 * fetches the pokemon from the pokeapi and populates the DB
 * (does nothing if the DB already got populated)
 * @returns a Promise that will resolve when the DB has data
 */
export async function fetchPokemon(): Promise<void> {
  if (!redisClient) throw new Error('No DB connection');

  if (await redisClient.exists("hasPokemon")) {
    return;
  }

  const pokemonGeneration1 = (await fetch(
    "https://pokeapi.co/api/v2/generation/1",
  ).then((res) => res.json())) as {
    pokemon_species: { id: number; name: string; url: string }[];
  };
  const pokemons = pokemonGeneration1.pokemon_species.map((pokemon) => {
    const id = pokemon.url.match(/^.+?\/(\d{1,3})\/$/);

    if (!id) {
      throw new Error(
        `Wasn't able to extract Pokemon id from url ${pokemon.url}`,
      );
    }

    return {
      id: Number(id[1]),
      imageUrl:
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
          id[1]
        }.png`,
    };
  });

  pokemons.forEach((pokemon) => {
    redisClient.hset(getPokemonKey(pokemon.id), pokemon);
  });

  redisClient.set("hasPokemon", 1);
}

export async function getPokemonById(id: number): Promise<Pokemon> {
  if (!redisClient) throw new Error('No DB connection');

  const pokemonHash = await redisClient.hgetall(getPokemonKey(id));

  if (pokemonHash.length === 0) {
    throw new Error(`Couldn't find pokemon with ID ${id}`);
  }

  // turn the response of hgetall ([key1, value1, key2, value2, ...]) into a usable object
  const pokemon: Partial<Record<keyof Pokemon, string | number>> = {};
  for (let i = 0; i < pokemonHash.length; i += 2) {
    pokemon[pokemonHash[i] as keyof Pokemon] = pokemonHash[i + 1];
  }

  // load the german name of the pokemon on demand
  let name = pokemon.name as string;
  if (!name) {
    const pokemonDetails = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemon?.id}/`,
    ).then((res) => res.json());
    name = pokemonDetails.names.find(
      (name: { language: { name: string }; name: string }) =>
        name.language.name === "de",
    ).name;
    await redisClient.hset(getPokemonKey(id), "name", name);
  }

  return {
    ...pokemon as Pokemon,
    name,
  };
}

export async function connect() {
  redisClient = await connectRedis({ hostname: Deno.env.get('REDISHOST')!, port: Deno.env.get('REDISPORT'), username: Deno.env.get('REDISUSER') || undefined, password: Deno.env.get('REDISPASSWORD') || undefined });
}
