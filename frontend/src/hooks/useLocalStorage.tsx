export type ItemKey = "latestAccessedCollectionId";

export const useLocalStorage = () => {
  const setItemToLocalStorage = (itemKey: ItemKey, itemValue: string) => {
    console.log(
      "from useLocalStorage::setItemToLocalStorage",
      itemKey,
      itemValue
    );
    localStorage.setItem(itemKey, itemValue);
  };

  const getItemFromLocalStorage = (itemKey: ItemKey) => {
    return localStorage.getItem(itemKey);
  };

  return { setItemToLocalStorage, getItemFromLocalStorage };
};
