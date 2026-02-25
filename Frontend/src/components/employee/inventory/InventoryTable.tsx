import { getInventory, updateInventory, deleteInventory, updateProduct, getProduct, getCategories, deleteProduct, createInventory, createProduct } from "@/api/inventory";
import { DataTable } from "@/components/shared/DataTable";
import type { Inventory, InventoryFlattened,ProductDto,ProductCategoryDto } from "../../../../types/inventoryType";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { InventoryModal } from "./InventoryModal";

// Helper function to flatten inventory data
const flattenInventory = (
  item: Inventory,
  products: ProductDto[],
  categories: ProductCategoryDto[]
): InventoryFlattened => {
  const product = products.find(p => p.id === item.productId);
  const category = categories.find(c => c.id === product?.categoryId);

  return {
    id: item.id,
    productid: item.productId ?? 0,
    quantityonhand: item.quantityOnHand ?? 0,
    reorderlevel: item.reorderLevel ?? 0,

    // From product table
    description: product?.description ?? "",
    unitprice: product?.unitPrice ?? 0,
    categoryid: product?.categoryId ?? 0,

    // From category table
    name: category?.name ?? ""
  };
};



export function InventoryTable() {
  const [inventory, setInventory] = useState<InventoryFlattened[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInventory, setEditingInventory] = useState<InventoryFlattened | null>(null);

  const loadInventory = async () => {
    const data = await getInventory();
    const data_product = await getProduct();
    const data_category = await getCategories();
    console.log('data',data);
    const flattened = Array.isArray(data) ? data.map(item =>
        flattenInventory(item, data_product, data_category)) : [];
    
    setInventory(flattened);
  };

  // Use it in useEffect
  useEffect(() => {
    loadInventory();
  }, []);

  //opens modal with the selected inventory's data for editing
  const handleEdit = (item: InventoryFlattened) => {
    setEditingInventory(item);
    setIsModalOpen(true);
  };

  //deletes inventory from database
  const handleDelete =async (id: number, productId: number) => {
    deleteInventory(id);
    deleteProduct(productId);
    alert("Deleted successfully");
    await loadInventory();
  };

  //opens modal when user clicks add inventory button
  const handleAddInventory = () => {   
    setEditingInventory(null); 
    setIsModalOpen(true);
  };

  //receives data from modal and calls api to create or update inventory in database
  const handleSubmit = async (formData: {
    productid: number;
    quantityonhand: number;
    reorderlevel: number;
    categoryid: number;
    description: string;
    unitprice: number;
    name: string;
  }) => {
    try {
      if (editingInventory) {
        await updateInventory(editingInventory.id, {
          productId: formData.productid,
          quantityOnHand: formData.quantityonhand,
          reorderLevel: formData.reorderlevel,
        });
        await updateProduct(editingInventory.productid, {
          categoryId: formData.categoryid,
          description: formData.description,
          unitPrice: formData.unitprice,
          id: formData.productid,
        });
        
        alert("Updated successfully");
      } else {
          const newProduct = await createProduct({
          categoryId: formData.categoryid,
          description: formData.description,
          unitPrice: formData.unitprice,
        });
         await createInventory({
          productId: newProduct.id,
        quantityOnHand: formData.quantityonhand,
        reorderLevel: formData.reorderlevel,
            });
        
        alert("Inserted successfully");
      }
      

      // Refresh table after submission
      await loadInventory();
      setEditingInventory(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving inventory:", error);
    }
  };

  
  const columns = [
    {
      header: "Actions",
      cell: (item: InventoryFlattened) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => handleEdit(item)}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(item.id, item.productid)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    //  {
    //   header: "Inventory ID",
    //   cell: (item: InventoryFlattened) =>
    //     item.id || <span className="text-gray-400 italic">N/A</span>,
    // },
    // {
    //   header: "Product ID",
    //   cell: (item: InventoryFlattened) =>
    //     item.productid || <span className="text-gray-400 italic">N/A</span>,
    // },
    // {
    //   header: "Category ID",
    //   cell: (item: InventoryFlattened) =>
    //     item.categoryid || <span className="text-gray-400 italic">N/A</span>,
    // },
    {
      header: " Category Name",
      cell: (item: InventoryFlattened) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {item.name || <span className="text-gray-400 italic">N/A</span>}
        </span>
      ),
    },
    {
      header: "Description",
      cell: (item: InventoryFlattened) =>
        item.description || <span className="text-gray-400 italic">N/A</span>,
    },
    {
      header: "Quantity on Hand",
      cell: (item: InventoryFlattened) =>
        item.quantityonhand ? (
          item.quantityonhand
        ) : (
          <span className="text-gray-400 italic">N/A</span>
        ),
    },
    {
      header: "Reorder Level",
      cell: (item: InventoryFlattened) =>
        item.reorderlevel ? (
          item.reorderlevel
        ) : (
          <span className="text-gray-400 italic">N/A</span>
        ),
    },
    {
      header: "Unit Price",
      cell: (item: InventoryFlattened) =>
        item.unitprice ? (
          `$${item.unitprice.toFixed(2)}`
        ) : (
          <span className="text-gray-400 italic">N/A</span>
        ),
    },
    
  ];

  return (
    <div className="w-full p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Inventory
        </h2>
        <Button
          onClick={handleAddInventory}
          className="bg-[#D9BF86] text-gray-900 hover:bg-[#c9af76] font-semibold px-6 py-2 shadow-md hover:shadow-lg hover:cursor-pointer transition-all duration-200"
        >
          + Add Inventory
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={inventory}
        emptyMessage="No inventory items found"
        getRowId={(item: InventoryFlattened) => item.id}
      />

      <InventoryModal
        key={editingInventory?.id ?? "new"}
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingInventory(null);
        }}
        onSubmit={handleSubmit}
        initialData={
          editingInventory
            ? {
              id: editingInventory.id,
              productid: editingInventory.productid ?? 0,
              quantityonhand: editingInventory.quantityonhand ?? 0,
              reorderlevel: editingInventory.reorderlevel ?? 0,
              categoryid: editingInventory.categoryid ?? 0,
              description: editingInventory.description ?? "",
              unitprice: editingInventory.unitprice ?? 0,
              name: editingInventory.name ?? "",
            }
            : undefined
        
        }
        isEditing={editingInventory?true:false}
      />
    </div>
  );
}