import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useCreateCollection as useCreateCollectionInState } from "../state/collectionsState";
import type { Collection as APICollection } from "../api/types";
import {
  createCollection as createCollectionInAPI,
  getCollections as getCollectionsInAPI,
} from "../api/collection";
import { collectionFactory } from "../domain/collection";

export const useCreateCollection = () => {
  const { mutate, isLoading, isError, isSuccess } = useMutation(
    (collection: APICollection) => createCollectionInAPI(collection)
  );
  const createCollectionInState = useCreateCollectionInState();
  const navigate = useNavigate();
  const { user } = useAuth();

  const createCollection = async () => {
    if (!user?.uid) throw Error("Unauthorized");

    const collection = collectionFactory();
    createCollectionInState(collection);

    await mutate({
      ...collection,
      user_id: user?.uid,
    });

    navigate(`/${collection.id}`);
  };

  return { createCollection, isLoading, isError, isSuccess };
};

export const useGetCollections = () => {
  const {data, isLoading, isError, isSuccess} = useQuery(
      ["getCollections"],
      getCollectionsInAPI
  );

  return {data, isLoading, isError, isSuccess};
};
