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
import type { FosterHome } from '../../../../types/fosterParentType';

type AssignFosterHomeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animalName: string;
  onSubmit: (fosterHomeId: number) => Promise<void>;
};

export function AssignFosterHomeModal({
  open,
  onOpenChange,
  animalName,
  onSubmit,
}: AssignFosterHomeModalProps) {
  const [fosterHomes, setFosterHomes] = useState<FosterHome[]>([]);
  const [selectedHomeId, setSelectedHomeId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      setLoading(true);
      getFosterHomes()
        .then((homes) => setFosterHomes(Array.isArray(homes) ? homes : []))
        .finally(() => setLoading(false));
    } else {
      setSelectedHomeId('');
    }
  }, [open]);

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
                  {fosterHomes.map((home) => (
                    <SelectItem key={home.id} value={String(home.id)}>
                      {home.homeName} | Capacity: {(home as any).currentCount ?? 0}/{home.capacity}
                    </SelectItem>
                  ))}
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
