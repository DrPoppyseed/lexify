import { atom, atomFamily, useRecoilCallback } from "recoil";
import { nanoid } from "nanoid";
import { Collection } from "../types/Collection";

export const collectionsState = atom<ReadonlyArray<string>>({
  key: "collections",
  default: [],
});

export const collectionState = atomFamily<Collection, string>({
  key: "collection",
  default: {
    id: nanoid(),
    title: "Untitled",
    description: "",
  },
});

export const useCreateCollection = () =>
  useRecoilCallback(
    ({ set }) =>
      () => {
        const id = nanoid();
        set(collectionsState, (currVal) => [...currVal, id]);
        set(collectionState(id), {
          id,
          title: "Untitled",
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
