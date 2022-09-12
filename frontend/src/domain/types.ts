import { Option } from "../types/utils";

export type Collection = {
  id: string;
  name: string;
  description: Option<string>;
};

export type VocabWord = {
  id: string;
  word: string;
  definition: string;
  fails: number;
  successes: number;
};
