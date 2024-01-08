"use client";

import { useState } from "react";
import { useInput } from "../hook/useInput";
import BookData from "./BookData";
import style from "../page.module.css";

type OperatorType = keyof typeof OperatorEnum;

export interface BookData {
  title: string;
  subtitle: string;
  image: string;
  url: string;
  isbn13: string;
}

export interface BookList {
  books: BookData[];
  page: string;
  total: string;
}

export enum OperatorEnum {
  "OR" = "|",
  "NOT" = "-",
  "SINGLE" = "SINGLE",
}

export default function List() {
  const { value, onChange } = useInput("");
  const [bookList, setBookList] = useState<BookData[]>();

  const getBookLists = async (keyword: string, pageNumber: number = 1) => {
    const response = await fetch(
      `https://api.itbook.store/1.0/search/${keyword}/${pageNumber}`
    );
    return response.json();
  };

  const checkOperator = (keyword: string): OperatorEnum => {
    for (const seperator of Object.values(OperatorEnum)) {
      if (keyword.includes(seperator)) {
        return seperator;
      }
    }
    return OperatorEnum.SINGLE;
  };

  const settingKeywords = async () => {
    const keyword = value;
    const operator = checkOperator(keyword);
    const keywordArr = keyword.split(`${operator}`).slice(0, 2);

    if (operator === OperatorEnum.SINGLE) {
      const list = await getBookLists(keyword);
      return setBookList(list.books);
    } else if (operator === OperatorEnum.NOT) {
      const list = await getBookLists(keywordArr[0]);
      settingNOTList(list.books, keywordArr[1]);
    } else {
      const firstResult = await getBookLists(keywordArr[0]);
      const secondResult = await getBookLists(keywordArr[1]);
      settingORList(firstResult.books, secondResult.books);
    }
  };

  const settingORList = (result: BookData[], secondResult: BookData[]) => {
    const list = result
      .concat(secondResult)
      .sort((a, b) => parseInt(a.isbn13) - parseInt(b.isbn13));
    setBookList(list);
  };

  const settingNOTList = (result: BookData[], anotherKeyword: string) => {
    const list = result
      .filter(
        (book) =>
          !book.title.toLowerCase().includes(anotherKeyword.toLowerCase())
      )
      .sort((a, b) => parseInt(a.isbn13) - parseInt(b.isbn13));
    console.log(list);
    setBookList(list);
  };

  return (
    <div className={style.listContainer}>
      <div className={style.listHeader}>
        <h2>List</h2>
        <div className={style.searchContainer}>
          <input className={style.searchInput} onChange={onChange} />
          <button className={style.searchBtn} onClick={settingKeywords}>
            검색
          </button>
        </div>
      </div>

      {bookList ? (
        <div className={style.listResult}>
          {bookList.map((book) => {
            return (
              <BookData
                key={book.isbn13}
                title={book.title}
                subtitle={book.subtitle}
                image={book.image}
                url={book.url}
                isbn13={book.isbn13}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
