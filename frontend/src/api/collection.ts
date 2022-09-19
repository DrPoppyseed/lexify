import type { AxiosResponse } from "axios";
import { getAuth } from "firebase/auth";
import { api } from "../config/axios";
import type { Collection } from "./types";
import { authHeader } from "./utils";

export const createCollection = async (
  collection: Collection
): Promise<null> => {
  const token = await getAuth()?.currentUser?.getIdToken();
  const { data } = await api.post<null, AxiosResponse<null>, Collection>(
    "/collections",
    collection,
    authHeader(token)
  );

  return data;
};

export const getCollections = async (): Promise<ReadonlyArray<Collection>> => {
  const token = await getAuth()?.currentUser?.getIdToken();
  const {data} = await api.get<ReadonlyArray<Collection>,
      AxiosResponse<ReadonlyArray<Collection>>,
      null>("/collections", authHeader(token));

  return data;
};
