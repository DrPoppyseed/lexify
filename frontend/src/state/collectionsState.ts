import {
  atom,
  atomFamily,
  useRecoilCallback,
  useRecoilTransaction_UNSTABLE,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
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

export const useCreateCollectionSync = () => {
  const setCollections = useSetRecoilState(collectionsState);

  const addCollection = useRecoilCallback(
    ({ set }) =>
      (newCollection: Collection) => {
        set(collectionState(newCollection.id), newCollection);
      }
  );

  return (newCollection: Collection) => {
    setCollections((currVal) => [...currVal, newCollection.id]);
    addCollection(newCollection);
    return newCollection;
  };
};

export const useSetCollections = () =>
  useRecoilTransaction_UNSTABLE(
    ({ set, get }) =>
      (collections: ReadonlyArray<Collection>) => {
        collections
          .filter(
            (collection) => !get(collectionsState).includes(collection.id)
          )
          .forEach((collection) => {
            set(collectionsState, (currVal) => [...currVal, collection.id]);
            set(collectionState(collection.id), collection);
          });
      }
  );

export const useRemoveCollection = () =>
  useRecoilCallback(({ set, reset }) => (id: string) => {
    reset(collectionState(id));
    set(collectionsState, (prev) => prev.filter((p) => p !== id));
  });

const useResetCollectionState = () => {
  const collectionIds = useRecoilValue(collectionsState);

  return useRecoilCallback(({ reset }) => () => {
    collectionIds.forEach((collectionId) => {
      reset(collectionState(collectionId));
    });
  });
};

export const useResetCollections = () => {
  const resetCurrentCollectionState = useResetRecoilState(
    currentCollectionState
  );
  const resetCollectionsState = useResetRecoilState(collectionsState);

  return () => {
    resetCollectionsState();
    resetCurrentCollectionState();
  };
};
