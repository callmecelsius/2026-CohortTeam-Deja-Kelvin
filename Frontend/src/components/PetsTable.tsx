import { getAnimals } from "@/api/animal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import type { Animal } from "../../types/animalType";

export function PetsTable() {
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getAnimals();
      setAnimals(Array.isArray(data) ? data : []);
    }
    load();
  }, []);

  const handleEdit = (animal: Animal) => {
    console.log("Edit:", animal);
  };

  const handleDelete = (id: number) => {
    console.log("Delete:", id);
  };

  const handleAddPet = () => {
    console.log("Add pet");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Pets Database</h2>
        <Button onClick={handleAddPet}>+ Add Pet</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Actions</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Breed</TableHead>
            <TableHead>Weight</TableHead>
            <TableHead>Height</TableHead>
            <TableHead>Intake Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {animals.map((animal) => (
            <TableRow key={animal.id}>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      ⋮
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(animal)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(animal.id)}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>

              <TableCell>{animal.name}</TableCell>
              <TableCell>{animal.breed}</TableCell>
              <TableCell>{animal.weight}</TableCell>
              <TableCell>{animal.height}</TableCell>
              <TableCell>{animal.intakeDate}</TableCell>
              <TableCell>{animal.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
