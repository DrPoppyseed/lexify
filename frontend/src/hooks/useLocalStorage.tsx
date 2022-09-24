export type ItemKey = "latestAccessedCollectionId";

export const useLocalStorage = () => {
  const setItemToLocalStorage = (itemKey: ItemKey, itemValue: string) => {
    localStorage.setItem(itemKey, itemValue);
  };

  const getItemFromLocalStorage = (itemKey: ItemKey) => localStorage.getItem(itemKey);

  return { setItemToLocalStorage, getItemFromLocalStorage };
};
