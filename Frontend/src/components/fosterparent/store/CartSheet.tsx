import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import { CartItem } from "./CartItem";
import type { CartItemData } from "./CartItem";

//props
interface CartSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItemData[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onPlaceOrder: () => void;
  isOrdering: boolean;
}

export function CartSheet({
  isOpen,
  onOpenChange,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  isOrdering,
}: CartSheetProps) {
  // Calculate the total price of all items in the cart
  const cartTotal = cartItems.reduce((total, item) => {
    return total + item.product.unitprice * item.quantity;
  }, 0);

  // Count total number of items
  const totalItems = cartItems.reduce((count, item) => {
    return count + item.quantity;
  }, 0);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </SheetTitle>
          <SheetDescription>
            Review your items and place your order
          </SheetDescription>
        </SheetHeader>

        {/* Cart items list - scrollable if many items */}
        <div className="flex-1 overflow-y-auto px-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <ShoppingCart className="h-10 w-10 mb-2 opacity-50" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="divide-y">
              {cartItems.map((item) => (
                <CartItem
                  key={item.product.productid}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer with total and place order button */}
        {cartItems.length > 0 && (
          <SheetFooter className="border-t pt-4">
            <div className="w-full space-y-3">
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <Button
                onClick={onPlaceOrder}
                disabled={isOrdering}
                className="w-full bg-[#D9BF86] text-gray-900 hover:bg-[#c9af76] font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isOrdering ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
