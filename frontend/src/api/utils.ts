import { getAuth } from "firebase/auth";

export const authHeader = async () => {
  const token = await getAuth()?.currentUser?.getIdToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
