import { getFosterParents } from '@/api/fosterparent';
import { DataTable } from '@/components/shared/DataTable';
import { useEffect, useState } from 'react';
import type { FosterUser } from 'types/FosterParentType';

const columns = [
  { header: 'First Name', accessor: 'userFirstName' },
  { header: 'Last Name', accessor: 'userLastName' },
  { header: 'Address', accessor: 'fosterHomeAddress' },
  { header: 'Capacity', accessor: 'fosterHomeCapacity' },
];

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
}

export function FosterHomesTable() {
  const [fosterParents, setFosterParents] = useState<FosterData[]>([]);

  useEffect(() => {
    async function load() {
      const parents = await getFosterParents();
      const mappedData = mapFosterParentsToData(parents);
      setFosterParents(mappedData);
    }
    load();
  }, []);

  return (
    <div className="relative w-full p-6 space-y-6">
      <DataTable columns={columns} data={fosterParents} />
    </div>
  );
}

function mapFosterParentsToData(fosterParents: FosterUser[]): FosterData[] {
  console.log('Mapping foster parents to data:', fosterParents);
  return fosterParents.map((user) => ({
    fosterParentId: user.fosterParent?.id || 0,
    userId: user.id,
    fosterHomeId: user.fosterParent?.fosterHomeId,
    approvedDate: user.fosterParent?.approvedDate,
    status: user.fosterParent?.status,
    fosterHomeName: user.fosterParent?.fosterHome?.homeName || '',
    fosterHomeAddress: user.fosterParent?.fosterHome?.address || '',
    fosterHomeCapacity: user.fosterParent?.fosterHome?.capacity || 0,
    userFirstName: user.firstName,
    userLastName: user.lastName,
    userCity: user.city,
    userState: user.state,
    userAddress: user.address,
    userPostalCode: user.postalCode,
    userPhoneNumber: user.phoneNumber,
    userEmail: user.email,
  }));
}
