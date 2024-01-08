import Image from "next/image";
import { BookData } from "./List";
import { useSetRecoilState } from "recoil";
import { BookDetailState } from "@/store/BookDetailState";
import style from "../page.module.css";

export default function BookData({
  title,
  subtitle,
  image,
  url,
  isbn13,
}: BookData) {
  const setCurrentBook = useSetRecoilState(BookDetailState);

  const onClickLsit = () => {
    setCurrentBook(Number(isbn13));
  };

  return (
    <div className={style.singleList}>
      <div className={style.listBookCover} onClick={onClickLsit}>
        <Image
          src={`${image}`}
          alt={`${title}'s cover image`}
          fill
          sizes="100px"
        />
      </div>
      <div>
        <h4 className={style.title} onClick={onClickLsit}>
          {title}
        </h4>
        <div className={style.subtitle}>{subtitle}</div>
        <a href={url}>
          <span className={style.bookLink}>링크 바로가기↗︎</span>
        </a>
      </div>
    </div>
  );
}
