import { getAuth } from "firebase/auth";

// TODO: come up with a functional way of handling this
export const moveInPlace = <T extends { id: string; priority: number }>(
  items: Array<T>,
  item: T,
  activeId: string,
  overId: string
) => {
  const fromIndex = items.findIndex(({ id }) => id === activeId);
  const toIndex = items.findIndex(({ id }) => id === overId);
  items.splice(fromIndex, 1);
  items.splice(toIndex, 0, item);
  return items.map((word, index) => ({
    ...word,
    priority: index + 1,
  }));
};

export const authHeader = async () => {
  const token = await getAuth()?.currentUser?.getIdToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
