import api from "./axios";
import type { FosterParent } from "../../types/fosterParentType";

export const getFosterParents  = async() => {
  const res = await api.get<Promise<FosterParent[]>>("/FosterParent");
  return res.data;
};

export const getFosterParentById = async (id: number) => {
  const res = await api.get(`/FosterParent/${id}`);
  return res.data;
};

export const createFosterParent = async (fosterParent: FosterParent) => {
  const res = await api.post("/FosterParent", fosterParent);
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
