import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import type { Collection } from "../api/types";
import {
  createCollection as createCollectionInAPI,
  getCollection as getCollectionInAPI,
  getCollections as getCollectionsInAPI,
  updateCollection as updateCollectionInAPI,
} from "../api/collection";
import { collectionFactory } from "../domain/collection";
import { Option } from "../types/utils";

export const useCreateCollection = () => {
  const { mutate, isLoading, isError, isSuccess } = useMutation(
    (collection: Collection) => createCollectionInAPI(collection)
  );
  const navigate = useNavigate();
  const { user } = useAuth();

  const createCollection = () => {
    if (!user?.uid) throw Error("Unauthorized");
    const collection = collectionFactory(user.uid);
    mutate(collection);
    navigate(`/${collection.id}`);
  };

  return { createCollection, isLoading, isError, isSuccess };
};

export const useUpdateCollection = () => {
  const { mutate, isLoading, isError, isSuccess } = useMutation(
    (collection: Collection) => updateCollectionInAPI(collection)
  );

  const updateCollection = async (collection: Collection) => {
    mutate(collection);
  };

  return { updateCollection, isLoading, isError, isSuccess };
};

export const useGetCollections = () => {
  const { data, isLoading, isError, isSuccess } = useQuery(
    ["getCollections"],
    getCollectionsInAPI
  );

  return { data, isLoading, isError, isSuccess };
};

export const useGetCollection = (collectionId: Option<string>) => {
  const { data, isLoading, isError, isSuccess } = useQuery(
    ["getCollection", collectionId],
    () => getCollectionInAPI(collectionId as string),
    {
      enabled: !!collectionId,
    }
  );

  return { data, isLoading, isError, isSuccess };
};
