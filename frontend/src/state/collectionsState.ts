import { atom, atomFamily, useRecoilCallback } from "recoil";
import { nanoid } from "nanoid";
import { Collection } from "../types/Collection";
import { useNavigate } from "react-router-dom";
import { api } from "../config/axios";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useAuth } from "../hooks/useAuth";

export const collectionsState = atom<ReadonlyArray<string>>({
  key: "collections",
  default: [],
});

export const collectionState = atomFamily<Collection, string>({
  key: "collection",
  default: {
    id: nanoid(),
    name: "Untitled",
    description: "",
  },
});

export const currentCollectionState = atom<Readonly<string | null>>({
  key: "currentCollection",
  default: null,
});

export const useCreateCollection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return useRecoilCallback(
    ({ set }) =>
      async () => {
        const id = nanoid();
        set(collectionsState, (currVal) => [...currVal, id]);
        set(collectionState(id), {
          id,
          name: "Untitled",
          description: "",
        });
        navigate(`/${id}`);
        console.log("baseUrl: ", import.meta.env.VITE_BASE_URL);
        await api.post<{
          id: number;
          user_id: number;
          name: string;
          description?: string;
        }>("/collection/collections", {
          id,
          user_id: user?.uid,
          name: "Untitled",
          description: "",
        });
      },
    []
  );
};

export const useRemoveCollection = () =>
  useRecoilCallback(({ set, reset }) => (id: string) => {
    reset(collectionState(id));
    set(collectionsState, (prev) => prev.filter((p) => p !== id));
  });
