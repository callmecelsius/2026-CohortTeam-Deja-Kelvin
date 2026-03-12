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
  Home,
} from "lucide-react";
import type { Animal } from "../../../../types/animalType";
import BehaviorModal from "./BehaviorModal";
import { useEffect, useState } from "react";
import { getBehaviorLog, getAnimalConditions } from "@/api/mypets";
import { getAnimalFosterHome } from "@/api/animal";
import type { BehaviorLogGetDto } from "types/BehaviorLogType";
import MedicalModal from "./MedicalModal";
import type { AnimalConditionDto } from "types/AnimalConditionType";



type PetDetailCardProps = {
  animal: Animal;
};

export function PetDetailCard({ animal }: PetDetailCardProps) {


  const [behaviors, setBehaviors] = useState<BehaviorLogGetDto[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<AnimalConditionDto[]>([]);
  const [showAllMedical, setShowAllMedical] = useState(false);
  const [showAllBehavior, setShowAllBehavior] = useState(false);
  const [fosterHome, setFosterHome] = useState<{ assigned: boolean; homeName?: string; address?: string } | null>(null);

  const medicalToShow = showAllMedical ? medicalRecords : medicalRecords.slice(0, 1);
  const behaviorsToShow = showAllBehavior ? behaviors : behaviors.slice(0, 1);
  

  useEffect(() => {
    async function fetchFosterHome() {
      try {
        const data = await getAnimalFosterHome(animal.id);
        setFosterHome(data);
      } catch (error) {
        console.error("Error fetching foster home:", error);
      }
    }
    fetchFosterHome();
  }, [animal.id]);

  useEffect(() => {
    async function fetchBehaviors() {
      try {
        const data = await getBehaviorLog(animal.id);
        console.log("Fetched behaviors:", data);
        const mapped = data.map((b: any) => ({
          Id: b.id,
          AnimalId: b.animalId,
          ReportedByUserId: b.reportedByUserId,
          ReportedByName: b.reportedByName,
          BehaviorType: b.behaviorType,
          Notes: b.notes,
          DateReported: new Date(b.dateReported), // convert string to Date
          Resolved: b.resolved,
        }));
        setBehaviors(mapped);
      } catch (error) {
        console.error("Error fetching behaviors:", error);
      }
    }
    fetchBehaviors();
  }, [animal.id]);

  useEffect(() => {
    async function fetchMedical() {
      try {
        const data = await getAnimalConditions(animal.id);

        const mapped = data.map((m: any) => ({
          Id: m.id,
          AnimalId: m.animalId,
          ConditionType: m.conditionType,
          Description: m.description,
          Severity: m.severity,
          StartDate: m.startDate ? new Date(m.startDate) : null,
          EndDate: m.endDate ? new Date(m.endDate) : null,
          VetSeen: m.vetSeen,
        }));

        setMedicalRecords(mapped);
      } catch (error) {
        console.error("Error fetching medical records:", error);
      }
    }

    fetchMedical();
  }, [animal.id]);

  return (
    <Card className="max-w-3xl w-full overflow-hidden pt-0">
      <div className="flex items-center justify-center px-6 pt-2 overflow-hidden">
        {animal.animalPhoto ? (
          <img
            src={`data:image/png;base64,${animal.animalPhoto}`}
            alt={animal.name ?? "Pet"}
            className="max-h-80 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm object-contain"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400 dark:text-gray-500">
            <ImageIcon className="h-16 w-16 mb-2" />
            <p className="text-sm">No image available</p>
          </div>
        )}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <DetailItem
            icon={<Home className="h-5 w-5" />}
            label="Foster Home"
            value={fosterHome?.assigned ? fosterHome.homeName ?? null : "Unassigned"}
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-2">
              <Heart className="h-5 w-5 text-red-500" />
              Medical
            </h3>
            <MedicalModal
              animalId={animal.id}
              onAdd={(medicalData) => {
                setMedicalRecords((prev) => [
                  ...prev,
                  {
                    ...medicalData,
                    Id: Date.now(),
                  },
                ]);
              }}
            />
          </div>

          {medicalRecords.length > 0 ? (
            <ul className="space-y-2">
              {medicalToShow.map((m) => (
                <li
                  key={m.Id}
                  className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{m.ConditionType}</span>
                    {m.StartDate && (
                      <span className="text-xs text-gray-500">
                        {m.StartDate.toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-400 dark:text-gray-500 break-words">
                    {m.Description}
                  </p>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Severity: {m.Severity || "N/A"}
                    {m.VetSeen ? " • Vet Seen ✅" : ""}
                  </p>
                </li>
              ))}
              {medicalRecords.length > 1 && (
                <button
                  onClick={() => setShowAllMedical(!showAllMedical)}
                  className="text-sm text-blue-500 hover:underline mt-2"
                >
                  {showAllMedical ? "Show Less" : "Show More"}
                </button>
              )}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">
              No medical records available yet.
            </p>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-2">
              <Brain className="h-5 w-5 text-purple-500" />
              Behavior
            </h3>
            <BehaviorModal
              animalId={animal.id}
              onAdd={(behaviorData) => {
                console.log("New behavior for", animal.name);
                console.log("Behavior Data:", behaviorData);
              }}
            />
          </div>
          {behaviors.length > 0 ? (
            <ul className="space-y-2">
              {behaviorsToShow.map((b) => {
               
                return (
                  <li key={b.Id} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{b.BehaviorType}</span>
                      <span className="text-xs text-gray-500">
                        {b.DateReported.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-500 break-words">{b.Notes}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Reported by: {b.ReportedByName}
                      {b.Resolved ? " ✅" : ""}
                    </p>
                  </li>
                );
              })}
              {behaviors.length > 1 && (
                <button
                  onClick={() => setShowAllBehavior(!showAllBehavior)}
                  className="text-sm text-blue-500 hover:underline mt-2"
                >
                  {showAllBehavior ? "Show Less" : "Show More"}
                </button>
              )}
            </ul>

          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">
              No behavior notes available yet.
            </p>
          )}
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
