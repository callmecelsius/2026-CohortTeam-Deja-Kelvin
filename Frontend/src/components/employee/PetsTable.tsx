import { getAnimals, updateAnimal, deleteAnimal, createAnimal } from "@/api/animal";
import { DataTable } from "../shared/DataTable";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Animal } from "../../../types/animalType";
import { PetsModal } from "./PetsModal";

export function PetsTable() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);

  //loads pets from database through api
  useEffect(() => {
    async function load() {
      const data = await getAnimals();
      setAnimals(Array.isArray(data) ? data : []);
    }
    load();
  }, []);

  //opens modal with the selected pet's data for editing
  const handleEdit = (animal: Animal) => {
    setEditingAnimal(animal);
    setIsModalOpen(true);
  };

  //deletes pet from database
  const handleDelete = (id: number) => {
    deleteAnimal(id);
  };

  //opens modal when user clicks add pet button
  const handleAddPet = () => {
    setIsModalOpen(true);
  };

  //recieves data from modal and calls api to create or update pet in database
  const handleSubmit = async (formData: {
    name: string;
    breed: string;
    weight: string;
    height: string;
    status: string;
  }) => {
    try {
      if (editingAnimal) {
        await updateAnimal(editingAnimal.id, {
          name: formData.name || null,
          breed: formData.breed || null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          height: formData.height ? parseFloat(formData.height) : null,
          intakeDate: editingAnimal.intakeDate ?? new Date().toISOString(),
          status: formData.status || null,
        });
      } else {
        await createAnimal({
          name: formData.name || null,
          breed: formData.breed || null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          height: formData.height ? parseFloat(formData.height) : null,
          intakeDate: new Date().toISOString(),
          status: formData.status || null,
        });
      }

      const data = await getAnimals();
      setAnimals(Array.isArray(data) ? data : []);
      setEditingAnimal(null);
    } catch (error) {
      console.error("Error saving pet:", error);
    }
  };
  const columns = [
    {
      header: "Actions",
      cell: (animal: Animal) => (
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
              onClick={() => handleEdit(animal)}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(animal.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      header: "Name",
      cell: (animal: Animal) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {animal.name || <span className="text-gray-400 italic">N/A</span>}
        </span>
      ),
    },
    {
      header: "Breed",
      cell: (animal: Animal) =>
        animal.breed || <span className="text-gray-400 italic">N/A</span>,
    },
    {
      header: "Weight",
      cell: (animal: Animal) =>
        animal.weight ? (
          `${animal.weight} lbs`
        ) : (
          <span className="text-gray-400 italic">N/A</span>
        ),
    },
    {
      header: "Height",
      cell: (animal: Animal) =>
        animal.height ? (
          `${animal.height} in`
        ) : (
          <span className="text-gray-400 italic">N/A</span>
        ),
    },
    {
      header: "Intake Date",
      cell: (animal: Animal) =>
        animal.intakeDate ? (
          new Date(animal.intakeDate).toLocaleDateString()
        ) : (
          <span className="text-gray-400 italic">N/A</span>
        ),
    },
    {
      header: "Status",
      cell: (animal: Animal) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          {animal.status || "Unknown"}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Pets
        </h2>
        <Button
          onClick={handleAddPet}
          className="bg-[#D9BF86] text-gray-900 hover:bg-[#c9af76] font-semibold px-6 py-2 shadow-md hover:shadow-lg hover:cursor-pointer transition-all duration-200"
        >
          + Add Pet
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={animals}
        emptyMessage="No pets found"
        getRowId={(animal: Animal) => animal.id}
      />

      <PetsModal
        key={editingAnimal?.id ?? "new"}
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingAnimal(null);
        }}
        onSubmit={handleSubmit}
        initialData={
          editingAnimal
            ? {
                id: editingAnimal.id,
                name: editingAnimal.name ?? "",
                breed: editingAnimal.breed ?? "",
                weight: String(editingAnimal.weight ?? ""),
                height: String(editingAnimal.height ?? ""),
                status: editingAnimal.status ?? "",
              }
            : undefined
        }
      />
    </div>
  );
}
