import { UserCredential } from "firebase/auth";
import { AxiosResponse } from "axios";
import { api } from "../config/axios";
import { User } from "./types";
import { authHeader } from "./utils";

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
