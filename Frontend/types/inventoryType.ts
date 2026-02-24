export interface ProductDto {
  id: number;
  categoryId: number | null;
  description: string | null;
  unitPrice: number | null;
}

export interface ProductCategoryDto {
  id: number;
  name: string | null;
}

export interface Inventory {
  id: number;
  productId: number | null;
  quantityOnHand: number | null;
  reorderLevel: number | null;
  lastUpdated: string | null;
  product: ProductDto | null;
}

export interface InventoryFlattened {
  id: number;
  productid: number;
  quantityonhand: number;
  reorderlevel: number;
  categoryid: number;
  description: string;
  unitprice: number;
  name: string;
}

// Only send these fields to the backend
export interface CreateInventoryDto {
  productId: number;
  quantityOnHand: number;
  reorderLevel: number;
}