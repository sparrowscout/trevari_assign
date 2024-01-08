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
    <div className={style.singleList} onClick={onClickLsit}>
      <div className={style.listBookCover}>
        <Image src={`${image}`} alt={`${title}'s cover image`} fill />
      </div>
      <div>
        <h4 className="title">{title}</h4>
        <div className="subtitle">{subtitle}</div>
      </div>
    </div>
  );
}
