import { atom } from "recoil";

export const isShakingState = atom<boolean>({
  key: "isShaking",
  default: false,
});
