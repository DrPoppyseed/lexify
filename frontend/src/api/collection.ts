import type { AxiosResponse } from "axios";
import { api } from "../config/axios";
import type { Collection } from "./types";
import { authHeader } from "./utils";

export const createCollection = async (
  collection: Collection
): Promise<null> => {
  const { data } = await api.post<null, AxiosResponse<null>, Collection>(
    "/collections",
    collection,
    await authHeader()
  );

  return data;
};

export const updateCollection = async (
  collection: Collection
): Promise<null> => {
  const { data } = await api.put<null, AxiosResponse<null>, Collection>(
    "/collections",
    collection,
    await authHeader()
  );

  return data;
};

export const getCollection = async (
  collectionId: string
): Promise<Readonly<Collection>> => {
  const { data } = await api.get<
    Readonly<Collection>,
    AxiosResponse<Readonly<Collection>>,
    null
  >(`/collections/${collectionId}`, await authHeader());

  return data;
};

export const getCollections = async (): Promise<ReadonlyArray<Collection>> => {
  const { data } = await api.get<
    ReadonlyArray<Collection>,
    AxiosResponse<ReadonlyArray<Collection>>,
    null
  >("/collections", await authHeader());

  return data;
};
