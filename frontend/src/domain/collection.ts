import { nanoid } from "nanoid";
import { Collection } from "../api/types";

export const collectionFactory = (userId: string): Collection => {
  const id = nanoid();

  return {
    id,
    userId,
    name: "Untitled",
    description: undefined,
  };
};
