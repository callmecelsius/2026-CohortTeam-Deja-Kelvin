import api from './axios';
import type { FosterHome, FosterHomeDto } from '../../types/FosterHomeType.ts';

//Get
export const getFosterHomes = async () => {
  const res = await api.get<Promise<FosterHome[]>>('/FosterHome');
  return res.data;
};

export const createHome = async (homeData: {
  homeName: string;
  Address: string;
  Capacity: number;
}) => {
  const res = await api.post('/FosterHome', homeData);
  return res.data;
};

export const deleteFosterHome = (id: number) => {
  return api.delete(`/FosterHome/${id}`);
};

export const updateHome = async (id: number, home: FosterHomeDto) => {
  const res = await api.put(`/FosterHome/${id}`, home);
  return res.data;
};
