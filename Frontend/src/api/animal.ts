import api from "./axios";
import type { CreateAnimalDto } from "../../types/animalType";

export const getAnimals = async () => {
  const res = await api.get("/Animal");
  return res.data;
};

export const getAnimalById = async (id: number) => {
  const res = await api.get(`/Animal/${id}`);
  return res.data;
};

export const createAnimal = async (animal: CreateAnimalDto) => {
  const res = await api.post("/Animal", animal);
  return res.data;
};

export const updateAnimal = async (id: number, animal: CreateAnimalDto) => {
  const res = await api.put(`/Animal/${id}`, animal);
  return res.data;
};

export const deleteAnimal = async (id: number) => {
  const res = await api.delete(`/Animal/${id}`);
  return res.data;
};
