import {
  createHome,
  deleteFosterHome,
  getFosterHomes,
  updateHome,
} from '@/api/fosterhome';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import type { FosterHome } from 'types/FosterHomeType';
import { FosterHomesModal } from './FosterHomesModal';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

import { ActionsDropdown } from '@/components/shared/ActionsDropdown';
import { toast, Toaster } from 'sonner';

export function FosterHomesTable() {
  const [fosterHome, setFosterHome] = useState<FosterHome[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHome, setEditingHome] = useState<FosterHome | null>(null);
  const columns = [
    {
      header: 'Actions',
      cell: (item: FosterHome) => (
        <ActionsDropdown
          actions={[
            {
              label: 'Edit',
              icon: <Pencil className="mr-2 h-4 w-4" />,
              onClick: () => handleEdit(item),
            },
            {
              label: 'Delete',
              icon: <Trash2 className="mr-2 h-4 w-4" />,
              onClick: () => handleDelete(item.id),
              className: 'text-red-600',
            },
          ]}
        />
      ),
    },
    { header: 'Home Name', accessor: 'homeName' },
    { header: 'Address', accessor: 'address' },
    { header: 'Capacity', accessor: 'capacity' },
  ];

  const handleEdit = (item: FosterHome) => {
    setEditingHome(item);
    setIsModalOpen(true);
  };

  //deletes inventory from database
  const handleDelete = async (id: number) => {
    await deleteFosterHome(id);
    toast.success('Deleted successfully');
    await loadHomes();
  };

  const loadHomes = async () => {
    const parentsHomes = await getFosterHomes();
    setFosterHome(parentsHomes);
  };

  useEffect(() => {
    async function load() {
      const parentsHomes = await getFosterHomes();
      setFosterHome(parentsHomes);
    }
    load();
  }, []);

  const handleAddHome = () => {
    setEditingHome(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: {
    homeName: string;
    Address: string;
    Capacity: number;
  }) => {
    try {
      //TODO
      if (editingHome) {
        await updateHome(editingHome.id, {
          homeName: formData.homeName,
          address: formData.address,
          capacity: formData.capacity,
        });
        toast.success('Edited successfully');
      } else {
        await createHome({
          homeName: formData.homeName,
          address: formData.address,
          capacity: formData.capacity,
        });
        toast.success('Inserted successfully');
      }
      // Refresh table after submission
      await loadHomes();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  };

  return (
    <div className="w-full p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Foster Homes</h2>
        <Button
          onClick={handleAddHome}
          className="bg-[#D9BF86] text-gray-900 hover:bg-[#c9af76] font-semibold px-6 py-2 shadow-md hover:shadow-lg hover:cursor-pointer transition-all duration-200"
        >
          + Add Home
        </Button>
      </div>

      <DataTable columns={columns} data={fosterHome} />
      <FosterHomesModal
        key={editingHome?.id ?? 'new'}
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingHome(null);
        }}
        onSubmit={handleSubmit}
        initialData={
          editingHome
            ? {
                id: editingHome.id,
                homeName: editingHome.homeName ?? '',
                address: editingHome.address ?? '',
                capacity: editingHome.capacity ?? 0,
              }
            : undefined
        }
        isEditing={editingHome ? true : false}
      />
      <Toaster richColors position="top-center" />
    </div>
  );
}
// homeName: formData.homeName,
// Address: formData.Address,
// Capacity: formData.Capacity,
