import api from "./axios";
import type { FosterParent } from "types/FosterParentType";

export const getFosterParents = async () => {
  const res = await api.get<FosterParent[]>("/FosterParent");
  return res.data;
};
