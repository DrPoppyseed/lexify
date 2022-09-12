import type { AxiosResponse } from "axios";
import { api } from "../config/axios";
import type { Collection } from "./types";
import { authHeader } from "./utils";
import type { Option } from "../types/utils";

export const createCollection = async (
  collection: Collection,
  token: Option<string>
): Promise<null> => {
  const { data } = await api.post<null, AxiosResponse<null>, Collection>(
    "/collection/collections",
    collection,
    authHeader(token)
  );

  return data;
};
