import { useState, useEffect } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCategories } from '@/api/inventory'


type InventoryFormData = {
  productid: number
  quantityonhand: number
  reorderlevel: number
  categoryid: number
  description: string
  unitprice: number
  name: string
}


type EditInventoryData = InventoryFormData & { id: number }

type Category = {
  id: number
  name: string
}

type InventoryModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (formData: InventoryFormData) => Promise<void>
  initialData?: EditInventoryData
  isEditing?: boolean
}

export function InventoryModal({ open, onOpenChange, onSubmit, initialData, isEditing = false }: InventoryModalProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    productid: initialData?.productid ?? "",
    quantityonhand: initialData?.quantityonhand ?? "",
    reorderlevel: initialData?.reorderlevel ?? "",
    categoryid: initialData?.categoryid ?? "",
    description: initialData?.description ?? "",
    unitprice: initialData?.unitprice ?? "",
    name: initialData?.name ?? "",
  })


  // Fetch categories when modal opens
  useEffect(() => {
    if (open) {
      fetchCategories()
    }
  }, [open])

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setForm({
        productid: initialData.productid ?? "",
        quantityonhand: initialData.quantityonhand ?? "",
        reorderlevel: initialData.reorderlevel ?? "",
        categoryid: initialData.categoryid ?? "",
        description: initialData.description ?? "",
        unitprice: initialData.unitprice ?? "",
        name: initialData.name ?? "",
      })
    } else {
      setForm({
        productid: "",
        quantityonhand: "",
        reorderlevel: "",
        categoryid: "",
        description: "",
        unitprice: "",
        name: "",
      })
    }
  }, [initialData])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    try {
      setSubmitting(true)

      await onSubmit({
        productid: Number(form.productid),
        quantityonhand: Number(form.quantityonhand),
        reorderlevel: Number(form.reorderlevel),
        categoryid: Number(form.categoryid),
        description: form.description,
        unitprice: Number(form.unitprice),
        name: form.name,
      })

      // Reset form data
      setForm({
        productid: "",
        quantityonhand: "",
        reorderlevel: "",
        categoryid: "",
        description: "",
        unitprice: "",
        name: "",
      })

      // Close modal
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving inventory:', error)
      alert('Error saving inventory. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Inventory" : "Add a New Inventory Item"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the inventory item's information below."
              : "Enter the inventory item's information below."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inventory-categoryid">Category</Label>
            <select
              id="inventory-categoryid"
              value={form.categoryid}
              onChange={(e) => setForm({ ...form, categoryid: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={loading}// || isEditing
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inventory-description">Description</Label>
            <Input
              id="inventory-description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Product description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inventory-quantityonhand">Quantity on Hand</Label>
            <Input
              id="inventory-quantityonhand"
              type="number"
              value={form.quantityonhand}
              onChange={(e) => setForm({ ...form, quantityonhand: e.target.value })}
              placeholder="e.g., 50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inventory-reorderlevel">Reorder Level</Label>
            <Input
              id="inventory-reorderlevel"
              type="number"
              value={form.reorderlevel}
              onChange={(e) => setForm({ ...form, reorderlevel: e.target.value })}
              placeholder="e.g., 10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inventory-unitprice">Unit Price</Label>
            <Input
              id="inventory-unitprice"
              type="number"
              step="0.01"
              value={form.unitprice}
              onChange={(e) => setForm({ ...form, unitprice: e.target.value })}
              placeholder="e.g., 29.99"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#D9BF86] text-black hover:bg-[#c9af76]"
          >
            {submitting ? "Saving..." : isEditing ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}