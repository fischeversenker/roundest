import { Component, createResource, For, Show } from 'solid-js';
import styles from './App.module.css';

const fetchMatch = async (): Promise<
  { name: string; imageUrl: string; id: number }[]
> => {
  return new Promise((resolve) => {
    const delay = Math.random() * 420 + 567;
    setTimeout(
      async () =>
        resolve(
          (await fetch('http://localhost:8080/match').then((res) =>
            res.json()
          )) as { name: string; imageUrl: string; id: number }[]
        ),
      delay
    );
  });
};

const App: Component = () => {
  const [matches, { refetch: refetchMatches }] = createResource(fetchMatch);

  async function markAsRounder(id: number) {
    await fetch('http://localhost:8080/vote', {
      method: 'POST',
      body: JSON.stringify({ for: id }),
      headers: { ContentType: 'application/json' },
    });
    refetchMatches();
  }

  return (
    <div class={styles.App}>
      <div class={styles.flex}>
        <Show
          when={!matches.loading}
          fallback={<span class={styles['lds-dual-ring']}></span>}
        >
          <For each={matches()}>
            {(match) => (
              <div class={styles.match} onClick={() => markAsRounder(match.id)}>
                <figure class={styles.figure}>
                  <img src={match.imageUrl}></img>
                </figure>
                <p>{match.name}</p>
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
};

export default App;
