import style from './About.module.css';

export function About() {
  return (
    <div className={style.container}>
      <h1 className={style.title}>about</h1>
      <button className={style.button}>go main</button>
    </div>
  );
}
