import api from "./axios";
import type { User } from "types/UserType";

export const getUsers = async () => {
  const res = await api.get<User[]>("/User");
  return res.data;
};
