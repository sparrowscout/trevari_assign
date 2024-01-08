import { OperatorEnum } from "constants/operatorEnum";

export interface ListBookData {
  title: string;
  subtitle: string;
  image: string;
  url: string;
  isbn13: string;
}

export interface BookDetail extends ListBookData {
  authors: string;
  publisher: string;
  pages: string;
  rating: string;
  desc: string;
  price: string;
  image: string;
}

export interface SearchData {
  keywordArr: string[];
  operator: OperatorEnum;
  pageNumber: number;
}
