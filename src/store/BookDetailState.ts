import { atom } from "recoil";

export const BookDetailState = atom<number>({
  key: "BookDetailState",
  default: 0,
});
