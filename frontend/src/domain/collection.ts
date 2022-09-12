import { nanoid } from "nanoid";
import { Collection } from "./types";

export const collectionFactory = (): Collection => {
  const id = nanoid();

  return {
    id,
    name: "Untitled",
    description: undefined,
  };
};
