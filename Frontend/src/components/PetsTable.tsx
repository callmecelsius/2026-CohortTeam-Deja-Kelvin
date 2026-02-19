import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function PetsTable() {
  return (
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
      <TableBody>
        {/* Pet rows can be rendered here */}
      </TableBody>
    </Table>
  )
}
