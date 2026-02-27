import api from './axios';
import type { FosterUser } from 'types/FosterParentType';

export const getFosterParents = async () => {
  const res = await api.get<FosterUser[]>('/FosterParent');
  return res.data;
};
