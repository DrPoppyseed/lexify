import type { Option } from "../types/utils";

export type Collection = {
  id: string;
  userId: string;
  name: string;
  description: Option<string>;
};

export type User = {
  id: string;
};

export type VocabWord = {
  id: string;
  collectionId: string;
  word: string;
  definition: string;
  fails: number;
  successes: number;
};

export type CollectionWithVocabWords = Pick<
  Collection,
  "userId" | "name" | "description"
> & {
  collectionId: string,
  words: ReadonlyArray<VocabWord>
}
