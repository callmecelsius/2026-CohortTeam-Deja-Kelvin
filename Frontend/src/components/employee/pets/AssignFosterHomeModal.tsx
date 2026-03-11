import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getFosterHomes } from '@/api/fosterhome';
import { getAnimalFosterHome } from '@/api/animal';
import type { FosterHome } from '../../../../types/fosterParentType';

type AssignFosterHomeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animalId: number;
  animalName: string;
  onSubmit: (fosterHomeId: number) => Promise<void>;
};

export function AssignFosterHomeModal({
  open,
  onOpenChange,
  animalId,
  animalName,
  onSubmit,
}: AssignFosterHomeModalProps) {
  const [fosterHomes, setFosterHomes] = useState<FosterHome[]>([]);
  const [selectedHomeId, setSelectedHomeId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentHome, setCurrentHome] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setCurrentHome(null);
      Promise.all([
        getFosterHomes(),
        getAnimalFosterHome(animalId),
      ])
        .then(([homes, fosterData]) => {
          setFosterHomes(Array.isArray(homes) ? homes : []);
          if (fosterData?.assigned) {
            setCurrentHome(fosterData.homeName);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setSelectedHomeId('');
      setCurrentHome(null);
    }
  }, [open, animalId]);

  async function handleSubmit() {
    if (!selectedHomeId) return;
    try {
      setSubmitting(true);
      await onSubmit(Number(selectedHomeId));
      onOpenChange(false);
    } catch (error) {
      console.error('Error assigning pet to foster home:', error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Assign to Foster Home</DialogTitle>
          <DialogDescription>
            Select a foster home for <strong>{animalName || 'this pet'}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {currentHome && (
            <div className="rounded-md bg-amber-50 border border-amber-200 p-3">
              <p className="text-sm text-amber-800">
                <strong>{animalName || 'This pet'}</strong> is currently assigned to <strong>{currentHome}</strong>. Selecting a new home will reassign them.
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="foster-home-select">Foster Home</Label>
            {loading ? (
              <p className="text-sm text-gray-500">Loading foster homes...</p>
            ) : fosterHomes.length === 0 ? (
              <p className="text-sm text-gray-500">No foster homes available.</p>
            ) : (
              <Select value={selectedHomeId} onValueChange={setSelectedHomeId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a foster home" />
                </SelectTrigger>
                <SelectContent>
                  {fosterHomes.map((home) => {
                    const isFull = home.capacity != null && (home.currentAnimalCount ?? 0) >= home.capacity;
                    return (
                      <SelectItem
                        key={home.id}
                        value={String(home.id)}
                        disabled={isFull}
                      >
                        {home.homeName} | Capacity: {home.currentAnimalCount ?? 0}/{home.capacity}
                        {isFull && ' (Full)'}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !selectedHomeId}
            className="bg-[#D9BF86] text-black hover:bg-[#c9af76]"
          >
            {submitting ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
