//get
export interface OrderDto {
  id: number;
  userId: number | null;
  userName: string | null;
  orderComplete: boolean | null;
  dateOrdered: string | null;
  orderItems: OrderItemDto[];
}

export interface OrderItemDto {
  id: number;
  orderId: number | null;
  productId: number | null;
  quantity: number | null;
  productName: string | null;
  categoryName: string | null;
}

//post
export interface CreateOrderDto {
  userId: number;
  orderComplete: boolean;
  dateOrdered: string;
}

export interface CreateOrderItemDto {
  orderId: number;
  productId: number;
  quantity: number;
}

//put
export interface UpdateOrderDto {
  userId: number | null;
  orderComplete: boolean;
  dateOrdered: string | null;
}
