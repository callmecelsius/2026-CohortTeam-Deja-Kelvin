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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { getCategories } from '@/api/home'

type HomeFormData = {
  homeName: string;
  Address: string;
  Capacity: number;
};

type EditHomeData = HomeFormData & { id: number };

type HomeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: HomeFormData) => Promise<void>;
  initialData?: EditHomeData;
  isEditing?: boolean;
};

export function FosterHomesModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEditing = false,
}: HomeModalProps) {
  console.log(initialData);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    //TODO
    homeName: initialData?.homeName ?? '',
    Address: initialData?.Address ?? '',
    Capacity: initialData?.Capacity ?? '',
  });

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setForm({
        //TODO
        homeName: initialData?.homeName ?? '',
        Address: initialData?.Address ?? '',
        Capacity: initialData?.Capacity ?? '',
      });
    } else {
      //TODO
      setForm({
        homeName: '',
        Address: '',
        Capacity: '',
      });
    }
  }, [initialData]);

  async function handleSubmit() {
    try {
      setSubmitting(true);
      //TODO
      await onSubmit({
        homeName: form.homeName,
        Address: form.Address,
        Capacity: Number(form.Capacity),
      });

      // Reset form data
      //TODO
      setForm({
        homeName: '',
        Address: '',
        Capacity: '',
      });

      // Close modal
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving home:', error);
      alert('Error saving home. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Home' : 'Add a New Home Item'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the home item's information below."
              : "Enter the home item's information below."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="home-homeName">Home Name</Label>
            <Input
              id="home-homeName"
              value={form.homeName}
              onChange={(e) => setForm({ ...form, homeName: e.target.value })}
              placeholder="e.g., Foster Home"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="home-address">Address</Label>
            <Input
              id="home-address"
              value={form.Address}
              onChange={(e) => setForm({ ...form, Address: e.target.value })}
              placeholder="e.g., 1234 Lane Street"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="home-capacity">Capacity</Label>
            <Input
              id="home-capacity"
              type="number"
              step="1"
              value={form.Capacity}
              onChange={(e) => setForm({ ...form, Capacity: e.target.value })}
              placeholder="e.g., 29.99"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-[#D9BF86] text-black hover:bg-[#c9af76]"
          >
            {submitting ? 'Saving...' : isEditing ? 'Update' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
