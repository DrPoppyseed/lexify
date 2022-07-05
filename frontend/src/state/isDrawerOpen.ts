import { atom } from "recoil";

export const isDrawerOpenState = atom<boolean>({
  key: "isDrawerOpen",
  default: false,
});
