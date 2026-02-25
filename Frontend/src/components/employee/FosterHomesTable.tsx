import { DataTable } from "@/components/shared/DataTable";
import type { FosterHome } from "types/FosterHomeType";

const COLUMNS = [
  { header: "Home Name", accessor: "HomeName" },
  { header: "Address", accessor: "Address" },
  { header: "Capacity", accessor: "Capacity" },
];

const FAKE_FOSTER_HOMES: FosterHome[] = [
  { id: 1, HomeName: "Sunrise Foster Home", Address: "123 Oak St, Dallas TX", Capacity: 2 },
  { id: 2, HomeName: "Maple Grove House", Address: "456 Maple Ave, Dallas TX", Capacity: 1 },
  { id: 3, HomeName: "Riverside Care", Address: "789 River Rd, Dallas TX", Capacity: 3 },
];

export function FosterHomesTable() {
  return (
    <div className="relative w-full p-6 space-y-6">
      <DataTable
        columns={COLUMNS}
        data={FAKE_FOSTER_HOMES}
      />
    </div>
  );
}
