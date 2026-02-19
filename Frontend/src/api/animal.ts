import api from "./axios";

export const getAnimals = async () => {
  const res = await api.get("/Animal");
  return res.data;
};
