import { atom, atomFamily, useRecoilCallback } from "recoil";
import { nanoid } from "nanoid";
import { Collection } from "../domain/types";

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

export const useCreateCollection = () =>
  useRecoilCallback(
    ({ set }) =>
      (collection: Collection) => {
        set(collectionsState, (currVal) => [...currVal, collection.id]);
        set(collectionState(collection.id), {
          id: collection.id,
          name: "Untitled",
          description: "",
        });
      },
    []
  );

export const useRemoveCollection = () =>
  useRecoilCallback(({ set, reset }) => (id: string) => {
    reset(collectionState(id));
    set(collectionsState, (prev) => prev.filter((p) => p !== id));
  });
