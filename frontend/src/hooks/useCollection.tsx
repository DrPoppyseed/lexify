import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { useCreateCollection as useCreateCollectionInState } from "../state/collectionsState";
import type { Collection as APICollection } from "../api/types";
import { createCollection as createCollectionInAPI } from "../api/collection";
import type { Option } from "../types/utils";
import { collectionFactory } from "../domain/collection";

export const useCreateCollection = () => {
  const { mutate, isLoading, isError, isSuccess } = useMutation(
    ({
      collection,
      token,
    }: {
      collection: APICollection;
      token: Option<string>;
    }) => createCollectionInAPI(collection, token)
  );
  const createCollectionInState = useCreateCollectionInState();
  const navigate = useNavigate();
  const { user } = useAuth();

  const createCollection = async () => {
    if (!user?.uid) throw Error("Unauthorized");

    const collection = collectionFactory();

    createCollectionInState(collection);

    await mutate({
      collection: { ...collection, user_id: user?.uid },
      token: await user.getIdToken(),
    });

    navigate(`/${collection.id}`);
  };

  return { createCollection, isLoading, isError, isSuccess };
};
