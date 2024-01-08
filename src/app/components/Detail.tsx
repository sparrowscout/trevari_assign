import { useRecoilState, useRecoilValue } from "recoil";
import { BookData } from "./List";
import { BookDetailState } from "@/store/BookDetailState";
import { useEffect, useState } from "react";
import style from "../page.module.css";
import Image from "next/image";

export interface BookDetail extends BookData {
  authors: string;
  publisher: string;
  pages: string;
  rating: string;
  desc: string;
  price: string;
  image: string;
}

export default function Detail() {
  const currentBook = useRecoilValue(BookDetailState);
  const [bookDetail, setBookDetail] = useState<BookDetail>();
  const bookRate = "★★★★★";

  const getBookDetail = async () => {
    const response = await fetch(
      `https://api.itbook.store/1.0/books/${currentBook}`
    );
    return response.json();
  };

  const settingBookDetail = async () => {
    const result = await getBookDetail();
    setBookDetail(result);
  };

  useEffect(() => {
    if (currentBook) {
      settingBookDetail();
    }
  }, [currentBook]);

  return (
    <div className={style.detailContainer}>
      <h2>Detail</h2>
      {bookDetail ? (
        <div className={style.bookContainer}>
          <div className={style.bookCover}>
            <Image
              src={`${bookDetail.image}`}
              alt={`${bookDetail.title}'s cover image`}
              fill
            />
          </div>
          <div>
            <h2>{bookDetail.title}</h2>
            <div>{bookDetail.subtitle}</div>
            <div>
              {bookDetail.authors} 저 | {bookDetail.publisher} |{" "}
              {bookDetail.pages}페이지
            </div>
            <div>
              {bookRate.substring(0, Number(bookDetail.rating)).padEnd(5, "☆")}
            </div>
            <div>판매가 {bookDetail.price}</div>
            <div className={style.bookDesc}>소개 {bookDetail.desc}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
