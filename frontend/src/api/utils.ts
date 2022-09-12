import type { Option } from "../types/utils";

export const authHeader = (token: Option<string>) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
