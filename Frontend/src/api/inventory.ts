import api from "./axios";
import type { CreateInventoryDto, ProductDto } from "../../types/inventoryType";

//Get
export const getInventory = async () => {
  const res = await api.get("/Inventory");
  return res.data;
};

export const getCategories = async () => {
    const res = await api.get("/ProductCategory");
    return res.data;
  
};

export const getProduct = async () => {
    const res = await api.get("/Product");
    return res.data;
  
};

// Create 
export const createInventory = async (inventory: CreateInventoryDto) => {
  const res = await api.post("/Inventory", inventory);
  return res.data;
};

export const createProduct = async (productData: {
  categoryId: number;
  description: string;
  unitPrice: number;
}) => {
  const res = await api.post("/Product", productData);
  return res.data;
};

//Update
export const updateInventory = async (id: number, inventory: CreateInventoryDto) => {
  const res = await api.put(`/Inventory/${id}`, inventory);
  return res.data;
};

export const updateProduct = async (id: number, product: ProductDto) => {
  const res = await api.put(`/Product/${id}`, product); 
  return res.data;
};

//Delete
export const deleteInventory = async (id: number) => {
  const res = await api.delete(`/Inventory/${id}`);
  return res.data;
};
export const deleteProduct= async (id: number) => {
  const res = await api.delete(`/Product/${id}`);
  return res.data;
};



