import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import type { Collection } from "../api/types";
import {
  createCollection as createCollectionInAPI,
  getCollections as getCollectionsInAPI,
  updateCollection as updateCollectionInAPI,
} from "../api/collection";
import { collectionFactory } from "../domain/collection";

export const useCreateCollection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { mutate, ...props } = useMutation(
    (collection: Collection) => createCollectionInAPI(collection),
    {
      onMutate: async (collection: Collection) => {
        await queryClient.cancelQueries(["collections"]);
        const prevCollections = queryClient.getQueryData<
          ReadonlyArray<Collection>
        >(["collections"]);
        queryClient.setQueryData<ReadonlyArray<Collection>>(
          ["collections"],
          (prev) => [...(prev || []), collection]
        );

        return { prevCollections };
      },
      onError: (err, collection, context) => {
        queryClient.setQueryData<ReadonlyArray<Collection>>(
          ["collections"],
          context?.prevCollections
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(["collections"]);
      },
    }
  );

  const createCollection = () => {
    if (!user?.uid) throw Error("Unauthorized");
    const collection = collectionFactory(user.uid);
    mutate(collection);
    navigate(`/${collection.id}`);
  };

  return { createCollection, ...props };
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();
  const { mutate, ...props } = useMutation(
    (collection: Collection) => updateCollectionInAPI(collection),
    {
      onMutate: async (collection: Collection) => {
        await queryClient.cancelQueries(["collections"]);
        const prevCollections = queryClient.getQueryData<
          ReadonlyArray<Collection>
        >(["collections"]);
        queryClient.setQueryData<ReadonlyArray<Collection>>(
          ["collections"],
          (prev) =>
            prev?.map((col) => (col.id === collection.id ? collection : col))
        );
        queryClient.setQueryData<Readonly<Collection>>(
          ["collections", collection.id],
          collection
        );

        return { prevCollections };
      },
      onError: (err, collection, context) => {
        queryClient.setQueryData<ReadonlyArray<Collection>>(
          ["collections"],
          context?.prevCollections
        );
      },
      onSettled: () => {
        queryClient.invalidateQueries(["collections"]);
      },
    }
  );

  const updateCollection = async (collection: Collection) => {
    mutate(collection);
  };

  return { updateCollection, ...props };
};

export const useGetCollections = () =>
  useQuery(["collections"], getCollectionsInAPI);
