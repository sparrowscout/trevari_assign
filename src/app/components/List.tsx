"use client";

import { use, useEffect, useRef, useState } from "react";
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
  books?: BookData[];
  page?: string;
  total?: string;
}

export enum OperatorEnum {
  "OR" = "|",
  "NOT" = "-",
  "SINGLE" = "SINGLE",
}

interface SearchData {
  keywordArr: string[];
  operator: OperatorEnum;
  pageNumber: number;
}

export default function List() {
  const { value, onChange } = useInput("");
  const [searchData, setSearchData] = useState<SearchData>({
    keywordArr: [""],
    operator: OperatorEnum.SINGLE,
    pageNumber: 1,
  });
  const [bookList, setBookList] = useState<BookData[]>();
  const resultRef = useRef<HTMLDivElement>(null);

  const getBookLists = async (keyword: string) => {
    const response = await fetch(
      `https://api.itbook.store/1.0/search/${keyword}/${searchData.pageNumber}`
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

  const onClickSearchBtn = () => {
    setBookList([]);
    const operator = checkOperator(value);
    const keywordArr = value.split(`${operator}`).slice(0, 2);
    setSearchData((prev) => {
      return { ...prev, keywordArr, operator };
    });
  };

  const onScrollResultRef = (event: React.UIEvent<HTMLElement>) => {
    const target = event.target as HTMLDivElement;

    if (target.clientHeight + target.scrollTop >= target.scrollHeight) {
      setSearchData((prev) => {
        return { ...prev, pageNumber: searchData.pageNumber + 1 };
      });
    }
  };

  useEffect(() => {
    settingBookList();
  }, [searchData]);

  const settingBookList = async () => {
    if (searchData.operator === OperatorEnum.SINGLE) {
      const list = await getBookLists(searchData.keywordArr[0]);
      const newList = bookList ? bookList.concat(list.books) : list.books;
      return setBookList(newList);
    } else if (searchData.operator === OperatorEnum.NOT) {
      const list = await getBookLists(searchData.keywordArr[0]);
      const newList = bookList
        ? bookList.concat(settingNOTList(list.books, searchData.keywordArr[1]))
        : settingNOTList(list.books, searchData.keywordArr[1]);
      return setBookList(newList);
    } else {
      const firstResult = await getBookLists(searchData.keywordArr[0]);
      const secondResult = await getBookLists(searchData.keywordArr[1]);
      const newList = bookList
        ? bookList.concat(settingORList(firstResult.books, secondResult.books))
        : settingORList(firstResult.books, secondResult.books);
      return setBookList(newList);
    }
  };

  const settingORList = (result: BookData[], secondResult: BookData[]) => {
    const list = result
      .concat(secondResult)
      .sort((a, b) => parseInt(a.isbn13) - parseInt(b.isbn13));
    return list;
  };

  const settingNOTList = (result: BookData[], anotherKeyword: string) => {
    const list = result
      .filter(
        (book) =>
          !book.title.toLowerCase().includes(anotherKeyword.toLowerCase())
      )
      .sort((a, b) => parseInt(a.isbn13) - parseInt(b.isbn13));
    return list;
  };

  return (
    <div className={style.listContainer}>
      <div className={style.listHeader}>
        <h2>List</h2>
        <div className={style.searchContainer}>
          <input className={style.searchInput} onChange={onChange} />
          <button className={style.searchBtn} onClick={onClickSearchBtn}>
            검색
          </button>
        </div>
      </div>

      {bookList ? (
        <div
          className={style.listResult}
          ref={resultRef}
          onScroll={(event) => onScrollResultRef(event)}
        >
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
