import { debounce } from '@solid-primitives/scheduled';
import { Component, createResource, createSignal, For, Show } from 'solid-js';
import styles from './App.module.css';

const fetchMatch = async (): Promise<
  { name: string; imageUrl: string; id: number }[]
> => {
  return await fetch('http://localhost:8080/').then((res) => res.json());
};

const App: Component = () => {
  const [matches, { refetch: refetchMatches }] = createResource(fetchMatch);

  async function handleClick(id: number) {
    setIsLoadingDebounced();

    await fetch(`http://localhost:8080/vote/${id}`);
    await refetchMatches();

    setIsLoadingDebounced.clear();
    setIsLoading(false);
  }

  const [isLoading, setIsLoading] = createSignal(false);
  const setIsLoadingDebounced = debounce(() => setIsLoading(true), 400);

  return (
    <div class={styles.App}>
      <Show
        when={!isLoading()}
        fallback={<span class={styles['lds-dual-ring']}></span>}
      >
        <For each={matches()}>
          {(match) => (
            <div class={styles.match} onClick={() => handleClick(match.id)}>
              <figure class={styles.figure}>
                <img src={match.imageUrl}></img>
              </figure>
              <p>{match.name}</p>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
};

export default App;
