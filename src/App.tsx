import { debounce } from '@solid-primitives/scheduled';
import { Component, createResource, createSignal, For, Show } from 'solid-js';
import styles from './App.module.css';
import Match from './Match';

const fetchMatch = async (): Promise<
  { name: string; imageUrl: string; id: number }[]
> => {
  return await fetch('http://localhost:8080/').then((res) => res.json());
};

const App: Component = () => {
  const [matches, { refetch: refetchMatches }] = createResource(fetchMatch);
  const [isLoading, setIsLoading] = createSignal(false);
  const setIsLoadingDebounced = debounce(() => setIsLoading(true), 400);

  async function handleClick(id: number) {
    setIsLoadingDebounced();

    await fetch(`http://localhost:8080/vote/${id}`);
    await refetchMatches();

    setIsLoadingDebounced.clear();
    setIsLoading(false);
  }

  return (
    <div class={styles.App}>
      <h1>Which one is the roundest?</h1>
      <div class={styles.matches}>
        <Show
          when={!isLoading()}
          fallback={<span class={styles['lds-dual-ring']}></span>}
        >
          <For each={matches()}>
            {(match) => (
              <Match {...match} onClick={() => handleClick(match.id)}></Match>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};

export default App;
