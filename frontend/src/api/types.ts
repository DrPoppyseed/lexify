import type { Option } from "../types/utils";

export type Collection = {
  id: string;
  user_id: string;
  name: string;
  description: Option<string>;
};

export type User = {
  id: string;
};
