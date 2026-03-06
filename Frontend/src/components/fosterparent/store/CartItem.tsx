import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { InventoryFlattened } from "../../../../types/inventoryType";

// Each item in the cart has a product and a quantity
export interface CartItemData {
  product: InventoryFlattened;
  quantity: number;
}

// Props that this component needs
interface CartItemProps {
  item: CartItemData;
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemove: (productId: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item;

  return (
    <div className="flex items-center justify-between py-3">
      {/* Left side: product info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{product.description}</p>
        <p className="text-sm text-muted-foreground">
          ${product.unitprice.toFixed(2)} each
        </p>
      </div>

      {/* Right side: quantity controls and remove button */}
      <div className="flex items-center gap-2 ml-4">
        {/* Decrease quantity button */}
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onUpdateQuantity(product.productid, quantity - 1)}
          disabled={quantity <= 1}
        >
          <Minus className="h-3 w-3" />
        </Button>

        {/* Current quantity */}
        <span className="w-8 text-center text-sm font-medium">{quantity}</span>

        {/* Increase quantity button */}
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onUpdateQuantity(product.productid, quantity + 1)}
          disabled={quantity >= product.quantityonhand}
        >
          <Plus className="h-3 w-3" />
        </Button>

        {/* Remove from cart button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onRemove(product.productid)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
