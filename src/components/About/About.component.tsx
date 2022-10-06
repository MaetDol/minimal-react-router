import { useRouter } from '@router';
import style from './About.module.css';

export function About() {
  const { push } = useRouter();

  return (
    <div className={style.container}>
      <h1 className={style.title}>about</h1>
      <button className={style.button} onClick={() => push('/')}>
        go main
      </button>
    </div>
  );
}
