import { useState } from "react"

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

//types for form data and modal props

type PetFormData = {
  name: string
  breed: string
  weight: string
  height: string
  status: string
}

type EditPetData = PetFormData & { id: number }

type PetsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (formData: PetFormData) => Promise<void>
  initialData?: EditPetData
}

export function PetsModal({ open, onOpenChange, onSubmit, initialData }: PetsModalProps) {
  const isEditing = !!initialData

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    breed: initialData?.breed ?? "",
    weight: initialData?.weight ?? "",
    height: initialData?.height ?? "",
    status: initialData?.status ?? "",
  })

  //handles submission of form data to api
  async function handleSubmit() {
    await onSubmit({
      name: form.name,
      breed: form.breed,
      weight: form.weight,
      height: form.height,
      status: form.status,
    })

    //resets form data
    setForm({
      name: "",
      breed: "",
      weight: "",
      height: "",
      status: "",
    })

    //closes modal
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Pet" : "Add a New Pet"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the pet's information below."
              : "Enter the pet's information below."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pet-name">Pet Name</Label>
            <Input
              id="pet-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Fluffy"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pet-breed">Pet Breed</Label>
            <Input
              id="pet-breed"
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
              placeholder="Dog"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pet-weight">Pet Weight</Label>
            <Input
              id="pet-weight"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              placeholder="10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pet-height">Pet Height</Label>
            <Input
              id="pet-height"
              value={form.height}
              onChange={(e) => setForm({ ...form, height: e.target.value })}
              placeholder="20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pet-status">Pet Status</Label>
            <select
              id="pet-status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="" disabled>Select status</option>
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Fostered">Fostered</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-[#D9BF86] text-black hover:bg-[#c9af76]"
          >
            {isEditing ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
