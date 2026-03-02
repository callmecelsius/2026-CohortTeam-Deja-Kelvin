import api from './axios';
import type { FosterHome } from '../../types/FosterHomeType.ts';

//Get
export const getFosterHomes = async () => {
  const res = await api.get<Promise<FosterHome[]>>('/FosterHome');
  return res.data;
};
