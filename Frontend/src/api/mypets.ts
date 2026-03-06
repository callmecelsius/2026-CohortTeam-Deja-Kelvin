import api from "./axios";
import type { BehaviorLogDto } from "../../types/BehaviorLogType";

export const getAnimalByFosterId = async (fosterHomeId: number) => {
  const res = await api.get(`/Animal/FosterHome/${fosterHomeId}`);
  console.log(res.data);
  return res.data;
};

export const getFosterUsers = async (fosterHomeId: number) => {
  const res = await api.get(`/FosterParent/GetFosterUsers/${fosterHomeId}`);
  console.log(res.data);
  return res.data;
};

export const insertBehaviorLog = async (behaviorlog: BehaviorLogDto) => {
  console.log(behaviorlog);
  const res = await api.post("/BehaviorLog",  behaviorlog);
  return res.data;
};

export const getBehaviorLog = async (animalId: number) => {
  const res = await api.get(`/BehaviorLog/animal/${animalId}`);
  console.log(res.data);
  return res.data;
};

export const insertAnimalCondition = async (animalConditionDto: any) => {
  console.log(animalConditionDto);
  const res = await api.post("/AnimalCondition",  animalConditionDto);
  return res.data;
};

export const getAnimalConditions = async (animalId: number) => { 
  const res = await api.get(`/AnimalCondition/animal/${animalId}`);
  console.log( res.data);
  return res.data;
};