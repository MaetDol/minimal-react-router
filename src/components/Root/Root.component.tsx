import style from './Root.module.css';

export function Root() {
  return (
    <div className={style.container}>
      <h1 className={style.title}>root</h1>
      <button className={style.button}>about</button>
    </div>
  );
}
