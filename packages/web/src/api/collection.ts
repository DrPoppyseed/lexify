import type { AxiosResponse } from "axios";
import { api } from "../config/axios";
import { authHeader } from "../utils";
import type { Collection } from "./types";

export const createCollection = async (collection: Collection): Promise<null> =>
  api
    .post<null, AxiosResponse<null>, Collection>(
      "/collections",
      collection,
      await authHeader()
    )
    .then((res) => res.data);

export const updateCollection = async (collection: Collection): Promise<null> =>
  api
    .put<null, AxiosResponse<null>, Collection>(
      `/collections/${collection.id}`,
      collection,
      await authHeader()
    )
    .then((res) => res.data);

export const getCollections = async (): Promise<ReadonlyArray<Collection>> =>
  api
    .get<
      ReadonlyArray<Collection>,
      AxiosResponse<ReadonlyArray<Collection>>,
      null
    >("/collections", await authHeader())
    .then((res) => res.data);

export const updateCollections = async (
  collections: ReadonlyArray<Collection>
): Promise<ReadonlyArray<Collection>> =>
  api
    .put<
      ReadonlyArray<Collection>,
      AxiosResponse<ReadonlyArray<Collection>>,
      ReadonlyArray<Collection>
    >("/collections", collections, await authHeader())
    .then((res) => res.data);
