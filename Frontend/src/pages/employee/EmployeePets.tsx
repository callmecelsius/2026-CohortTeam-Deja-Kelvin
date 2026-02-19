import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function EmployeePets() {
    return (
      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Breed</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Height</TableHead>
              <TableHead>Intake Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
    );
  }
  