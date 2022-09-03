import styles from './Match.module.css';
import confetti from 'canvas-confetti';

interface MatchProps {
  imageUrl: string;
  id: number;
  name: string;
  onClick: () => void
}

export default function Match(props: MatchProps) {
  const clickHandler = (e: MouseEvent) => {
    confetti({
      particleCount: 42,
      spread: 42,
      startVelocity: 20,
      ticks: 42,
      decay: 0.93,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }
    });
    props.onClick();
  }
  return (
    <div class={styles.match} onClick={(e) => clickHandler(e)}>
      <figure class={styles.figure}>
        <img src={props.imageUrl}></img>
      </figure>
      <p>{props.name}</p>
    </div>
  );
}
