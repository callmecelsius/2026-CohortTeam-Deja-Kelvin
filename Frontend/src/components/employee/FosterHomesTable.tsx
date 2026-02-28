import { getFosterHomes } from "@/api/fosterhome";
import { getFosterParents } from "@/api/fosterparent";
import { getUsers } from "@/api/user";
import { DataTable } from "@/components/shared/DataTable";
import { useEffect, useState } from "react";
import type { FosterHome } from "types/FosterHomeType";

export function FosterHomesTable() {
  const [fosterHomes, setFosterHomes] = useState<FosterHome[]>([]);
  const [columns, setColumns] = useState<Array<{ header: string; accessor: string }>>([]);

  useEffect(() => {
    async function load() {
      const homes = await getFosterHomes();
      const parents = await getFosterParents();
      const users = await getUsers();
      console.log(parents)

      const parentsWithNames = parents.map((parent) => {
        const user = users.find((u) => u.id === parent.userId);
        return {
          ...parent,
          userName: user ? `${user.firstName} ${user.lastName}` : null,
        };
      });
      
      const homesWithParents = homes.map((home) => {
        const homeParents = parentsWithNames.filter((p) => p.fosterHomeId === home.id);

        const parentNames = homeParents.map((p) => p.userName).join(" ");
        return {
          ...home,
          fosterParents: parentNames,
        };
      });
      
      setFosterHomes(homesWithParents);


      const dynamicColumns = Object.keys(homesWithParents[0])
        .filter((e) => !e.includes("fosterAssignments"))
        .map((key) => ({
          header: key,
          accessor: key,
        }));
      setColumns(dynamicColumns);
    }
    load();
  }, []);

  return (
    <div className="relative w-full p-6 space-y-6">
      <DataTable columns={columns} data={fosterHomes} />
    </div>
  );
}
