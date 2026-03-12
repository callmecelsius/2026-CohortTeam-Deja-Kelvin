import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Store components
import { ProductCard } from "@/components/fosterparent/store/ProductCard";
import { StoreFilters } from "@/components/fosterparent/store/StoreFilters";
import type { SortOption } from "@/components/fosterparent/store/StoreFilters";
import { CartSheet } from "@/components/fosterparent/store/CartSheet";
import type { CartItemData } from "@/components/fosterparent/store/CartItem";

// API functions (reusing existing ones from inventory)
import { getInventory, getProduct, getCategories } from "@/api/inventory";
import { createOrder, createOrderItem } from "@/api/order";
import useGlobalContext from "@/hooks/useGlobalContext";

// Types
import type {
  Inventory,
  InventoryFlattened,
  ProductDto,
  ProductCategoryDto,
} from "../../../types/inventoryType";

// Helper function to join inventory + product + category data into one flat object
function flattenInventoryItem(
  item: Inventory,
  products: ProductDto[],
  categories: ProductCategoryDto[]
): InventoryFlattened {
  const product = products.find((p) => p.id === item.productId);
  const category = categories.find((c) => c.id === product?.categoryId);

  return {
    id: item.id,
    productid: item.productId ?? 0,
    quantityonhand: item.quantityOnHand ?? 0,
    reorderlevel: item.reorderLevel ?? 0,
    description: product?.description ?? "",
    unitprice: product?.unitPrice ?? 0,
    categoryid: product?.categoryId ?? 0,
    name: category?.name ?? "",
  };
}

export default function FosterStore() {
  const { user } = useGlobalContext();

  // --- State for product data ---
  const [products, setProducts] = useState<InventoryFlattened[]>([]);
  const [categories, setCategories] = useState<ProductCategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- State for search, filters, and sorting ---
  const [searchText, setSearchText] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");

  // --- State for the cart ---
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  // --- Ref for cart badge animation ---
  const [cartBounce, setCartBounce] = useState(false);
  const badgeRef = useRef<HTMLSpanElement>(null);

  // --- Load products when the page first loads ---
  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setIsLoading(true);

      // Fetch all three data sources at the same time
      const [inventoryData, productData, categoryData] = await Promise.all([
        getInventory(),
        getProduct(),
        getCategories(),
      ]);

      // Join the data together into flat objects
      const flattenedProducts = Array.isArray(inventoryData)
        ? inventoryData.map((item: Inventory) =>
            flattenInventoryItem(item, productData, categoryData)
          )
        : [];

      setProducts(flattenedProducts);
      setCategories(categoryData);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // --- Filter products based on search text and selected category ---
  const filteredProducts = products.filter((product) => {
    // Check if the product matches the search text (searches both name and category)
    const search = searchText.toLowerCase();
    const matchesSearch =
      product.description.toLowerCase().includes(search) ||
      product.name.toLowerCase().includes(search);

    // Check if the product matches the selected category
    const matchesCategory =
      selectedCategoryId === null || product.categoryid === selectedCategoryId;

    // Product must match both filters
    return matchesSearch && matchesCategory;
  });

  // --- Sort the filtered products ---
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.description.localeCompare(b.description);
      case "name-desc":
        return b.description.localeCompare(a.description);
      case "price-low":
        return a.unitprice - b.unitprice;
      case "price-high":
        return b.unitprice - a.unitprice;
      case "stock-low":
        return a.quantityonhand - b.quantityonhand;
      case "stock-high":
        return b.quantityonhand - a.quantityonhand;
      default:
        return 0;
    }
  });

  // --- Cart functions ---

  function addToCart(product: InventoryFlattened) {
    setCartItems((currentCart) => {
      // Check if this product is already in the cart
      const existingItem = currentCart.find(
        (item) => item.product.productid === product.productid
      );

      if (existingItem) {
        // If already in cart, increase the quantity by 1
        return currentCart.map((item) =>
          item.product.productid === product.productid
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // If not in cart, add it with quantity 1
      return [...currentCart, { product, quantity: 1 }];
    });

    // Trigger the cart badge bounce animation
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 300);

    toast.success(`Added "${product.description}" to cart`);
  }

  function updateCartQuantity(productId: number, newQuantity: number) {
    // If quantity drops to 0 or below, remove the item
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((currentCart) =>
      currentCart.map((item) =>
        item.product.productid === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }

  function removeFromCart(productId: number) {
    setCartItems((currentCart) =>
      currentCart.filter((item) => item.product.productid !== productId)
    );
  }

  // --- Place order (checkout) ---

  async function handlePlaceOrder() {
    if (cartItems.length === 0) return;

    try {
      setIsOrdering(true);

      // Step 1: Create the order (backend returns the created order with its ID)
      const orderData = {
        userId: user.id,
        orderComplete: false,
        dateOrdered: new Date().toISOString(),
      };
      const createdOrder = await createOrder(orderData);

      // Step 2: Create an order item for each cart item
      for (const cartItem of cartItems) {
        await createOrderItem({
          orderId: createdOrder.id,
          productId: cartItem.product.productid,
          quantity: cartItem.quantity,
        });
      }

      // Step 3: Clear cart, reload products to show updated stock, and show success
      setCartItems([]);
      setIsCartOpen(false);
      await loadProducts();
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsOrdering(false);
    }
  }

  // Count total items in cart (for the badge on the cart button)
  const cartItemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <div className="w-full p-3 sm:p-6 space-y-6">
      {/* Toast notifications */}
      <Toaster richColors position="top-center" />

      {/* Page header with cart button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Store
        </h1>

        {/* Cart button - opens the cart sheet */}
        <Button
          onClick={() => setIsCartOpen(true)}
          className="bg-[#D9BF86] text-gray-900 hover:bg-[#c9af76] font-semibold px-6 py-2 shadow-md hover:shadow-lg hover:cursor-pointer transition-all duration-200 relative"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart
          {/* Item count badge with smooth bounce animation */}
          {cartItemCount > 0 && (
            <Badge
              ref={badgeRef}
              className={`absolute -top-2 -right-2 bg-gray-800 text-white text-xs h-5 w-5 flex items-center justify-center p-0 transition-transform duration-300 ease-out ${
                cartBounce ? "scale-125" : "scale-100"
              }`}
            >
              {cartItemCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Search and category filters */}
      <StoreFilters
        searchText={searchText}
        onSearchChange={setSearchText}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={setSelectedCategoryId}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Product grid */}
      {isLoading ? (
        // Show skeleton cards while loading
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        // Show message when no products match the filters
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No products found</p>
          <p className="text-sm mt-1">
            Try adjusting your search or category filter
          </p>
        </div>
      ) : (
        // Show the product cards
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}

      {/* Cart sidebar sheet */}
      <CartSheet
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onPlaceOrder={handlePlaceOrder}
        isOrdering={isOrdering}
      />
    </div>
  );
}
