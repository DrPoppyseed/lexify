import { nanoid } from "nanoid";
import type { VocabWord } from "../api/types";

export const vocabWordFactory = (
  collectionId: string,
  prevPriority: number
): VocabWord => {
  const id = nanoid();

  return {
    collectionId,
    id,
    word: "",
    definition: "",
    fails: 0,
    successes: 0,
    priority: prevPriority + 1,
  };
};
