import type { UserCredential } from "firebase/auth";
import type { AxiosResponse } from "axios";
import { api } from "../config/axios";
import type { User } from "./types";
import { authHeader } from "../utils";

export const getOrCreateUser = async (
  authnedUser: UserCredential
): Promise<User> => {
  const { data } = await api.post<User, AxiosResponse<User>, User>(
    "/users",
    {
      id: authnedUser.user.uid,
    },
    await authHeader()
  );

  return data;
};
