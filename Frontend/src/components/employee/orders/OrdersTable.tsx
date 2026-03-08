import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { CheckCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { ActionsDropdown } from "@/components/shared/ActionsDropdown";
import { getOrders, updateOrder, deleteOrder } from "@/api/order";
import type { OrderDto } from "../../../../types/orderType";

export function OrdersTable() {
  const [orders, setOrders] = useState<OrderDto[]>([]);

  // Load all orders from the backend
  const loadOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders.");
    }
  };

  // Load orders when the component first mounts
  useEffect(() => {
    loadOrders();
  }, []);

  // Mark an order as complete
  const handleMarkComplete = async (order: OrderDto) => {
    try {
      await updateOrder(order.id, {
        userId: order.userId,
        orderComplete: true,
        dateOrdered: order.dateOrdered,
      });
      toast.success(`Order #${order.id} marked as complete`);
      await loadOrders();
    } catch (error) {
      console.error("Error completing order:", error);
      toast.error("Failed to complete order.");
    }
  };

  // Delete an order
  const handleDelete = async (id: number) => {
    try {
      await deleteOrder(id);
      toast.success("Order deleted");
      await loadOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order.");
    }
  };

  // Format a date string to a readable format
  function formatDate(dateString: string | null) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Define the table columns
  const columns = [
    {
      header: "Actions",
      cell: (order: OrderDto) => {
        // Build the list of actions for this row
        const actions = [];

        // Only show "Mark Complete" if the order is still pending
        if (!order.orderComplete) {
          actions.push({
            label: "Complete",
            icon: <CheckCircle className="mr-2 h-4 w-4" />,
            onClick: () => handleMarkComplete(order),
          });
        }

        // Always show delete
        actions.push({
          label: "Delete",
          icon: <Trash2 className="mr-2 h-4 w-4" />,
          onClick: () => handleDelete(order.id),
          className: "text-red-600",
        });

        return <ActionsDropdown actions={actions} />;
      },
    },
    {
      header: "Order ID",
      cell: (order: OrderDto) => (
        <span className="font-medium">#{order.id}</span>
      ),
    },
    {
      header: "Foster Parent",
      cell: (order: OrderDto) => order.userName ?? "N/A",
    },
    {
      header: "Date Ordered",
      cell: (order: OrderDto) => formatDate(order.dateOrdered),
    },
    {
      header: "Items",
      cell: (order: OrderDto) => {
        const count = order.orderItems?.length ?? 0;
        return `${count} ${count === 1 ? "item" : "items"}`;
      },
    },
    {
      header: "Status",
      cell: (order: OrderDto) =>
        order.orderComplete ? (
          <Badge className="bg-emerald-100 text-emerald-700">Complete</Badge>
        ) : (
          <Badge className="bg-amber-100 text-amber-700">Pending</Badge>
        ),
    },
  ];

  return (
    <div className="w-full p-6 space-y-4">
      <Toaster richColors position="top-center" />

      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Orders
        </h2>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        getRowId={(order: OrderDto) => order.id}
      />
    </div>
  );
}
