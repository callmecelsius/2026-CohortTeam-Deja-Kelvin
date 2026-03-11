import { getFosterParents, updateFosterParent } from '@/api/fosterparent';
import { DataTable } from '@/components/shared/DataTable';
import { ActionsDropdown } from '@/components/shared/ActionsDropdown';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useMemo, useState } from 'react';
import type { FosterUser } from 'types/FosterParentType';
import { Pencil, Trash2 } from 'lucide-react';
import { FosterParentsModal } from './FosterParentsModal';
import { updateUser } from '@/api/user';

interface FosterData {
  fosterParentId: number;
  userId?: number;
  fosterHomeId?: number;
  approvedDate?: string;
  status?: string;
  fosterHomeName: string;
  fosterHomeAddress: string;
  fosterHomeCapacity: number;
  userFirstName: string;
  userLastName: string;
  userCity: string;
  userState: string;
  userAddress: string;
  userPostalCode: string;
  userPhoneNumber: string;
  userEmail: string;
  userCreatedOn: string;
}

export function FosterParentsTable() {
  const [fosterParents, setFosterParents] = useState<FosterData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFosterParent, setEditingFosterParent] = useState<FosterData | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function load() {
      const parents = await getFosterParents();
      const mappedData = mapFosterParentsToData(parents);
      setFosterParents(mappedData);
    }
    load();
  }, []);

  const handleEdit = (item: FosterData) => {
    setEditingFosterParent(item);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
  };

  const handleSubmit = async (formData: { firstName: string; lastName: string; phone: string; email: string; address: string; city: string; state: string; zip: string; status: string }) => {
    if (!editingFosterParent?.userId) return;

    await updateUser(editingFosterParent.userId, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: parseInt(formData.zip),
    });

    await updateFosterParent(editingFosterParent.fosterParentId, {
      userId: editingFosterParent.userId,
      fosterHomeId: editingFosterParent.fosterHomeId,
      status: formData.status,
    });

    const parents = await getFosterParents();
    setFosterParents(mapFosterParentsToData(parents));
    setEditingFosterParent(null);
    setIsModalOpen(false);
  };

  const columns = [
    {
      header: 'Actions',
      cell: (row: FosterData) => (
        <ActionsDropdown
          actions={[
            {
              label: 'Edit',
              icon: <Pencil className="mr-2 h-4 w-4" />,
              onClick: () => handleEdit(row),
            },
            {
              label: 'Delete',
              icon: <Trash2 className="mr-2 h-4 w-4" />,
              onClick: () => handleDelete(),
              className: 'text-red-600',
            },
          ]}
        />
      ),
    },
    { header: 'First Name', accessor: 'userFirstName' },
    { header: 'Last Name', accessor: 'userLastName' },
    { header: 'Phone Number', accessor: 'userPhoneNumber' },
    { header: 'Email', accessor: 'userEmail' },
    { header: 'Address', accessor: 'userAddress' },
    { header: 'City', accessor: 'userCity' },
    { header: 'State', accessor: 'userState' },
    { header: 'Zip', accessor: 'userPostalCode' },
    {
      header: 'Created On',
      cell: (row: FosterData) => {
        if (!row.userCreatedOn) return '';
        return new Date(row.userCreatedOn).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
    },
    { 
      header: 'Status', 
      cell: (row: FosterData) => {
        const status = row.status?.toLowerCase();
        const bgColor = status === 'approved' ? 'bg-green-100 text-green-800' 
                      : status === 'pending' ? 'bg-yellow-100 text-yellow-800'
                      : status === 'rejected' ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800';
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
            {row.status}
          </span>
        );
      }
    }
  ];

  const displayedParents = useMemo(() => {
    const filtered = statusFilter === 'all'
      ? fosterParents
      : fosterParents.filter(p => p.status?.toLowerCase() === statusFilter);

    return [...filtered].sort((a, b) => {
      const dateA = a.userCreatedOn ? new Date(a.userCreatedOn).getTime() : 0;
      const dateB = b.userCreatedOn ? new Date(b.userCreatedOn).getTime() : 0;
      return dateB - dateA;
    });
  }, [fosterParents, statusFilter]);

  return (
    <div className="w-full p-3 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Foster Parents</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DataTable columns={columns} data={displayedParents} />
      {editingFosterParent && (
        <FosterParentsModal
          key={editingFosterParent.userId}
          open={isModalOpen}
          onOpenChange={(open: boolean) => {
            setIsModalOpen(open);
            if (!open) setEditingFosterParent(null);
          }}
          onSubmit={handleSubmit}
          initialData={{
            id: editingFosterParent.userId ?? 0,
            firstName: editingFosterParent.userFirstName,
            lastName: editingFosterParent.userLastName,
            phone: editingFosterParent.userPhoneNumber,
            email: editingFosterParent.userEmail,
            address: editingFosterParent.userAddress,
            city: editingFosterParent.userCity,
            state: editingFosterParent.userState,
            zip: editingFosterParent.userPostalCode,
            status: editingFosterParent.status ?? '',
          }}
        />
      )}
    </div>
  );
}

function mapFosterParentsToData(fosterParents: FosterUser[]): FosterData[] {
  
  return fosterParents.map((user) => ({
    fosterParentId: user.fosterParent?.id ?? 0,
    userId: user.id,
    fosterHomeId: user.fosterParent?.fosterHomeId,
    approvedDate: user.fosterParent?.approvedDate,
    status: user.fosterParent?.status ?? '',
    fosterHomeName: user.fosterParent?.fosterHome?.homeName ?? '',
    fosterHomeAddress: user.fosterParent?.fosterHome?.address ?? '',
    fosterHomeCapacity: user.fosterParent?.fosterHome?.capacity ?? 0,
    userFirstName: user.firstName,
    userLastName: user.lastName,
    userCity: user.city,
    userState: user.state,
    userAddress: user.address,
    userPostalCode: user.zip?.toString() ?? '',
    userPhoneNumber: user.phone,
    userEmail: user.email,
    userCreatedOn: user.createdOn ?? '',
  }));
}