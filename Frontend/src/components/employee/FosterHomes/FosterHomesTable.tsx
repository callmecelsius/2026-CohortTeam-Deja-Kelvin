import { createHome, getFosterHomes } from '@/api/fosterhome';
import { DataTable } from '@/components/shared/DataTable';
import { Button } from '@headlessui/react';
import { useEffect, useState } from 'react';
import type { FosterHome } from 'types/FosterHomeType';
import { FosterHomesModal } from './FosterHomesModal';

const columns = [
  { header: 'Home Name', accessor: 'homeName' },
  { header: 'Address', accessor: 'address' },
  { header: 'Capacity', accessor: 'capacity' },
];

export function FosterHomesTable() {
  const [fosterHome, setFosterHome] = useState<FosterHome[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInventory, setEditingHome] = useState<FosterHome | null>(null);

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
      await createHome({
        homeName: formData.homeName,
        Address: formData.Address,
        Capacity: formData.Capacity,
      });

      alert('Inserted successfully');

      // Refresh table after submission
      await loadHomes();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  };

  return (
    <div className="relative w-full p-6 space-y-6">
      <div className="flex justify-between items-center">
        <span></span>
        <Button
          onClick={handleAddHome}
          className="bg-[#D9BF86] text-gray-900 hover:bg-[#c9af76] font-semibold px-6 py-2 shadow-md hover:shadow-lg hover:cursor-pointer transition-all duration-200"
        >
          + Add Home
        </Button>
      </div>
      <DataTable columns={columns} data={fosterHome} />
      <FosterHomesModal
        key={editingInventory?.id ?? 'new'}
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) setEditingHome(null);
        }}
        onSubmit={handleSubmit}
        isEditing={editingInventory ? true : false}
      />
    </div>
  );
}
