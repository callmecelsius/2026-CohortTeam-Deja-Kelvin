import { getFosterParents } from "@/api/fosterparent";
// import { DataTable } from "@/components/shared/DataTable";
// import { useEffect, useState } from "react";

export function FosterHomesTable() {
  
//   const [columns, setColumns] = useState<Array<{ header: string; accessor: string }>>([]);
      const parents =  getFosterParents();
      console.log(parents)
//   useEffect(() => {
//     async function load() {
     
//       const parents = await getFosterParents();
//       console.log(parents)
//       // setColumns(parents);
//     }
//     load();
//   }, []);

  return (
    <div className="relative w-full p-6 space-y-6">
      {/* <DataTable columns={columns} data={fosterHomes} /> */}
    </div>
  );
}
