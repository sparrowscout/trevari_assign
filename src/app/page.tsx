"use client";

import Detail from "./components/Detail";
import List from "./components/List";
import style from "./page.module.css";

export default function Home() {
  return (
    <div className={style.main}>
      <Detail />
      <List />
    </div>
  );
}
