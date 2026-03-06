import api from "./axios";
import type { FosterParent, FosterUser } from "types/FosterParentType";


export const getFosterParents = async () => {
  const res = await api.get<FosterUser[]>('/FosterParent');
  return res.data;
};

export const updateFosterParent = async (id: number, fosterParent: FosterParent) => {
  const res = await api.put(`/FosterParent/${id}`, fosterParent);
  return res.data;
};

export const deleteFosterParent = async (id: number) => {
  const res = await api.delete(`/FosterParent/${id}`);
  return res.data;
};
