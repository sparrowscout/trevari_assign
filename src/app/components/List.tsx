"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useInput } from "../hook/useInput";
import BookData from "./BookData";
import { ListBookData, SearchData } from "type/book.types";
import { OperatorEnum } from "constants/operatorEnum";
import style from "style/list.module.css";

export default function List() {
  const { value, onChange } = useInput("");
  const [searchData, setSearchData] = useState<SearchData>({
    keywordArr: [""],
    operator: OperatorEnum.SINGLE,
    pageNumber: 1,
  });
  const [bookList, setBookList] = useState<ListBookData[]>();
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    settingBookList();
  }, [searchData]);

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

  const onEnterSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmit();
    }
  };

  const onSubmit = () => {
    setBookList([]);
    const operator = checkOperator(value);
    const keywordArr = value.split(`${operator}`).slice(0, 2);
    setSearchData({ pageNumber: 1, keywordArr, operator });
  };

  const onScrollResultRef = (event: React.UIEvent<HTMLElement>) => {
    const target = event.target as HTMLDivElement;
    if (target.clientHeight + target.scrollTop >= target.scrollHeight) {
      setSearchData((prev) => {
        return { ...prev, pageNumber: searchData.pageNumber + 1 };
      });
    }
  };

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

  const settingORList = (
    result: ListBookData[],
    secondResult: ListBookData[]
  ) => {
    const list = result
      .concat(secondResult)
      .sort((a, b) => parseInt(a.isbn13) - parseInt(b.isbn13));
    return list;
  };

  const settingNOTList = (result: ListBookData[], anotherKeyword: string) => {
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
          <input
            className={style.searchInput}
            onChange={onChange}
            onKeyDown={(event) => onEnterSubmit(event)}
          />
          <button className={style.searchBtn} onClick={onSubmit}>
            검색
          </button>
        </div>
      </div>

      {bookList && bookList.length > 0 ? (
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
      ) : (
        <div className={style.nullContainer}>
          검색어에 따라 서적 리스트가 나옵니다.
        </div>
      )}
    </div>
  );
}
