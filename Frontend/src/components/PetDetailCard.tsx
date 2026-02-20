import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  PawPrint,
  Weight,
  Ruler,
  CalendarDays,
  Activity,
  Heart,
  Brain,
  ImageIcon,
} from "lucide-react";
import type { Animal } from "../../types/animalType";

type PetDetailCardProps = {
  animal: Animal;
};

export function PetDetailCard({ animal }: PetDetailCardProps) {
  return (
    <Card className="max-w-3xl w-full">
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-t-xl">
        <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
          <ImageIcon className="h-16 w-16 mb-2" />
          <p className="text-sm">No image available</p>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-2xl text-gray-900 dark:text-white">
          {animal.name || "Unknown"}
        </CardTitle>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {animal.breed || "Breed unknown"}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <DetailItem
            icon={<PawPrint className="h-5 w-5" />}
            label="Breed"
            value={animal.breed}
          />
          <DetailItem
            icon={<Weight className="h-5 w-5" />}
            label="Weight"
            value={animal.weight ? `${animal.weight} lbs` : null}
          />
          <DetailItem
            icon={<Ruler className="h-5 w-5" />}
            label="Height"
            value={animal.height ? `${animal.height} in` : null}
          />
          <DetailItem
            icon={<CalendarDays className="h-5 w-5" />}
            label="Intake Date"
            value={
              animal.intakeDate
                ? new Date(animal.intakeDate).toLocaleDateString()
                : null
            }
          />
          <DetailItem
            icon={<Activity className="h-5 w-5" />}
            label="Status"
            value={animal.status}
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-2">
            <Heart className="h-5 w-5 text-red-500" />
            Medical
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            No medical records available yet.
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Behavior
          </h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">
            No behavior notes available yet.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
      <div className="text-gray-500 dark:text-gray-400 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}
