import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast, Toaster } from "sonner";
import { insertAnimalCondition } from "@/api/mypets";

type MedicalModalProps = {
  animalId: number;
  onAdd: (condition: {
    AnimalId: number;
    ConditionType: string;
    Description: string;
    Severity: string;
    StartDate: Date | null;
    EndDate: Date | null;
    VetSeen: boolean;
  }) => void;
};

const MedicalModal: React.FC<MedicalModalProps> = ({ animalId, onAdd }) => {
  const [open, setOpen] = useState(false);

  const [conditionType, setConditionType] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [vetSeen, setVetSeen] = useState(false);

  const handleAdd = async () => {
    const newCondition = {
      AnimalId: animalId,
      ConditionType: conditionType,
      Description: description,
      Severity: severity,
      StartDate: startDate ? new Date(startDate) : null,
      EndDate: endDate ? new Date(endDate) : null,
      VetSeen: vetSeen,
    };

    try {
      const savedCondition = await insertAnimalCondition(newCondition);

      onAdd(savedCondition);

      toast.success("Medical condition added successfully");

      window.location.reload();

      setConditionType("");
      setDescription("");
      setSeverity("");
      setStartDate("");
      setEndDate("");
      setVetSeen(false);
      setOpen(false);
    } catch (error) {
      toast.error("Failed to save medical condition");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Toaster richColors position="top-center" />

      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 transition"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4 text-green-600 dark:text-green-300" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Medical Condition</DialogTitle>
          <DialogDescription>
            Add medical details for this animal.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">

          <div className="space-y-2">
            <Label>Condition Type</Label>
            <Input
              placeholder="Condition type (Injury, Allergy, Infection...)"
              value={conditionType}
              onChange={(e) => setConditionType(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe the condition"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Severity</Label>
            <Select onValueChange={setSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={vetSeen}
              onCheckedChange={(checked) => setVetSeen(Boolean(checked))}
            />
            <Label>Vet Seen</Label>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleAdd}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalModal;
