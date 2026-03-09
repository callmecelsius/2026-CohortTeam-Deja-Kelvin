import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Home, ShoppingCart } from "lucide-react";
import { getOrdersByFosterHome } from "@/api/order";
import type { OrderDto } from "../../../types/orderType";
import useGlobalContext from "@/hooks/useGlobalContext";

export default function FosterDashboard() {
  const { user } = useGlobalContext();
  const fosterHomeId = user?.fosterParent?.fosterHomeId;
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [fosterHomeId]);

  async function loadOrders() {
    if (!fosterHomeId) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const homeOrders = await getOrdersByFosterHome(fosterHomeId);
      setOrders(homeOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Format a date string to a readable format
  function formatDate(dateString: string | null) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="w-full p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.firstName}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's your foster home overview.
        </p>
      </div>

      {/* Order history section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          My Orders
        </h2>

        {!fosterHomeId ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Home className="h-10 w-10 mb-2 opacity-50" />
              <p>No foster home assigned</p>
              <p className="text-sm">
                You are not currently assigned to a foster home.
              </p>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <p className="text-muted-foreground">Loading orders...</p>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ShoppingCart className="h-10 w-10 mb-2 opacity-50" />
              <p>No orders yet</p>
              <p className="text-sm">
                Visit the Store to place your first order
              </p>
            </CardContent>
          </Card>
        ) : (
          // List of order cards
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Order #{order.id}
                    </CardTitle>

                    {/* Status badge */}
                    {order.orderComplete ? (
                      <Badge className="bg-emerald-100 text-emerald-700">
                        Complete
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700">
                        Pending
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-2">
                  {/* Order date */}
                  <p className="text-sm text-muted-foreground">
                    Ordered on {formatDate(order.dateOrdered)}
                  </p>

                  <Separator />

                  {/* List of items in this order */}
                  <div className="space-y-1">
                    {order.orderItems?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span>{item.productName ?? "Unknown item"}</span>
                          {item.categoryName && (
                            <Badge variant="secondary" className="text-xs">
                              {item.categoryName}
                            </Badge>
                          )}
                        </div>
                        <span className="text-muted-foreground">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
