import { getAnimals, updateAnimal, deleteAnimal, createAnimal } from "@/api/animal";
import { DataTable } from "@/components/shared/DataTable";
import { ActionsDropdown } from "@/components/shared/ActionsDropdown";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Animal } from "../../../../types/animalType";
import { PetsModal } from "./PetsModal";

export function PetsTable() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [status, setStatus] = useState<string[]>([]);

  //loads pets from database through api
  useEffect(() => {
    async function load() {
      const data = await getAnimals();
      setAnimals(Array.isArray(data) ? data : []);

      const tempStatus: string[] = data.map(animal => animal.status).reduce((acc: string[], cur: string) => {
        if (acc.includes(cur)) {
          return acc;
        }
        acc.push(cur);
        return acc;
      }, []);

      setStatus(tempStatus);
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
    animalPhoto: string | null;
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
          animalPhoto: formData.animalPhoto,
        });
      } else {
        await createAnimal({
          name: formData.name || null,
          breed: formData.breed || null,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          height: formData.height ? parseFloat(formData.height) : null,
          intakeDate: new Date().toISOString(),
          status: formData.status || null,
          animalPhoto: formData.animalPhoto,
        });
      }

      const data = await getAnimals();
      setAnimals(Array.isArray(data) ? data : []);
      setEditingAnimal(null);
    } catch (error) {
      console.error("Error saving pet:", error);
    }
  };

  const handleView = (animal: Animal) => {
    navigate(`/employee-pets-page/${animal.id}`);
  };

  const columns = [
    {
      header: "Actions",
      cell: (row: Animal) => (
        <ActionsDropdown
          actions={[
            {
              label: "View",
              icon: <Eye className="mr-2 h-4 w-4" />,
              onClick: () => handleView(row),
            },
            {
              label: "Edit",
              icon: <Pencil className="mr-2 h-4 w-4" />,
              onClick: () => handleEdit(row),
            },
            {
              label: "Delete",
              icon: <Trash2 className="mr-2 h-4 w-4" />,
              onClick: () => handleDelete(row.id),
              className: "text-red-600",
            },
          ]}
        />
      ),
    },
    {
      header: "Name",
      cell: (row: Animal) =>
        row.name || <span className="text-gray-400 italic">N/A</span>,
    },
    {
      header: "Breed",
      cell: (row: Animal) =>
        row.breed || <span className="text-gray-400 italic">N/A</span>,
    },
    {
      header: "Weight",
      cell: (row: Animal) =>
        row.weight ? `${row.weight} lbs` : <span className="text-gray-400 italic">N/A</span>,
    },
    {
      header: "Height",
      cell: (row: Animal) =>
        row.height ? `${row.height} in` : <span className="text-gray-400 italic">N/A</span>,
    },
    {
      header: "Intake Date",
      cell: (row: Animal) =>
        row.intakeDate
          ? new Date(row.intakeDate).toLocaleDateString()
          : <span className="text-gray-400 italic">N/A</span>,
    },
    {
      header: "Status",
      cell: (row: Animal) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          {row.status || "Unknown"}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Pets</h2>
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
        getRowId={(row) => row.id}
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
                animalPhoto: null,
              }
            : undefined
        }
        status={status}
      />
    </div>
  );
}
