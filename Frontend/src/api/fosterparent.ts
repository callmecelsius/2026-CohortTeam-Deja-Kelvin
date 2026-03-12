import api from "./axios";
import type { FosterParent, FosterUser } from "types/FosterParentType";


export const getFosterParents = async () => {
  const res = await api.get<FosterUser[]>('/FosterParent');
  return res.data;
};

export const getFosterParentByUserId = async (userId: number) => {
  try {
    const res = await api.get<FosterParent>(`/FosterParent/status/${userId}`);
    return res.data;
  } catch (error: any) {
    // If the API doesn't support this endpoint, fallback to fetching all and filtering.
    if (error?.response?.status === 404) {
      const all = await getFosterParents();
      return all.find((fp) => fp.fosterParent?.userId === userId)?.fosterParent ?? null;
    }
    throw error;
  }
};

export const updateFosterParent = async (id: number, fosterParent: FosterParent) => {
  const res = await api.put(`/FosterParent/${id}`, fosterParent);
  return res.data;
};

export const deleteFosterParent = async (id: number) => {
  const res = await api.delete(`/FosterParent/${id}`);
  return res.data;
};
