import { getFosterHomes } from '@/api/fosterhome';
import { DataTable } from '@/components/shared/DataTable';
import { useEffect, useState } from 'react';
import type { FosterHome } from 'types/FosterHomeType';

const columns = [
  { header: 'Home Name', accessor: 'homeName' },
  { header: 'Address', accessor: 'address' },
  { header: 'Capacity', accessor: 'capacity' },
];


export function FosterHomesTable() {
  const [fosterHome, setFosterHome] = useState<FosterHome[]>([]);

  useEffect(() => {
    async function load() {
      const parentsHomes = await getFosterHomes();
      console.log(parentsHomes);
      setFosterHome(parentsHomes);
    }
    load();
  }, []);

  return (
    <div className="relative w-full p-6 space-y-6">
      <DataTable columns={columns} data={fosterHome} />
    </div>
  );
}
