import { PetsTable } from "@/components/employee/pets/PetsTable"
import { Toaster } from "@/components/ui/sonner"

export default function EmployeePets() {
  return (
    <div>
      <Toaster richColors position="top-center" />
      <PetsTable />
    </div>
  )
}
  