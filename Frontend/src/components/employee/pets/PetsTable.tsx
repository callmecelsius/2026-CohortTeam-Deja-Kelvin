import { getAnimals, updateAnimal, deleteAnimal, createAnimal, assignPetToFosterHome, getAnimalSeverities } from "@/api/animal";
import { DataTable } from "@/components/shared/DataTable";
import { ActionsDropdown } from "@/components/shared/ActionsDropdown";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Pencil, Trash2, Home, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Animal } from "../../../../types/animalType";
import { PetsModal } from "./PetsModal";
import { AssignFosterHomeModal } from "./AssignFosterHomeModal";
import { toast } from "sonner";

const severityColor: Record<string, string> = {
  low: "text-green-500",
  moderate: "text-yellow-500",
  high: "text-amber-500",
  critical: "text-red-500",
};

export function PetsTable() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [status, setStatus] = useState<string[]>([]);
  const [assigningAnimal, setAssigningAnimal] = useState<Animal | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [severityMap, setSeverityMap] = useState<Map<number, string>>(new Map());
  const [severityFilter, setSeverityFilter] = useState("all");

  //loads pets from database through api
  useEffect(() => {
    async function load() {
      const [data, severities] = await Promise.all([
        getAnimals(),
        getAnimalSeverities(),
      ]);
      setAnimals(Array.isArray(data) ? data : []);
      setSeverityMap(new Map(severities.map(s => [s.animalId, s.severity])));

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
  const handleDelete = async (id: number) => {
    try {
      await deleteAnimal(id);
      toast.success("Pet deleted successfully");
      const data = await getAnimals();
      setAnimals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error deleting pet:", error);
      toast.error("Failed to delete pet");
    }
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

  const handleAssign = (animal: Animal) => {
    setAssigningAnimal(animal);
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async (fosterHomeId: number) => {
    if (!assigningAnimal) return;
    await assignPetToFosterHome(assigningAnimal.id, fosterHomeId);
    await updateAnimal(assigningAnimal.id, {
      name: assigningAnimal.name,
      breed: assigningAnimal.breed,
      weight: assigningAnimal.weight,
      height: assigningAnimal.height,
      intakeDate: assigningAnimal.intakeDate ?? new Date().toISOString(),
      status: "Fostered",
      animalPhoto: null,
    });
    toast.success(`${assigningAnimal.name || "Pet"} assigned to foster home`);
    const data = await getAnimals();
    setAnimals(Array.isArray(data) ? data : []);
    setAssigningAnimal(null);
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
              label: "Assign",
              icon: <Home className="mr-2 h-4 w-4" />,
              onClick: () => handleAssign(row),
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
      cell: (row: Animal) => {
        const severity = severityMap.get(row.id);
        return (
          <span className="flex items-center gap-1.5">
            {row.name || <span className="text-gray-400 italic">N/A</span>}
            {severity && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertTriangle className={`h-4 w-4 ${severityColor[severity] ?? "text-gray-400"}`} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Medical Severity: {severity.charAt(0).toUpperCase() + severity.slice(1)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </span>
        );
      },
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

  const displayedAnimals = useMemo(() => {
    const filtered = severityFilter === "all"
      ? animals
      : severityFilter === "none"
        ? animals.filter(a => !severityMap.has(a.id))
        : animals.filter(a => severityMap.get(a.id) === severityFilter);

    return [...filtered].sort((a, b) => {
      const dateA = a.intakeDate ? new Date(a.intakeDate).getTime() : 0;
      const dateB = b.intakeDate ? new Date(b.intakeDate).getTime() : 0;
      return dateB - dateA;
    });
  }, [animals, severityFilter, severityMap]);

  return (
    <div className="w-full p-3 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Pets</h2>
        <div className="flex items-center gap-3">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="none">No Condition</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleAddPet}
            className="bg-[#D9BF86] text-gray-900 hover:bg-[#c9af76] font-semibold px-6 py-2 shadow-md hover:shadow-lg hover:cursor-pointer transition-all duration-200"
          >
            + Add Pet
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={displayedAnimals}
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

      <AssignFosterHomeModal
        key={assigningAnimal?.id ?? "assign"}
        open={isAssignModalOpen}
        onOpenChange={(open) => {
          setIsAssignModalOpen(open);
          if (!open) setAssigningAnimal(null);
        }}
        animalId={assigningAnimal?.id ?? 0}
        animalName={assigningAnimal?.name ?? ""}
        onSubmit={handleAssignSubmit}
      />
    </div>
  );
}
