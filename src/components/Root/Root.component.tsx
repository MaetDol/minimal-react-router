import { useRouter } from '@router';
import style from './Root.module.css';

export function Root() {
  const { push } = useRouter();

  return (
    <div className={style.container}>
      <h1 className={style.title}>root</h1>
      <button className={style.button} onClick={() => push('/about')}>
        about
      </button>
    </div>
  );
}
