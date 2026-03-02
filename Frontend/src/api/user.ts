import api from "./axios";
import type { User } from "types/UserType";

export const getUsers = async () => {
  const res = await api.get<User[]>("/User");
  return res.data;
};

export const updateUser = async (id: number, userData: Record<string, unknown>) => {
  const res = await api.put(`/User/${id}`, userData);
  return res.data;
};

