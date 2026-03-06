import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  UtensilsCrossed,
  Droplets,
  Baby,
  SprayCan,
  Droplet,
  Layers,
  Puzzle,
  Bone,
  Link,
  Circle,
  Shield,
  Pill,
  Bug,
  BugOff,
  Syringe,
  Thermometer,
  Cross,
  Bed,
  Home,
  Briefcase,
  Fence,
  Wheat,
  CookingPot,
  ClipboardList,
  Cookie,
  FlaskConical,
  Milk,
  Package,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { InventoryFlattened } from "../../../../types/inventoryType";

// Maps each category name to a Lucide icon
const categoryIcons: Record<string, LucideIcon> = {
  "Food bowls": UtensilsCrossed,
  "Water bowls": Droplets,
  "Bottle feeders": Baby,
  "Cleaning supplies": SprayCan,
  "Shampoo": Droplet,
  "Towels": Layers,
  "Toys": Puzzle,
  "Chew toys": Bone,
  "Leashes": Link,
  "Collars": Circle,
  "Harnesses": Shield,
  "Medications": Pill,
  "Flea/tick prevention": Bug,
  "Dewormer": BugOff,
  "Vaccines": Syringe,
  "Syringes": Syringe,
  "Thermometers": Thermometer,
  "First aid kits": Cross,
  "Bedding": Bed,
  "Kennels": Home,
  "Carriers": Briefcase,
  "Play pens": Fence,
  "Blankets": Layers,
  "Dry food": Wheat,
  "Wet/canned food": CookingPot,
  "Prescription diet food": ClipboardList,
  "Treats": Cookie,
  "Supplements": FlaskConical,
  "Vitamins": Pill,
  "Milk replacer": Milk,
};

interface ProductCardProps {
  product: InventoryFlattened;
  onAddToCart: (product: InventoryFlattened) => void;
}

function getStockInfo(quantity: number) {
  if (quantity === 0) {
    return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
  }
  if (quantity <= 10) {
    return { label: "Low Stock", color: "bg-amber-100 text-amber-700" };
  }
  return { label: "In Stock", color: "bg-emerald-100 text-emerald-700" };
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const stockInfo = getStockInfo(product.quantityonhand);
  const isOutOfStock = product.quantityonhand === 0;

  // Look up the icon for this product's category, fallback to Package
  const CategoryIcon = categoryIcons[product.name] || Package;

  return (
    <Card className="group flex flex-col justify-between transition-shadow hover:shadow-md">
      {/* Top section: category badge + product info */}
      <CardHeader>
        <div className="flex items-center justify-between">
          {/* Category name with icon */}
          <Badge variant="secondary" className="text-xs gap-1">
            <CategoryIcon className="h-3 w-3" />
            {product.name}
          </Badge>

          {/* Stock status indicator */}
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${stockInfo.color}`}>
            {stockInfo.label}
          </span>
        </div>

        <CardTitle className="text-base mt-1">
          {product.description}
        </CardTitle>
      </CardHeader>

      {/* Price display */}
      <CardContent>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          ${product.unitprice.toFixed(2)}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {product.quantityonhand} available
        </p>
      </CardContent>

      {/* Add to cart button */}
      <CardFooter>
        <Button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50 hover:cursor-pointer"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
