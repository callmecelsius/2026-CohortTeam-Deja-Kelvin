import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAnimalById } from "@/api/animal";
import { PetDetailCard } from "@/components/employee/PetDetailCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Animal } from "../../../types/animalType";

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchAnimal() {
      try {
        const data = await getAnimalById(Number(id));
        setAnimal(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchAnimal();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="w-full p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Loading pet details...
        </p>
      </div>
    );
  }

  if (error || !animal) {
    return (
      <div className="w-full p-6 space-y-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/employee-pets-page")}
          className="hover:cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pets
        </Button>
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Pet not found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6">
      <Button
        variant="ghost"
        onClick={() => navigate("/employee-pets-page")}
        className="hover:cursor-pointer"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Pets
      </Button>

      <div className="flex justify-center">
        <PetDetailCard animal={animal} />
      </div>
    </div>
  );
}
