import { nanoid } from "nanoid";
import { Collection } from "../api/types";

export const collectionFactory = (
  userId: string,
  prevPriority: number
): Collection => {
  const id = nanoid();

  return {
    id,
    userId,
    name: "Untitled",
    description: undefined,
    priority: prevPriority + 1,
  };
};
