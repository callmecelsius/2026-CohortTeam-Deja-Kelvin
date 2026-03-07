import { useState } from 'react';
import { toast } from 'sonner';

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

type FosterFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: string;
};

type EditFosterData = FosterFormData & { id: number };

type FosterParentsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FosterFormData) => Promise<void>;
  initialData: EditFosterData;
};

export function FosterParentsModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: FosterParentsModalProps) {
  const [form, setForm] = useState<FosterFormData>({
    firstName: initialData.firstName ?? '',
    lastName: initialData.lastName ?? '',
    phone: initialData.phone ?? '',
    email: initialData.email ?? '',
    address: initialData.address ?? '',
    city: initialData.city ?? '',
    state: initialData.state ?? '',
    zip: initialData.zip ?? '',
    status: initialData.status ?? '',
  });

  async function handleSubmit() {
    try {
      await onSubmit(form);

      toast.success('Foster parent updated successfully!');

      setForm({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        status: '',
      });

      onOpenChange(false);
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Foster Parent</DialogTitle>
          <DialogDescription>
            Update the foster parent's information below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              placeholder="First Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              placeholder="Last Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone Number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="City"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              placeholder="State"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip">Zip Code</Label>
            <Input
              id="zip"
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value })}
              placeholder="Zip Code"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input px-3 py-1 text-sm shadow-sm "
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-[#D9BF86] text-black hover:bg-[#c9af76]"
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
