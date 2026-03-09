import api from "./axios";
import type { CreateOrderDto, CreateOrderItemDto, UpdateOrderDto } from "../../types/orderType";

//post
export const createOrder = async (orderData: CreateOrderDto) => {
  const res = await api.post("/Order", orderData);
  return res.data;
};
export const createOrderItem = async (itemData: CreateOrderItemDto) => {
  const res = await api.post("/OrderItem", itemData);
  return res.data;
};

//get
export const getOrders = async () => {
  const res = await api.get("/Order");
  return res.data;
};

export const getOrdersByFosterHome = async (fosterHomeId: number) => {
  const res = await api.get(`/Order/fosterhome/${fosterHomeId}`);
  return res.data;
};

//put - update an order (used to mark complete)
export const updateOrder = async (id: number, orderData: UpdateOrderDto) => {
  const res = await api.put(`/Order/${id}`, orderData);
  return res.data;
};

//delete
export const deleteOrder = async (id: number) => {
  const res = await api.delete(`/Order/${id}`);
  return res.data;
};
